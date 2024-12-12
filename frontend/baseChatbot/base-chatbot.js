import EventEmitter from "eventemitter3";
import { generateUserId } from "../utils/user-id-generator.js";

/**
 * BaseChatbot Web Component
 * Base class for all chatbot implementations
 * Handles core functionality and communication with Voiceflow API
 */
export class BaseChatbot extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // Create local event bus
    this.eventBus = new EventEmitter();

    // Initialize state
    this.userID = generateUserId();
    this.abortController = null;
  }

  /**
   * Define observed attributes for the web component
   */
  static get observedAttributes() {
    return ["endpoint"];
  }

  /**
   * Called when the element is added to the document
   */
  connectedCallback() {
    this.initialize();
  }

  /**
   * Called when the element is removed from the document
   */
  disconnectedCallback() {
    this.cleanup();
  }

  /**
   * Initialize the chatbot
   * @private
   */
  initialize() {
    this.setupEventListeners();
  }

  /**
   * Launch the chatbot
   * @public
   */
  launch() {
    this.sendLaunch();
  }

  /**
   * Set up core event listeners
   * @private
   */
  setupEventListeners() {
    // Message handling
    this.eventBus.on("userMessage", (message) => this.sendMessage(message));
    this.eventBus.on("buttonClicked", (payload) => this.sendMessage(payload));
  }

  /**
   * Sends a launch request to initiate the conversation
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
    console.log("Sending message:", message);
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
    this.abortController = new AbortController();
    const { signal } = this.abortController;

    try {
      const endpoint = this.getAttribute("endpoint");
      if (!endpoint) {
        throw new Error("Endpoint attribute is required");
      }

      // Show typing indicator
      this.eventBus.emit("typing", { isTyping: true });

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      this.handleError(error);
    }
  }

  /**
   * Handles the SSE response from the API
   * @private
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

        for (const eventStr of events) {
          if (eventStr.trim() === "") continue;
          this.processEventString(eventStr);
        }
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
   */
  processEventString(eventStr) {
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
   * @protected - Can be extended by child classes
   */
  processTrace(trace) {
    if (!trace.type) {
      console.warn("Trace without type received:", trace);
      return;
    }

    // Hide typing indicator when we receive any trace
    this.eventBus.emit("typing", { isTyping: false });

    switch (trace.type) {
      case "text":
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

      case "waiting_text":
        this.eventBus.emit("typingText", {
          text: trace.payload.text,
        });
        this.eventBus.emit("typing", { isTyping: true });
        break;

      default:
        console.warn(`Unhandled trace type: ${trace.type}`, trace);
    }
  }

  /**
   * Handle errors in the chatbot
   * @protected - Can be extended by child classes
   */
  handleError(error) {
    console.error("Chatbot error:", error);
    this.eventBus.emit("error", { message: error.message });
    this.eventBus.emit("typing", { isTyping: false });
  }

  /**
   * Clean up resources when the component is destroyed
   */
  cleanup() {
    if (this.abortController) {
      this.abortController.abort();
    }
    this.eventBus.removeAllListeners();
  }
}
