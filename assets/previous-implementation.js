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

    // Listen for user messages with the correct namespace
    eventBus.on(
      chatbotType === "main"
        ? EVENTS.MAIN_CHATBOT.USER_MESSAGE
        : EVENTS.SECTION_CHATBOT.USER_MESSAGE,
      (message) => this.sendMessage(message)
    );

    this.initialize();
  }

  initialize() {
    // Initial setup if needed
  }

  /**
   * Sends a launch request to initiate the conversation.
   */
  sendLaunch(interactPayload = {}) {
    console.log("Constructing launch payload with:", interactPayload);
    const payload = interactPayload.action
      ? interactPayload
      : {
          action: {
            type: "launch",
          },
        };
    console.log("Final launch payload:", payload);

    return this.sendAction(payload);
  }

  /**
   * Sends a user message to the chatbot.
   * @param {string | Object} message - The user's message or button payload
   */
  sendMessage(message) {
    console.log("Constructing message payload:", message);

    // If message is an object (button payload), use it directly
    const payload = {
      action: {
        type: "text",
        payload: typeof message === "object" ? message : message,
      },
    };

    console.log("Final message payload:", payload);
    return this.sendAction(payload);
  }

  /**
   * Sends an action (launch, message, etc.) to the Gadget API via POST and handles SSE response.
   * @param {Object} actionPayload - The action payload to send.
   */
  async sendAction(actionPayload) {
    this.abortController = new AbortController();
    const { signal } = this.abortController;

    try {
      console.log("Sending action to Gadget API:", actionPayload);

      // Show typing indicator before sending request
      eventBus.emit(`${this.eventPrefix}:typing`, { isTyping: true });

      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: this.userID,
          action: actionPayload.action,
        }),
        credentials: "include",
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
      // Hide typing indicator on error
      eventBus.emit(`${this.eventPrefix}:typing`, { isTyping: false });

      if (error.name === "AbortError") {
        console.warn("SSE connection aborted");
      } else {
        console.error("SSE connection error:", error);
        eventBus.emit(`${this.eventPrefix}:error`, { message: error.message });
      }
    } finally {
      this.abortController = null;
      eventBus.emit(`${this.eventPrefix}:end`, {});
      // Hide typing indicator when everything is done
      eventBus.emit(`${this.eventPrefix}:typing`, { isTyping: false });
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

    // Hide typing indicator when we receive any trace
    eventBus.emit(`${this.eventPrefix}:typing`, { isTyping: false });

    switch (trace.type) {
      case "text":
        console.log("Text received trace:", trace);
        eventBus.emit(`${this.eventPrefix}:messageReceived`, {
          content: trace.payload.message,
          metadata: trace.payload.metadata || null, // Include metadata if available
        });
        break;

      case "choice":
        console.log("Choice received trace:", trace);
        eventBus.emit(`${this.eventPrefix}:choicePresented`, {
          type: "choice",
          buttons: trace.payload.buttons,
        });
        break;

      case "carousel":
        console.log("Carousel received trace:", trace);
        eventBus.emit(`${this.eventPrefix}:carouselPresented`, {
          type: "carousel",
          carouselItems: trace.payload.cards,
        });
        break;

      case "waiting_text":
        console.log("Waiting text received trace:", trace);
        eventBus.emit(`${this.eventPrefix}:typingText`, {
          text: trace.payload.text,
        });
        // Show typing indicator with the custom text
        eventBus.emit(`${this.eventPrefix}:typing`, { isTyping: true });
        break;

      case "speak":
        console.log("Speak received trace:", trace);
        // Handle speak traces if necessary
        break;

      case "visual":
        console.log("Visual received trace:", trace);
        // Handle visual traces if necessary
        break;

      case "no-reply":
        console.log("No-reply received trace:", trace);
        // Handle no-reply traces if necessary
        break;

      case "end":
        console.log("End trace received:", trace);
        eventBus.emit(`${this.eventPrefix}:end`, {});
        break;

      case "completion-events":
        console.log("Completion event trace received:", trace);
        // Handle completion events if necessary
        break;
      default:
        console.warn(`Unhandled trace type: ${trace.type}`, trace);
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
    // Remove the user message listener based on chatbot type
    eventBus.removeAllListeners(
      this.chatbotType === "main"
        ? EVENTS.MAIN_CHATBOT.USER_MESSAGE
        : EVENTS.SECTION_CHATBOT.USER_MESSAGE
    );
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





// /assets/scripts/chatbot/chatbot-main.js

import ChatbotCore from "../core/chatbot-core.js";
import MainChatbotUI from "../ui/chatbot-main-ui.js";
import eventBus from "../utils/event-bus.js";
import { EVENTS } from "../utils/event-constants.js";
import { generateUserId } from "../utils/user-id-generator.js";

/**
 * MainChatbot Class
 * Manages the Main Chatbot's interactions, conversation history, and UI updates.
 */
class MainChatbot {
  constructor(core, ui) {
    this.core = core;
    this.ui = ui;
    this.historyKey = "mainChatbotHistory";
    this.launchKey = "chatHasLaunched";
    this.isLaunched = this.hasLaunched();
    this.setupEventListeners();
  }

  hasLaunched() {
    return localStorage.getItem(this.launchKey) === "true";
  }

  setLaunched() {
    localStorage.setItem(this.launchKey, "true");
    this.isLaunched = true;
  }

  setupEventListeners() {
    // Listen to messageReceived events
    eventBus.on(EVENTS.MAIN_CHATBOT.MESSAGE_RECEIVED, (data) => {
      this.ui.addMessage("assistant", data.content, data.metadata);
      this.saveToHistory("assistant", data.content, data.metadata);
    });

    // Listen to user messages
    eventBus.on("userMessage", (message) => {
      this.ui.addMessage("user", message);
      this.saveToHistory("user", message);
      this.core.sendMessage(message);
    });

    // Listen to button clicks
    eventBus.on("buttonClicked", (data) => {
      if (!data || !data.label) {
        console.error("Invalid button data:", data);
        return;
      }

      // Display the button's label as the user's message
      this.ui.addMessage("user", data.label);
      this.saveToHistory("user", data.label);

      // Send the button payload to Voiceflow
      const actionPayload = {
        action: {
          type: data.type,
        },
      };

      // Only add payload if it exists and has content
      if (data.payload && Object.keys(data.payload).length > 0) {
        actionPayload.action.payload = data.payload;
      }

      this.core.sendAction(actionPayload);
    });

    // Listen to choicePresented events
    eventBus.on(EVENTS.MAIN_CHATBOT.CHOICE_PRESENTED, (data) => {
      this.ui.addButtons(data.buttons);
      // Save to history with metadata, but without message
      this.saveToHistory("assistant", "", {
        type: "choice",
        buttons: data.buttons,
      });
    });

    // Listen to carouselPresented events
    eventBus.on(EVENTS.MAIN_CHATBOT.CAROUSEL_PRESENTED, (data) => {
      this.ui.addCarousel(data.carouselItems);
      // Save to history with metadata, but without message
      this.saveToHistory("assistant", "", {
        type: "carousel",
        carouselItems: data.carouselItems,
      });
    });

    // Listen to error events
    eventBus.on(EVENTS.MAIN_CHATBOT.ERROR, (error) => {
      this.ui.displayError(error.message);
    });

    // Listen to typing events
    eventBus.on(EVENTS.MAIN_CHATBOT.TYPING, (data) => {
      if (data.isTyping) {
        this.ui.showTypingIndicator();
      } else {
        this.ui.hideTypingIndicator();
      }
    });

    // Listen for chatbot launch event
    document.addEventListener("chatbotLaunch", () => {
      this.launch();
    });

    // Handle carousel button clicks
    eventBus.on("carouselButtonClicked", (data) => {
      if (!data || !data.action) {
        console.error("Invalid carousel button data:", data);
        return;
      }

      // Add the button text as a user message
      this.ui.addMessage("user", data.label);
      this.saveToHistory("user", data.label);

      // Send the action to Voiceflow
      this.core.sendAction({
        action: data.action,
      });
    });
  }

  launch() {
    if (this.isLaunched) {
      console.log("Chat already launched, skipping launch request");
      return;
    }

    this.core
      .sendLaunch()
      .then(() => {
        console.log("Chatbot launched successfully.");
        this.setLaunched();
      })
      .catch((error) => {
        console.error("Error launching chatbot:", error);
        this.ui.displayError(
          "Failed to launch the chatbot. Please try again later."
        );
      });
  }

  sendMessage(message) {
    const sanitizedMessage = this.sanitizeInput(message);

    this.ui.addMessage("user", sanitizedMessage, { type: "message" });
    this.saveToHistory("user", sanitizedMessage, { type: "message" });

    this.core.sendMessage(sanitizedMessage).catch((error) => {
      console.error("Error sending message:", error);
      this.ui.displayError("Failed to send your message. Please try again.");
    });
  }

  sendAction(actionPayload) {
    if (!actionPayload || typeof actionPayload !== "object") {
      console.error("Invalid action payload:", actionPayload);
      this.ui.displayError("Invalid action triggered.");
      return;
    }

    this.core
      .sendAction({
        action: actionPayload,
        config: {},
      })
      .then(() => {
        console.log("Action sent successfully:", actionPayload);
        this.ui.addMessage("user", actionPayload.label || "Action executed.", {
          type: "action",
        });
        this.saveToHistory("user", JSON.stringify(actionPayload), {
          type: "action",
        });
      })
      .catch((error) => {
        console.error("Error sending action:", error);
        this.ui.displayError(
          "An error occurred while processing your request."
        );
      });
  }

  saveToHistory(sender, message, metadata = null) {
    const history = JSON.parse(localStorage.getItem(this.historyKey)) || [];

    // Create history entry with additional trace data for interactive elements
    const historyEntry = {
      sender,
      message,
      timestamp: Date.now(),
      isInteractive: false, // Add flag for interactive elements
    };

    // If this is an assistant message with choice or carousel, store the trace
    if (sender === "assistant" && metadata) {
      if (metadata.type === "choice") {
        historyEntry.isInteractive = true;
        historyEntry.traceType = "choice";
        historyEntry.traceData = { buttons: metadata.buttons };
      } else if (metadata.type === "carousel") {
        historyEntry.isInteractive = true;
        historyEntry.traceType = "carousel";
        historyEntry.traceData = { cards: metadata.carouselItems };
      }
    }

    history.push(historyEntry);
    localStorage.setItem(this.historyKey, JSON.stringify(history));
  }

  loadHistory() {
    const history = JSON.parse(localStorage.getItem(this.historyKey)) || [];

    // Process all messages
    history.forEach((entry, index) => {
      // If it's an interactive element
      if (entry.isInteractive) {
        // Only restore interactive element if it's the last entry
        if (index === history.length - 1) {
          if (entry.traceType === "choice") {
            this.ui.addButtons(entry.traceData.buttons, true);
          } else if (entry.traceType === "carousel") {
            this.ui.addCarousel(entry.traceData.cards, true);
          }
        }
        // Skip adding message for interactive elements since they should have empty messages
        return;
      }

      // For non-interactive messages, display them normally
      if (entry.message) {
        this.ui.addMessage(entry.sender, entry.message);
      }
    });
  }

  restoreInteractiveElement(historyEntry) {
    if (historyEntry.traceType === "choice") {
      this.ui.addButtons(historyEntry.traceData.buttons, true);
    } else if (historyEntry.traceType === "carousel") {
      this.ui.addCarousel(historyEntry.traceData.cards, true);
    }
  }

  sanitizeInput(input) {
    const div = document.createElement("div");
    div.textContent = input;
    return div.innerHTML;
  }
}

// Initialize Main Chatbot on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  const mainChatbotContainer = document.getElementById("main-chatbot-ui");

  if (!mainChatbotContainer) {
    console.error("Main Chatbot UI container not found");
    return;
  }

  // Generate or retrieve existing userID for Main Chatbot
  let mainUserId = localStorage.getItem("mainChatbotUserId");
  if (!mainUserId) {
    mainUserId = generateUserId("mainChatbot");
    localStorage.setItem("mainChatbotUserId", mainUserId);
  }

  // Initialize ChatbotCore with the generated userID
  const mainChatbotCore = new ChatbotCore({
    userID: mainUserId,
    endpoint:
      "https://chatbottings--development.gadget.app/voiceflowAPI/voiceflow-streaming", // Update to your actual endpoint
    chatbotType: "main",
  });

  // Initialize MainChatbotUI
  const mainChatbotUI = new MainChatbotUI(mainChatbotContainer);

  // Initialize MainChatbot
  const mainChatbot = new MainChatbot(mainChatbotCore, mainChatbotUI);

  // Load conversation history
  mainChatbot.loadHistory();
});

