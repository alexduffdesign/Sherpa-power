// /assets/scripts/chatbot/core/base-chatbot-ui.js

import EventEmitter from "eventemitter3";
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
    this.accumulatedContent = ""; // For accumulating partial messages

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
    this.eventBus.on("messageReceived", ({ content, metadata, isStreamed }) => {
      console.log(
        "UI received messageReceived event:",
        content,
        metadata,
        isStreamed
      );
      this.handleAssistantMessage(content, metadata, isStreamed);
    });

    // Listen for partial and final messages
    this.eventBus.on("partialMessage", ({ content, isStreamed }) => {
      this.handlePartialMessage(content, isStreamed);
    });

    this.eventBus.on("finalMessage", ({ content, isStreamed }) => {
      this.handleFinalMessage(content, isStreamed);
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

    // Reset current assistant message on end
    this.eventBus.on("end", () => {
      this.currentAssistantMessage = null;
      this.accumulatedContent = "";
    });
  }

  /**
   * Handle assistant messages with markdown support
   * @private
   * @param {string} content - The raw markdown message content
   * @param {Object} metadata - Optional metadata
   * @param {boolean} isStreamed - Indicates if the message is streamed
   */
  handleAssistantMessage(content, metadata, isStreamed) {
    // Determine if the message is loaded from history
    const isFromHistory = metadata && metadata.fromHistory;
    const animate = !isStreamed && !isFromHistory;
    const animationSpeed = isFromHistory ? 10 : undefined; // Faster for deterministic messages

    // Create the message component with appropriate animation settings
    const message = this.createMessage(
      "assistant",
      content,
      metadata,
      animate,
      animationSpeed,
      isStreamed
    );
    this.messageContainer.appendChild(message);
    this.scrollToBottom();
  }

  /**
   * Handle partial assistant messages (streamed content)
   * @private
   * @param {string} content - Partial message content
   * @param {boolean} isStreamed - Indicates if the message is streamed
   */
  handlePartialMessage(content, isStreamed) {
    this.accumulatedContent += content;

    // Check for sentence-ending punctuation
    const sentenceEndRegex = /([.!?;]\s)|(\n)/;
    const match = this.accumulatedContent.match(sentenceEndRegex);

    if (match) {
      const sentenceEndIndex = match.index + match[0].length;
      const completeSentence = this.accumulatedContent
        .slice(0, sentenceEndIndex)
        .trim();
      const remaining = this.accumulatedContent.slice(sentenceEndIndex).trim();

      if (this.currentAssistantMessage) {
        // Append complete sentence to the current message
        this.currentAssistantMessage.appendContent(completeSentence);
      } else {
        // Create a new assistant message component with animation if not streamed
        this.currentAssistantMessage = this.createMessage(
          "assistant",
          completeSentence,
          null,
          !isStreamed, // animate only if not streamed
          undefined, // default animation speed
          isStreamed
        );
        this.messageContainer.appendChild(this.currentAssistantMessage);
      }

      this.accumulatedContent = remaining;
      this.scrollToBottom();
    } else {
      // No sentence boundary yet, append as is with animation if not streamed
      if (this.currentAssistantMessage) {
        this.currentAssistantMessage.appendContent(content);
      } else {
        this.currentAssistantMessage = this.createMessage(
          "assistant",
          content,
          null,
          !isStreamed, // animate only if not streamed
          undefined, // default animation speed
          isStreamed
        );
        this.messageContainer.appendChild(this.currentAssistantMessage);
      }
      this.scrollToBottom();
    }
  }

  /**
   * Handle final assistant message (complete message)
   * @private
   * @param {string} fullContent - The complete message content
   * @param {boolean} isStreamed - Indicates if the message is streamed
   */
  handleFinalMessage(fullContent, isStreamed) {
    if (this.currentAssistantMessage) {
      // Append the remaining content
      this.currentAssistantMessage.appendContent(fullContent);
      this.currentAssistantMessage = null;
      this.accumulatedContent = "";
      this.scrollToBottom();
    } else {
      // In case finalMessage is received without a partial message
      const message = this.createMessage(
        "assistant",
        fullContent,
        null,
        !isStreamed, // animate only if not streamed
        undefined,
        isStreamed
      );
      this.messageContainer.appendChild(message);
      this.scrollToBottom();
    }
  }
  /**
   * Create a message component
   * @private
   * @param {string} sender - The sender of the message ('user' or 'assistant')
   * @param {string} content - The raw markdown message content
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
   * Add a message to the chat using the message-component
   * @public
   * @param {string} sender - The sender of the message ('user' or 'assistant')
   * @param {string} content - The raw markdown message content
   * @param {Object} metadata - Optional metadata for the message
   * @param {boolean} fromHistory - Indicates if the message is loaded from history
   * @param {boolean} isStreamed - Indicates if the message is streamed via completion events
   * @param {number} [animationSpeed] - Optional animation speed in ms per character
   */
  addMessage(
    sender,
    content,
    metadata = null,
    fromHistory = false,
    isStreamed = false,
    animationSpeed = undefined
  ) {
    console.log(
      `addMessage called with sender=${sender}, content=${content}, metadata=`,
      metadata,
      `, fromHistory=${fromHistory}, isStreamed=${isStreamed}, animationSpeed=${animationSpeed}`
    );

    if (sender === "assistant") {
      // Determine if the message is streamed
      const animate = !isStreamed && !fromHistory;
      const speed = isStreamed
        ? undefined // No animation
        : fromHistory
        ? 10
        : animationSpeed;

      const message = this.createMessage(
        "assistant",
        content,
        metadata,
        animate,
        speed,
        isStreamed
      );
      this.messageContainer.appendChild(message);

      if (isStreamed) {
        // For streamed messages, append content directly
        message.appendContent(content);
      }

      this.scrollToBottom();
    } else if (sender === "user") {
      // For user messages, determine if it's from history or a new message
      const animate = !fromHistory;
      const speed = animationSpeed || (fromHistory ? 10 : undefined);

      const message = this.createMessage(
        sender,
        content,
        metadata,
        animate,
        speed,
        isStreamed
      );
      this.messageContainer.appendChild(message);
      this.scrollToBottom();
    }
  }

  handlePartialMessage(content, isStreamed) {
    // If there is no current assistant message, create one
    if (!this.currentAssistantMessage) {
      this.currentAssistantMessage = this.createMessage(
        "assistant",
        "", // Start with empty content
        null,
        false, // Do not animate character by character
        undefined,
        true // isStreamed
      );
      this.messageContainer.appendChild(this.currentAssistantMessage);
    }
    this.currentAssistantMessage.appendContent(content);
    this.scrollToBottom();
  }

  /**
   * Handle final assistant message (complete message)
   * @private
   * @param {string} fullContent - The complete message content
   * @param {boolean} isStreamed - Indicates if the message is streamed
   */
  handleFinalMessage(fullContent, isStreamed) {
    console.log("handleFinalMessage called", { fullContent, isStreamed });
    if (this.currentAssistantMessage) {
      this.currentAssistantMessage.finalizeContentAndAnimate();
      this.currentAssistantMessage = null;
      this.accumulatedContent = "";
    } else {
      console.warn(
        "handleFinalMessage called but currentAssistantMessage is null",
        { fullContent, isStreamed }
      );
      // Fallback: Create and add the message without animation
      const message = this.createMessage(
        "assistant",
        fullContent,
        null,
        false, // No character animation for fallback
        undefined,
        isStreamed
      );
      this.messageContainer.appendChild(message);
    }
    this.scrollToBottom();
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
}

export default ChatbotUI;
