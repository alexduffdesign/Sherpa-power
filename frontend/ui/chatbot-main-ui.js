// /assets/scripts/chatbot/main/main-chatbot-ui.js

import eventBus from "../utils/event-bus.js";
import { EVENTS } from "../utils/event-constants.js";

/**
 * MainChatbotUI Class
 * Handles UI-specific functionalities for the Main Chatbot.
 */
class MainChatbotUI {
  /**
   * Constructor initializes UI elements and sets up event listeners.
   * @param {HTMLElement} container - The main chatbot UI container.
   */
  constructor(container) {
    this.container = container;
    this.form = this.container.querySelector(".chat-form");
    this.input = this.container.querySelector("input[type='text']");
    this.messageContainer = this.container.querySelector(".message-container");

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

  /**
   * Sets up event listeners for user interactions within the UI.
   */
  setupEventListeners() {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      const message = this.input.value.trim();
      if (message) {
        this.emit("userMessage", message);
        this.input.value = "";
        this.saveToHistory("user", message);
      }
    });
  }

  /**
   * Registers a callback for user message submissions.
   * @param {Function} callback - Function to handle user messages.
   */
  onUserMessage(callback) {
    eventBus.on("userMessage", callback);
  }

  /**
   * Registers a callback for button click interactions.
   * @param {Function} callback - Function to handle button clicks.
   */
  onButtonClick(callback) {
    eventBus.on("buttonClicked", callback);
  }

  /**
   * Emits custom events from the UI components.
   * @param {string} eventName - Name of the event.
   * @param {any} data - Data to pass with the event.
   */
  emit(eventName, data) {
    const event = new CustomEvent(eventName, { detail: data });
    this.container.dispatchEvent(event);
  }

  /**
   * Adds a message to the chatbot UI.
   * @param {string} sender - 'user' or 'assistant'.
   * @param {string} content - The message content.
   */
  addMessage(sender, content) {
    const message = document.createElement("message-component");
    message.setAttribute("sender", sender);
    message.setAttribute("content", content);
    this.messageContainer.appendChild(message);
    this.scrollToBottom();
    this.saveToHistory(sender, content);
  }

  /**
   * Adds interactive buttons to the chatbot UI.
   * @param {Array} buttons - Array of button data.
   */
  addButtons(buttons) {
    buttons.forEach((buttonData) => {
      const button = document.createElement("button-component");
      button.setAttribute("label", buttonData.name);
      button.setAttribute("payload", JSON.stringify(buttonData.request));
      this.messageContainer.appendChild(button);
    });
    this.scrollToBottom();

    // Set up event delegation for button clicks
    this.messageContainer.addEventListener("click", (e) => {
      if (e.target.closest("button-component")) {
        const button = e.target.closest("button-component");
        const payload = JSON.parse(button.getAttribute("payload"));
        this.emit("buttonClicked", payload);
        this.removeInteractiveElements();
      }
    });
  }

  /**
   * Adds a carousel to the chatbot UI.
   * @param {Array} items - Array of carousel items.
   */
  addCarousel(items) {
    const carousel = document.createElement("carousel-component");
    carousel.setAttribute("items", JSON.stringify(items));
    this.messageContainer.appendChild(carousel);
    this.scrollToBottom();

    // Set up event delegation for carousel interactions if necessary
    // Implement similar to buttons if carousel items have interactive elements
  }

  /**
   * Displays a typing indicator in the chatbot UI.
   */
  showTypingIndicator() {
    const typing = document.createElement("div");
    typing.classList.add("typing-indicator");
    typing.innerText = "Assistant is typing...";
    this.messageContainer.appendChild(typing);
    this.scrollToBottom();
  }

  /**
   * Hides the typing indicator from the chatbot UI.
   */
  hideTypingIndicator() {
    const typing = this.messageContainer.querySelector(".typing-indicator");
    if (typing) {
      typing.remove();
    }
  }

  /**
   * Displays an error message in the chatbot UI.
   * @param {string} message - The error message.
   */
  displayError(message) {
    const errorDiv = document.createElement("div");
    errorDiv.classList.add("error-message");
    errorDiv.innerText = message;
    this.messageContainer.appendChild(errorDiv);
    this.scrollToBottom();
  }

  /**
   * Scrolls the chatbot container to the bottom.
   */
  scrollToBottom() {
    this.container.scrollTop = this.container.scrollHeight;
  }

  /**
   * Saves a message to conversation history in localStorage.
   * @param {string} sender - 'user' or 'assistant'.
   * @param {string} message - The message content.
   */
  saveToHistory(sender, message) {
    const history =
      JSON.parse(localStorage.getItem("mainChatbotHistory")) || [];
    history.push({ sender, message });
    localStorage.setItem("mainChatbotHistory", JSON.stringify(history));
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