export default MainChatbot;




// /assets/scripts/chatbot/main/main-chatbot-ui.js

import eventBus from "../utils/event-bus.js";
import { EVENTS } from "../utils/event-constants.js";

/**
 * MainChatbotUI Class
 * Handles UI-specific functionalities for the Main Chatbot.
 */
class MainChatbotUI {
  constructor(container) {
    this.container = container;
    this.form = this.container.querySelector(".chat-form");
    this.input = this.container.querySelector("input[type='text']");
    this.messageContainer = this.container.querySelector(".message-container");
    this.typingIndicator = this.container.querySelector(".chat-typing");

    console.log("Chatbot UI Container:", this.container);
    console.log("Chat Form:", this.form);
    console.log("Chat Input:", this.input);
    console.log("Message Container:", this.messageContainer);
    console.log("Typing Indicator:", this.typingIndicator);

    if (!this.container) {
      console.error("Main Chatbot UI container not found");
      return;
    }

    if (!this.form || !this.input) {
      console.error("Main Chatbot form or input not found");
      return;
    }

    this.setupEventListeners();
  }

  setupEventListeners() {
    // Handle form submissions
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      const message = this.input.value.trim();
      if (message) {
        eventBus.emit(EVENTS.MAIN_CHATBOT.USER_MESSAGE, message);
        this.input.value = "";
      }
    });

    // Listen for typing events from ChatbotCore
    eventBus.on(`${EVENTS.MAIN_CHATBOT.PREFIX}:typing`, (data) => {
      if (data.isTyping) {
        this.showTypingIndicator();
      } else {
        this.hideTypingIndicator();
      }
    });

    // Set up event delegation for button clicks within messages
    this.messageContainer.addEventListener("click", (e) => {
      const button = e.target.closest("button-component");
      if (button) {
        const payload = JSON.parse(button.getAttribute("payload") || "{}");
        const label = button.getAttribute("label");
        if (label) {
          eventBus.emit("buttonClicked", {
            type: payload.type,
            payload,
            label,
          });
          this.removeInteractiveElements();
        }
      }
    });

    // Listen at the custom-drawer level
    document.querySelector("custom-drawer")?.addEventListener("click", (e) => {
      const menuButton = e.target.closest(".main-menu");
      if (menuButton) {
        e.preventDefault();
        eventBus.emit("buttonClicked", {
          type: "event",
          payload: {
            event: {
              name: "main_menu",
            },
          },
          label: "Back to Menu",
        });
      }
    });
  }

  /**
   * Adds a message to the chatbot UI.
   * @param {string} sender - 'user' or 'assistant'.
   * @param {string} content - The message content.
   * @param {Object} [metadata] - Additional metadata about the message.
   * @param {boolean} [isHistory] - Whether this message is being loaded from history
   */
  addMessage(sender, content, metadata = null, isHistory = false) {
    if (!this.messageContainer) {
      console.error("Message container not set");
      return;
    }

    // Only remove interactive elements if this isn't from history loading
    // and the current message isn't interactive
    if (!isHistory && (!metadata || !metadata.isInteractive)) {
      this.removeInteractiveElements();
    }

    const message = document.createElement("message-component");
    message.setAttribute("sender", sender);
    message.setAttribute("content", content);

    // Add image URL if available in metadata
    if (metadata?.imageUrl) {
      message.setAttribute("image-url", metadata.imageUrl);
    }

    this.messageContainer.appendChild(message);
    console.log("Message appended to messageContainer");
    this.scrollToBottom();

    // If metadata includes interactive elements, add them
    if (sender === "assistant" && metadata) {
      switch (metadata.type) {
        case "choice":
          this.addButtons(metadata.buttons, isHistory);
          break;
        case "carousel":
          this.addCarousel(metadata.carouselItems, isHistory);
          break;
        default:
          break;
      }
    }
  }

  /**
   * Adds interactive buttons to the chatbot UI.
   * @param {Array} buttons - Array of button data.
   * @param {boolean} [isHistory] - Whether these buttons are being loaded from history
   */
  addButtons(buttons, isHistory = false) {
    console.log("addButtons called with:", buttons);

    if (!Array.isArray(buttons)) {
      console.error("addButtons expected an array but received:", buttons);
      return;
    }

    // Only remove existing interactive elements if not loading from history
    if (!isHistory) {
      this.removeInteractiveElements();
      this.storeInteractiveState("choice", buttons);
    }

    buttons.forEach((buttonData) => {
      const button = document.createElement("button-component");
      button.setAttribute("label", buttonData.name);
      button.setAttribute("payload", JSON.stringify(buttonData.request));
      this.messageContainer.appendChild(button);
      console.log("Button appended to messageContainer");
    });
    this.scrollToBottom();
  }

  addCarousel(carouselItems, isHistory = false) {
    console.log("Adding carousel with items:", carouselItems);

    if (!Array.isArray(carouselItems)) {
      console.error(
        "addCarousel expected an array but received:",
        carouselItems
      );
      return;
    }

    // Only remove existing interactive elements if not loading from history
    if (!isHistory) {
      this.removeInteractiveElements();
      this.storeInteractiveState("carousel", carouselItems);
    }

    const carouselData = { cards: carouselItems };
    const carousel = document.createElement("carousel-component");
    carousel.setAttribute("data-carousel", JSON.stringify(carouselData));
    this.messageContainer.appendChild(carousel);
    this.scrollToBottom();
  }

  /**
   * Stores the state of the last interactive element
   * @param {string} type - The type of interactive element ('choice' or 'carousel')
   * @param {Array} data - The data for the interactive element
   */
  storeInteractiveState(type, data) {
    const interactiveState = {
      type,
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(
      "lastInteractiveElement",
      JSON.stringify(interactiveState)
    );
  }

  /**
   * Restores the last interactive element if it exists
   */
  restoreInteractiveElement() {
    const savedState = localStorage.getItem("lastInteractiveElement");
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        if (state.type === "choice") {
          this.addButtons(state.data, true);
        } else if (state.type === "carousel") {
          this.addCarousel(state.data, true);
        }
      } catch (error) {
        console.error("Error restoring interactive element:", error);
      }
    }
  }

  showTypingIndicator() {
    if (this.typingIndicator) {
      this.typingIndicator.style.display = "flex";
      this.scrollToBottom();
    }
  }

  hideTypingIndicator() {
    if (this.typingIndicator) {
      this.typingIndicator.style.display = "none";
    }
  }

  displayError(message) {
    const errorDiv = document.createElement("div");
    errorDiv.classList.add("error-message");
    errorDiv.innerText = message;
    this.messageContainer.appendChild(errorDiv);
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
  }

  /**
   * Removes interactive elements (buttons, carousels) from the UI.
   */
  removeInteractiveElements() {
    const interactiveElements = this.messageContainer.querySelectorAll(
      "button-component, carousel-component"
    );
    interactiveElements.forEach((element) => element.remove());
    // Clear the stored interactive state
    localStorage.removeItem("lastInteractiveElement");
  }
}

