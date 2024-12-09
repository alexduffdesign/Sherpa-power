// /assets/scripts/chatbot/core/chatbot-core.js

import eventBus from "../utils/event-bus.js";
import { EVENTS } from "../utils/event-constants.js";

/**
 * ChatbotCore Class
 * Handles communication with Voiceflow API via Gadget API, processes incoming data,
 * manages Voiceflow variables, and emits events based on trace types.
 */
class ChatbotCore {
  constructor({ userID, endpoint, chatbotType }) {
    if (!userID) {
      throw new Error("ChatbotCore requires a userID.");
    }
    if (!endpoint) {
      throw new Error("ChatbotCore requires an endpoint URL.");
    }
    if (!chatbotType) {
      throw new Error(
        'ChatbotCore requires a chatbotType ("main" or "section").'
      );
    }

    this.userID = userID;
    this.endpoint = endpoint;
    this.chatbotType = chatbotType; // 'main' or 'section'
    this.eventPrefix =
      chatbotType === "main" ? "mainChatbot" : "sectionChatbot";

    this.abortController = null; // For aborting the fetch request if needed

    this.initialize();
  }

  initialize() {
    // Initial setup if needed
  }

  /**
   * Sends a launch request to initiate the conversation.
   */
  sendLaunch(variables = {}) {
    const payload = {
      action: {
        type: "launch",
        payload: variables,
      },
      config: {}, // Additional configuration if needed
    };

    this.sendAction(payload);
  }

  /**
   * Sends a user message to the chatbot.
   * @param {string} message - The user's message.
   */
  sendMessage(message) {
    const payload = {
      action: {
        type: "text",
        payload: {
          message: message,
        },
      },
      config: {}, // Additional configuration if needed
    };

    this.sendAction(payload);
  }

  /**
   * Sends an action (launch, message, etc.) to the Gadget API via POST and handles SSE response.
   * @param {Object} actionPayload - The action payload to send.
   */
  async sendAction(actionPayload) {
    this.abortController = new AbortController();
    const { signal } = this.abortController;

    try {
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: this.userID,
          action: actionPayload.action,
          config: actionPayload.config,
        }),
        credentials: "include", // Include cookies if needed
        signal: signal,
      });

      if (!response.ok) {
        throw new Error(`Gadget API responded with status ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          eventBus.emit(`${this.eventPrefix}:end`, {});
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop(); // Remaining partial event

        events.forEach((eventStr) => {
          if (eventStr.trim() === "") return;
          try {
            const lines = eventStr.split("\n");
            const eventTypeLine = lines.find((line) =>
              line.startsWith("event:")
            );
            const dataLine = lines.find((line) => line.startsWith("data:"));

            const eventType = eventTypeLine
              ? eventTypeLine.split(":")[1].trim()
              : "trace";
            const data = dataLine
              ? JSON.parse(
                  eventStr.substring(eventStr.indexOf("data:") + 5).trim()
                )
              : null;

            if (eventType === "trace") {
              this.processTrace(data);
            } else if (eventType === "end") {
              eventBus.emit(`${this.eventPrefix}:end`, {});
            }
            // Handle other event types if necessary
          } catch (error) {
            console.error("Error parsing SSE event:", error);
          }
        });
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.warn("SSE connection aborted");
      } else {
        console.error("SSE connection error:", error);
        eventBus.emit(`${this.eventPrefix}:error`, { message: error.message });
      }
    } finally {
      this.abortController = null;
      eventBus.emit(`${this.eventPrefix}:end`, {});
    }
  }

  /**
   * Processes individual trace events and emits corresponding events via EventBus.
   * @param {Object} trace - The trace object received from Voiceflow.
   */
  processTrace(trace) {
    if (!trace.type) {
      console.warn("Trace without type received:", trace);
      return;
    }

    switch (trace.type) {
      case "text":
        eventBus.emit(`${this.eventPrefix}:messageReceived`, {
          content: trace.payload.message,
        });
        break;
      case "choice":
        eventBus.emit(`${this.eventPrefix}:choicePresented`, {
          choices: trace.payload.choices,
        });
        break;
      case "carousel":
        eventBus.emit(`${this.eventPrefix}:carouselPresented`, {
          carouselItems: trace.payload.items,
        });
        break;
      case "device_answer":
        eventBus.emit(`${this.eventPrefix}:deviceAnswer`, {
          devices: trace.payload.devices,
        });
        break;
      case "typing":
        if (trace.payload.isTyping) {
          eventBus.emit(`${this.eventPrefix}:typing`, { isTyping: true });
        } else {
          eventBus.emit(`${this.eventPrefix}:typing`, { isTyping: false });
        }
        break;
      // Add more trace types as needed
      default:
        console.warn(`Unhandled trace type: ${trace.type}`);
    }
  }

  /**
   * Closes the SSE connection gracefully.
   */
  closeConnection() {
    if (this.abortController) {
      this.abortController.abort();
      console.log("SSE connection closed.");
    }
  }

  /**
   * Cleans up resources when the ChatbotCore instance is no longer needed.
   */
  destroy() {
    this.closeConnection();
    eventBus.removeAllListeners(`${this.eventPrefix}:messageReceived`);
    eventBus.removeAllListeners(`${this.eventPrefix}:choicePresented`);
    eventBus.removeAllListeners(`${this.eventPrefix}:carouselPresented`);
    eventBus.removeAllListeners(`${this.eventPrefix}:deviceAnswer`);
    eventBus.removeAllListeners(`${this.eventPrefix}:error`);
    eventBus.removeAllListeners(`${this.eventPrefix}:typing`);
    eventBus.removeAllListeners(`${this.eventPrefix}:end`);
  }
}

export default ChatbotCore;