// chatbot-main.js

import { ChatbotCore } from "./chatbot-core-file.js";

console.log("MainChatbot module loading");

class MainChatbot {
  constructor(element, config) {
    console.log("MainChatbot constructor called with config:", config);
    this.element = element;
    this.voiceflowEndpoint = config.voiceflowEndpoint;

    this.core = new ChatbotCore({
      apiEndpoint: this.voiceflowEndpoint,
      userIDPrefix: "mainChatbot",
    });
    console.log("ChatbotCore instance created:", this.core);

    this.conversationHistory = [];
    this.hasLaunched = localStorage.getItem("chatHasLaunched") === "true";

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
    const drawer = this.element.closest("x-drawer");
    let drawerBody = null;

    if (drawer && drawer.shadowRoot) {
      drawerBody = drawer.shadowRoot.querySelector('[part="body"]');
    }

    if (!messageContainer || !typingIndicator || !drawerBody) {
      console.error("Required DOM elements not found");
      return;
    }

    this.core.setDOMElements(messageContainer, typingIndicator, drawerBody);
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
        input.value = ""; // Clear the input field immediately
        await this.handleUserMessage(message);
      }
    });

    this.element.addEventListener("click", async (e) => {
      if (e.target.matches(".button-container button")) {
        const buttonData = JSON.parse(e.target.dataset.buttonData);
        try {
          const response = await this.core.handleButtonClick(buttonData);
          // Save button click as a message
          this.conversationHistory.push({
            type: "user",
            message: buttonData.name,
          });
          this.saveConversationToStorage();
          await this.handleAgentResponse(response);
        } catch (error) {
          console.error("Error handling button click:", error);
        }
      }
    });

    const jumpToStartButton = document.querySelector(".back-to-start");
    if (jumpToStartButton) {
      jumpToStartButton.addEventListener("click", () => this.jumpToStart());
    } else {
      console.error("Jump to start button not found");
    }

    this.eventListenersAttached = true;
  }

  async initializeChat() {
    console.log("Initializing chat");
    if (!this.hasLaunched) {
      try {
        console.log("Initializing chat for the first time");
        await this.sendLaunch();
        this.hasLaunched = true;
        localStorage.setItem("chatHasLaunched", "true");
      } catch (error) {
        console.error("Error during chat initialization:", error);
      }
    } else {
      // Add this else block to handle existing conversations
      this.loadConversationFromStorage();
      this.displaySavedConversation();
    }
    // Add this line to scroll to the bottom after initialization
    this.core.scrollToBottom();
    console.log("Chat initialized");
  }

  async sendLaunch(payload = {}) {
    console.log("Sending main chatbot launch request");

    const interactPayload = {
      userAction: {
        type: "launch",
      },
    };

    try {
      const response = await this.core.sendLaunch(interactPayload);
      await this.handleAgentResponse(response);
    } catch (error) {
      console.error("Error in main chatbot send launch:", error);
    }
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
      this.core.scrollToBottom();
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
      this.conversationHistory.forEach((turn, index) => {
        if (turn.type === "user" || turn.type === "assistant") {
          this.core.addMessage(turn.type, turn.message);
        } else if (turn.type === "choice") {
          // Check if next turn is 'user' type
          const nextTurn = this.conversationHistory[index + 1];
          if (!nextTurn || nextTurn.type !== "user") {
            this.core.addButtons(turn.buttons);
          }
        } else if (turn.type === "carousel") {
          // Check if next turn is 'user' type
          const nextTurn = this.conversationHistory[index + 1];
          if (!nextTurn || nextTurn.type !== "user") {
            this.addCarousel(turn.data);
          }
        } else if (turn.type === "visual" && turn.data.visualType === "image") {
          this.addVisualImage(turn.data);
        }
      });
      this.core.scrollToBottom();
    } else {
      console.error("Message container not found");
    }
  }

  // User clicks back to start button

  async jumpToStart() {
    console.log("MainChatbot jumpToStart called");
    try {
      const response = await this.core.gadgetInteract({
        userID: this.core.userID,
        userAction: {
          type: "intent",
          payload: {
            intent: {
              name: "Main menu",
            },
          },
        },
      });
      await this.handleAgentResponse(response);
    } catch (error) {
      console.error("Error in main chatbot jump to start:", error);
    }
  }

  /// < Redirect Custom Action > //

  handleProductRedirect(productHandle) {
    if (!productHandle) {
      console.error("Cannot redirect: Product handle is undefined or empty");
      return;
    }

    const baseUrl = "https://www.sherpapower.co.uk/products/";
    const productUrl = `${baseUrl}${encodeURIComponent(productHandle)}`;
    console.log(`Redirecting to product page: ${productUrl}`);
    window.location.href = productUrl;
  }

  async handleAgentResponse(response) {
    console.log("Handling agent response:", response);
    for (const trace of response) {
      if (trace.type === "RedirectToProduct") {
        const productHandle = trace.payload?.body?.productHandle;
        if (productHandle) {
          this.handleProductRedirect(productHandle);
          return;
        }
      } else if (trace.type === "text") {
        this.core.addMessage("assistant", trace.payload.message);
        this.conversationHistory.push({
          type: "assistant",
          message: trace.payload.message,
        });
      } else if (trace.type === "choice") {
        this.core.addButtons(trace.payload.buttons);
        this.conversationHistory.push({
          type: "choice",
          buttons: trace.payload.buttons,
        });
      } else if (trace.type === "carousel") {
        this.addCarousel(trace.payload);
        this.conversationHistory.push({
          type: "carousel",
          data: trace.payload,
        });
      } else if (
        trace.type === "visual" &&
        trace.payload.visualType === "image"
      ) {
        this.addVisualImage(trace.payload);
        this.conversationHistory.push({
          type: "visual",
          data: trace.payload,
        });
      } else {
        console.log("Unknown trace type:", trace.type);
      }
    }
    this.saveConversationToStorage();
    this.core.scrollToBottom();
  }

  addVisualImage(payload) {
    console.log("Adding visual image:", payload);
    const messageContainer = this.element.querySelector("#messageContainer");
    if (messageContainer) {
      const imageWrapper = document.createElement("div");
      imageWrapper.classList.add(
        "message-wrapper",
        "message-wrapper--assistant"
      );

      const imageElement = document.createElement("img");
      imageElement.src = payload.image;
      imageElement.alt = "Visual content";
      imageElement.classList.add("chat-image");

      // Set dimensions if available
      if (payload.dimensions) {
        imageElement.width = payload.dimensions.width;
        imageElement.height = payload.dimensions.height;
      }

      // Add loading and error handling
      imageElement.loading = "lazy";
      imageElement.onerror = () => {
        console.error("Failed to load image:", payload.image);
        imageElement.alt = "Failed to load image";
      };

      imageWrapper.appendChild(imageElement);
      messageContainer.appendChild(imageWrapper);
    } else {
      console.error("Message container not found when adding visual image");
    }
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

    carouselData.cards.forEach((card, index) => {
      const itemContent = `
        <div class="carousel__item-wrapper">
          <div class="carousel__item-content">
            <img src="${card.imageUrl}" alt="${card.title}" class="carousel__item-image">
            <h6 class="carousel__item-title">${card.title}</h6>
            <p class="carousel__item-description">${card.description.text}</p>
            <button class="button carousel__item-button" data-button-index="${index}">${card.buttons[0].name}</button>
          </div>
        </div>
      `;

      carousel.addItem(itemContent);
    });

    const buttons = carouselElement.querySelectorAll(".carousel__item-button");
    buttons.forEach((button, index) => {
      button.addEventListener("click", async () => {
        const cardIndex = Math.floor(
          index / carouselData.cards[0].buttons.length
        );
        const buttonIndex = index % carouselData.cards[0].buttons.length;
        const buttonData = carouselData.cards[cardIndex].buttons[buttonIndex];
        try {
          // Remove the carousel element
          carouselElement.remove();

          // Save button click as a message
          this.conversationHistory.push({
            type: "user",
            message: buttonData.name,
          });
          this.saveConversationToStorage();

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

    this.mediaQuery = window.matchMedia("(min-width: 1000px)");
    this.isDesktop = this.mediaQuery.matches;

    this.leftButton.addEventListener("click", () => this.move("left"));
    this.rightButton.addEventListener("click", () => this.move("right"));

    this.mediaQuery.addListener(this.handleMediaQueryChange.bind(this));
  }

  handleMediaQueryChange(e) {
    this.isDesktop = e.matches;
    this.currentIndex = 0;
    this.updatePosition();
    this.updateVisibility();
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
    const itemsPerSlide = this.isDesktop ? 2 : 1;
    if (direction === "left") {
      this.currentIndex = Math.max(0, this.currentIndex - itemsPerSlide);
    } else {
      this.currentIndex = Math.min(
        this.items.length - itemsPerSlide,
        this.currentIndex + itemsPerSlide
      );
    }
    this.updatePosition();
    this.updateVisibility();
  }

  updatePosition() {
    const itemsPerSlide = this.isDesktop ? 2 : 1;
    const offset = -(this.currentIndex / itemsPerSlide) * 100;
    this.container.style.transform = `translateX(${offset}%)`;
  }

  updateVisibility() {
    const itemsPerSlide = this.isDesktop ? 2 : 1;
    this.leftButton.style.display = this.currentIndex === 0 ? "none" : "flex";
    this.rightButton.style.display =
      this.currentIndex >= this.items.length - itemsPerSlide ? "none" : "flex";
  }
}

console.log("MainChatbot module loaded");

export default MainChatbot;