export default MainChatbotUI;




// /assets/scripts/chatbot/section/section-chatbot.js

import ChatbotCore from "../core/chatbot-core.js";
import SectionChatbotUI from "../ui/chatbot-section-ui.js";
import eventBus from "../utils/event-bus.js";
import { EVENTS } from "../utils/event-constants.js";
import { generateUserId } from "../utils/user-id-generator.js";

/**
 * SectionChatbot Class
 * Manages the Section Chatbot's interactions, handles product details, and updates the UI.
 * Does not maintain conversation history, focuses on immediate interactions.
 *
 * @class
 * @property {ChatbotCore} core - Instance of ChatbotCore handling API communications
 * @property {SectionChatbotUI} ui - Instance of SectionChatbotUI handling UI updates
 * @property {boolean} isLaunched - Tracks whether the chatbot has been launched
 */
class SectionChatbot {
  /**
   * Creates a new SectionChatbot instance.
   * Initializes the core functionality and UI components.
   *
   * @param {ChatbotCore} core - ChatbotCore instance for API communication
   * @param {SectionChatbotUI} ui - SectionChatbotUI instance for UI management
   */
  constructor(core, ui) {
    if (!core || !ui) {
      throw new Error("SectionChatbot requires both core and ui instances");
    }

    this.core = core;
    this.ui = ui;
    this.isLaunched = false;

    this.validateProductDetails();
    this.setupEventListeners();
  }

