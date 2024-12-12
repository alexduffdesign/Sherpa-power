// /assets/scripts/chatbot/section/section-chatbot-ui.js

import { BaseChatbotUI } from "../baseChatbot/base-chatbot-ui.js";

/**
 * SectionChatbotUI Class
 * Extends BaseChatbotUI with specific UI logic for the Section Chatbot
 * Handles product-specific UI elements and device_answer displays
 * @extends BaseChatbotUI
 */
export class SectionChatbotUI extends BaseChatbotUI {
  /**
   * @param {ShadowRoot} shadowRoot - The shadow root of the chatbot component
   * @param {EventEmitter} eventBus - The event bus for this chatbot instance
   */
  constructor(shadowRoot, eventBus) {
    super(shadowRoot, eventBus);
    this.setupSectionSpecificEventListeners();
  }

  /**
   * Set up section-specific event listeners
   * @private
   */
  setupSectionSpecificEventListeners() {
    // Handle device answer displays
    this.eventBus.on("deviceAnswer", ({ applications }) => {
      this.displayDeviceAnswer(applications);
    });
  }

  /**
   * Display device answer in the applications grid
   * @private
   * @param {Array} applications - List of applications from device_answer
   */
  displayDeviceAnswer(applications) {
    const applicationsGrid = document.querySelector(".applications-grid");
    if (!applicationsGrid) return;

    // Clear existing applications
    applicationsGrid.innerHTML = "";

    // Create and append application elements
    applications.forEach((app) => {
      const appElement = this.createApplicationElement(app);
      applicationsGrid.appendChild(appElement);
    });
  }

  /**
   * Create an application element for the grid
   * @private
   * @param {Object} app - Application data
   * @returns {HTMLElement} The created application element
   */
  createApplicationElement(app) {
    const element = document.createElement("div");
    element.className = "application-item";

    const icon = document.createElement("img");
    icon.src = app.iconUrl || "";
    icon.alt = app.name || "Application Icon";
    icon.className = "application-icon";

    const name = document.createElement("span");
    name.textContent = app.name || "Unknown Application";
    name.className = "application-name";

    const power = document.createElement("span");
    power.className = "power-requirement";
    power.textContent = app.powerRequirement
      ? `${app.powerRequirement}W`
      : "N/A";

    element.appendChild(icon);
    element.appendChild(name);
    element.appendChild(power);

    return element;
  }

  /**
   * Override addMessage to handle section-specific message formatting
   * @override
   * @param {string} sender - Message sender (user/assistant)
   * @param {string} content - Message content
   * @param {Object} metadata - Additional message metadata
   */
  addMessage(sender, content, metadata = null) {
    if (sender === "assistant" && metadata?.productContext) {
      content = this.formatMessageWithProductContext(
        content,
        metadata.productContext
      );
    }
    super.addMessage(sender, content, metadata);
  }

  /**
   * Format message with product context
   * @private
   * @param {string} message - Original message
   * @param {Object} context - Product context
   * @returns {string} Formatted message
   */
  formatMessageWithProductContext(message, context) {
    return message.replace(/\{(\w+)\}/g, (match, key) => context[key] || match);
  }
}

export default SectionChatbotUI;
