// /assets/scripts/chatbot/main/chatbot-main-ui.js

import ChatbotUI from "../baseChatbot/base-chatbot-ui.js";

/**
 * MainChatbotUI Class
 * Extends base ChatbotUI with main chatbot specific functionality
 */
class MainChatbotUI extends ChatbotUI {
  /**
   * @param {Object} config - Configuration object
   * @param {HTMLElement} config.container - The container element
   * @param {EventEmitter} config.eventBus - Event bus instance
   * @param {string} config.type - Type of chatbot
   */
  constructor(config) {
    super(config);
    this.setupMainChatbotUI();
  }

  /**
   * Set up main chatbot specific UI elements
   * @private
   */
  setupMainChatbotUI() {
    this.footer = this.container.querySelector(".chatbot-footer");
    this.setupFooterControls();
    this.setupMainMenu();
  }

  /**
   * Set up footer controls
   * @private
   */
  setupFooterControls() {
    if (!this.footer) return;

    // Clear history button
    const clearButton = this.footer.querySelector(".clear-history");
    if (clearButton) {
      clearButton.addEventListener("click", () => {
        this.eventBus.emit("clearHistory");
      });
    }

    // Minimize button
    const minimizeButton = this.footer.querySelector(".minimize-chatbot");
    if (minimizeButton) {
      minimizeButton.addEventListener("click", () => {
        this.eventBus.emit("minimize");
      });
    }
  }

  /**
   * Set up main menu functionality
   * @private
   */
  setupMainMenu() {
    const menuButton = document.querySelector(".main-menu");
    console.log("Menu Button:", menuButton);
    if (menuButton) {
      menuButton.addEventListener("click", () => {
        this.eventBus.emit("mainMenu");
      });
    }
  }

  /**
   * Clear the chat messages
   * @public
   */
  clearChat() {
    while (this.messageContainer.firstChild) {
      this.messageContainer.removeChild(this.messageContainer.firstChild);
    }
  }

  /**
   * Update footer visibility
   * @public
   * @param {boolean} visible - Whether footer should be visible
   */
  updateFooterVisibility(visible) {
    if (this.footer) {
      this.footer.style.display = visible ? "flex" : "none";
    }
  }
}

export default MainChatbotUI;
