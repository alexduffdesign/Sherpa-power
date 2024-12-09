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
      this.ui.addButtons(data.choices);
    });

    eventBus.on(EVENTS.MAIN_CHATBOT.CAROUSEL_PRESENTED, (data) => {
      this.ui.addCarousel(data.carouselItems);
    });

    eventBus.on(EVENTS.MAIN_CHATBOT.ERROR, (error) => {
      this.ui.displayError(error.message);
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
    this.core.sendMessage(message);
    this.ui.addMessage("user", message);
    this.saveToHistory("user", message);
  }

  /**
   * Loads conversation history from localStorage and renders it in the UI.
   */
  loadHistory() {
    const history = JSON.parse(localStorage.getItem(this.historyKey)) || [];
    history.forEach((entry) => {
      this.ui.addMessage(entry.sender, entry.message);
    });

    // Check if the last message was a choice or carousel to retain interactive elements
    if (history.length > 0) {
      const lastEntry = history[history.length - 1];
      if (lastEntry.sender === "assistant") {
        // Placeholder: Implement logic to determine if lastEntry includes choices or carousel
        // This could be based on additional flags or message content structure
        // For example:
        // if (lastEntry.hasChoices) { this.ui.addButtons(lastEntry.choices); }
        // if (lastEntry.hasCarousel) { this.ui.addCarousel(lastEntry.carouselItems); }
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
      "https://chatbottings--development.gadget.app/voiceflowAPI/voiceflow-streaming",
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

  // Handle launch event on first opening of the chat drawer
  let hasLaunched = false;
  const drawer = document.getElementById("header-ai-trigger");
  if (drawer) {
    drawer.addEventListener("click", () => {
      if (!hasLaunched) {
        mainChatbot.launch();
        hasLaunched = true;
      }
    });
  } else {
    console.error("Chatbot drawer element not found");
  }
});

export default MainChatbot;
