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
      this.ui.addMessage("user", data.label);
      this.saveToHistory("user", data.label);
      this.core.sendAction({ type: "text", payload: data.payload });
    });

    // Listen to choicePresented events
    eventBus.on(EVENTS.MAIN_CHATBOT.CHOICE_PRESENTED, (data) => {
      this.ui.addButtons(data.buttons);
    });

    // Listen to carouselPresented events
    eventBus.on(EVENTS.MAIN_CHATBOT.CAROUSEL_PRESENTED, (data) => {
      this.ui.addCarousel(data.carouselItems);
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

    // Listen for user message submissions via UI
    this.ui.onUserMessage((message) => {
      this.sendMessage(message);
    });

    // Listen for button clicks from UI components
    this.ui.onButtonClick((payload) => {
      this.sendAction(payload);
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

  loadHistory() {
    const history = JSON.parse(localStorage.getItem(this.historyKey)) || [];
    history.forEach((entry) => {
      if (entry.sender === "user") {
        this.ui.addMessage("user", entry.message, entry.metadata);
      } else if (entry.sender === "assistant") {
        this.ui.addMessage("assistant", entry.message, entry.metadata);
        // Re-render interactive elements if present
        if (entry.metadata) {
          switch (entry.metadata.type) {
            case "choice":
              this.ui.addButtons(entry.metadata.buttons);
              break;
            case "carousel":
              this.ui.addCarousel(entry.metadata.carouselItems);
              break;
            // Add more cases as needed
            default:
              break;
          }
        }
      }
    });
  }

  saveToHistory(sender, message, metadata = null) {
    const history = JSON.parse(localStorage.getItem(this.historyKey)) || [];
    history.push({ sender, message, metadata });
    localStorage.setItem(this.historyKey, JSON.stringify(history));
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
