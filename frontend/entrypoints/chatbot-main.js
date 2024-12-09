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
  /**
   * Constructor initializes ChatbotCore and MainChatbotUI, sets up event listeners.
   * @param {ChatbotCore} core - Instance of ChatbotCore handling API communications.
   * @param {MainChatbotUI} ui - Instance of MainChatbotUI handling UI updates.
   */
  constructor(core, ui) {
    this.core = core;
    this.ui = ui;
    this.historyKey = "mainChatbotHistory";
    this.isLaunched = false;
    this.setupEventListeners();
  }

  /**
   * Sets up event listeners for ChatbotCore events.
   */
  setupEventListeners() {
    // Listen to events emitted by ChatbotCore via EventBus
    eventBus.on(EVENTS.MAIN_CHATBOT.MESSAGE_RECEIVED, (data) => {
      this.ui.addMessage("assistant", data.content);
    });

    eventBus.on(EVENTS.MAIN_CHATBOT.CHOICE_PRESENTED, (data) => {
      this.ui.addButtons(data.buttons);
    });

    eventBus.on(EVENTS.MAIN_CHATBOT.CAROUSEL_PRESENTED, (data) => {
      this.ui.addCarousel(data.carouselItems);
    });

    eventBus.on(EVENTS.MAIN_CHATBOT.ERROR, (error) => {
      this.ui.displayError(error.message);
    });

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
  }

  /**
   * Launches the chatbot by sending a launch request.
   */
  launch() {
    if (this.isLaunched) return;

    this.core.sendLaunch();
    this.isLaunched = true;
  }

  /**
   * Sends a user message to the chatbot.
   * @param {string} message - The user's message.
   */
  sendMessage(message) {
    // Sanitize user input to prevent XSS attacks
    const sanitizedMessage = this.sanitizeInput(message);
    this.core.sendMessage(sanitizedMessage);
    this.ui.addMessage("user", sanitizedMessage);
    this.saveToHistory("user", sanitizedMessage);
  }

  /**
   * Loads conversation history from localStorage and renders it in the UI.
   */
  loadHistory() {
    const history = JSON.parse(localStorage.getItem(this.historyKey)) || [];
    history.forEach((entry) => {
      this.ui.addMessage(entry.sender, entry.message);
    });

    // Check if the last message was from the assistant to retain interactive elements
    if (history.length > 0) {
      const lastEntry = history[history.length - 1];
      if (lastEntry.sender === "assistant") {
        // Optional: Implement logic to re-render interactive elements based on the last entry
        // For example, if the last message included choices or a carousel, re-add them
        // This requires storing additional metadata in the history
      }
    }
  }

  /**
   * Saves a message to conversation history in localStorage.
   * @param {string} sender - 'user' or 'assistant'.
   * @param {string} message - The message content.
   */
  saveToHistory(sender, message) {
    const history = JSON.parse(localStorage.getItem(this.historyKey)) || [];
    history.push({ sender, message });
    localStorage.setItem(this.historyKey, JSON.stringify(history));
  }

  /**
   * Sanitizes user input to prevent XSS attacks.
   * @param {string} input - The user-provided input.
   * @returns {string} - The sanitized input.
   */
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

  // Listen for user message submissions
  mainChatbotUI.onUserMessage((message) => {
    mainChatbot.sendMessage(message);
  });

  // Listen for button clicks from UI components
  mainChatbotUI.onButtonClick((payload) => {
    mainChatbot.sendMessage(JSON.stringify(payload));
  });
});

export default MainChatbot;
