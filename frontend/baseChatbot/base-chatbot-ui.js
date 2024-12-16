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
    const messageContainers =
      this.container.querySelectorAll(".message-container");
    this.messageContainer = messageContainers[0];
    console.log("Message container found:", !!this.messageContainer);

    const forms = this.container.querySelectorAll(".chat-form");
    this.form = forms[0];
    console.log("Chat form found:", !!this.form);

    const inputs = this.container.querySelectorAll(".chatbot-input");
    this.input = inputs[0];
    console.log("Chat input found:", !!this.input);

    const typingIndicators = this.container.querySelectorAll(".chat-typing");
    this.typingIndicator = typingIndicators[0];
    console.log("Typing indicator found:", !!this.typingIndicator);

    this.typingText = this.typingIndicator?.querySelector(".typing-text");
    console.log("Typing text found:", !!this.typingText);

    console.log("Container HTML:", this.container.innerHTML);

    if (!this.messageContainer || !this.form || !this.input) {
      const missing = [];
      if (!this.messageContainer) missing.push("message-container");
      if (!this.form) missing.push("chat-form");
      if (!this.input) missing.push("chatbot-input");
      throw new Error(`Required UI elements not found: ${missing.join(", ")}`);
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
        // Emit a 'userMessage' event. The ChatbotCore will handle the logic and respond.
        this.eventBus.emit("userMessage", message);
        this.input.value = "";
      }
    });

    // Listen for chatbot events and update the UI accordingly
    this.eventBus.on("messageReceived", ({ content, metadata }) => {
      console.log("UI received messageReceived event:", content, metadata);
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
   * Add a message to the chat using the message-component
   * @public
   * @param {string} sender - The sender of the message ('user' or 'assistant')
   * @param {string} content - The message content
   * @param {Object} metadata - Optional metadata for the message
   */
  addMessage(sender, content, metadata = null) {
    console.log(
      `addMessage called with sender=${sender}, content=${content}, metadata=`,
      metadata
    );

    // Create a message-component instead of manually constructing HTML
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
   * Add interactive buttons to the chat using button-component
   * @public
   * @param {Array} buttons - Array of button data
   */
  addButtons(buttons) {
    if (!Array.isArray(buttons)) {
      console.error("Invalid buttons data:", buttons);
      return;
    }

    // Instead of manually creating HTML buttons, we use <button-component>
    // for each button. The button-component handles its own styling and click event.
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
   * Add a carousel to the chat using carousel-component
   * @public
   * @param {Array} items - Array of carousel items
   */
  addCarousel(items) {
    if (!Array.isArray(items)) {
      console.error("Invalid carousel items:", items);
      return;
    }

    // Use <carousel-component> with a data-carousel attribute
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
    // For errors, we can still just create a div since it's simple text
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
    // Remove all custom components and groups of interactive elements
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
