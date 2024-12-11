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
  }

  /**
   * Adds a message to the chatbot UI.
   * @param {string} sender - 'user' or 'assistant'.
   * @param {string} content - The message content.
   * @param {Object} [metadata] - Additional metadata about the message.
   * @param {boolean} [isHistory] - Whether this message is being loaded from history
   */
  addMessage(sender, content, metadata = null, isHistory = false) {
    if (!this.messageContainer) {
      console.error("Message container not set");
      return;
    }

    // Only remove interactive elements if this isn't from history loading
    // and the current message isn't interactive
    if (!isHistory && (!metadata || !metadata.isInteractive)) {
      this.removeInteractiveElements();
    }

    const message = document.createElement("message-component");
    message.setAttribute("sender", sender);
    message.setAttribute("content", content);

    // Add image URL if available in metadata
    if (metadata?.imageUrl) {
      message.setAttribute("image-url", metadata.imageUrl);
    }

    this.messageContainer.appendChild(message);
    console.log("Message appended to messageContainer");
    this.scrollToBottom();

    // If metadata includes interactive elements, add them
    if (sender === "assistant" && metadata) {
      switch (metadata.type) {
        case "choice":
          this.addButtons(metadata.buttons, isHistory);
          break;
        case "carousel":
          this.addCarousel(metadata.carouselItems, isHistory);
          break;
        default:
          break;
      }
    }
  }

  /**
   * Adds interactive buttons to the chatbot UI.
   * @param {Array} buttons - Array of button data.
   * @param {boolean} [isHistory] - Whether these buttons are being loaded from history
   */
  addButtons(buttons, isHistory = false) {
    console.log("addButtons called with:", buttons);

    if (!Array.isArray(buttons)) {
      console.error("addButtons expected an array but received:", buttons);
      return;
    }

    // Only remove existing interactive elements if not loading from history
    if (!isHistory) {
      this.removeInteractiveElements();
      this.storeInteractiveState("choice", buttons);
    }

    buttons.forEach((buttonData) => {
      const button = document.createElement("button-component");
      button.setAttribute("label", buttonData.name);
      button.setAttribute("payload", JSON.stringify(buttonData.request));
      this.messageContainer.appendChild(button);
      console.log("Button appended to messageContainer");
    });
    this.scrollToBottom();
  }

  addCarousel(carouselItems, isHistory = false) {
    console.log("Adding carousel with items:", carouselItems);

    if (!Array.isArray(carouselItems)) {
      console.error(
        "addCarousel expected an array but received:",
        carouselItems
      );
      return;
    }

    // Only remove existing interactive elements if not loading from history
    if (!isHistory) {
      this.removeInteractiveElements();
      this.storeInteractiveState("carousel", carouselItems);
    }

    const carouselData = { cards: carouselItems };
    const carousel = document.createElement("carousel-component");
    carousel.setAttribute("data-carousel", JSON.stringify(carouselData));
    this.messageContainer.appendChild(carousel);
    this.scrollToBottom();
  }

  /**
   * Stores the state of the last interactive element
   * @param {string} type - The type of interactive element ('choice' or 'carousel')
   * @param {Array} data - The data for the interactive element
   */
  storeInteractiveState(type, data) {
    const interactiveState = {
      type,
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(
      "lastInteractiveElement",
      JSON.stringify(interactiveState)
    );
  }

  /**
   * Restores the last interactive element if it exists
   */
  restoreInteractiveElement() {
    const savedState = localStorage.getItem("lastInteractiveElement");
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        if (state.type === "choice") {
          this.addButtons(state.data, true);
        } else if (state.type === "carousel") {
          this.addCarousel(state.data, true);
        }
      } catch (error) {
        console.error("Error restoring interactive element:", error);
      }
    }
  }

  showTypingIndicator() {
    if (this.typingIndicator) {
      this.typingIndicator.style.display = "flex";
      this.scrollToBottom();
    }
  }

  hideTypingIndicator() {
    if (this.typingIndicator) {
      this.typingIndicator.style.display = "none";
    }
  }

  displayError(message) {
    const errorDiv = document.createElement("div");
    errorDiv.classList.add("error-message");
    errorDiv.innerText = message;
    this.messageContainer.appendChild(errorDiv);
    this.scrollToBottom();
  }

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
    // Clear the stored interactive state
    localStorage.removeItem("lastInteractiveElement");
  }
}

export default MainChatbotUI;
