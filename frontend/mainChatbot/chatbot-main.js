// /frontend/mainChatbot/chatbot-main.js

import ChatbotCore from "../baseChatbot/base-chatbot.js";
import MainChatbotUI from "./chatbot-main-ui.js";
import { generateUserId } from "../utils/user-id-generator.js";

/**
 * MainChatbot Class
 * Handles main chatbot functionality including history management and drawer integration
 */
class MainChatbot {
  /**
   * @param {HTMLElement} container - The container element for the chatbot
   */
  constructor(container) {
    this.container = container;
    this.historyKey = "mainChatbotHistory";
    this.launchKey = "chatHasLaunched";
    this.isLaunched = this.hasLaunched();

    // Initialize core and UI
    this.initialize();
  }

  /**
   * Initialize the chatbot components
   * @private
   */
  initialize() {
    // Set up user ID
    let userId = localStorage.getItem("mainChatbotUserId");
    if (!userId) {
      userId = generateUserId("mainChatbot");
      localStorage.setItem("mainChatbotUserId", userId);
    }

    // Initialize core
    this.core = new ChatbotCore({
      type: "main",
      endpoint:
        "https://chatbottings--development.gadget.app/voiceflowAPI/voiceflow-streaming",
      userID: userId,
    });

    // Initialize UI
    this.ui = new MainChatbotUI({
      container: this.container,
      eventBus: this.core.eventBus,
      type: "main",
    });

    this.setupEventListeners();
    this.loadHistory();
  }

  /**
   * Set up event listeners
   * @private
   */
  setupEventListeners() {
    // Handle user messages
    this.core.eventBus.on("userMessage", (message) => {
      this.saveToHistory("user", message);
    });

    // Handle bot messages
    this.core.eventBus.on("messageReceived", ({ content, metadata }) => {
      this.saveToHistory("assistant", content, metadata);
    });

    // Handle choice presentation (saves them to history)
    this.core.eventBus.on("choicePresented", ({ buttons }) => {
      this.saveToHistory("assistant", "Choice presented", {
        type: "choice",
        buttons: buttons,
      });
    });

    this.core.eventBus.on("carouselPresented", ({ items }) => {
      this.saveToHistory("assistant", "Carousel presented", {
        type: "carousel",
        carouselItems: items,
      });
    });

    // Handle button clicks
    this.core.eventBus.on("buttonClicked", (payload) => {
      // Save the user's choice and display it in the UI
      const userMessage = payload.payload.label || "Button clicked";
      this.saveToHistory("user", userMessage);
      this.ui.addMessage("user", userMessage);

      // Remove previous interactive elements
      this.ui.removeInteractiveElements();

      // Handle sending the request to Voiceflow based on payload.type
      if (payload.type && payload.type.startsWith("path-")) {
        // If this is a path type request, build the action as per Voiceflow docs
        const actionPayload = {
          action: {
            type: payload.type, // e.g. "path-4ragy3i2y"
            payload: {
              label: userMessage, // optional but recommended to set last_utterance
            },
          },
        };

        // Use sendAction with the constructed payload
        this.core.sendAction(actionPayload);
      } else if (payload.type === "intent") {
        // If it were an intent, you'd do something like:
        const actionPayload = {
          action: {
            type: "intent",
            payload: {
              intent: payload.payload.intent,
              query: payload.payload.query || "",
              entities: payload.payload.entities || [],
              // label could be included here if desired
            },
          },
        };
        this.core.sendAction(actionPayload);
      } else {
        // If it's neither path nor intent, fall back to treating it as text input:
        this.core.sendMessage(userMessage);
      }
    });

    // Handle carousel button clicks
    this.core.eventBus.on("carouselButtonClicked", (payload) => {
      // payload is { action: buttonData.request, label: displayLabel }
      // displayLabel = "Selected ${productTitle}" if productTitle is defined

      const userMessage = payload.label || "Button clicked";
      console.log("User selected: ", userMessage);

      // Save to history and display the user's choice
      this.saveToHistory("user", userMessage);
      this.ui.addMessage("user", userMessage);

      // Handle sending the request to Voiceflow based on payload.action.type
      // payload.action might look like { type: "path-xyz", payload: {...} } or {type: "intent", ...}
      const { type, payload: actionData } = payload.action;

      if (type === "button") {
        // Treat it as a text input, but send the entire object so Voiceflow has `item`, `title`, etc.
        const actionPayload = {
          action: {
            type: "text",
            payload: payload.action,
          },
        };
        this.core.sendAction(actionPayload);
      } else if (type && type.startsWith("path-")) {
        const actionPayload = {
          action: {
            type: type, // e.g. "path-4ragy3i2y"
            payload: {
              label: userMessage,
            },
          },
        };
        this.core.sendAction(actionPayload);
      } else if (type === "intent") {
        const actionPayload = {
          action: {
            type: "intent",
            payload: {
              intent: actionData.intent,
              query: actionData.query || "",
              entities: actionData.entities || [],
              // label can be included if needed
            },
          },
        };
        this.core.sendAction(actionPayload);
      } else {
        // If Voiceflow doesn't understand "button", treat it like text
        this.core.sendMessage(userMessage);
      }
    });

    // Handle main menu
    this.core.eventBus.on("mainMenu", () => {
      this.core.sendAction({
        action: {
          type: "event",
          payload: {
            event: {
              name: "main_menu",
            },
          },
        },
      });
    });
  }

