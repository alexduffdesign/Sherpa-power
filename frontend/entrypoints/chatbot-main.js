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
   * Sets up event listeners for ChatbotCore events and UI interactions.
   */
  setupEventListeners() {
    // Listen to events emitted by ChatbotCore via EventBus
    eventBus.on(EVENTS.MAIN_CHATBOT.MESSAGE_RECEIVED, (data) => {
      this.ui.addMessage("assistant", data.content, data.metadata);
    });

    eventBus.on(EVENTS.MAIN_CHATBOT.CHOICE_PRESENTED, (data) => {
      this.ui.addMessage("assistant", data.content, {
        type: "choice",
        buttons: data.buttons,
      });
    });

    eventBus.on(EVENTS.MAIN_CHATBOT.CAROUSEL_PRESENTED, (data) => {
      this.ui.addMessage("assistant", data.content, {
        type: "carousel",
        carouselItems: data.carouselItems,
      });
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

    // Listen for user message submissions via UI
    this.ui.onUserMessage((message) => {
      this.sendMessage(message);
    });

    // Listen for button clicks from UI components
    this.ui.onButtonClick((payload) => {
      this.sendAction(payload);
    });
  }

  /**
   * Launches the chatbot by sending a launch request.
   */
  launch() {
    if (this.isLaunched) return;

    this.core
      .sendLaunch()
      .then(() => {
        console.log("Chatbot launched successfully.");
      })
      .catch((error) => {
        console.error("Error launching chatbot:", error);
        this.ui.displayError(
          "Failed to launch the chatbot. Please try again later."
        );
      });

    this.isLaunched = true;
  }

  /**
   * Sends a user message to the chatbot.
   * @param {string} message - The user's message.
   */
  sendMessage(message) {
    // Sanitize user input to prevent XSS attacks
    const sanitizedMessage = this.sanitizeInput(message);
    this.core
      .sendMessage(sanitizedMessage)
      .then(() => {
        this.ui.addMessage("user", sanitizedMessage, { type: "message" });
        this.saveToHistory("user", sanitizedMessage, { type: "message" });
      })
      .catch((error) => {
        console.error("Error sending message:", error);
        this.ui.displayError("Failed to send your message. Please try again.");
      });
  }

  /**
   * Sends an action payload to the chatbot.
   * @param {Object} actionPayload - The action payload to send.
   */
  sendAction(actionPayload) {
    // Validate the action payload
    if (!actionPayload || typeof actionPayload !== "object") {
      console.error("Invalid action payload:", actionPayload);
      this.ui.displayError("Invalid action triggered.");
      return;
    }

    // Send the action to the chatbot core
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

  /**
   * Loads conversation history from localStorage and renders it in the UI.
   */
  loadHistory() {
    const history = JSON.parse(localStorage.getItem(this.historyKey)) || [];
    history.forEach((entry) => {
      if (entry.sender === "user") {
        this.ui.addMessage("user", entry.message, entry.metadata);
      } else if (entry.sender === "assistant") {
        this.ui.addMessage("assistant", entry.message, entry.metadata);
      }
    });

    // Optionally, re-render interactive elements based on the last entry's metadata
    if (history.length > 0) {
      const lastEntry = history[history.length - 1];
      if (lastEntry.sender === "assistant" && lastEntry.metadata) {
        switch (lastEntry.metadata.type) {
          case "choice":
            this.ui.addButtons(lastEntry.metadata.buttons);
            break;
          case "carousel":
            this.ui.addCarousel(lastEntry.metadata.carouselItems);
            break;
          // Add more cases as needed
          default:
            break;
        }
      }
    }
  }

  /**
   * Saves a message or action to conversation history in localStorage.
   * @param {string} sender - 'user' or 'assistant'.
   * @param {string} message - The message content or action payload.
   * @param {Object} [metadata] - Additional metadata about the entry.
   */
  saveToHistory(sender, message, metadata = null) {
    const history = JSON.parse(localStorage.getItem(this.historyKey)) || [];
    history.push({ sender, message, metadata });
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
});

export default MainChatbot;
