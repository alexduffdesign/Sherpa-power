// chatbot-main.js

import { ChatbotCore } from "./chatbot-core-file.js";

console.log("MainChatbot module loading");

class MainChatbot {
  constructor(element, config) {
    console.log("MainChatbot constructor called with config:", config);
    this.element = element;
    this.voiceflowEndpoint = config.voiceflowEndpoint;

    this.core = new ChatbotCore({ apiEndpoint: this.voiceflowEndpoint });
    console.log("ChatbotCore instance created:", this.core);

    this.conversationHistory = [];
    this.hasLaunched = localStorage.getItem("chatHasLaunched") === "true";

    // Make sure eventListenersAttached starts as false
    this.eventListenersAttached = false;

    this.initializeElements();
    this.setupEventListeners();

    if (this.hasLaunched) {
      this.loadConversationFromStorage();
      this.displaySavedConversation();
    }
  }

  initializeElements() {
    console.log("MainChatbot initializeElements called");
    const messageContainer = this.element.querySelector("#messageContainer");
    const typingIndicator = this.element.querySelector(".chat-typing");

    if (!messageContainer || !typingIndicator) {
      console.error("Required DOM elements not found");
      return;
    }

    this.core.setDOMElements(messageContainer, typingIndicator);
    console.log("DOM elements set in ChatbotCore:", this.core);
  }

  setupEventListeners() {
    if (this.eventListenersAttached) return;

    console.log("MainChatbot setupEventListeners called");
    const form = this.element.querySelector("#chatForm");
    const input = this.element.querySelector("#userInput");

    if (!form || !input) {
      console.error("Chat form or input not found");
      return;
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const message = input.value.trim();
      if (message) {
        console.log("Form submitted with message:", message);
        await this.handleUserMessage(message);
        input.value = "";
      }
    });

