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

    this.core.eventBus.on(
      "assistantMessageNonStreamed",
      ({ content, metadata }) => {
        this.saveToHistory("assistant", content, metadata);
      }
    );

    // Handle responses with potential text and animation
    this.core.eventBus.on("messageReceived", ({ content, metadata }) => {
      this.ui.addMessage("assistant", content, metadata, false);
    });

    // Handle the final part of a streamed message
    this.core.eventBus.on(
      "assistantMessageFinalized",
      ({ content, metadata }) => {
        // Changed finalContent to content
        console.log(
          "assistantMessageFinalized received with content:",
          content
        );
        this.saveToHistory("assistant", content, metadata); // Changed finalContent to content
      }
    );

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

    // Handle button clicks (both carousel and choice buttons)
    this.core.eventBus.on("buttonClicked", (payload) => {
      const userMessage = payload.label || "Button clicked";
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
              name: "menu",
            },
          },
        },
      });
    });

    // Handle product redirects
    this.core.eventBus.on("productRedirect", ({ productHandle }) => {
      this.handleProductRedirect(productHandle);
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

    // Add new event listener for device sources
    this.core.eventBus.on("deviceSources", ({ sources }) => {
      this.saveToHistory("assistant", "Device sources presented", {
        type: "deviceSources",
        sources: sources,
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
    console.log("Saving HTML to history:", {
      message,
      prettyHTML: message.replace(/>/g, ">\n"), // For readable logging
    });
    const history = JSON.parse(localStorage.getItem(this.historyKey)) || [];

    const historyEntry = {
      sender,
      message,
      timestamp: Date.now(),
      isInteractive: false,
      metadata: metadata, // Store the full metadata
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
      } else if (metadata.type === "deviceSources") {
        historyEntry.isInteractive = true;
        historyEntry.traceType = "deviceSources";
        historyEntry.traceData = { sources: metadata.sources };
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
    console.log("Loading history:", history);

    history.forEach((entry, index) => {
      console.log("Processing history entry:", entry);

      if (entry.metadata && entry.metadata.type === "deviceSources") {
        console.log("Restoring device sources from history:", entry);
        this.ui.addDeviceSources(entry.metadata.sources, true);
        return;
      }

      if (entry.isInteractive) {
        console.log("Entry is interactive:", entry);
        if (index === history.length - 1) {
          console.log("Restoring interactive element from history");
          this.restoreInteractiveElement(entry);
        }
        return;
      }

      if (entry.message) {
        console.log("Loading HTML from history:", {
          message: entry.message,
          prettyHTML: entry.message.replace(/>/g, ">\n"), // For readable logging
        });
        console.log("Adding message from history:", entry);
        this.ui.addMessage(entry.sender, entry.message, null, true);
      }
    });
  }

  /**
   * Handle redirecting to product pages
   * @private
   * @param {string} productHandle - The product handle to redirect to
   */
  handleProductRedirect(productHandle) {
    if (!productHandle) {
      console.error("Cannot redirect: Product handle is undefined or empty");
      return;
    }

    const baseUrl = "https://www.sherpapower.co.uk/products/";
    const productUrl = `${baseUrl}${encodeURIComponent(productHandle)}`;
    console.log(`Redirecting to product page: ${productUrl}`);
    window.location.href = productUrl;
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
    } else if (historyEntry.traceType === "deviceSources") {
      this.ui.addDeviceSources(historyEntry.traceData.sources);
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