  /**
   * Check if chatbot has been launched before
   * @private
   * @returns {boolean}
   */
  hasLaunched() {
    return localStorage.getItem(this.launchKey) === "true";
  }

  /**
   * Set launched state
   * @private
   */
  setLaunched() {
    localStorage.setItem(this.launchKey, "true");
    this.isLaunched = true;
  }

  /**
   * Launch the chatbot
   * @public
   */
  async launch() {
    if (this.isLaunched) {
      console.log("Chat already launched, skipping launch request");
      return;
    }

    try {
      await this.core.sendLaunch();
      this.setLaunched();
    } catch (error) {
      console.error("Error launching chatbot:", error);
      this.ui.displayError(
        "Failed to launch the chatbot. Please try again later."
      );
    }
  }

  /**
   * Save message to history
   * @private
   * @param {string} sender - Message sender
   * @param {string} message - Message content
   * @param {Object} metadata - Optional metadata
   */
  saveToHistory(sender, message, metadata = null) {
    const history = JSON.parse(localStorage.getItem(this.historyKey)) || [];

    const historyEntry = {
      sender,
      message,
      timestamp: Date.now(),
      isInteractive: false,
    };

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

  /**
   * Load conversation history
   * @private
   */
  loadHistory() {
    const history = JSON.parse(localStorage.getItem(this.historyKey)) || [];
    console.log("Loading history:", history); // Log the entire history array

    history.forEach((entry, index) => {
      console.log("Processing history entry:", entry);

      if (entry.isInteractive) {
        console.log("Entry is interactive:", entry);

        if (index === history.length - 1) {
          console.log("Restoring interactive element from history");

          this.restoreInteractiveElement(entry);
        }
        return;
      }

      if (entry.message) {
        console.log("Adding message from history:", entry);

        this.ui.addMessage(entry.sender, entry.message);
      }
    });
  }

  /**
   * Restore interactive elements from history
   * @private
   * @param {Object} historyEntry - The history entry to restore
   */
  restoreInteractiveElement(historyEntry) {
    if (historyEntry.traceType === "choice") {
      this.ui.addButtons(historyEntry.traceData.buttons, true);
    } else if (historyEntry.traceType === "carousel") {
      this.ui.addCarousel(historyEntry.traceData.cards, true);
    }
  }

  /**
   * Clear chat history
   * @public
   */
  clearHistory() {
    localStorage.removeItem(this.historyKey);
    localStorage.removeItem(this.launchKey);
    this.isLaunched = false;
    this.ui.clearChat();
  }

  /**
   * Clean up resources
   * @public
   */
  destroy() {
    this.core.destroy();
    this.ui.destroy();
  }
}

export default MainChatbot;
window.MainChatbot = MainChatbot;
