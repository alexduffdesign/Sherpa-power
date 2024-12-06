console.log("WOLLLOPPPP");

import { ApiClient } from "./chatbot-api.js";
import { UIManager } from "./chatbot-ui.js";
import { StreamHandler } from "./chatbot-stream.js";
import { TraceHandler } from "./chatbot-trace.js";
import { HistoryHandler } from "./chatbot-history.js";

export class ChatbotBase {
  constructor(config) {
    console.log("ChatbotBase constructor called with config:", config);

    // Save the config with defaults
    this.config = {
      isSection: false, // Default to false for main chatbot
      ...config,
    };

    this.storagePrefix = this.config.isSection ? "section_" : "main_";

    this.ui = new UIManager();
    this.history = new HistoryHandler(this.storagePrefix);

    this.api = new ApiClient({
      apiEndpoint: this.config.apiEndpoint,
      userIDPrefix: this.config.userIDPrefix,
      completionEvents: this.config.completionEvents || false,
    });

    this.stream = new StreamHandler();
    this.traceHandler = new TraceHandler(
      this.ui,
      this.history,
      this.handleSpecialTrace.bind(this)
    );

    // Set up button click handler
    this.ui.setButtonClickHandler(this.handleButtonClick.bind(this));

    // Bind methods
    this.sendMessage = this.sendMessage.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);

    if (this.history.hasHistory()) {
      this.history.loadFromStorage();
    }
  }

  setDOMElements(messageContainer, typingIndicator, drawerBody, element) {
    console.log("Setting DOM elements in ChatbotBase");
    this.ui.setDOMElements(
      messageContainer,
      typingIndicator,
      drawerBody,
      element
    );
  }

  async initializeChatIfNeeded() {
    if (this.isSectionChatbot()) {
      // For section chatbots, do nothing - initialization handled by section component
      return;
    }

    // Only main chatbot uses history
    if (!this.history.hasHistory()) {
      console.log("No chat history found, sending launch request...");
      await this.sendLaunch("", "{}");
      this.history.hasLaunched = true;
      localStorage.setItem(`${this.storagePrefix}chatHasLaunched`, "true");
    } else {
      console.log("Chat history found, displaying saved conversation...");
      this.displaySavedConversation();
    }
  }

  isSectionChatbot() {
    // Logic to determine if this is the section chatbot
    return (
      this.config.isSection ||
      this.element.classList.contains("section-chatbot")
    );
  }

  displaySavedConversation() {
    const conversation = this.history.getHistory();
    if (!conversation || conversation.length === 0) return;

    this.ui.messageContainer.innerHTML = "";

    // First pass: display all messages
    for (let turn of conversation) {
      if (turn.type === "user" || turn.type === "assistant") {
        this.ui.addMessage(turn.type, turn.message);
      }
    }

    // Second pass: only show buttons/carousel if they were the last interaction
    const lastTurn = conversation[conversation.length - 1];
    if (lastTurn) {
      switch (lastTurn.type) {
        case "choice":
          this.ui.addButtons(lastTurn.buttons);
          break;
        case "carousel":
          this.ui.addCarousel({ cards: lastTurn.cards }); // Wrap cards in proper structure
          break;
      }
    }

    this.ui.scrollToBottom();
  }

  async sendLaunch(startBlock = "", productDetails = "{}") {
    console.log("Sending launch request with:", { startBlock, productDetails });
    const response = await this.api.streamInteract({
      type: "launch",
      payload: {
        startBlock,
        powerStationDetails: productDetails,
      },
    });
    return response;
  }

  async sendMessage(message) {
    // Only update history for main chatbot
    if (!this.isSectionChatbot()) {
      this.history.updateHistory({
        type: "user",
        message: message,
      });
    }

    this.ui.addMessage("user", message);
    return this.api.sendUserMessage(message);
  }

  async handleButtonClick(buttonData) {
    // Only update history for main chatbot
    if (!this.isSectionChatbot()) {
      this.history.updateHistory({
        type: "user",
        message: buttonData.name,
      });
    }

    this.ui.addMessage("user", buttonData.name);
    return this.api.streamInteract(buttonData.request);
  }

  async handleSpecialTrace(trace) {
    if (trace.type === "RedirectToProduct") {
      const productHandle = trace.productHandle;
      if (productHandle) {
        const baseUrl = "https://www.sherpapower.co.uk/products/";
        const productUrl = `${baseUrl}${encodeURIComponent(productHandle)}`;
        console.log(`Redirecting to product page: ${productUrl}`);
        window.location.href = productUrl;
      }
    }
  }

  async jumpToMainMenu() {
    console.log("MainChatbot jumpToMainMenu called");
    this.ui.showTypingIndicator("Returning to main menu...");
    try {
      // Don't add this to chat history since it's a UI action
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

  updateHistory(item) {
    // Only store history for main chatbot
    if (!this.isSectionChatbot()) {
      this.history.updateHistory(item);
    }
  }
}