  /**
   * Validates that all required product details are present.
   * Displays an error message if required fields are missing.
   *
   * @private
   */
  validateProductDetails() {
    const requiredFields = ["title", "capacity"];
    const missingFields = requiredFields.filter(
      (field) => !this.ui.productDetails[field]
    );

    if (missingFields.length > 0) {
      console.error(
        `Missing required product details: ${missingFields.join(", ")}`
      );
      this.ui.displayError(
        "Some product information is missing. Chat functionality may be limited."
      );
    }
  }

  /**
   * Sets up event listeners for all chatbot interactions.
   * Handles message reception, user interactions, and error states.
   *
   * @private
   */
  setupEventListeners() {
    // Message handling with typing indicators
    eventBus.on(EVENTS.SECTION_CHATBOT.MESSAGE_RECEIVED, (data) => {
      this.ui.hideTypingIndicator();
      this.ui.addMessage("assistant", data.content, data.metadata);
    });

    // Typing indicator management
    eventBus.on(EVENTS.SECTION_CHATBOT.TYPING, (data) => {
      if (data.isTyping) {
        this.ui.showTypingIndicator();
      } else {
        this.ui.hideTypingIndicator();
      }
    });

    // Typing text updates
    eventBus.on(EVENTS.SECTION_CHATBOT.TYPING_TEXT, (data) => {
      this.ui.showTypingIndicator();
      this.ui.updateTypingText(data.text);
    });

    // Button choice handling
    eventBus.on(EVENTS.SECTION_CHATBOT.CHOICE_PRESENTED, (data) => {
      this.ui.hideTypingIndicator();
      this.ui.addButtons(data.buttons);
    });

    // Carousel handling
    eventBus.on(EVENTS.SECTION_CHATBOT.CAROUSEL_PRESENTED, (data) => {
      this.ui.hideTypingIndicator();
      this.ui.addCarousel(data.carouselItems);
    });

    // Error handling
    eventBus.on(EVENTS.SECTION_CHATBOT.ERROR, (error) => {
      this.ui.hideTypingIndicator();
      this.ui.displayError(error.message);
    });

    // User message handling
    eventBus.on("userMessage", (message) => {
      this.sendMessage(message);
    });

    // Button click handling
    eventBus.on("buttonClicked", (payload) => {
      this.handleButtonClick(payload);
    });

    // Carousel button click handling
    eventBus.on("carouselButtonClicked", (payload) => {
      this.handleButtonClick(payload);
    });

    // Handle page cleanup
    window.addEventListener("unload", () => {
      this.destroy();
    });
  }

