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

    this.ui = new UIManager();
    this.history = new HistoryHandler();

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

  setDOMElements(messageContainer, typingIndicator, drawerBody) {
    this.ui.setDOMElements(messageContainer, typingIndicator, drawerBody);
  }

  async initializeChatIfNeeded() {
    let startBlock = "";
    let productDetails = "{}";

    if (this.isSectionChatbot()) {
      startBlock = "shopifySection";
      productDetails = this.getProductDetails();
    }

    if (!this.history.hasHistory()) {
      console.log("No chat history found, sending launch request...");
      await this.sendLaunch(startBlock, productDetails);
      this.history.hasLaunched = true;
      localStorage.setItem("chatHasLaunched", "true");
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

  getProductDetails() {
    // Logic to retrieve product details specific to section chatbot
    return "{}"; // Placeholder for actual implementation
  }

  displaySavedConversation() {
    const conversation = this.history.getHistory();
    if (!conversation || conversation.length === 0) return;
    this.ui.messageContainer.innerHTML = "";
    for (let turn of conversation) {
      switch (turn.type) {
        case "user":
          this.ui.addMessage("user", turn.message);
          break;
        case "assistant":
          this.ui.addMessage("assistant", turn.message);
          break;
        case "choice":
          this.ui.addButtons(turn.buttons);
          break;
        case "carousel":
          this.ui.addCarousel(turn.data);
          break;
        case "visual":
          this.ui.addVisualImage(turn.data);
          break;
        default:
          console.log("Unknown turn type in history:", turn.type);
      }
    }
    this.ui.scrollToBottom();
  }

  async sendLaunch(startBlock, productDetails) {
    this.ui.showTypingIndicator("Launching chat...");
    try {
      const response = await this.api.launch(startBlock, productDetails);
      await this.stream.handleStream(response, this.traceHandler);
      this.ui.hideTypingIndicator();
    } catch (error) {
      console.error("Error during chat launch:", error);
      this.ui.hideTypingIndicator();
      this.ui.addMessage(
        "assistant",
        "I encountered an error launching the conversation. Please try again."
      );
    }
  }

  async sendMessage(message) {
    this.ui.addMessage("user", message);
    this.history.updateHistory({ type: "user", message: message });

    this.ui.showTypingIndicator();
    try {
      this.stream.closeCurrentStream();
      const response = await this.api.sendUserMessage(message);
      await this.stream.handleStream(response, this.traceHandler);
    } catch (error) {
      console.error("Error in send message:", error);
      this.ui.addMessage(
        "assistant",
        "I apologize, but I encountered an error. Please try again."
      );
    } finally {
      this.ui.hideTypingIndicator();
      this.ui.scrollToBottom();
    }
  }

  async handleButtonClick(buttonData) {
    console.log("Handling button click:", buttonData);
    this.ui.removeButtons();

    this.ui.showTypingIndicator();
    try {
      this.stream.closeCurrentStream();

      // Send the button's request data directly to Voiceflow
      // The request object from the button already contains the correct format
      const response = await this.api.streamInteract(buttonData.request);

      // Add the button text as a user message
      this.ui.addMessage("user", buttonData.name);
      this.history.updateHistory({ type: "user", message: buttonData.name });

      // Handle the response
      await this.stream.handleStream(response, this.traceHandler);
    } catch (error) {
      console.error("Error in button click:", error);
      this.ui.addMessage(
        "assistant",
        "I apologize, but I encountered an error. Please try again."
      );
    } finally {
      this.ui.hideTypingIndicator();
      this.ui.scrollToBottom();
    }
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
    console.log("Jumping to main menu event");
    this.ui.showTypingIndicator("Returning to main menu...");
    try {
      const response = await this.api.sendEvent("main_menu");
      await this.stream.handleStream(response, this.traceHandler);
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
}