    this.eventListenersAttached = true;
  }

  async handleUserMessage(message) {
    this.core.addMessage("user", message);
    this.conversationHistory.push({ type: "user", message: message });
    this.saveConversationToStorage();

    this.core.showTypingIndicator();
    try {
      const response = await this.core.sendMessage(message);
      console.log("Response from sendMessage:", response);
      await this.handleAgentResponse(response);
    } catch (error) {
      console.error("Error in send message:", error);
    } finally {
      this.core.hideTypingIndicator();
    }
  }

  loadConversationFromStorage() {
    const savedConversation = localStorage.getItem("chatConversation");
    this.conversationHistory = savedConversation
      ? JSON.parse(savedConversation)
      : [];
    console.log("Loaded conversation from storage:", this.conversationHistory);
  }

  saveConversationToStorage() {
    localStorage.setItem(
      "chatConversation",
      JSON.stringify(this.conversationHistory)
    );
    console.log("Saved conversation to storage");
  }

  displaySavedConversation() {
    console.log("Displaying saved conversation");
    const messageContainer = this.element.querySelector("#messageContainer");
    if (messageContainer) {
      messageContainer.innerHTML = ""; // Clear existing messages
      this.conversationHistory.forEach((turn) => {
        this.core.addMessage(turn.type, turn.message);
      });
      this.core.scrollToBottom();
    } else {
      console.error("Message container not found");
    }
  }

  async initializeChat() {
    console.log("Initializing chat");
    if (!this.hasLaunched) {
      console.log("Initializing chat for the first time");
      await this.sendLaunch();
    }
    console.log("Chat initialized");
  }

  async sendLaunch() {
    console.log("Sending launch request");
    this.core.showTypingIndicator();
    try {
      const response = await this.core.sendLaunch();
      await this.handleAgentResponse(response);
      this.hasLaunched = true;
      localStorage.setItem("chatHasLaunched", "true");
    } catch (error) {
      console.error("Error in send launch:", error);
    } finally {
      this.core.hideTypingIndicator();
    }
  }

  async handleAgentResponse(response) {
    console.log("Handling agent response:", response);
    for (const trace of response) {
      if (trace.type === "text") {
        this.core.addMessage("assistant", trace.payload.message);
        this.conversationHistory.push({
          type: "assistant",
          message: trace.payload.message,
        });
      } else if (trace.type === "choice") {
        this.core.addButtons(trace.payload.buttons);
      } else if (trace.type === "carousel") {
        this.addCarousel(trace.payload);
      } else {
        console.log("Unknown trace type:", trace.type);
      }
    }
    this.saveConversationToStorage();
  }

  // < Carousel JS > //

  addCarousel(carouselData) {
    console.log("Adding carousel:", carouselData);
    const carouselElement = document.createElement("div");
    carouselElement.className = "carousel";
    carouselElement.innerHTML = `
    <div class="carousel__container">
      <!-- Carousel items will be dynamically added here -->
    </div>
    <button class="carousel__button carousel__button--left" aria-label="Previous slide">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <button class="carousel__button carousel__button--right" aria-label="Next slide">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  `;

    const carousel = new Carousel(carouselElement);

    for (let i = 0; i < carouselData.cards.length; i += 2) {
      const itemContent = carouselData.cards
        .slice(i, i + 2)
        .map(
          (card) => `
      <div class="carousel__item-wrapper">
        <div class="carousel__item-content">
          <img src="${card.imageUrl}" alt="${card.title}" class="carousel__item-image">
          <h6 class="carousel__item-title">${card.title}</h6>
          <p class="carousel__item-description">${card.description.text}</p>
          <button class="button carousel__item-button" data-button-index="0">${card.buttons[0].name}</button>
        </div>
      </div>
    `
        )
        .join("");

      carousel.addItem(itemContent);
    }

    const buttons = carouselElement.querySelectorAll(".carousel__item-button");
    buttons.forEach((button, index) => {
      button.addEventListener("click", async () => {
        const cardIndex = Math.floor(
          index / carouselData.cards[0].buttons.length
        );
        const buttonIndex = index % carouselData.cards[0].buttons.length;
        const buttonData = carouselData.cards[cardIndex].buttons[buttonIndex];
        try {
          const response = await this.core.handleButtonClick(buttonData);
          await this.handleAgentResponse(response);
        } catch (error) {
          console.error("Error handling carousel button click:", error);
        }
      });
    });

    const messageContainer = this.element.querySelector("#messageContainer");
    if (messageContainer) {
      messageContainer.appendChild(carouselElement);
      this.core.scrollToBottom();
    } else {
      console.error("Message container not found when adding carousel");
    }
  }
}

class Carousel {
  constructor(element) {
    this.element = element;
    this.container = element.querySelector(".carousel__container");
    this.leftButton = element.querySelector(".carousel__button--left");
    this.rightButton = element.querySelector(".carousel__button--right");
    this.items = [];
    this.currentIndex = 0;

    this.leftButton.addEventListener("click", () => this.move("left"));
    this.rightButton.addEventListener("click", () => this.move("right"));
  }

  addItem(content) {
    const item = document.createElement("div");
    item.className = "carousel__item";
    item.innerHTML = content;
    this.container.appendChild(item);
    this.items.push(item);
    this.updateVisibility();
  }

  move(direction) {
    if (direction === "left") {
      this.currentIndex = Math.max(0, this.currentIndex - 1);
    } else {
      this.currentIndex = Math.min(
        this.items.length - 1,
        this.currentIndex + 1
      );
    }
    this.updatePosition();
    this.updateVisibility();
  }

  updatePosition() {
    const offset = -this.currentIndex * 100;
    this.container.style.transform = `translateX(${offset}%)`;
  }

  updateVisibility() {
    this.leftButton.style.display = this.currentIndex === 0 ? "none" : "flex";
    this.rightButton.style.display =
      this.currentIndex === this.items.length - 1 ? "none" : "flex";
  }
}
console.log("MainChatbot module loaded");

export default MainChatbot;
