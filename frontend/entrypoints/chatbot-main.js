// chatbot-main.js

import { ChatbotCore } from "./chatbot-core-file.js";

console.log("MainChatbot module loading");

class MainChatbot {
  constructor(element, config) {
    console.log("MainChatbot constructor called with config:", config);
    this.element = element;
    this.voiceflowEndpoint = config.voiceflowEndpoint;

    this.core = new ChatbotCore({
      proxyEndpoint: "/POST-voiceflow-stream", // Gadget's streaming endpoint
      projectID: "YOUR_VOICEFLOW_PROJECT_ID",
      environment: "development",
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
          // The response will be handled via event listeners
        } catch (error) {
          console.error("Error handling button click:", error);
        }
      }
    });

    const jumpToMainButton = this.element.querySelector(".back-to-start");
    if (jumpToMainButton) {
      jumpToMainButton.addEventListener("click", () => this.jumpToMainMenu());
    } else {
      console.error("Jump to start button not found");
    }

    this.core.on("message", this.handleMessage.bind(this));
    this.core.on("typing", this.handleTyping.bind(this));
    this.core.on("updateMessage", this.handleUpdateMessage.bind(this));
    this.core.on("error", this.handleError.bind(this));

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

    try {
      await this.core.handleStreaming({
        action: {
          type: "launch",
        },
        config: {
          completion_events: true,
        },
      });
    } catch (error) {
      console.error("Error in main chatbot send launch:", error);
      this.core.addMessage(
        "assistant",
        "Failed to initialize the chatbot. Please try again later."
      );
    }
  }

  async handleUserMessage(message) {
    this.core.addMessage("user", message);
    this.conversationHistory.push({ type: "user", message: message });
    this.saveConversationToStorage();

    this.core.showTypingIndicator();
    try {
      await this.core.sendMessage(message);
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
            this.core.addCarousel(turn.data);
          }
        } else if (turn.type === "visual" && turn.data.visualType === "image") {
          this.core.addVisualImage(turn.data);
        }
      });
      this.core.scrollToBottom();
    } else {
      console.error("Message container not found");
    }
  }

  async jumpToMainMenu() {
    console.log("MainChatbot jumpToMainMenu called");

    this.core.showTypingIndicator();
    try {
      // Send the main_menu event to Voiceflow via Gadget
      await this.core.handleStreaming({
        action: {
          type: "event",
          payload: {
            event: {
              name: "main_menu",
            },
          },
        },
        config: {
          completion_events: true,
        },
      });
    } catch (error) {
      console.error("Error in jumpToMainMenu:", error);
      this.core.addMessage(
        "assistant",
        "Sorry, I couldn't navigate to the main menu. Please try again."
      );
    } finally {
      this.core.hideTypingIndicator();
      this.core.scrollToBottom();
    }
  }

  handleMessage({ sender, content }) {
    this.core.addMessage(sender, content);
  }

  handleTyping(isTyping) {
    if (isTyping) {
      this.core.showTypingIndicator();
    } else {
      this.core.hideTypingIndicator();
    }
  }

  handleUpdateMessage(content) {
    this.core.updateLatestMessage(content);
  }

  handleError(message) {
    this.core.addMessage("assistant", message);
  }

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

  // Additional methods like addCarousel, addVisualImage can be inherited from ChatbotCore or implemented here
}

export default MainChatbot;
