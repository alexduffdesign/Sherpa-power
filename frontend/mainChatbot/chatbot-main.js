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
      // Add the message to the UI as a user message
      this.ui.addMessage("user", message, null, false); // fromHistory=false

      // Save the message to history
      this.saveToHistory("user", message);

      // Send the typed message to Voiceflow so it processes it
      this.core.sendMessage(message);
    });

    this.core.eventBus.on(
      "assistantMessageNonStreamed",
      ({ content, metadata }) => {
        this.saveToHistory("assistant", content, metadata);
      }
    );

    this.core.eventBus.on(
      "assistantMessageFinalized",
      ({ finalContent, metadata }) => {
        this.saveToHistory("assistant", finalContent, metadata);
      }
    );

    // Handle responses with potential text and animation
    this.core.eventBus.on("messageReceived", ({ content, metadata }) => {
      // Add the message to the UI, triggering animation if needed
      this.ui.addMessage("assistant", content, metadata, false);
    });

    // Handle the final part of a streamed message
    this.core.eventBus.on(
      "assistantMessageFinalized",
      ({ finalContent, metadata }) => {
        this.saveToHistory("assistant", finalContent, metadata);
      }
    );

    // Handle typing indicator
    this.core.eventBus.on("typing", ({ isTyping }) => {
      this.ui.showTypingIndicator(isTyping);
    });

    // Handle errors
    this.core.eventBus.on("error", ({ message }) => {
      this.ui.displayError(message);
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

    this.core.eventBus.on("interactiveElementClicked", (payload) => {
      const userMessage =
        payload.label ||
        payload.payload?.label ||
        payload.payload?.text ||
        "Button clicked";
      this.saveToHistory("user", userMessage);
    });

    // Handle main menu
    this.core.eventBus.on("mainMenu", () => {
      const userMessage = "Main menu";
      this.saveToHistory("user", userMessage);
      // Add message without animation and faster speed
      this.ui.addMessage("user", userMessage, null, false); // fromHistory=false
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

    // Handle clearing history
    this.core.eventBus.on("clearHistory", () => {
      this.clearHistory();
    });

    // Handle minimizing chatbot
    this.core.eventBus.on("minimize", () => {
      // Implement minimize functionality as needed
      console.log("Minimize chatbot");
      // For example, hide the chatbot container or trigger a CSS class
      this.container.classList.toggle("minimized");
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

        // Pass fromHistory=true to disable animation
        this.ui.addMessage(entry.sender, entry.message, null, true);
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