  /**
   * Launches the chatbot with product details.
   * Only launches if not already launched.
   *
   * @public
   */
  launch() {
    if (this.isLaunched) {
      console.log("Section chatbot already launched");
      return;
    }

    const sanitizedDetails = this.sanitizeProductDetails(
      this.ui.productDetails
    );
    const interactPayload = {
      action: {
        type: "launch",
        payload: {
          startBlock: "shopifySection",
          powerStationDetails: sanitizedDetails,
        },
      },
    };

    console.log("Launching section chatbot with payload:", interactPayload);
    this.ui.showTypingIndicator();
    this.core.sendLaunch(interactPayload);
    this.isLaunched = true;
  }

  /**
   * Sanitizes product details before sending to the API.
   *
   * @private
   * @param {Object} details - Raw product details
   * @returns {Object} Sanitized product details
   */
  sanitizeProductDetails(details) {
    return Object.entries(details).reduce((acc, [key, value]) => {
      acc[key] = value ? String(value).trim() : "";
      return acc;
    }, {});
  }

  /**
   * Sends a user message to the chatbot.
   *
   * @public
   * @param {string} message - User's message to send
   */
  sendMessage(message) {
    if (!message.trim()) return;

    this.ui.showTypingIndicator();
    this.core.sendMessage(message);
    this.ui.addMessage("user", message);
  }

