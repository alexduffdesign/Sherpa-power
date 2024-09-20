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
    } else {
      this.initializeChat();
    }
  }

  /**
   * Initializes and sets the required DOM elements for the chatbot.
   */
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
      console.error("MainChatbot: Required DOM elements not found");
      return;
    }

    this.core.setDOMElements(messageContainer, typingIndicator, drawerBody);
    console.log("MainChatbot: DOM elements set in ChatbotCore:", this.core);
  }

  /**
   * Sets up event listeners for form submission and button clicks.
   */
  setupEventListeners() {
    if (this.eventListenersAttached) return;

    console.log("MainChatbot setupEventListeners called");
    const form = this.element.querySelector("#chatForm");
    const input = this.element.querySelector("#userInput");

    if (!form || !input) {
      console.error("MainChatbot: Chat form or input not found");
      return;
    }

    // Handle form submission (user sends a message)
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const message = input.value.trim();
      if (message) {
        console.log("MainChatbot: Form submitted with message:", message);
        input.value = ""; // Clear the input field immediately
        await this.handleUserMessage(message);
      }
    });

    // Handle button clicks within the chat (e.g., choices, carousel buttons)
    this.element.addEventListener("click", async (e) => {
      if (
        e.target.matches(".button-container button") ||
        e.target.matches(".carousel__item-button")
      ) {
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
          console.error("MainChatbot: Error handling button click:", error);
        }
      }
    });

    // Handle "Back to Start" or "Main Menu" button clicks
    const jumpToMainButton = this.element.querySelector(".back-to-start");
    if (jumpToMainButton) {
      jumpToMainButton.addEventListener("click", () => this.jumpToMainMenu());
    } else {
      console.error("MainChatbot: Jump to start button not found");
    }

    this.eventListenersAttached = true;
  }

  /**
   * Initializes the chat by sending a launch request if it's the first time.
   */
  async initializeChat() {
    console.log("MainChatbot: Initializing chat");
    if (!this.hasLaunched) {
      try {
        console.log("MainChatbot: Initializing chat for the first time");
        const response = await this.core.sendLaunch();
        await this.handleAgentResponse(response);
        this.hasLaunched = true;
        localStorage.setItem("chatHasLaunched", "true");
      } catch (error) {
        console.error("MainChatbot: Error during chat initialization:", error);
      }
    }
    this.core.scrollToBottom();
    console.log("MainChatbot: Chat initialized");
  }

  /**
   * Handles sending a user message and processing the response.
   * @param {string} message - The user's message.
   */
  async handleUserMessage(message) {
    this.core.addMessage("user", message);
    this.conversationHistory.push({ type: "user", message: message });
    this.saveConversationToStorage();

    try {
      const response = await this.core.sendMessage(message);
      console.log("MainChatbot: Response from sendMessage:", response);
      await this.handleAgentResponse(response);
    } catch (error) {
      console.error("MainChatbot: Error in send message:", error);
    } finally {
      this.core.scrollToBottom();
    }
  }

  /**
   * Loads the conversation history from local storage.
   */
  loadConversationFromStorage() {
    const savedConversation = localStorage.getItem("chatConversation");
    this.conversationHistory = savedConversation
      ? JSON.parse(savedConversation)
      : [];
    console.log(
      "MainChatbot: Loaded conversation from storage:",
      this.conversationHistory
    );
  }

  /**
   * Saves the current conversation history to local storage.
   */
  saveConversationToStorage() {
    localStorage.setItem(
      "chatConversation",
      JSON.stringify(this.conversationHistory)
    );
    console.log("MainChatbot: Saved conversation to storage");
  }

  /**
   * Displays the saved conversation in the chat interface.
   */
  displaySavedConversation() {
    console.log("MainChatbot: Displaying saved conversation");
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
      console.error("MainChatbot: Message container not found");
    }
  }

  /**
   * Handles navigating back to the main menu.
   */
  async jumpToMainMenu() {
    console.log("MainChatbot: jumpToMainMenu called");
    const mainMenuMessage = "Main menu"; // The message content to trigger the intent

    // Add the "Main menu" message to the UI
    this.core.addMessage("user", mainMenuMessage);

    // Update the conversation history
    this.conversationHistory.push({
      type: "user",
      message: mainMenuMessage,
    });
    this.saveConversationToStorage();

    try {
      // Send the message to Voiceflow
      const response = await this.core.gadgetInteract({
        userID: this.core.userID,
        userAction: {
          type: "text",
          payload: mainMenuMessage, // Directly set payload to the string "Main menu"
        },
      });

      // Handle the response from Voiceflow
      await this.handleAgentResponse(response);
    } catch (error) {
      console.error("MainChatbot: Error in jumpToMainMenu:", error);
      // Optionally, notify the user about the error
      this.core.addMessage(
        "assistant",
        "Sorry, I couldn't navigate to the main menu. Please try again."
      );
    }
  }

  /**
   * Handles the response traces from Voiceflow and updates the chat interface accordingly.
   * @param {Array} response - The array of response traces.
   */
  async handleAgentResponse(response) {
    console.log("MainChatbot: Handling agent response:", response);
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
        console.log("MainChatbot: Unknown trace type:", trace.type);
      }
    }
    this.saveConversationToStorage();
    this.core.scrollToBottom();
  }

  /**
   * Handles redirection to a product page.
   * @param {string} productHandle - The handle of the product to redirect to.
   */
  handleProductRedirect(productHandle) {
    if (!productHandle) {
      console.error(
        "MainChatbot: Cannot redirect - Product handle is undefined or empty"
      );
      return;
    }

    const baseUrl = "https://www.sherpapower.co.uk/products/";
    const productUrl = `${baseUrl}${encodeURIComponent(productHandle)}`;
    console.log(`MainChatbot: Redirecting to product page: ${productUrl}`);
    window.location.href = productUrl;
  }

  /**
   * Adds a visual image to the chat interface.
   * @param {Object} payload - The payload containing image data.
   */
  addVisualImage(payload) {
    console.log("MainChatbot: Adding visual image:", payload);
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
        console.error("MainChatbot: Failed to load image:", payload.image);
        imageElement.alt = "Failed to load image";
      };

      imageWrapper.appendChild(imageElement);
      messageContainer.appendChild(imageWrapper);
      this.core.scrollToBottom();
    } else {
      console.error(
        "MainChatbot: Message container not found when adding visual image"
      );
    }
  }

  /**
   * Adds a carousel to the chat interface.
   * @param {Object} carouselData - The data for the carousel.
   */
  addCarousel(carouselData) {
    console.log("MainChatbot: Adding carousel:", carouselData);
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
            <img src="${card.imageUrl}" alt="${
        card.title
      }" class="carousel__item-image">
            <h6 class="carousel__item-title">${card.title}</h6>
            <p class="carousel__item-description">${card.description.text}</p>
            <button class="button carousel__item-button" data-button-data='${JSON.stringify(
              card.buttons[0]
            )}'>${card.buttons[0].name}</button>
          </div>
        </div>
      `;

      carousel.addItem(itemContent);
    });

    const buttons = carouselElement.querySelectorAll(".carousel__item-button");
    buttons.forEach((button, index) => {
      button.addEventListener("click", async () => {
        const buttonData = JSON.parse(button.dataset.buttonData);
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
          console.error(
            "MainChatbot: Error handling carousel button click:",
            error
          );
        }
      });
    });

    const messageContainer = this.element.querySelector("#messageContainer");
    if (messageContainer) {
      messageContainer.appendChild(carouselElement);
      this.core.scrollToBottom();
    } else {
      console.error(
        "MainChatbot: Message container not found when adding carousel"
      );
    }
  }
}

/**
 * Carousel class to handle carousel functionalities.
 * Note: Ensure that this class does not interfere with the typing indicator.
 */
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
