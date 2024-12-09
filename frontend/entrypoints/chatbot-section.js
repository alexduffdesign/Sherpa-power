// /assets/scripts/chatbot/section/chatbot-section.js

import ChatbotCore from "../core/chatbot-core.js";
import SectionChatbotUI from "../ui/chatbot-section-ui.js";
import eventBus from "../utils/event-bus.js";
import { EVENTS } from "../utils/event-constants.js";
import { generateUserId } from "../utils/user-id-generator.js";

/**
 * SectionChatbot Class
 * Manages the Section Chatbot's interactions, handles product details, and updates the UI.
 */
class SectionChatbot {
  /**
   * Constructor initializes ChatbotCore and SectionChatbotUI, sets up event listeners.
   * @param {ChatbotCore} core - Instance of ChatbotCore handling API communications.
   * @param {SectionChatbotUI} ui - Instance of SectionChatbotUI handling UI updates.
   */
  constructor(core, ui) {
    this.core = core;
    this.ui = ui;
    this.isLaunched = false;

    this.setupEventListeners();
  }

  /**
   * Sets up event listeners for ChatbotCore events.
   */
  setupEventListeners() {
    // Listen to events emitted by ChatbotCore via EventBus
    eventBus.on(EVENTS.SECTION_CHATBOT.MESSAGE_RECEIVED, (data) => {
      this.ui.addMessage("assistant", data.content);
    });

    eventBus.on(EVENTS.SECTION_CHATBOT.CHOICE_PRESENTED, (data) => {
      this.ui.addButtons(data.choices);
    });

    eventBus.on(EVENTS.SECTION_CHATBOT.CAROUSEL_PRESENTED, (data) => {
      this.ui.addCarousel(data.carouselItems);
    });

    eventBus.on(EVENTS.SECTION_CHATBOT.DEVICE_ANSWER, (data) => {
      this.ui.populateApplicationsGrid(data.devices);
    });

    eventBus.on(EVENTS.SECTION_CHATBOT.ERROR, (error) => {
      this.ui.displayError(error.message);
    });
  }

  /**
   * Launches the chatbot by sending a launch request with required variables.
   */
  launch() {
    if (this.isLaunched) return;

    const interactPayload = {
      action: {
        type: "launch",
        payload: {
          startBlock: "shopifySection",
          productDetails: this.ui.productDetails,
        },
      },
    };

    this.core.sendLaunch(interactPayload);
    this.isLaunched = true;
  }

  /**
   * Sends a user message to the chatbot.
   * @param {string} message - The user's message.
   */
  sendMessage(message) {
    this.core.sendMessage(message);
    this.ui.addMessage("user", message);
    // Note: Section Chatbot does not maintain history
  }
}

// Initialize Section Chatbot on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  const sectionChatbotContainer = document.getElementById("section-chatbot-ui");

  if (!sectionChatbotContainer) {
    console.error("Section Chatbot UI container not found");
    return;
  }

  // Generate or retrieve existing userID for Section Chatbot
  let sectionUserId = localStorage.getItem("sectionChatbotUserId");
  if (!sectionUserId) {
    sectionUserId = generateUserId("sectionChatbot");
    localStorage.setItem("sectionChatbotUserId", sectionUserId);
  }

  // Initialize ChatbotCore with the generated userID
  const sectionChatbotCore = new ChatbotCore({
    userID: sectionUserId,
    endpoint:
      "https://chatbottings--development.gadget.app/voiceflowAPI/voiceflow-streaming",
    chatbotType: "section",
  });

  // Initialize SectionChatbotUI
  const sectionChatbotUI = new SectionChatbotUI(sectionChatbotContainer);

  // Initialize SectionChatbot
  const sectionChatbot = new SectionChatbot(
    sectionChatbotCore,
    sectionChatbotUI
  );

  // Listen for user message submissions
  sectionChatbotUI.onUserMessage((message) => {
    sectionChatbot.sendMessage(message);
  });

  // Listen for button clicks from UI components
  sectionChatbotUI.onButtonClick((payload) => {
    sectionChatbot.sendMessage(JSON.stringify(payload));
  });

  // Handle launch event on first focus of the input field
  let hasLaunched = false;
  const sectionInput = sectionChatbotContainer.querySelector(
    "#section-chatbot-input"
  );

  if (sectionInput) {
    sectionInput.addEventListener("focus", () => {
      if (!hasLaunched) {
        sectionChatbot.launch();
        hasLaunched = true;
      }
    });
  } else {
    console.error("Section Chatbot input field not found");
  }
});

export default SectionChatbot;
