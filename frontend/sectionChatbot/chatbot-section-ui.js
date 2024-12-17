// /assets/scripts/chatbot/section/chatbot-section-ui.js

import ChatbotUI from "../baseChatbot/base-chatbot-ui.js";

/**
 * SectionChatbotUI Class
 * Extends base ChatbotUI with section-specific functionality
 */
class SectionChatbotUI extends ChatbotUI {
  /**
   * @param {Object} config - Configuration object
   * @param {HTMLElement} config.container - The container element
   * @param {EventEmitter} config.eventBus - Event bus instance
   * @param {string} config.type - Type of chatbot
   * @param {Object} config.productDetails - Product-specific information
   */
  constructor(config) {
    super(config);
    this.productDetails = config.productDetails;
    this.setupSectionChatbotUI();
  }

  /**
   * Set up section-specific UI elements
   * @private
   */
  setupSectionChatbotUI() {
    this.deviceAnswerGrid = this.container.querySelector(".device-answer-grid");
    this.setupProductContext();
  }

  /**
   * Update device answers in the grid
   * @public
   * @param {Object} data - Device answer data
   */
  updateDeviceAnswers(data) {
    if (!this.deviceAnswerGrid) {
      console.warn("Device answer grid not found");
      return;
    }

    // Clear existing content
    this.deviceAnswerGrid.innerHTML = "";

    // Add device name
    if (data.deviceName) {
      const deviceName = document.createElement("div");
      deviceName.className = "device-name";
      deviceName.textContent = data.deviceName;
      this.deviceAnswerGrid.appendChild(deviceName);
    }

    // Add results
    if (Array.isArray(data.results)) {
      const resultsContainer = document.createElement("div");
      resultsContainer.className = "results-container";

      data.results.forEach((result) => {
        const resultItem = document.createElement("div");
        resultItem.className = "result-item";
        resultItem.innerHTML = `
          <div class="result-value">${result.value}</div>
          <div class="result-label">${result.label}</div>
        `;
        resultsContainer.appendChild(resultItem);
      });

      this.deviceAnswerGrid.appendChild(resultsContainer);
    }

    // Add recommendations
    if (Array.isArray(data.recommendations)) {
      const recommendationsContainer = document.createElement("div");
      recommendationsContainer.className = "recommendations-container";

      data.recommendations.forEach((recommendation) => {
        const recommendationItem = document.createElement("div");
        recommendationItem.className = "recommendation-item";
        recommendationItem.textContent = recommendation;
        recommendationsContainer.appendChild(recommendationItem);
      });

      this.deviceAnswerGrid.appendChild(recommendationsContainer);
    }
  }

  /**
   * Override message addition to handle product-specific formatting
   * @override
   * @param {string} sender - Message sender
   * @param {string} content - Message content
   * @param {Object} metadata - Optional metadata
   */
  addMessage(sender, content, metadata = null) {
    // Add product context to assistant messages if needed
    if (sender === "assistant" && this.productDetails.title) {
      content = this.addProductContext(content);
    }

    super.addMessage(sender, content, metadata);
  }

  /**
   * Add product context to message content
   * @private
   * @param {string} content - Original message content
   * @returns {string} Content with product context
   */
  addProductContext(content) {
    const productPlaceholder = "{product_name}";
    return content.replace(productPlaceholder, this.productDetails.title);
  }

  /**
   * Display error with product context
   * @override
   * @param {string} message - Error message
   */
  displayError(message) {
    const errorDiv = document.createElement("div");
    errorDiv.classList.add("error-message", "section-error");
    errorDiv.textContent = message;
    this.messageContainer.appendChild(errorDiv);
    this.scrollToBottom();
  }

  /**
   * Update product information
   * @public
   * @param {Object} newDetails - Updated product details
   */
  updateProductDetails(newDetails) {
    this.productDetails = { ...this.productDetails, ...newDetails };
    const productContext = this.container.querySelector(".product-context");
    if (productContext) {
      this.setupProductContext();
    }
  }
}

export default SectionChatbotUI;
