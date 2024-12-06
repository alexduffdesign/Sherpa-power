// In MainChatbot class:
export class MainChatbot extends ChatbotBase {
  constructor(element, config) {
    console.log("MainChatbot constructor called with config:", config);
    super(config);

    this.element = element;

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.initialize());
    } else {
      this.initialize();
    }
  }

  initialize() {
    console.log("Initializing MainChatbot");
    this.initializeElements();
    this.setupEventListeners();
    this.initializeChatIfNeeded();
  }

  initializeElements() {
    console.log("Initializing elements for MainChatbot");

    this.backToStartButton = document.querySelector(".back-to-start");
    console.log("Back to start button found:", this.backToStartButton);

    this.messageContainer = this.element.querySelector(".message-container");
    this.typingIndicator = this.element.querySelector(".chat-typing");
    this.drawerBody = this.element.querySelector(".drawer-body");
    this.chatInput = this.element.querySelector("#userInput");
    this.chatForm = this.element.querySelector("#chatForm");
    this.sendButton = this.element.querySelector("button[type='submit']");

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

    this.setDOMElements(
      this.messageContainer,
      this.typingIndicator,
      this.drawerBody
    );
  }

  setupEventListeners() {
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
        // Trigger the main_menu event in Voiceflow without clearing history
        this.jumpToMainMenu();
      });
    } else {
      console.warn("Back to start button not found - will try again later");
      setTimeout(() => {
        const button = document.querySelector(".back-to-start");
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

  // Modified jumpToMainMenu: No clearing of history or UI
  async jumpToMainMenu() {
    console.log("MainChatbot jumpToMainMenu called");
    // Do not clear history or UI here. Simply send the "main_menu" event to Voiceflow.
    try {
      this.ui.showTypingIndicator("Returning to main menu...");
      const response = await this.api.streamInteract({
        action: {
          type: "event",
          payload: {
            event: {
              name: "main_menu",
            },
          },
        },
      });

      console.log("Main menu response received:", response);
      await this.stream.handleStream(response, this.traceHandler);
      console.log("Finished processing main menu stream");
    } catch (error) {
      console.error("Error in jumpToMainMenu:", error);
      this.ui.addMessage(
        "assistant",
        "Sorry, I couldn't navigate to the main menu. Please try again."
      );
    } finally {
      this.ui.hideTypingIndicator();
      this.ui.scrollToBottom();
    }
  }

  async handleSpecialTrace(trace) {
    console.log("Main chatbot handling special trace:", trace);
    await super.handleSpecialTrace(trace);
    // Additional special handling can go here if needed.
  }
}
