console.log("WOLLLOPPPP 2");

import { ChatbotBase } from "./chatbot-base.js";

export class MainChatbot extends ChatbotBase {
  constructor(element, config) {
    console.log("MainChatbot constructor called with config:", config);
    super(config);

    this.element = element;

    this.initializeElements();
    this.setupEventListeners();

    // Initialize chat (launch if no history, or display history if exists)
    this.initializeChatIfNeeded();
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
        console.log("Form found:", form);
        form.addEventListener("submit", async (e) => {
          e.preventDefault();
          e.stopPropagation();
          await this.handleUserInput();
        });
      }

      this.chatInput.addEventListener("keypress", async (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          event.stopPropagation();
          await this.handleUserInput();
        }
      });

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

    // Call the parent implementation first
    await super.handleSpecialTrace(trace);

    // Add any additional special handling for the main chatbot here if needed.
    // The TraceHandler and ChatbotBase already handle normal text, choice, carousel, and visual traces,
    // as well as the RedirectToProduct trace.
  }

  async jumpToMainMenu() {
    console.log("MainChatbot jumpToMainMenu called");
    // Clear history and UI if you want a fresh start
    this.history.clearHistory();
    if (this.messageContainer) {
      this.messageContainer.innerHTML = "";
    }
    // Send the main_menu event to start over
    await super.jumpToMainMenu();
  }
}

console.log("MainChatbot module loaded");
