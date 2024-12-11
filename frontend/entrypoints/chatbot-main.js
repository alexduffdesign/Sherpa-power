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

    // Process all messages except the last one
    for (let i = 0; i < history.length - 1; i++) {
      const entry = history[i];
      this.ui.addMessage(entry.sender, entry.message);
    }

    // Special handling for the last message if it exists
    if (history.length > 0) {
      const lastEntry = history[history.length - 1];

      // If the last message was interactive and from assistant, only restore the interactive element
      if (lastEntry.isInteractive && lastEntry.sender === "assistant") {
        this.restoreInteractiveElement(lastEntry);
      } else {
        // Otherwise, just add the message normally
        this.ui.addMessage(lastEntry.sender, lastEntry.message);
      }
    }
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
