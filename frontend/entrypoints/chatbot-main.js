console.log("WOLLLOPPPP 2");

import { ChatbotBase } from "./chatbot-base.js";

// Only define if not already defined
if (!customElements.get("main-chatbot")) {
  class MainChatbotElement extends HTMLElement {
    constructor() {
      super();
      console.log("MainChatbotElement constructor called");

      // Extract config from attributes
      const apiEndpoint =
        this.getAttribute("api-endpoint") ||
        "https://chatbottings--development.gadget.app/voiceflowAPI/voiceflow-new";
      const config = {
        apiEndpoint: apiEndpoint,
        userIDPrefix: "mainChatbot",
        isSection: false,
      };

      // Create chatbot base instance and store element reference
      this.chatbotBase = new ChatbotBase(config);
      this.chatbotBase.element = this;
    }

    connectedCallback() {
      console.log("MainChatbotElement connected");
      this.initialize();
    }

    initialize() {
      if (!this.initialized) {
        console.log("Initializing MainChatbotElement");
        this.initializeElements();
        this.setupEventListeners();
        this.chatbotBase.initializeChatIfNeeded();
        this.initialized = true;
      }
    }

    initializeElements() {
      console.log("Initializing elements for MainChatbot");

      // Find the drawer container
      const drawer = this.closest(".drawer.sherpa-guide");
      if (!drawer) {
        console.error("Could not find drawer container");
        return;
      }

      // Find elements within the drawer context
      this.backToStartButton = drawer.querySelector(".back-to-start");
      console.log("Back to start button found:", this.backToStartButton);

      this.messageContainer = this.querySelector(".message-container");
      this.typingIndicator = this.querySelector(".chat-typing");
      this.drawerBody = drawer.querySelector(".drawer-body") || drawer;
      this.chatInput = this.querySelector("#userInput");
      this.chatForm = this.querySelector("#chatForm");
      this.sendButton = this.querySelector("button[type='submit']");

      if (!this.chatForm || !this.chatInput || !this.sendButton) {
        console.error("Required chat elements not found:", {
          form: this.chatForm,
          input: this.chatInput,
          button: this.sendButton,
        });
        return;
      }

      console.log("Chat elements found:", {
        form: this.chatForm,
        input: this.chatInput,
        button: this.sendButton,
        backToStart: this.backToStartButton,
      });

      // Set DOM elements on the chatbotBase instance
      this.chatbotBase.setDOMElements(
        this.messageContainer,
        this.typingIndicator,
        this.drawerBody
      );
    }

    setupEventListeners() {
      if (this.eventListenersAttached) return;

      if (this.chatInput && this.sendButton) {
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
        console.log("Setting up back-to-start button click listener");
        this.backToStartButton.addEventListener("click", () => {
          console.log("Main menu button clicked!");
          this.jumpToMainMenu();
        });
      } else {
        console.warn("Back to start button not found - will try again later");
        setTimeout(() => {
          const button = this.querySelector(".back-to-start");
          if (button) {
            console.log("Found back-to-start button after delay");
            button.addEventListener("click", () => {
              console.log("Main menu button clicked!");
              this.jumpToMainMenu();
            });
          } else {
            console.error("Back to start button still not found after delay");
          }
        }, 1000);
      }

      if (this.messageContainer) {
        this.messageContainer.addEventListener("click", async (event) => {
          const button = event.target.closest(".chat-button");
          if (button) {
            const buttonData = JSON.parse(button.dataset.buttonData);
            await this.chatbotBase.handleButtonClick(buttonData);
          }
        });
      }

      this.eventListenersAttached = true;
    }

    async handleUserInput() {
      const message = this.chatInput.value.trim();
      if (message) {
        this.chatInput.value = "";
        this.chatInput.disabled = true;

        try {
          await this.chatbotBase.sendMessage(message);
        } catch (error) {
          console.error("Error sending message:", error);
          this.chatbotBase.ui.addMessage(
            "assistant",
            "Sorry, there was an error sending your message. Please try again."
          );
        } finally {
          this.chatInput.disabled = false;
          this.chatInput.focus();
        }
      }
    }

    async jumpToMainMenu() {
      console.log("MainChatbotElement jumpToMainMenu called");

      // Add a user message to the UI
      const userMessage = "Main Menu";
      this.chatbotBase.ui.addMessage("user", userMessage);

      // Update the conversation history
      this.chatbotBase.history.updateHistory({
        type: "user",
        message: userMessage,
      });

      try {
        this.chatbotBase.ui.showTypingIndicator("Returning to main menu...");

        const response = await this.chatbotBase.api.streamInteract({
          type: "event",
          payload: {
            event: {
              name: "main_menu",
            },
          },
        });

        console.log("Main menu response received:", response);
        await this.chatbotBase.stream.handleStream(
          response,
          this.chatbotBase.traceHandler
        );
        console.log("Finished processing main menu stream");
      } catch (error) {
        console.error("Error in jumpToMainMenu:", error);
        this.chatbotBase.ui.addMessage(
          "assistant",
          "Sorry, I couldn't navigate to the main menu. Please try again."
        );
      } finally {
        this.chatbotBase.ui.hideTypingIndicator();
        this.chatbotBase.ui.scrollToBottom();
      }
    }
  }

  // Register the custom element
  customElements.define("main-chatbot", MainChatbotElement);
}

// Export for use in other modules
export { MainChatbotElement };
