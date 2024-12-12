// /assets/scripts/chatbot/main/main-chatbot-ui.js

import eventBus from "../utils/event-bus.js";
import { EVENTS } from "../utils/event-constants.js";
import { BaseChatbotUI } from "../baseChatbot/base-chatbot-ui.js";
import { MAIN_CHATBOT } from "../utils/event-constants.js";

/**
 * MainChatbotUI Class
 * Extends BaseChatbotUI with drawer-specific functionality
 */
export class MainChatbotUI extends BaseChatbotUI {
  /**
   * @param {ShadowRoot} shadowRoot - The shadow root of the chatbot component
   * @param {EventEmitter} eventBus - The event bus for this chatbot instance
   */
  constructor(shadowRoot, eventBus) {
    super(shadowRoot, eventBus);
    this.setupMainChatbotUI();
  }

  /**
   * Set up main chatbot specific UI elements and functionality
   * @private
   */
  setupMainChatbotUI() {
    // Set up footer elements
    this.footer = this.shadowRoot.querySelector(".chatbot-footer");
    this.setupFooterEventListeners();
  }

  /**
   * Set up event listeners specific to the main chatbot
   * @protected
   * @override
   */
  setupEventListeners() {
    super.setupEventListeners();

    // Handle button clicks with main chatbot namespace
    this.messageContainer.addEventListener("click", (e) => {
      const button = e.target.closest("button-component");
      if (button) {
        const payload = JSON.parse(button.getAttribute("payload"));
        const label = button.getAttribute("label");

        this.eventBus.emit(MAIN_CHATBOT.BUTTON_CLICK, {
          ...payload,
          label,
          type: "choice",
        });

        // Add the button text as a user message
        this.addMessage("user", label);
        this.removeInteractiveElements();
      }
    });

    // Handle carousel button clicks with main chatbot namespace
    this.messageContainer.addEventListener("click", (e) => {
      const carouselButton = e.target.closest("carousel-button");
      if (carouselButton) {
        const payload = JSON.parse(carouselButton.getAttribute("payload"));
        const label = carouselButton.getAttribute("label");

        this.eventBus.emit(MAIN_CHATBOT.CAROUSEL_BUTTON_CLICK, {
          ...payload,
          label,
          type: "carousel_click",
        });

        // Add the button text as a user message
        this.addMessage("user", label);
      }
    });
  }

  /**
   * Add buttons to the chat
   * @param {Array} buttons - Array of button data
   * @param {boolean} isRestored - Whether these buttons are being restored from history
   * @override
   */
  addButtons(buttons, isRestored = false) {
    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "buttons-container";

    buttons.forEach((buttonData) => {
      const button = document.createElement("button-component");
      button.setAttribute("label", buttonData.name);
      button.setAttribute("payload", JSON.stringify(buttonData.request));

      // Add any additional attributes needed for restored buttons
      if (isRestored) {
        button.setAttribute("data-restored", "true");
      }

      buttonsContainer.appendChild(button);
    });

    this.messageContainer.appendChild(buttonsContainer);
    this.scrollToBottom();
  }

  /**
   * Add a carousel to the chat
   * @param {Array} items - Array of carousel items
   * @param {boolean} isRestored - Whether this carousel is being restored from history
   * @override
   */
  addCarousel(items, isRestored = false) {
    const carousel = document.createElement("carousel-component");
    carousel.setAttribute("items", JSON.stringify(items));

    // Add any additional attributes needed for restored carousels
    if (isRestored) {
      carousel.setAttribute("data-restored", "true");
    }

    this.messageContainer.appendChild(carousel);
    this.scrollToBottom();
  }

  /**
   * Set up event listeners for footer elements
   * @private
   */
  setupFooterEventListeners() {
    if (!this.footer) return;

    // Handle clear history button
    const clearButton = this.footer.querySelector(".clear-history");
    if (clearButton) {
      clearButton.addEventListener("click", () => {
        this.clearChat();
        this.eventBus.emit(MAIN_CHATBOT.CLEAR_HISTORY);
      });
    }

    // Handle minimize button
    const minimizeButton = this.footer.querySelector(".minimize-chatbot");
    if (minimizeButton) {
      minimizeButton.addEventListener("click", () => {
        this.eventBus.emit(MAIN_CHATBOT.MINIMIZE);
      });
    }
  }

  /**
   * Clear the chat
   * @private
   */
  clearChat() {
    while (this.messageContainer.firstChild) {
      this.messageContainer.removeChild(this.messageContainer.firstChild);
    }
  }

  /**
   * Update the footer visibility
   * @public
   */
  updateFooterVisibility(visible) {
    if (this.footer) {
      this.footer.style.display = visible ? "flex" : "none";
    }
  }
}
