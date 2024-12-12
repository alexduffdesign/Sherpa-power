// /assets/scripts/chatbot/section/section-chatbot.js

import { BaseChatbot } from "../baseChatbot/base-chatbot.js";
import { SectionChatbotUI } from "./chatbot-section-ui.js";
import { generateUserId } from "../utils/user-id-generator.js";

/**
 * SectionChatbot Web Component
 * Extends BaseChatbot with specific logic for the Section Chatbot
 * Handles product context, device answers, and focused interactions
 * @extends BaseChatbot
 */
export class SectionChatbot extends BaseChatbot {
  constructor() {
    super();
    this.productDetails = {};
  }

  /**
   * Initialize the chatbot UI
   * @protected
   * @override
   */
  initializeUI() {
    this.ui = new SectionChatbotUI(this.shadowRoot, this.eventBus);
    this.setupSectionChatbotEventListeners();
  }

  /**
   * Initialize product details from element attributes
   * @private
   */
  initializeProductDetails() {
    this.productDetails = {
      title: this.getAttribute("product-title"),
      capacity: this.getAttribute("product-capacity"),
      ac_output_continuous_power: this.getAttribute(
        "product-ac_output_continuous_power"
      ),
      ac_output_peak_power: this.getAttribute("product-ac_output_peak_power"),
      dc_output_power: this.getAttribute("product-dc_output_power"),
    };
    this.validateProductDetails();
  }

  /**
   * Override initialize to add product context initialization
   * @protected
   * @override
   */
  initialize() {
    this.initializeProductDetails();
    super.initialize();
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
        `Missing required product details: ${missingFields.join(", ")}`
      );
      this.eventBus.emit("error", {
        message:
          "Some product information is missing. Chat functionality may be limited.",
      });
    }
  }

  /**
   * Set up section-specific event listeners
   * @private
   */
  setupSectionChatbotEventListeners() {
    // Handle device_answer traces
    this.eventBus.on("trace", ({ type, payload }) => {
      if (type === "device_answer") {
        this.handleDeviceAnswer(payload);
      }
    });

    // Handle input focus for launching
    this.shadowRoot
      .querySelector(".chat-input")
      ?.addEventListener("focus", () => {
        if (!this.isLaunched) {
          this.launch();
        }
      });
  }

  /**
   * Handle device_answer traces by updating the applications grid
   * @private
   * @param {Object} payload - The device_answer payload
   */
  handleDeviceAnswer(payload) {
    if (payload.applications) {
      this.eventBus.emit("deviceAnswer", {
        applications: payload.applications,
      });
    }
  }

  /**
   * Get product-specific launch payload
   * @private
   * @returns {Object} Launch payload with product details
   */
  getProductLaunchPayload() {
    return {
      action: {
        type: "launch",
        payload: {
          context: {
            startBlock: "shopifySection",
            powerStationDetails: this.productDetails,
          },
        },
      },
    };
  }

  /**
   * Override launch to include product details
   * @public
   * @override
   */
  launch() {
    this.sendLaunch(this.getProductLaunchPayload());
  }
}

// Register the web component
customElements.define("section-chatbot", SectionChatbot);
