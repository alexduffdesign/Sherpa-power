// /assets/scripts/chatbot/core/chatbot-core.js

import eventBus from "../utils/event-bus.js";
import { EVENTS } from "../utils/event-constants.js";

/**
 * ChatbotCore Class
 * Handles communication with Voiceflow API via Gadget API, processes incoming data,
 * manages Voiceflow variables, and emits events based on trace types.
 */
class ChatbotCore {
  /**
   * Constructor initializes ChatbotCore with userID, endpoint, and chatbot type.
   * @param {Object} options - Configuration options.
   * @param {string} options.userID - Unique identifier for the user/session.
   * @param {string} options.endpoint - Gadget API endpoint URL.
   * @param {string} options.chatbotType - Type of chatbot ('main' or 'section') for event namespacing.
   */
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
    this.eventNamespace =
      chatbotType === "main" ? "MAIN_CHATBOT" : "SECTION_CHATBOT";
    this.eventPrefix =
      chatbotType === "main" ? "mainChatbot" : "sectionChatbot";

    this.eventHandlers = {};

    this.initialize();
  }

  /**
   * Initializes the ChatbotCore by setting up SSE connection.
   */
  initialize() {
    this.setupSSE();
  }

  /**
   * Sets up the Server-Sent Events (SSE) connection to the Gadget API.
   */
  setupSSE() {
    const payload = {
      userID: this.userID,
      action: {}, // Initial action is empty; launch or message will populate this
      config: {}, // Additional configuration if needed
    };

    // Send initial connection request to Gadget API to establish SSE
    fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Gadget API responded with status ${response.status}`
          );
        }
        // Check if browser supports EventSource
        if (typeof EventSource === "undefined") {
          throw new Error("EventSource is not supported in this browser.");
        }

        // Create a unique URL with userID to handle multiple chatbots
        const eventSourceUrl = `${this.endpoint}?userID=${encodeURIComponent(
          this.userID
        )}`;

        this.eventSource = new EventSource(eventSourceUrl, {
          withCredentials: true,
        });

        this.eventSource.onmessage = this.handleIncomingMessage.bind(this);
        this.eventSource.onerror = this.handleError.bind(this);
      })
      .catch((error) => {
        console.error("Failed to establish SSE connection:", error);
        eventBus.emit(`${this.eventPrefix}:error`, { message: error.message });
      });
  }

  /**
   * Handles incoming SSE messages from the Gadget API.
   * @param {MessageEvent} event - The SSE message event.
   */
  handleIncomingMessage(event) {
    try {
      const data = JSON.parse(event.data);
      if (!data.type || !data.payload) {
        throw new Error("Invalid data format received from Gadget API.");
      }

      switch (data.type) {
        case "trace":
          this.processTrace(data.payload);
          break;
        case "end":
          this.closeConnection();
          break;
        case "error":
          eventBus.emit(`${this.eventPrefix}:error`, {
            message: data.payload.message,
          });
          this.closeConnection();
          break;
        default:
          console.warn(`Unknown data type received: ${data.type}`);
      }
    } catch (error) {
      console.error("Error processing incoming message:", error);
      eventBus.emit(`${this.eventPrefix}:error`, { message: error.message });
    }
  }

  /**
   * Processes different types of traces received from Voiceflow.
   * @param {Object} trace - The trace object containing type and payload.
   */
  processTrace(trace) {
    if (!trace.type) {
      console.warn("Trace without type received:", trace);
      return;
    }

    switch (trace.type) {
      case "message":
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
   * Handles errors from the SSE connection.
   * @param {Event} event - The error event.
   */
  handleError(event) {
    console.error("SSE connection error:", event);
    eventBus.emit(`${this.eventPrefix}:error`, {
      message: "Connection error with Voiceflow API.",
    });
    this.closeConnection();
  }

  /**
   * Sends a launch request to Voiceflow with optional payload.
   * @param {Object} [variables={}] - Voiceflow variables to include in the launch payload.
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
   * Sends a user message to Voiceflow.
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
   * Sends an action (launch, message, etc.) to the Gadget API.
   * @param {Object} actionPayload - The action payload to send.
   */
  sendAction(actionPayload) {
    const payload = {
      userID: this.userID,
      action: actionPayload.action,
      config: actionPayload.config,
    };

    fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "include", // Include cookies if needed
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Gadget API responded with status ${response.status}`
          );
        }
        // No need to handle response as SSE is used for incoming messages
      })
      .catch((error) => {
        console.error("Failed to send action to Gadget API:", error);
        eventBus.emit(`${this.eventPrefix}:error`, { message: error.message });
      });
  }

  /**
   * Closes the SSE connection gracefully.
   */
  closeConnection() {
    if (this.eventSource) {
      this.eventSource.close();
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
  }
}

export default ChatbotCore;
