// chatbot-main.js

import { ChatbotBase } from "./chatbot-base";
import { HistoryHandler } from "./chatbot-history";

export class MainChatbot extends ChatbotBase {
  constructor(element, config) {
    console.log("MainChatbot constructor called with config:", config);
    super(config);

    this.element = element;
    this.history = new HistoryHandler();

    this.initializeElements();
    this.setupEventListeners();

    // Launch the chatbot after initialization
    this.launchChatbot();
  }

  async launchChatbot() {
    try {
      await this.api.launch();
    } catch (error) {
      console.error("Error launching chatbot:", error);
      this.ui.addMessage(
        "assistant",
        "Sorry, there was an error initializing the chatbot. Please refresh the page."
      );
    }
  }

  initializeElements() {
    this.messageContainer = this.element.querySelector(".message-container");
    this.typingIndicator = this.element.querySelector(".typing-indicator");
    this.drawerBody = this.element.querySelector(".drawer-body");
    this.chatInput = this.element.querySelector(".chat-input");
    this.sendButton = this.element.querySelector(".send-button");
    this.backToStartButton = this.element.querySelector(
      ".back-to-start-button"
    );

    this.setDOMElements(
      this.messageContainer,
      this.typingIndicator,
      this.drawerBody
    );
  }

  setupEventListeners() {
    if (this.chatInput && this.sendButton) {
      // Find the form element
      const form = this.chatInput.closest("form");
      if (form) {
        // Prevent form submission and handle input
        form.addEventListener("submit", async (e) => {
          e.preventDefault();
          e.stopPropagation();
          await this.handleUserInput();
          return false;
        });
      }

      // Handle Enter key press
      this.chatInput.addEventListener("keypress", async (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          event.stopPropagation();
          await this.handleUserInput();
        }
      });

      // Handle send button click
      this.sendButton.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await this.handleUserInput();
      });
    }

    if (this.backToStartButton) {
      this.backToStartButton.addEventListener("click", () => {
        this.jumpToMainMenu();
      });
    }

    if (this.messageContainer) {
      this.messageContainer.addEventListener("click", async (event) => {
        const button = event.target.closest(".chat-button");
        if (button) {
          const buttonData = JSON.parse(button.dataset.buttonData);
          await this.handleButtonClick(buttonData);
        }
      });
    }
  }

  async handleUserInput() {
    const message = this.chatInput.value.trim();
    if (message) {
      this.chatInput.value = "";
      this.chatInput.disabled = true;

      try {
        this.ui.addMessage("user", message);
        this.history.updateHistory({ type: "user", message });
        await this.sendMessage(message);
      } catch (error) {
        console.error("Error sending message:", error);
        this.ui.addMessage(
          "assistant",
          "Sorry, there was an error sending your message. Please try again."
        );
      } finally {
        this.chatInput.disabled = false;
        this.chatInput.focus();
      }
    }
  }

  async handleSpecialTrace(trace) {
    console.log("Main chatbot handling special trace:", trace);

    switch (trace.type) {
      case "text":
        if (trace.payload?.message) {
          this.history.updateHistory({
            type: "assistant",
            message: trace.payload.message,
          });
        }
        break;

      case "choice":
        if (trace.payload?.buttons) {
          this.history.updateHistory({
            type: "choice",
            buttons: trace.payload.buttons,
          });
        }
        break;

      case "carousel":
        if (trace.payload) {
          this.history.updateHistory({
            type: "carousel",
            data: trace.payload,
          });
        }
        break;

      case "visual":
        if (trace.payload?.visualType === "image") {
          this.history.updateHistory({
            type: "visual",
            data: trace.payload,
          });
        }
        break;

      case "RedirectToProduct":
        const productHandle = trace.payload?.body?.productHandle;
        if (productHandle) {
          this.handleProductRedirect(productHandle);
        }
        break;
    }
  }

  async jumpToMainMenu() {
    console.log("MainChatbot jumpToMainMenu called");
    this.history.clearHistory();
    this.messageContainer.innerHTML = "";
    await this.sendMessage("start");
  }

  handleProductRedirect(productHandle) {
    if (productHandle) {
      window.location.href = `/products/${productHandle}`;
    }
  }

  displaySavedConversation() {
    const history = this.history.getHistory();
    history.forEach((entry) => {
      switch (entry.type) {
        case "user":
        case "assistant":
          this.ui.addMessage(entry.type, entry.message);
          break;
        case "choice":
          this.ui.addButtons(entry.buttons);
          break;
        case "carousel":
          this.ui.addCarousel(entry.data);
          break;
        case "visual":
          this.ui.addVisualImage(entry.data);
          break;
      }
    });
  }
}

console.log("MainChatbot module loaded");
