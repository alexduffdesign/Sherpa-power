// /assets/scripts/chatbot/core/chatbot-ui.js

/**
 * ChatbotUI Class
 * Handles base UI functionality for chatbots
 */
class ChatbotUI {
  /**
   * @param {Object} config - Configuration object
   * @param {HTMLElement} config.container - The container element for the chatbot
   * @param {EventEmitter} config.eventBus - Event bus instance
   * @param {string} config.type - Type of chatbot ('main' or 'section')
   */
  constructor(config) {
    if (!config.container) {
      throw new Error("ChatbotUI requires a container element");
    }
    if (!config.eventBus) {
      throw new Error("ChatbotUI requires an event bus");
    }

    this.container = config.container;
    this.eventBus = config.eventBus;
    this.type = config.type;

    this.setupUIElements();
    this.setupEventListeners();
  }

  /**
   * Set up references to UI elements
   * @private
   */
  setupUIElements() {
    this.messageContainer = this.container.querySelector(".message-container");
    this.form = this.container.querySelector(".chat-form");
    this.input = this.container.getElementById("#userInput");
    this.typingIndicator = this.container.querySelector(".chat-typing");
    this.typingText = this.typingIndicator?.querySelector(".typing-text");

    if (!this.messageContainer || !this.form || !this.input) {
      throw new Error("Required UI elements not found");
    }
  }

  /**
   * Set up event listeners for UI interactions
   * @private
   */
  setupEventListeners() {
    // Handle form submissions
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      const message = this.input.value.trim();
      if (message) {
        this.eventBus.emit("userMessage", message);
        this.input.value = "";
      }
    });

    // Listen for chatbot events
    this.eventBus.on("messageReceived", ({ content, metadata }) => {
      this.addMessage("assistant", content, metadata);
    });

    this.eventBus.on("typing", ({ isTyping }) => {
      if (isTyping) {
        this.showTypingIndicator();
      } else {
        this.hideTypingIndicator();
      }
    });

    this.eventBus.on("error", ({ message }) => {
      this.displayError(message);
    });

    this.eventBus.on("choicePresented", ({ buttons }) => {
      this.addButtons(buttons);
    });

    this.eventBus.on("carouselPresented", ({ items }) => {
      this.addCarousel(items);
    });
  }

  /**
   * Add a message to the chat
   * @public
   * @param {string} sender - The sender of the message ('user' or 'assistant')
   * @param {string} content - The message content
   * @param {Object} metadata - Optional metadata for the message
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
   * Add interactive buttons to the chat
   * @public
   * @param {Array} buttons - Array of button data
   */
  addButtons(buttons) {
    if (!Array.isArray(buttons)) {
      console.error("Invalid buttons data:", buttons);
      return;
    }

    const buttonGroup = document.createElement("div");
    buttonGroup.className = "button-group";

    buttons.forEach((buttonData) => {
      const button = document.createElement("button-component");
      button.setAttribute("label", buttonData.name);
      button.setAttribute("payload", JSON.stringify(buttonData.request));
      buttonGroup.appendChild(button);
    });

    this.messageContainer.appendChild(buttonGroup);
    this.scrollToBottom();
  }

  /**
   * Add a carousel to the chat
   * @public
   * @param {Array} items - Array of carousel items
   */
  addCarousel(items) {
    if (!Array.isArray(items)) {
      console.error("Invalid carousel items:", items);
      return;
    }

    const carousel = document.createElement("carousel-component");
    carousel.setAttribute("data-carousel", JSON.stringify({ cards: items }));
    this.messageContainer.appendChild(carousel);
    this.scrollToBottom();
  }

  /**
   * Show the typing indicator
   * @public
   */
  showTypingIndicator() {
    if (this.typingIndicator) {
      this.typingIndicator.style.display = "flex";
      this.scrollToBottom();
    }
  }

  /**
   * Hide the typing indicator
   * @public
   */
  hideTypingIndicator() {
    if (this.typingIndicator) {
      this.typingIndicator.style.display = "none";
    }
  }

  /**
   * Display an error message
   * @public
   * @param {string} message - The error message to display
   */
  displayError(message) {
    const errorDiv = document.createElement("div");
    errorDiv.classList.add("error-message");
    errorDiv.textContent = message;
    this.messageContainer.appendChild(errorDiv);
    this.scrollToBottom();
  }

  /**
   * Remove all interactive elements
   * @public
   */
  removeInteractiveElements() {
    const elements = this.messageContainer.querySelectorAll(
      "button-component, carousel-component, .button-group"
    );
    elements.forEach((element) => element.remove());
  }

  /**
   * Scroll the message container to the bottom
   * @private
   */
  scrollToBottom() {
    this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
  }

  /**
   * Clean up resources
   * @public
   */
  destroy() {
    this.eventBus.removeAllListeners();
  }
}

export default ChatbotUI;
