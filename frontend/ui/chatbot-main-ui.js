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

    console.log("Chatbot UI Container:", this.container);
    console.log("Chat Form:", this.form);
    console.log("Chat Input:", this.input);
    console.log("Message Container:", this.messageContainer);

    if (!this.container) {
      console.error("Main Chatbot UI container not found");
      return;
    }

    if (!this.form || !this.input) {
      console.error("Main Chatbot form or input not found");
      return;
    }

    this.setupEventListeners();
    this.setupUIEventListeners();
  }

  /**
   * Sets up event listeners for user interactions within the UI.
   */
  setupEventListeners() {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      const message = this.input.value.trim();
      if (message) {
        eventBus.emit("userMessage", message);
        this.input.value = "";
        this.saveToHistory("user", message);
      }
    });
  }

  /**
   * Sets up event listeners for UI components like buttons.
   */
  setupUIEventListeners() {
    // Set up event delegation for button clicks once
    this.container
      .querySelector(".chatbot-container")
      .addEventListener("click", (e) => {
        const button = e.target.closest("button.button");
        if (button) {
          const payload = JSON.parse(button.getAttribute("data-button-data"));
          eventBus.emit("buttonClicked", payload);
          this.removeInteractiveElements();
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
   * Adds a message to the chatbot UI.
   * @param {string} sender - 'user' or 'assistant'.
   * @param {string} content - The message content.
   */
  addMessage(sender, content) {
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
    this.saveToHistory(sender, content);
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
   * @param {Object} carouselData - Data for the carousel.
   */
  addCarousel(carouselData) {
    console.log("Adding carousel:", carouselData);
    const carousel = document.createElement("carousel-component");
    carousel.setAttribute("data-carousel", JSON.stringify(carouselData));
    this.messageContainer.appendChild(carousel);
    this.scrollToBottom();
  }

  /**
   * Displays a typing indicator in the chatbot UI.
   */
  showTypingIndicator() {
    const typing = this.container.querySelector(".chat-typing");
    if (typing) {
      typing.style.display = "flex";
      this.scrollToBottom();
    }
  }

  /**
   * Hides the typing indicator from the chatbot UI.
   */
  hideTypingIndicator() {
    const typing = this.container.querySelector(".chat-typing");
    if (typing) {
      typing.style.display = "none";
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
    this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
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