  /**
   * Handles button click interactions.
   *
   * @public
   * @param {Object} payload - Button click payload
   */
  handleButtonClick(payload) {
    if (!payload) return;

    this.ui.showTypingIndicator();
    this.core.sendAction({
      action: payload,
    });
    this.ui.removeInteractiveElements();
  }

  /**
   * Cleans up resources and event listeners.
   *
   * @public
   */
  destroy() {
    this.core.closeConnection();
    eventBus.removeAllListeners(`${EVENTS.SECTION_CHATBOT.PREFIX}:`);
    eventBus.removeAllListeners("userMessage");
    eventBus.removeAllListeners("buttonClicked");
    eventBus.removeAllListeners("carouselButtonClicked");
  }
}

// Initialize Section Chatbot on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  const sectionChatbotContainer = document.getElementById("section-chatbot-ui");

  if (!sectionChatbotContainer) {
    console.error("Section Chatbot UI container not found");
    return;
  }

  // Generate or retrieve existing userID for Section Chatbot
  let sectionUserId = localStorage.getItem("sectionChatbotUserId");
  if (!sectionUserId) {
    sectionUserId = generateUserId("sectionChatbot");
    localStorage.setItem("sectionChatbotUserId", sectionUserId);
  }

  // Initialize ChatbotCore with the generated userID
  const sectionChatbotCore = new ChatbotCore({
    userID: sectionUserId,
    endpoint:
      "https://chatbottings--development.gadget.app/voiceflowAPI/voiceflow-streaming",
    chatbotType: "section",
  });

  // Initialize SectionChatbotUI
  const sectionChatbotUI = new SectionChatbotUI(sectionChatbotContainer);

  // Initialize SectionChatbot
  const sectionChatbot = new SectionChatbot(
    sectionChatbotCore,
    sectionChatbotUI
  );

  // Handle launch event on first focus of the input field
  const sectionInput = sectionChatbotContainer.querySelector("#userInput");
  console.log("Section Chatbot UI input:", sectionInput);

  if (sectionInput) {
    sectionInput.addEventListener("focus", () => {
      if (!sectionChatbot.isLaunched) {
        sectionChatbot.launch();
      }
    });
  } else {
    console.error("Section Chatbot input field not found");
  }
});

