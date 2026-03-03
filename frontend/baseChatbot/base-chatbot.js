// /assets/scripts/chatbot/core/base-chatbot.js

import EventEmitter from "eventemitter3";
import { StreamingMarkdownParser } from "../utils/streaming-markdown-parser.js"; // Ensure correct path
import { parseMarkdown } from "../utils/markdown-util.js"; // Import parseMarkdown

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
    this.currentCompletion = null; // For handling completion events
    this.setupInteractiveElementHandling();

    // Initialize Streaming Markdown Parser
    this.streamingParser = new StreamingMarkdownParser((htmlSegment) => {
      this.eventBus.emit("assistantMessageStreamed", { content: htmlSegment });
    });

    this.eventBus.on("userMessage", (message) => {
      this.sendMessage(message);
    });

    this.eventBus.on("sendAction", (action) => {
      this.sendAction({ action });
    });
  }

  /**
   * Sends a launch request to initiate the conversation
   * @param {Object} interactPayload - Optional payload for launch
   */
  async sendLaunch(interactPayload = {}) {
    console.log("Constructing launch payload:", interactPayload);

    this.eventBus.emit("typing", {
      isTyping: true,
      message: "Sherpa Guide Launching...",
    });

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
    console.log("Message payload:", message);
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
    this.eventBus.emit("typing", {
      isTyping: true,
      message: "Sherpa Guide Thinking...",
    }); // Show when request starts
    try {
      // Only abort if there's an existing connection
      if (this.abortController) {
        this.abortController.abort();
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      this.abortController = new AbortController();
      const { signal } = this.abortController;

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

  setupInteractiveElementHandling() {
    this.eventBus.on("interactiveElementClicked", (payload) => {
      const userMessage = payload.label || "Button clicked";
      this.handleInteractiveElementAction(payload, userMessage);
    });
  }

  async handleInteractiveElementAction(payload, userMessage) {
    if (payload.type && payload.type.startsWith("path-")) {
      const actionPayload = {
        action: {
          type: payload.type,
          payload: {
            label: userMessage,
          },
        },
      };
      return this.sendAction(actionPayload);
    } else if (payload.type === "intent") {
      const actionPayload = {
        action: {
          type: "intent",
          payload: {
            intent: payload.payload.intent,
            query: payload.payload.query || "",
            entities: payload.payload.entities || [],
          },
        },
      };
      return this.sendAction(actionPayload);
    } else if (payload.type === "button") {
      return this.sendAction({
        action: {
          type: "button",
          payload: payload.payload || payload,
        },
      });
    } else if (payload.action) {
      // Handle carousel button clicks
      return this.sendAction({ action: payload.action });
    } else {
      // Fallback to sending a plain text message when the payload shape is unknown
      return this.sendMessage(userMessage);
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
    }
  }

  /**
   * Process an individual SSE event string
   * @private
   * @param {string} eventStr - The event string to process
   */
  processEventString(eventStr) {
    try {
      const lines = eventStr.split("\n");
      const eventTypeLine = lines.find((line) => line.startsWith("event:"));
      console.log("eventTypeLine:", eventTypeLine);

      let data = null;
      const dataLines = lines
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).trimStart());
      const rawData = dataLines.join("\n").trim();

      if (rawData && rawData !== "[DONE]") {
        try {
          data = JSON.parse(rawData);
        } catch (e) {
          console.error("Error parsing data:", e);
          return; // Skip processing if data is invalid
        }
      }

      const eventType = eventTypeLine
        ? eventTypeLine.split(":")[1].trim()
        : null;

      if (eventType === "end") {
        console.log("End event received");
        this.eventBus.emit("end", {});
      } else if (data && data.type === "completion") {
        this.handleCompletion(data.payload); // Pass the payload, not the entire data object
      } else if (data && data.type) {
        this.processTrace(data);
      } else {
        console.warn("Unknown event type:", eventType, data);
      }
    } catch (error) {
      this.handleError(error);
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

    if (this.shouldOpenMainChatbot(trace)) {
      this.eventBus.emit("openMainChatbot", {
        payload: trace.payload || null,
        trace,
      });
      return;
    }

    switch (trace.type) {
      case "text":
        this.eventBus.emit("typing", { isTyping: false });
        this.eventBus.emit("assistantMessageNonStreamed", {
          content: trace.payload.message,
          metadata: trace.payload.metadata,
        });
        break;
      case "choice": {
        const buttons = this.normalizeButtons(trace.payload?.buttons);
        if (!buttons.length) {
          console.warn("Choice trace has no renderable buttons:", trace);
          break;
        }
        this.eventBus.emit("choicePresented", {
          buttons,
        });
        break;
      }
      case "carousel": {
        const items = this.normalizeCardsPayload(trace.payload);
        if (!items.length) {
          console.warn("Carousel trace has no renderable cards:", trace);
          break;
        }
        this.eventBus.emit("carouselPresented", {
          type: "carousel",
          items,
        });
        break;
      }
      case "card":
      case "cardV2": {
        const card = this.normalizeCard(trace.payload);
        if (!card) {
          console.warn("Card trace has no renderable card payload:", trace);
          break;
        }
        this.eventBus.emit("carouselPresented", {
          type: trace.type,
          items: [card],
        });
        break;
      }
      case "device_answer":
        if (this.type === "section") {
          this.eventBus.emit("deviceAnswer", trace.payload);
        }
        break;
      case "RedirectToProduct":
        this.eventBus.emit("productRedirect", {
          productHandle: trace.payload?.body?.productHandle,
        });
        break;
      case "waiting_text":
        this.eventBus.emit("waitingText", {
          text:
            typeof trace.payload === "string"
              ? trace.payload
              : trace.payload?.text || "Sherpa Guide Thinking...",
        });
        break;
      case "deviceSources":
        this.eventBus.emit("deviceSources", {
          sources: trace.payload,
        });
        break;
      case "openMainChatbot":
        this.eventBus.emit("openMainChatbot", {
          payload: trace.payload || null,
          trace,
        });
        break;
      case "custom_action":
      case "customAction":
        if (this.isOpenMainChatbotAction(trace.payload)) {
          this.eventBus.emit("openMainChatbot", {
            payload: trace.payload || null,
            trace,
          });
        } else {
          console.warn("Unhandled custom action trace:", trace);
        }
        break;
      default:
        console.warn(`Unhandled trace type: ${trace.type}`, trace);
    }
  }

  isOpenMainChatbotAction(payload) {
    const actionNameCandidates = [
      payload?.name,
      payload?.actionName,
      payload?.action,
      payload?.type,
      payload?.event?.name,
      payload?.eventName,
      payload?.data?.name,
      payload?.data?.actionName,
      payload?.action?.name,
      payload?.action?.actionName,
      payload?.action?.type,
      payload?.payload?.name,
      payload?.payload?.actionName,
      payload?.payload?.type,
      payload?.body?.name,
      payload?.body?.actionName,
      payload?.body?.action?.name,
      payload?.body?.action?.actionName,
      typeof payload === "string" ? payload : null,
    ];

    const actionName = actionNameCandidates.find(
      (candidate) => typeof candidate === "string" && candidate.trim() !== ""
    );

    if (!actionName) {
      return false;
    }

    return this.normalizeActionName(actionName) === "openmainchatbot";
  }

  shouldOpenMainChatbot(trace) {
    const traceTypeName = this.normalizeActionName(trace.type || "");
    if (traceTypeName === "openmainchatbot") {
      return true;
    }

    const traceNameCandidates = [
      trace.name,
      trace.eventName,
      trace.actionName,
      trace.action?.name,
      trace.payload?.name,
      trace.payload?.actionName,
      trace.payload?.type,
    ];

    const traceNameMatch = traceNameCandidates.some(
      (name) =>
        typeof name === "string" &&
        this.normalizeActionName(name) === "openmainchatbot"
    );

    if (traceNameMatch) {
      return true;
    }

    return this.isOpenMainChatbotAction(trace.payload);
  }

  normalizeActionName(value) {
    if (typeof value !== "string") {
      return "";
    }

    return value.toLowerCase().replace(/[^a-z0-9]/g, "");
  }

  normalizeCardsPayload(payload) {
    if (!payload) return [];

    const rawCards = Array.isArray(payload)
      ? payload
      : Array.isArray(payload.cards)
        ? payload.cards
        : [];

    return rawCards
      .map((card) => this.normalizeCard(card))
      .filter((card) => card !== null);
  }

  normalizeCard(card) {
    if (!card || typeof card !== "object") {
      return null;
    }

    const descriptionText =
      typeof card.description === "string"
        ? card.description
        : card.description?.text || "";

    const normalizedDescription = descriptionText
      ? { text: descriptionText }
      : null;

    return {
      ...card,
      imageUrl: card.imageUrl || card.image_url || card.image?.url || null,
      title: card.title || card.name || "",
      description: normalizedDescription,
      buttons: this.normalizeButtons(card.buttons),
    };
  }

  normalizeButtons(buttons) {
    if (!Array.isArray(buttons)) {
      return [];
    }

    return buttons
      .filter((button) => button && typeof button === "object")
      .map((button) => ({
        ...button,
        name: button.name || button.label || button.text || "Select",
        request: button.request || button.action || button.payload?.action || null,
        openUrl: this.extractOpenUrl(button),
      }));
  }

  extractOpenUrl(button) {
    if (!button || typeof button !== "object") {
      return null;
    }

    const directCandidates = [
      button.openUrl,
      button.url,
      button.href,
      button.link,
      button.targetUrl,
      button.payload?.url,
      button.payload?.href,
      button.payload?.link,
      button.request?.payload?.url,
      button.request?.payload?.href,
      button.request?.payload?.link,
      button.request?.payload,
      button.action?.payload?.url,
      button.action?.payload?.href,
      button.action?.payload?.link,
      button.action?.payload,
    ];

    const directUrl = this.getFirstUrlCandidate(directCandidates);

    if (directUrl) {
      return directUrl;
    }

    const actionCollections = [
      button.actions,
      button.payload?.actions,
      button.request?.payload?.actions,
      button.action?.payload?.actions,
    ];

    for (const actions of actionCollections) {
      const url = this.extractOpenUrlFromActions(actions);
      if (url) {
        return url;
      }
    }

    return null;
  }

  extractOpenUrlFromActions(actions) {
    if (!Array.isArray(actions)) {
      return null;
    }

    const openUrlAction = actions.find((action) => {
      if (!action || typeof action !== "object") {
        return false;
      }

      const typeName = `${action.type || action.name || ""}`.toLowerCase();
      return (
        typeName === "open_url" ||
        typeName === "openurl" ||
        typeName === "url" ||
        typeName === "link"
      );
    });

    if (!openUrlAction) {
      return null;
    }

    const actionCandidates = [
      openUrlAction.url,
      openUrlAction.href,
      openUrlAction.link,
      openUrlAction.payload?.url,
      openUrlAction.payload?.href,
      openUrlAction.payload?.link,
      openUrlAction.payload,
      openUrlAction.value,
    ];

    return this.getFirstUrlCandidate(actionCandidates);
  }

  getFirstUrlCandidate(candidates) {
    const rawValue = candidates.find(
      (candidate) => typeof candidate === "string" && this.isLikelyUrl(candidate)
    );

    return rawValue ? rawValue.trim() : null;
  }

  isLikelyUrl(value) {
    if (typeof value !== "string") {
      return false;
    }

    const normalized = value.trim();
    if (!normalized) {
      return false;
    }

    return (
      /^https?:\/\//i.test(normalized) ||
      /^\/(?!\/)/.test(normalized) ||
      /^www\./i.test(normalized)
    );
  }

  /**
   * Handle completion trace events for streaming
   * @private
   * @param {Object} payload - The payload from completion trace
   */
  handleCompletion(payload) {
    if (!payload || !payload.state) {
      console.warn("Invalid completion payload:", payload);
      return;
    }

    switch (payload.state) {
      case "start":
        this.currentCompletion = "";
        // Initialize parser state if needed
        break;

      case "content":
        if (payload.content) {
          if (!this.hasStartedStreaming) {
            this.eventBus.emit("typing", { isTyping: false });
            this.hasStartedStreaming = true;
          }

          this.currentCompletion += payload.content;
          this.streamingParser.appendText(payload.content);
          console.log("appendText called with:", payload.content);
        }
        break;

      case "end":
        // Parser flush
        this.streamingParser.end();

        const finalHTML = parseMarkdown(this.currentCompletion); // Use parseMarkdown instead of window.marked
        this.eventBus.emit("finalMessage", {
          content: finalHTML,
          isStreamed: true,
        });
        // Emit a new event specifically for history saving
        console.log(
          "Emitting assistantMessageFinalized with content:",
          finalHTML
        ); // Add this line
        this.eventBus.emit("assistantMessageFinalized", {
          content: finalHTML,
          metadata: null,
        });
        this.currentCompletion = null;
        this.hasStartedStreaming = false; // Reset for next stream
        break;

      default:
        console.warn("Unknown completion state:", payload.state);
    }
  }

  /**
   * Emit a complete message received
   * @private
   * @param {string} message - The message content
   * @param {Object} metadata - Optional metadata
   */
  emitMessageReceived(message, metadata) {
    this.eventBus.emit("messageReceived", {
      content: message,
      metadata,
      isStreamed: false,
    });
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
