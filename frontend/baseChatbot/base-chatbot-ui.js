// /assets/scripts/chatbot/core/base-chatbot-ui.js

import EventEmitter from "eventemitter3";
import { animateText } from "../utils/animation-util.js";
import { parseMarkdown } from "../utils/markdown-util.js";

/**
 * ChatbotUI Class
 * Handles base UI functionality for chatbots with markdown and streaming support
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

    this.currentAssistantMessage = null; // Track the current assistant message

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
        // Add message to UI first
        this.showTypingIndicator();

        this.addMessage("user", message, null, false);
        // Then emit event for core to handle
        this.eventBus.emit("userMessage", message);
        this.input.value = "";
      }
    });

    this.eventBus.on("typing", ({ isTyping, message }) => {
      if (isTyping) {
        this.showTypingIndicator(message);
      } else {
        this.hideTypingIndicator();
      }
    });

    // Handle button clicks
    this.eventBus.on("buttonClicked", (payload) => {
      const userMessage = payload.label || "Button clicked";
      this.showTypingIndicator();
      this.addMessage("user", userMessage, null, false); // Use this directly since we're in ChatbotUI
      this.eventBus.emit("sendAction", payload.action); // Emit event for core to handle
      this.removeInteractiveElements();
    });

    this.eventBus.on("assistantMessageStreamed", ({ content }) => {
      this.handleAssistantStreamedMessage(content);
      console.log("assistnatmessageStreamed activated", content);
    });

    this.eventBus.on("assistantMessageNonStreamed", ({ content, metadata }) => {
      this.handleAssistantNonStreamedMessage(content, metadata);
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

    // Reset current assistant message on end
    this.eventBus.on("end", () => {
      this.currentAssistantMessage = null;
      this.hideTypingIndicator();
    });
  }

  handleAssistantStreamedMessage(content) {
    if (!this.currentAssistantMessage) {
      // Create a message in streaming mode
      this.currentAssistantMessage = this.createMessage(
        "assistant",
        "",
        null,
        false,
        undefined,
        true
      );
      this.messageContainer.appendChild(this.currentAssistantMessage);
      // Set the initial content attribute
      this.currentAssistantMessage.setAttribute("content", content);
      this.currentAssistantMessage.appendHTMLContent(content);
      this.scrollToBottom();
    } else {
      // Append to the existing message
      this.currentAssistantMessage.appendHTMLContent(content);
    }
  }

  handleAssistantNonStreamedMessage(content, metadata) {
    const parsedContent = parseMarkdown(content);

    const message = this.createMessage(
      "assistant",
      parsedContent,
      metadata,
      true,
      undefined,
      false
    );
    this.messageContainer.appendChild(message);
    this.scrollToBottom();

    const messageContentElement =
      message.shadowRoot.querySelector(".message__content");
    if (messageContentElement) {
      // Set innerHTML first to ensure proper HTML rendering
      messageContentElement.innerHTML = parsedContent;

      // Then animate with faster speed (lower number = faster)
      animateText(messageContentElement, parsedContent, 2).then(() => {
        this.scrollToBottom();
        this.hideTypingIndicator();
      });
    }
  }

  /**
   * Create a message component
   * @private
   * @param {string} sender - The sender of the message ('user' or 'assistant')
   * @param {string} content - The raw markdown message content or HTML segments
   * @param {Object} metadata - Optional metadata for the message
   * @param {boolean} animate - Whether to animate the message
   * @param {number} [animationSpeed] - Optional animation speed in ms per character
   * @param {boolean} isStreamed - Indicates if the message is streamed
   * @returns {MessageComponent} The created message component
   */
  createMessage(
    sender,
    content,
    metadata = null,
    animate = true,
    animationSpeed,
    isStreamed = false
  ) {
    const message = document.createElement("message-component");
    message.eventBus = this.eventBus;
    message.setAttribute("sender", sender);
    message.setAttribute("content", content); // Set initial content

    if (isStreamed) {
      message.setAttribute("streaming", ""); // Add the streaming attribute
    }

    if (metadata) {
      message.setAttribute("metadata", JSON.stringify(metadata));
    }

    // Set data attributes for animation
    if (!animate) {
      message.setAttribute("data-animate", "false");
    }

    if (animationSpeed) {
      message.setAttribute("data-animation-speed", animationSpeed.toString());
    }

    return message;
  }

  /**
   * Add interactive buttons to the chat using button-component
   * @public
   * @param {Array} buttons - Array of button data
   * @param {boolean} fromHistory - Indicates if the buttons are loaded from history
   */
  addButtons(buttons, fromHistory = false) {
    if (!Array.isArray(buttons)) {
      console.error("Invalid buttons data:", buttons);
      return;
    }

    // Use <button-component> for each button
    const buttonGroup = document.createElement("div");
    buttonGroup.className = "button-group";

    buttons.forEach((buttonData) => {
      const button = document.createElement("button-component");
      button.eventBus = this.eventBus;
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
   * @param {boolean} fromHistory - Indicates if the carousel is loaded from history
   */
  addCarousel(items, fromHistory = false) {
    if (!Array.isArray(items)) {
      console.error("Invalid carousel items:", items);
      return;
    }

    // Use <carousel-component> with a data-carousel attribute
    const carousel = document.createElement("carousel-component");
    carousel.eventBus = this.eventBus;
    carousel.setAttribute("data-carousel", JSON.stringify({ cards: items }));
    this.messageContainer.appendChild(carousel);
    this.scrollToBottom();
  }

  /**
   * Show the typing indicator
   * @public
   */
  showTypingIndicator(message = null) {
    if (this.typingIndicator) {
      this.typingIndicator.style.display = "flex";

      // Only update text content if message is provided and typingText exists
      if (message && this.typingText) {
        this.typingText.textContent = message;
      }

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
    // For errors, create a div with the error message
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
    if (this.abortController) {
      this.abortController.abort();
    }
    this.eventBus.removeAllListeners();
  }

  /**
   * Add a user message to the UI
   * @public
   * @param {string} sender - The sender ('user')
   * @param {string} message - The message content
   * @param {Object} metadata - Optional metadata
   * @param {boolean} fromHistory - Whether message is from history
   * @param {boolean} isStreamed - Whether message is part of streaming response
   */
  addMessage(
    sender,
    message,
    metadata = null,
    fromHistory = false,
    isStreamed = false
  ) {
    const parsedMessage =
      sender === "assistant" && !isStreamed ? parseMarkdown(message) : message;

    const shouldAnimate = sender === "assistant" && !fromHistory;
    const animationSpeed = fromHistory ? 2 : undefined; // Adjusted speed here too

    const messageComponent = this.createMessage(
      sender,
      parsedMessage,
      metadata,
      shouldAnimate,
      animationSpeed,
      isStreamed
    );

    this.messageContainer.appendChild(messageComponent);
    this.scrollToBottom();
  }
}

export default ChatbotUI;