export default SectionChatbot;



// /assets/scripts/chatbot/section/section-chatbot-ui.js

import eventBus from "../utils/event-bus.js";
import { EVENTS } from "../utils/event-constants.js";

/**
 * SectionChatbotUI Class
 * Handles all UI-specific functionalities for the Section Chatbot.
 * Manages message display, interactive elements, and product details.
 *
 * @class
 * @property {HTMLElement} container - The main container element for the chatbot UI
 * @property {HTMLFormElement} form - The form element for user input
 * @property {HTMLInputElement} input - The text input element
 * @property {HTMLElement} messageContainer - Container for chat messages
 * @property {Object} productDetails - Product information from data attributes
 */
class SectionChatbotUI {
  /**
   * Creates a new SectionChatbotUI instance.
   * Initializes UI elements and extracts product details from container attributes.
   *
   * @param {HTMLElement} container - The section chatbot UI container
   * @throws {Error} If required UI elements are not found
   */
  constructor(container) {
    if (!container) {
      throw new Error("SectionChatbotUI requires a container element");
    }

    this.container = container;
    this.form = this.container.querySelector("#chatForm");
    this.input = this.container.querySelector("#userInput");
    this.messageContainer = this.container.querySelector("#messageContainer");
    this.typingIndicator = this.container.querySelector(".chat-typing");
    this.typingText = this.typingIndicator?.querySelector(".typing-text");

    console.log("Chatbot UI Container:", this.container);
    console.log("Chat Form:", this.form);
    console.log("Chat Input:", this.input);
    console.log("Message Container:", this.messageContainer);
    console.log("Typing Indicator:", this.typingIndicator);
    console.log("Typing Text:", this.typingText);

    if (!this.form) {
      throw new Error("Chat form not found (id: chatForm)");
    }
    if (!this.input) {
      throw new Error("Input field not found (id: userInput)");
    }
    if (!this.messageContainer) {
      throw new Error("Message container not found (id: messageContainer)");
    }

    this.initializeProductDetails();
    this.setupEventListeners();
  }

  /**
   * Initializes product details from container data attributes.
   *
   * @private
   */
  initializeProductDetails() {
    this.productDetails = {
      title: this.getAttribute("product-title"),
      capacity: this.getAttribute("product-capacity"),
      ac_output_continuous_power: this.getAttribute(
        "product-ac_output_continuous_power"
      ),
      ac_output_peak_power: this.getAttribute("product-ac_output_peak_power"),
      dc_output_power: this.getAttribute("product-dc_output_power"),
    };

    console.log("Initialized product details:", this.productDetails);
  }

