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

  // /**
  //  * Override base addButtons to add main-specific functionality
  //  * @override
  //  * @param {Array} buttons - Array of button data
  //  * @param {boolean} isRestored - Whether these buttons are being restored from history
  //  */
  // addButtons(buttons, isRestored = false) {
  //   if (!Array.isArray(buttons)) {
  //     console.error("Invalid buttons data:", buttons);
  //     return;
  //   }

  //   const buttonGroup = document.createElement("div");
  //   buttonGroup.className = "button-group";

  //   buttons.forEach((buttonData) => {
  //     const button = document.createElement("button-component");
  //     button.setAttribute("label", buttonData.name);
  //     button.setAttribute("payload", JSON.stringify(buttonData.request));
  //     button.eventBus = this.eventBus;

  //     if (isRestored) {
  //       button.setAttribute("data-restored", "true");
  //     }
  //     buttonGroup.appendChild(button);
  //   });

  //   this.messageContainer.appendChild(buttonGroup);
  //   this.scrollToBottom();
  // }

  // /**
  //  * Override base addCarousel to add main-specific functionality
  //  * @override
  //  * @param {Array} items - Array of carousel items
  //  * @param {boolean} isRestored - Whether this carousel is being restored from history
  //  */
  // addCarousel(items, isRestored = false) {
  //   if (!Array.isArray(items)) {
  //     console.error("Invalid carousel items:", items);
  //     return;
  //   }

  //   const carousel = document.createElement("carousel-component");
  //   carousel.setAttribute("data-carousel", JSON.stringify({ cards: items }));

  //   if (isRestored) {
  //     carousel.setAttribute("data-restored", "true");
  //   }

  //   carousel.eventBus = this.eventBus;
  //   this.messageContainer.appendChild(carousel);
  //   this.scrollToBottom();
  // }

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
