// /assets/scripts/chatbot/section/section-chatbot.js

import ChatbotCore from "../baseChatbot/chatbot-core.js";
import SectionChatbotUI from "./chatbot-section-ui.js";
import eventBus from "../utils/event-bus.js";
import { EVENTS } from "../utils/event-constants.js";
import { generateUserId } from "../utils/user-id-generator.js";

/**
 * SectionChatbot Class
 * Manages the Section Chatbot's interactions, handles product details, and updates the UI.
 * Does not maintain conversation history, focuses on immediate interactions.
 *
 * @class
 * @property {ChatbotCore} core - Instance of ChatbotCore handling API communications
 * @property {SectionChatbotUI} ui - Instance of SectionChatbotUI handling UI updates
 * @property {boolean} isLaunched - Tracks whether the chatbot has been launched
 */
class SectionChatbot {
  /**
   * Creates a new SectionChatbot instance.
   * Initializes the core functionality and UI components.
   *
   * @param {ChatbotCore} core - ChatbotCore instance for API communication
   * @param {SectionChatbotUI} ui - SectionChatbotUI instance for UI management
   */
  constructor(core, ui) {
    if (!core || !ui) {
      throw new Error("SectionChatbot requires both core and ui instances");
    }

    this.core = core;
    this.ui = ui;
    this.isLaunched = false;

    this.validateProductDetails();
    this.setupEventListeners();
  }

  /**
   * Validates that all required product details are present.
   * Displays an error message if required fields are missing.
   *
   * @private
   */
  validateProductDetails() {
    const requiredFields = ["title", "capacity"];
    const missingFields = requiredFields.filter(
      (field) => !this.ui.productDetails[field]
    );

    if (missingFields.length > 0) {
      console.error(
        `Missing required product details: ${missingFields.join(", ")}`
      );
      this.ui.displayError(
        "Some product information is missing. Chat functionality may be limited."
      );
    }
  }

  /**
   * Sets up event listeners for all chatbot interactions.
   * Handles message reception, user interactions, and error states.
   *
   * @private
   */
  setupEventListeners() {
    // Message handling with typing indicators
    eventBus.on(EVENTS.SECTION_CHATBOT.MESSAGE_RECEIVED, (data) => {
      this.ui.hideTypingIndicator();
      this.ui.addMessage("assistant", data.content, data.metadata);
    });

    // Typing indicator management
    eventBus.on(EVENTS.SECTION_CHATBOT.TYPING, (data) => {
      if (data.isTyping) {
        this.ui.showTypingIndicator();
      } else {
        this.ui.hideTypingIndicator();
      }
    });

    // Typing text updates
    eventBus.on(EVENTS.SECTION_CHATBOT.TYPING_TEXT, (data) => {
      this.ui.showTypingIndicator();
      this.ui.updateTypingText(data.text);
    });

    // Button choice handling
    eventBus.on(EVENTS.SECTION_CHATBOT.CHOICE_PRESENTED, (data) => {
      this.ui.hideTypingIndicator();
      this.ui.addButtons(data.buttons);
    });

    // Carousel handling
    eventBus.on(EVENTS.SECTION_CHATBOT.CAROUSEL_PRESENTED, (data) => {
      this.ui.hideTypingIndicator();
      this.ui.addCarousel(data.carouselItems);
    });

    // Error handling
    eventBus.on(EVENTS.SECTION_CHATBOT.ERROR, (error) => {
      this.ui.hideTypingIndicator();
      this.ui.displayError(error.message);
    });

    // User message handling
    eventBus.on("userMessage", (message) => {
      this.sendMessage(message);
    });

    // Button click handling
    eventBus.on("buttonClicked", (payload) => {
      this.handleButtonClick(payload);
    });

    // Carousel button click handling
    eventBus.on("carouselButtonClicked", (payload) => {
      this.handleButtonClick(payload);
    });

    // Handle page cleanup
    window.addEventListener("unload", () => {
      this.destroy();
    });
  }

  /**
   * Launches the chatbot with product details.
   * Only launches if not already launched.
   *
   * @public
   */
  launch() {
    if (this.isLaunched) {
      console.log("Section chatbot already launched");
      return;
    }

    const sanitizedDetails = this.sanitizeProductDetails(
      this.ui.productDetails
    );
    const interactPayload = {
      action: {
        type: "launch",
        payload: {
          startBlock: "shopifySection",
          powerStationDetails: sanitizedDetails,
        },
      },
    };

    console.log("Launching section chatbot with payload:", interactPayload);
    this.ui.showTypingIndicator();
    this.core.sendLaunch(interactPayload);
    this.isLaunched = true;
  }

  /**
   * Sanitizes product details before sending to the API.
   *
   * @private
   * @param {Object} details - Raw product details
   * @returns {Object} Sanitized product details
   */
  sanitizeProductDetails(details) {
    return Object.entries(details).reduce((acc, [key, value]) => {
      acc[key] = value ? String(value).trim() : "";
      return acc;
    }, {});
  }

  /**
   * Sends a user message to the chatbot.
   *
   * @public
   * @param {string} message - User's message to send
   */
  sendMessage(message) {
    if (!message.trim()) return;

    this.ui.showTypingIndicator();
    this.core.sendMessage(message);
    this.ui.addMessage("user", message);
  }

  /**
   * Handles button click interactions.
   *
   * @public
   * @param {Object} payload - Button click payload
   */
  handleButtonClick(payload) {
    if (!payload) return;

    this.ui.showTypingIndicator();
    this.core.sendAction({
      action: payload,
    });
    this.ui.removeInteractiveElements();
  }

  /**
   * Cleans up resources and event listeners.
   *
   * @public
   */
  destroy() {
    this.core.closeConnection();
    eventBus.removeAllListeners(`${EVENTS.SECTION_CHATBOT.PREFIX}:`);
    eventBus.removeAllListeners("userMessage");
    eventBus.removeAllListeners("buttonClicked");
    eventBus.removeAllListeners("carouselButtonClicked");
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

  // Handle launch event on first focus of the input field
  const sectionInput = sectionChatbotContainer.querySelector("#userInput");
  console.log("Section Chatbot UI input:", sectionInput);

  if (sectionInput) {
    sectionInput.addEventListener("focus", () => {
      if (!sectionChatbot.isLaunched) {
        sectionChatbot.launch();
      }
    });
  } else {
    console.error("Section Chatbot input field not found");
  }
});

export default SectionChatbot;