  /**
   * Sets up event listeners for user interactions within the UI.
   *
   * @private
   */
  setupEventListeners() {
    // Handle form submissions
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      const message = this.input.value.trim();
      if (message) {
        eventBus.emit(EVENTS.SECTION_CHATBOT.USER_MESSAGE, message);
        this.input.value = "";
      }
    });

    // Handle button clicks through event delegation
    this.messageContainer.addEventListener("click", (e) => {
      const button = e.target.closest("button-component");
      if (button) {
        const payload = this.getButtonPayload(button);
        if (payload) {
          eventBus.emit("buttonClicked", payload);
          this.removeInteractiveElements();
        }
      }
    });

    // Handle carousel interactions
    this.messageContainer.addEventListener("click", (e) => {
      const carousel = e.target.closest("carousel-component");
      if (carousel) {
        const button = e.target.closest(".carousel-button");
        if (button) {
          const payload = this.getButtonPayload(button);
          if (payload) {
            eventBus.emit("carouselButtonClicked", payload);
          }
        }
      }
    });
  }

  /**
   * Gets the payload data from a button element.
   *
   * @private
   * @param {HTMLElement} button - The button element
   * @returns {Object|null} The button's payload data or null if invalid
   */
  getButtonPayload(button) {
    try {
      return JSON.parse(button.getAttribute("payload") || "null");
    } catch (error) {
      console.error("Error parsing button payload:", error);
      return null;
    }
  }

  /**
   * Adds a message to the chatbot UI.
   *
   * @public
   * @param {string} sender - 'user' or 'assistant'
   * @param {string} content - The message content
   * @param {Object} [metadata] - Optional metadata for the message
   */
  addMessage(sender, content, metadata = null) {
    const message = document.createElement("message-component");
    message.setAttribute("sender", sender);
    message.setAttribute("content", content);

    if (metadata) {
      message.setAttribute("metadata", JSON.stringify(metadata));
    }

    this.messageContainer.appendChild(message);
    this.scrollToBottom();
  }

  /**
   * Adds interactive buttons to the chatbot UI.
   *
   * @public
   * @param {Array} buttons - Array of button data
   */
  addButtons(buttons) {
    if (!Array.isArray(buttons)) {
      console.error("Invalid buttons data:", buttons);
      return;
    }

    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "buttons-container";

    buttons.forEach((buttonData) => {
      const button = document.createElement("button-component");
      button.setAttribute("label", buttonData.name);
      button.setAttribute("payload", JSON.stringify(buttonData.request));
      buttonsContainer.appendChild(button);
    });

    this.messageContainer.appendChild(buttonsContainer);
    this.scrollToBottom();
  }

  /**
   * Adds a carousel to the chatbot UI.
   *
   * @public
   * @param {Array} items - Array of carousel items
   */
  addCarousel(items) {
    if (!Array.isArray(items)) {
      console.error("Invalid carousel items:", items);
      return;
    }

    const carousel = document.createElement("carousel-component");
    carousel.setAttribute("items", JSON.stringify(items));
    this.messageContainer.appendChild(carousel);
    this.scrollToBottom();
  }

  /**
   * Updates the typing indicator text.
   *
   * @public
   * @param {string} text - The text to display in the typing indicator
   */
  updateTypingText(text) {
    if (this.typingText) {
      this.typingText.textContent = text;
    }
  }

  /**
   * Shows the typing indicator.
   *
   * @public
   */
  showTypingIndicator() {
    if (this.typingIndicator) {
      this.typingIndicator.style.display = "flex";
      this.scrollToBottom();
    }
  }

  /**
   * Hides the typing indicator.
   *
   * @public
   */
  hideTypingIndicator() {
    if (this.typingIndicator) {
      this.typingIndicator.style.display = "none";
    }
  }

  /**
   * Displays an error message in the chatbot UI.
   *
   * @public
   * @param {string} message - The error message
   */
  displayError(message) {
    const errorDiv = document.createElement("div");
    errorDiv.classList.add("error-message");
    errorDiv.innerText = message;
    this.messageContainer.appendChild(errorDiv);
    this.scrollToBottom();
  }

  /**
   * Scrolls the message container to the bottom.
   *
   * @private
   */
  scrollToBottom() {
    this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
  }

  /**
   * Retrieves the value of a specified attribute from the chatbot container.
   *
   * @private
   * @param {string} attrName - The name of the attribute
   * @returns {string|null} The value of the attribute or null if not found
   */
  getAttribute(attrName) {
    return this.container.getAttribute(attrName);
  }

  /**
   * Removes all interactive elements from the UI.
   *
   * @public
   */
  removeInteractiveElements() {
    const elements = this.messageContainer.querySelectorAll(
      "button-component, carousel-component, .buttons-container"
    );
    elements.forEach((element) => element.remove());
  }
}

export default SectionChatbotUI;