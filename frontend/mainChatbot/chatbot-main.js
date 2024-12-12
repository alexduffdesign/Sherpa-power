// /assets/scripts/chatbot/chatbot-main.js

import { BaseChatbot } from "../baseChatbot/base-chatbot.js";
import { MainChatbotUI } from "./chatbot-main-ui.js";
import { MAIN_CHATBOT } from "../utils/event-constants.js";
import eventBus from "../utils/event-bus.js";
import { generateUserId } from "../utils/user-id-generator.js";

/**
 * MainChatbot Class
 * Extends BaseChatbot with drawer-specific functionality
 * Manages the Main Chatbot's conversation history and UI updates
 */
export class MainChatbot extends BaseChatbot {
  constructor() {
    super();
    this.historyKey = "mainChatbotHistory";
    this.launchKey = "chatHasLaunched";
    this.isLaunched = this.hasLaunched();
  }

  connectedCallback() {
    super.connectedCallback();

    // Load user ID
    let mainUserId = localStorage.getItem("mainChatbotUserId");
    if (!mainUserId) {
      mainUserId = generateUserId("mainChatbot");
      localStorage.setItem("mainChatbotUserId", mainUserId);
    }
    this.userID = mainUserId;

    // Load history if needed
    this.loadHistory();
  }

  /**
   * Initialize the chatbot UI
   * @protected
   * @override
   */
  initializeUI() {
    this.ui = new MainChatbotUI(this.shadowRoot, this.eventBus);
    this.setupMainChatbotEventListeners();
    this.loadHistory(); // Changed from restoreHistory to loadHistory to maintain interactive elements
  }

  /**
   * Set up event listeners specific to the main chatbot
   * @private
   */
  setupMainChatbotEventListeners() {
    // Handle button clicks
    this.eventBus.on(MAIN_CHATBOT.BUTTON_CLICK, (payload) => {
      this.sendAction(payload);
    });

    // Handle carousel button clicks
    this.eventBus.on(MAIN_CHATBOT.CAROUSEL_BUTTON_CLICK, (payload) => {
      this.sendAction(payload);
    });

    // Handle user messages with history saving
    this.eventBus.on("userMessage", (message) => {
      this.saveToHistory("user", message);
      this.sendMessage(message);
    });

    // Handle bot messages with history saving
    this.eventBus.on("messageReceived", ({ content, metadata }) => {
      this.saveToHistory("assistant", content, metadata);
    });
  }

  /**
   * Check if the chatbot has been launched before
   * @private
   */
  hasLaunched() {
    return localStorage.getItem(this.launchKey) === "true";
  }

  /**
   * Set the launched state in localStorage
   * @private
   */
  setLaunched() {
    localStorage.setItem(this.launchKey, "true");
    this.isLaunched = true;
  }

  /**
   * Save a message to the conversation history
   * Preserves interactive element data for choices and carousels
   * @private
   */
  saveToHistory(sender, message, metadata = null) {
    const history = JSON.parse(localStorage.getItem(this.historyKey)) || [];

    // Create history entry with additional trace data for interactive elements
    const historyEntry = {
      sender,
      message,
      timestamp: Date.now(),
      isInteractive: false,
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

  /**
   * Load conversation history from localStorage
   * Handles interactive elements specially
   * @private
   */
  loadHistory() {
    const history = JSON.parse(localStorage.getItem(this.historyKey)) || [];

    // Process all messages
    history.forEach((entry, index) => {
      // If it's an interactive element
      if (entry.isInteractive) {
        // Only restore interactive element if it's the last entry
        if (index === history.length - 1) {
          this.restoreInteractiveElement(entry);
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

  /**
   * Restore an interactive element (choice or carousel)
   * @private
   */
  restoreInteractiveElement(historyEntry) {
    if (historyEntry.traceType === "choice") {
      this.ui.addButtons(historyEntry.traceData.buttons, true);
    } else if (historyEntry.traceType === "carousel") {
      this.ui.addCarousel(historyEntry.traceData.cards, true);
    }
  }

  /**
   * Clear the conversation history
   * @public
   */
  clearHistory() {
    localStorage.removeItem(this.historyKey);
    localStorage.removeItem(this.launchKey);
    this.isLaunched = false;
  }

  /**
   * Sanitize user input
   * @private
   */
  sanitizeInput(input) {
    const div = document.createElement("div");
    div.textContent = input;
    return div.innerHTML;
  }
}

// Register the web component
customElements.define("main-chatbot", MainChatbot);
