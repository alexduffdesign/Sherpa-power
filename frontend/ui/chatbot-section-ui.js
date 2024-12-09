// /assets/scripts/chatbot/section/section-chatbot-ui.js

import eventBus from "../utils/event-bus.js";
import { EVENTS } from "../utils/event-constants.js";

/**
 * SectionChatbotUI Class
 * Handles UI-specific functionalities for the Section Chatbot.
 */
class SectionChatbotUI {
  /**
   * Constructor initializes UI elements, extracts product details, and sets up event listeners.
   * @param {HTMLElement} container - The section chatbot UI container.
   */
  constructor(container) {
    this.container = container;
    this.form = this.container.querySelector("form#section-chatbot-form");
    this.input = this.container.querySelector("#section-chatbot-input");

    if (!this.form || !this.input) {
      console.error("Section Chatbot form or input not found");
      return;
    }

    // Extract product details from HTML attributes
    this.productTitle = this.getAttribute("product-title");
    this.productCapacity = this.getAttribute("product-capacity");
    this.acOutputContinuousPower = this.getAttribute(
      "product-ac_output_continuous_power"
    );
    this.acOutputPeakPower = this.getAttribute("product-ac_output_peak_power");
    this.dcOutputPower = this.getAttribute("product-dc_output_power");

    this.startBlock = "shopifySection";
    this.productDetails = {
      title: this.productTitle,
      capacity: this.productCapacity,
      ac_output_continuous_power: this.acOutputContinuousPower,
      ac_output_peak_power: this.acOutputPeakPower,
      dc_output_power: this.dcOutputPower,
    };

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
    this.container.querySelector(".chatbot-container").appendChild(message);
    this.scrollToBottom();
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
      this.container.querySelector(".chatbot-container").appendChild(button);
    });
    this.scrollToBottom();

    // Set up event delegation for button clicks
    this.container
      .querySelector(".chatbot-container")
      .addEventListener("click", (e) => {
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
    this.container.querySelector(".chatbot-container").appendChild(carousel);
    this.scrollToBottom();

    // Set up event delegation for carousel interactions if necessary
    // Implement similar to buttons if carousel items have interactive elements
  }

  /**
   * Populates the applications grid with device information.
   * @param {Array} devices - Array of device data.
   */
  populateApplicationsGrid(devices) {
    const grid = document.querySelector(".applications-grid");
    if (!grid) {
      console.error("Applications grid not found");
      return;
    }
    devices.forEach((device) => {
      const card = document.createElement("div");
      card.classList.add("application-card", "chatbot-card");
      card.innerHTML = `
        <div class="application-card__image">
          <img src="${device.imageUrl}" alt="${device.name}" />
        </div>
        <div class="application-card__content">
          <div class="application-card__title">${device.name}</div>
          <div class="application-card__runtime">${device.estimatedRuntime}</div>
        </div>
      `;
      grid.appendChild(card);
    });
    this.scrollToBottom();
  }

  /**
   * Displays an error message in the chatbot UI.
   * @param {string} message - The error message.
   */
  displayError(message) {
    const errorDiv = document.createElement("div");
    errorDiv.classList.add("error-message");
    errorDiv.innerText = message;
    this.container.querySelector(".chatbot-container").appendChild(errorDiv);
    this.scrollToBottom();
  }

  /**
   * Scrolls the chatbot container to the bottom.
   */
  scrollToBottom() {
    this.container.scrollTop = this.container.scrollHeight;
  }

  /**
   * Retrieves the value of a specified attribute from the chatbot container.
   * @param {string} attrName - The name of the attribute.
   * @returns {string|null} - The value of the attribute or null if not found.
   */
  getAttribute(attrName) {
    return this.container.getAttribute(attrName);
  }

  /**
   * Removes interactive elements (buttons, carousels) from the UI.
   */
  removeInteractiveElements() {
    const interactiveElements = this.container.querySelectorAll(
      "button-component, carousel-component"
    );
    interactiveElements.forEach((element) => element.remove());
  }
}

export default SectionChatbotUI;
