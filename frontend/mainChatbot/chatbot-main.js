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

    // Handle button clicks
    this.core.eventBus.on("buttonClicked", (payload) => {
      // Save to history and show the user's choice in the UI
      this.saveToHistory("user", payload.label || "Button clicked");
      const userMessage = payload.label || "Button clicked";
      this.ui.addMessage("user", userMessage);
      this.ui.removeInteractiveElements();

      // Handle the payload based on request.type
      let actionPayload;

      if (payload.action && typeof payload.action === "object") {
        // payload.action should have a structure like { type: 'path-xyz' or 'intent', payload: {...} }
        const { type, payload: actionData } = payload.action;

        if (type && type.startsWith("path-")) {
          // For a path type:
          actionPayload = {
            action: {
              type: type, // e.g. "path-xyz"
              payload: {
                label: payload.label, // optional but recommended
              },
            },
          };

          // Send this action payload to Voiceflow
          this.core.sendAction(actionPayload);
        } else if (type === "intent") {
          // For an intent type:

          actionPayload = {
            action: {
              type: "intent",
              payload: {
                intent: actionData.intent, // {name: "forgot_password"}
                query: actionData.query || "",
                entities: actionData.entities || [],
                // "label" can be set if you want to store last_utterance
              },
            },
          };

          this.core.sendAction(actionPayload);
        } else {
          // For any other type, just send the userMessage as text

          this.core.sendMessage(userMessage);
        }
      } else {
        // If no structured payload, just send the userMessage as text
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
