// /assets/scripts/chatbot/section/section-chatbot-ui.js

import eventBus from "../utils/event-bus.js";
import { EVENTS } from "../utils/event-constants.js";

/**
 * SectionChatbotUI Class
 * Handles all UI-specific functionalities for the Section Chatbot.
 * Manages message display, interactive elements, and product details.
 *
 * @class
 * @property {HTMLElement} container - The main container element for the chatbot UI
 * @property {HTMLFormElement} form - The form element for user input
 * @property {HTMLInputElement} input - The text input element
 * @property {HTMLElement} messageContainer - Container for chat messages
 * @property {Object} productDetails - Product information from data attributes
 */
class SectionChatbotUI {
  /**
   * Creates a new SectionChatbotUI instance.
   * Initializes UI elements and extracts product details from container attributes.
   *
   * @param {HTMLElement} container - The section chatbot UI container
   * @throws {Error} If required UI elements are not found
   */
  constructor(container) {
    if (!container) {
      throw new Error("SectionChatbotUI requires a container element");
    }

    this.container = container;
    this.form = this.container.querySelector("#chatForm");
    this.input = this.container.querySelector("#userInput");
    this.messageContainer = this.container.querySelector("#messageContainer");
    this.typingIndicator = this.container.querySelector(".chat-typing");
    this.typingText = this.typingIndicator?.querySelector(".typing-text");

    console.log("Chatbot UI Container:", this.container);
    console.log("Chat Form:", this.form);
    console.log("Chat Input:", this.input);
    console.log("Message Container:", this.messageContainer);
    console.log("Typing Indicator:", this.typingIndicator);
    console.log("Typing Text:", this.typingText);

    if (!this.form) {
      throw new Error("Chat form not found (id: chatForm)");
    }
    if (!this.input) {
      throw new Error("Input field not found (id: userInput)");
    }
    if (!this.messageContainer) {
      throw new Error("Message container not found (id: messageContainer)");
    }

    this.initializeProductDetails();
    this.setupEventListeners();
  }

  /**
   * Initializes product details from container data attributes.
   *
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

    console.log("Initialized product details:", this.productDetails);
  }

  /**
   * Sets up event listeners for user interactions within the UI.
   *
   * @private
   */
  setupEventListeners() {
    // Handle form submissions
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      const message = this.input.value.trim();
      if (message) {
        eventBus.emit(EVENTS.SECTION_CHATBOT.USER_MESSAGE, message);
        this.input.value = "";
      }
    });

    // Handle button clicks through event delegation
    this.messageContainer.addEventListener("click", (e) => {
      const button = e.target.closest("button-component");
      if (button) {
        const payload = this.getButtonPayload(button);
        if (payload) {
          eventBus.emit("buttonClicked", payload);
          this.removeInteractiveElements();
        }
      }
    });

    // Handle carousel interactions
    this.messageContainer.addEventListener("click", (e) => {
      const carousel = e.target.closest("carousel-component");
      if (carousel) {
        const button = e.target.closest(".carousel-button");
        if (button) {
          const payload = this.getButtonPayload(button);
          if (payload) {
            eventBus.emit("carouselButtonClicked", payload);
          }
        }
      }
    });
  }

  /**
   * Gets the payload data from a button element.
   *
   * @private
   * @param {HTMLElement} button - The button element
   * @returns {Object|null} The button's payload data or null if invalid
   */
  getButtonPayload(button) {
    try {
      return JSON.parse(button.getAttribute("payload") || "null");
    } catch (error) {
      console.error("Error parsing button payload:", error);
      return null;
    }
  }

  /**
   * Adds a message to the chatbot UI.
   *
   * @public
   * @param {string} sender - 'user' or 'assistant'
   * @param {string} content - The message content
   * @param {Object} [metadata] - Optional metadata for the message
   */
  addMessage(sender, content, metadata = null) {
    const message = document.createElement("message-component");
    message.setAttribute("sender", sender);
    message.setAttribute("content", content);

    if (metadata) {
      message.setAttribute("metadata", JSON.stringify(metadata));
    }

    this.messageContainer.appendChild(message);
    this.scrollToBottom();
  }

  /**
   * Adds interactive buttons to the chatbot UI.
   *
   * @public
   * @param {Array} buttons - Array of button data
   */
  addButtons(buttons) {
    if (!Array.isArray(buttons)) {
      console.error("Invalid buttons data:", buttons);
      return;
    }

    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "buttons-container";

    buttons.forEach((buttonData) => {
      const button = document.createElement("button-component");
      button.setAttribute("label", buttonData.name);
      button.setAttribute("payload", JSON.stringify(buttonData.request));
      buttonsContainer.appendChild(button);
    });

    this.messageContainer.appendChild(buttonsContainer);
    this.scrollToBottom();
  }

  /**
   * Adds a carousel to the chatbot UI.
   *
   * @public
   * @param {Array} items - Array of carousel items
   */
  addCarousel(items) {
    if (!Array.isArray(items)) {
      console.error("Invalid carousel items:", items);
      return;
    }

    const carousel = document.createElement("carousel-component");
    carousel.setAttribute("items", JSON.stringify(items));
    this.messageContainer.appendChild(carousel);
    this.scrollToBottom();
  }

  /**
   * Updates the typing indicator text.
   *
   * @public
   * @param {string} text - The text to display in the typing indicator
   */
  updateTypingText(text) {
    if (this.typingText) {
      this.typingText.textContent = text;
    }
  }

  /**
   * Shows the typing indicator.
   *
   * @public
   */
  showTypingIndicator() {
    if (this.typingIndicator) {
      this.typingIndicator.style.display = "flex";
      this.scrollToBottom();
    }
  }

  /**
   * Hides the typing indicator.
   *
   * @public
   */
  hideTypingIndicator() {
    if (this.typingIndicator) {
      this.typingIndicator.style.display = "none";
    }
  }

  /**
   * Displays an error message in the chatbot UI.
   *
   * @public
   * @param {string} message - The error message
   */
  displayError(message) {
    const errorDiv = document.createElement("div");
    errorDiv.classList.add("error-message");
    errorDiv.innerText = message;
    this.messageContainer.appendChild(errorDiv);
    this.scrollToBottom();
  }

  /**
   * Scrolls the message container to the bottom.
   *
   * @private
   */
  scrollToBottom() {
    this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
  }

  /**
   * Retrieves the value of a specified attribute from the chatbot container.
   *
   * @private
   * @param {string} attrName - The name of the attribute
   * @returns {string|null} The value of the attribute or null if not found
   */
  getAttribute(attrName) {
    return this.container.getAttribute(attrName);
  }

  /**
   * Removes all interactive elements from the UI.
   *
   * @public
   */
  removeInteractiveElements() {
    const elements = this.messageContainer.querySelectorAll(
      "button-component, carousel-component, .buttons-container"
    );
    elements.forEach((element) => element.remove());
  }
}

export default SectionChatbotUI;
