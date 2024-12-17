// /frontend/sectionChatbot/chatbot-section.js

import ChatbotCore from "../baseChatbot/base-chatbot.js";
import SectionChatbotUI from "./chatbot-section-ui.js";
import { generateUserId } from "../utils/user-id-generator.js";

/**
 * SectionChatbot Class
 * Handles section-specific chatbot functionality including product context and device answers
 */
class SectionChatbot {
  /**
   * @param {HTMLElement} container - The container element
   * @param {Object} productDetails - Product-specific information
   */
  constructor(container, productDetails) {
    this.container = container;
    this.productDetails = productDetails;
    this.isLaunched = false;

    this.initialize();
    this.validateProductDetails();
  }

  /**
   * Initialize the chatbot components
   * @private
   */
  initialize() {
    // Initialize core
    this.core = new ChatbotCore({
      type: "section",
      endpoint:
        "https://chatbottings--development.gadget.app/voiceflowAPI/voiceflow-streaming",
      userID: this.generateSessionId(),
    });

    // Initialize UI
    this.ui = new SectionChatbotUI({
      container: this.container,
      eventBus: this.core.eventBus,
      type: "section",
      productDetails: this.productDetails,
    });

    this.setupEventListeners();
  }

  /**
   * Generate a session ID for this instance
   * @private
   * @returns {string}
   */
  generateSessionId() {
    return `section_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Validate required product details
   * @private
   */
  validateProductDetails() {
    const requiredFields = ["title", "capacity"];
    const missingFields = requiredFields.filter(
      (field) => !this.productDetails[field]
    );

    if (missingFields.length > 0) {
      console.error(
        "Missing required product details:",
        missingFields.join(", ")
      );
      this.ui.displayError(
        "Some product information is missing. Chat functionality may be limited."
      );
    }
  }

  /**
   * Set up event listeners
   * @private
   */
  setupEventListeners() {
    // Handle device answers
    this.core.eventBus.on("deviceAnswer", (payload) => {
      this.handleDeviceAnswer(payload);
    });

    // Handle input focus for launch
    const input = this.container.querySelector(".chat-input");
    if (input) {
      input.addEventListener("focus", () => {
        if (!this.isLaunched) {
          this.launch();
        }
      });
    }
  }

  /**
   * Launch the chatbot with product context
   * @public
   */
  async launch() {
    if (this.isLaunched) {
      console.log("Section chatbot already launched");
      return;
    }

    try {
      const sanitizedDetails = this.sanitizeProductDetails();
      await this.core.sendLaunch({
        action: {
          type: "launch",
          payload: {
            startBlock: "shopifySection",
            powerStationDetails: sanitizedDetails,
          },
        },
      });
      this.isLaunched = true;
    } catch (error) {
      console.error("Error launching section chatbot:", error);
      this.ui.displayError("Failed to start the chat. Please try again.");
    }
  }

  /**
   * Handle device answer traces
   * @private
   * @param {Object} payload - Device answer payload
   */
  handleDeviceAnswer(payload) {
    if (!payload || !payload.data) {
      console.warn("Invalid device answer payload:", payload);
      return;
    }

    // Process device answer data
    const processedData = this.processDeviceAnswerData(payload.data);
    this.ui.updateDeviceAnswers(processedData);
  }

  /**
   * Process device answer data for UI
   * @private
   * @param {Object} data - Raw device answer data
   * @returns {Object} Processed data for UI
   */
  processDeviceAnswerData(data) {
    return {
      deviceName: data.deviceName || this.productDetails.title,
      results: data.results || [],
      recommendations: data.recommendations || [],
      calculationDetails: data.calculationDetails || {},
    };
  }

  /**
   * Sanitize product details for API
   * @private
   * @returns {Object}
   */
  sanitizeProductDetails() {
    return Object.entries(this.productDetails).reduce((acc, [key, value]) => {
      acc[key] = value ? String(value).trim() : "";
      return acc;
    }, {});
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

export default SectionChatbot;
window.sectionChatbot = sectionChatbot;
