/**
 * BaseChatbotUI Class
 * Handles common UI functionality for chatbots
 */
export class BaseChatbotUI {
  /**
   * @param {ShadowRoot} shadowRoot - The shadow root of the chatbot component
   * @param {EventEmitter} eventBus - The event bus for this chatbot instance
   */
  constructor(shadowRoot, eventBus) {
    this.shadowRoot = shadowRoot;
    this.eventBus = eventBus;
    this.setupUIElements();
    this.setupEventListeners();
  }

  /**
   * Set up references to UI elements
   * @protected
   */
  setupUIElements() {
    this.container = this.shadowRoot.querySelector(".chatbot-container");
    this.messageContainer = this.shadowRoot.querySelector(".message-container");
    this.typingIndicator = this.shadowRoot.querySelector(".chat-typing");
    this.typingText = this.shadowRoot.querySelector(".typing-text");
    this.form = this.shadowRoot.querySelector(".chat-form");
    this.input = this.shadowRoot.querySelector(".chat-input");
  }

  /**
   * Set up event listeners for UI interactions
   * @protected - Can be extended by child classes
   */
  setupEventListeners() {
    // Handle form submissions
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      const message = this.input.value.trim();
      if (message) {
        this.addMessage("user", message);
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

    this.eventBus.on("typingText", ({ text }) => {
      this.updateTypingText(text);
    });

    this.eventBus.on("error", ({ message }) => {
      this.displayError(message);
    });
  }

  /**
   * Add a message to the chat
   * @public
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
   */
  addButtons(buttons) {
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
   * Update the typing indicator text
   * @public
   */
  updateTypingText(text) {
    if (this.typingText) {
      this.typingText.textContent = text;
    }
  }

  /**
   * Display an error message
   * @public
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
      "button-component, carousel-component, .buttons-container"
    );
    elements.forEach((element) => element.remove());
  }

  /**
   * Scroll the message container to the bottom
   * @protected
   */
  scrollToBottom() {
    this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
  }
}
