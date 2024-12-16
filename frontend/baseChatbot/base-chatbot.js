// /assets/scripts/chatbot/core/chatbot-core.js

import EventEmitter from "eventemitter3";

/**
 * ChatbotCore Class
 * Handles communication with Voiceflow API via Gadget middleware and processes responses
 */
class ChatbotCore {
  /**
   * @param {Object} config - Configuration object
   * @param {string} config.type - Type of chatbot ('main' or 'section')
   * @param {string} config.endpoint - API endpoint URL
   * @param {string} config.userID - Unique user identifier
   */
  constructor(config) {
    if (!config.userID) {
      throw new Error("ChatbotCore requires a userID");
    }
    if (!config.endpoint) {
      throw new Error("ChatbotCore requires an endpoint URL");
    }
    if (!config.type) {
      throw new Error("ChatbotCore requires a type ('main' or 'section')");
    }

    this.userID = config.userID;
    this.endpoint = config.endpoint;
    this.type = config.type;
    this.eventBus = new EventEmitter();
    this.abortController = null;
  }

  /**
   * Sends a launch request to initiate the conversation
   * @param {Object} interactPayload - Optional payload for launch
   */
  async sendLaunch(interactPayload = {}) {
    console.log("Constructing launch payload:", interactPayload);
    const payload = interactPayload.action
      ? interactPayload
      : {
          action: {
            type: "launch",
          },
        };

    return this.sendAction(payload);
  }

  /**
   * Sends a user message to the chatbot
   * @param {string | Object} message - The user's message or button payload
   */
  async sendMessage(message) {
    console.log("Constructing message payload:", message);
    const payload = {
      action: {
        type: "text",
        payload: typeof message === "object" ? message : message,
      },
    };

    return this.sendAction(payload);
  }

  /**
   * Sends an action to the Voiceflow API via Gadget
   * @param {Object} actionPayload - The action payload to send
   */
  async sendAction(actionPayload) {
    try {
      // Only abort if there's an existing connection
      if (this.abortController) {
        this.abortController.abort();
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      this.abortController = new AbortController();
      const { signal } = this.abortController;

      // Show typing indicator
      this.eventBus.emit("typing", { isTyping: true });

      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify({
          userID: this.userID,
          action: actionPayload.action,
        }),
        credentials: "include",
        signal,
      });

      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }

      await this.handleSSEResponse(response);
    } catch (error) {
      if (error.name === "AbortError") {
        console.debug("Request aborted, new request in progress");
        return;
      }
      this.handleError(error);
    }
  }

  /**
   * Handles the SSE response from the API
   * @private
   * @param {Response} response - Fetch API response object
   */
  async handleSSEResponse(response) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          this.eventBus.emit("end", {});
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop();

        events.forEach((eventStr) => {
          if (eventStr.trim() === "") return;
          this.processEventString(eventStr);
        });
      }
    } catch (error) {
      this.handleError(error);
    } finally {
      this.eventBus.emit("typing", { isTyping: false });
    }
  }

  /**
   * Process an individual SSE event string
   * @private
   * @param {string} eventStr - The event string to process
   */
  processEventString(eventStr) {
    console.log("Raw SSE event string:", eventStr);
    try {
      const lines = eventStr.split("\n");
      const eventTypeLine = lines.find((line) => line.startsWith("event:"));
      const dataLine = lines.find((line) => line.startsWith("data:"));

      const eventType = eventTypeLine
        ? eventTypeLine.split(":")[1].trim()
        : "trace";
      const data = dataLine
        ? JSON.parse(eventStr.substring(eventStr.indexOf("data:") + 5).trim())
        : null;

      if (eventType === "trace") {
        this.processTrace(data);
      }
    } catch (error) {
      console.error("Error processing SSE event:", error);
    }
  }

  /**
   * Process a trace event from Voiceflow
   * @protected
   * @param {Object} trace - The trace object to process
   */
  processTrace(trace) {
    if (!trace.type) {
      console.warn("Trace without type received:", trace);
      return;
    }

    console.log("processTrace called with:", trace);

    switch (trace.type) {
      case "text":
        console.log("Emitting messageReceived event...");
        this.eventBus.emit("messageReceived", {
          content: trace.payload.message,
          metadata: trace.payload.metadata || null,
        });
        break;

      case "choice":
        this.eventBus.emit("choicePresented", {
          type: "choice",
          buttons: trace.payload.buttons,
        });
        break;

      case "carousel":
        this.eventBus.emit("carouselPresented", {
          type: "carousel",
          items: trace.payload.cards,
        });
        break;

      case "device_answer":
        if (this.type === "section") {
          this.eventBus.emit("deviceAnswer", trace.payload);
        }
        break;

      default:
        console.warn(`Unhandled trace type: ${trace.type}`, trace);
    }
  }

  /**
   * Handle errors in the chatbot
   * @private
   * @param {Error} error - The error to handle
   */
  handleError(error) {
    console.error("Chatbot error:", error);
    this.eventBus.emit("error", { message: error.message });
    this.eventBus.emit("typing", { isTyping: false });
  }

  /**
   * Clean up resources
   * @public
   */
  destroy() {
    if (this.abortController) {
      this.abortController.abort();
    }
    this.eventBus.removeAllListeners();
  }
}

export default ChatbotCore;
