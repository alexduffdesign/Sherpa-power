// /assets/scripts/chatbot/main/main-chatbot-ui.js

import eventBus from "../utils/event-bus.js";
import { EVENTS } from "../utils/event-constants.js";

/**
 * MainChatbotUI Class
 * Handles UI-specific functionalities for the Main Chatbot.
 */
class MainChatbotUI {
  constructor(container) {
    this.container = container;
    this.form = this.container.querySelector(".chat-form");
    this.input = this.container.querySelector("input[type='text']");
    this.messageContainer = this.container.querySelector(".message-container");
    this.typingIndicator = this.container.querySelector(".chat-typing");

    console.log("Chatbot UI Container:", this.container);
    console.log("Chat Form:", this.form);
    console.log("Chat Input:", this.input);
    console.log("Message Container:", this.messageContainer);
    console.log("Typing Indicator:", this.typingIndicator);

    if (!this.container) {
      console.error("Main Chatbot UI container not found");
      return;
    }

    if (!this.form || !this.input) {
      console.error("Main Chatbot form or input not found");
      return;
    }

    this.setupEventListeners();
  }

  setupEventListeners() {
    // Handle form submission
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      const message = this.input.value.trim();
      if (message) {
        eventBus.emit("userMessage", message);
        this.input.value = "";
      }
    });

    // Listen for typing events from ChatbotCore
    eventBus.on(`${EVENTS.MAIN_CHATBOT.PREFIX}:typing`, (data) => {
      if (data.isTyping) {
        this.showTypingIndicator();
      } else {
        this.hideTypingIndicator();
      }
    });

    // Set up event delegation for button clicks within messages
    this.messageContainer.addEventListener("click", (e) => {
      const button = e.target.closest("button-component");
      if (button) {
        const payload = JSON.parse(button.getAttribute("payload") || "{}");
        const label = button.getAttribute("label");
        if (label) {
          eventBus.emit("buttonClicked", {
            type: payload.type,
            payload,
            label,
          });
          this.removeInteractiveElements();
        }
      }
    });

    // Note: Removed 'buttonClicked' listener from here to prevent undefined 'this.ui'
  }

  /**
   * Adds a message to the chatbot UI.
   * @param {string} sender - 'user' or 'assistant'.
   * @param {string} content - The message content.
   * @param {Object} [metadata] - Additional metadata about the message.
   */
  addMessage(sender, content, metadata = null) {
    if (!this.messageContainer) {
      console.error("Message container not set");
      return;
    }

    const message = document.createElement("message-component");
    message.setAttribute("sender", sender);
    message.setAttribute("content", content);
    this.messageContainer.appendChild(message);
    console.log("Message appended to messageContainer"); // Debug log
    this.scrollToBottom();

    // If metadata includes interactive elements, add them
    if (sender === "assistant" && metadata) {
      switch (metadata.type) {
        case "choice":
          this.addButtons(metadata.buttons);
          break;
        case "carousel":
          this.addCarousel(metadata.carouselItems);
          break;
        // Add more cases as needed
        default:
          break;
      }
    }
  }

  /**
   * Adds interactive buttons to the chatbot UI.
   * @param {Array} buttons - Array of button data.
   */
  addButtons(buttons) {
    console.log("addButtons called with:", buttons); // Debug log

    if (!Array.isArray(buttons)) {
      console.error("addButtons expected an array but received:", buttons);
      return;
    }

    buttons.forEach((buttonData) => {
      const button = document.createElement("button-component");
      button.setAttribute("label", buttonData.name);
      button.setAttribute("payload", JSON.stringify(buttonData.request));
      this.messageContainer.appendChild(button);
      console.log("Button appended to messageContainer"); // Debug log
    });
    this.scrollToBottom();
  }

  /**
   * Adds a carousel to the chatbot UI.
   * Wraps the carouselItems array within a 'cards' key as expected by the carousel component.
   * @param {Array} carouselItems - Array of carousel card data.
   */
  addCarousel(carouselItems) {
    console.log("Adding carousel with items:", carouselItems);
    const carouselData = { cards: carouselItems };
    console.log("Adding carousel:", carouselData);

    if (!Array.isArray(carouselItems)) {
      console.error(
        "addCarousel expected an array but received:",
        carouselItems
      );
      return;
    }

    const carousel = document.createElement("carousel-component");
    carousel.setAttribute("data-carousel", JSON.stringify(carouselData));
    this.messageContainer.appendChild(carousel);
    this.scrollToBottom();
  }

  /**
   * Shows the typing indicator in the chatbot UI.
   */
  showTypingIndicator() {
    if (this.typingIndicator) {
      this.typingIndicator.style.display = "flex";
      this.scrollToBottom();
    }
  }

  /**
   * Hides the typing indicator in the chatbot UI.
   */
  hideTypingIndicator() {
    if (this.typingIndicator) {
      this.typingIndicator.style.display = "none";
    }
  }

  /**
   * Displays an error message in the chatbot UI.
   * @param {string} message - The error message to display.
   */
  displayError(message) {
    const errorDiv = document.createElement("div");
    errorDiv.classList.add("error-message");
    errorDiv.innerText = message;
    this.messageContainer.appendChild(errorDiv);
    this.scrollToBottom();
  }

  /**
   * Scrolls the chatbot UI to the bottom to show the latest message.
   */
  scrollToBottom() {
    this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
  }

  /**
   * Removes interactive elements (buttons, carousels) from the UI.
   */
  removeInteractiveElements() {
    const interactiveElements = this.messageContainer.querySelectorAll(
      "button-component, carousel-component"
    );
    interactiveElements.forEach((element) => element.remove());
  }
}

export default MainChatbotUI;
