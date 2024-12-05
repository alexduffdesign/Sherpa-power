import { ApiClient } from "./chatbot-api";
import { UIManager } from "./chatbot-ui";
import { StreamHandler } from "./chatbot-stream";
import { TraceHandler } from "./chatbot-trace";

export class ChatbotBase {
  constructor(config) {
    console.log("ChatbotBase constructor called with config:", config);

    // Initialize core components
    this.api = new ApiClient(config);
    this.ui = new UIManager();
    this.stream = new StreamHandler();
    this.traceHandler = new TraceHandler(this.ui);

    // Set up trace handling
    this.traceHandler.onSpecialTrace = this.handleSpecialTrace.bind(this);

    // Bind methods
    this.sendMessage = this.sendMessage.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  setDOMElements(messageContainer, typingIndicator, drawerBody) {
    this.ui.setDOMElements(messageContainer, typingIndicator, drawerBody);
  }

  async sendMessage(message) {
    console.log("Sending message:", message);

    try {
      // Close any existing stream
      this.stream.closeCurrentStream();

      // Show typing indicator before starting stream
      this.ui.showTypingIndicator();

      // Start new stream
      const response = await this.api.streamInteract(message);
      const result = await this.stream.handleStream(
        response,
        this.traceHandler
      );

      // Hide typing indicator after stream completes
      this.ui.hideTypingIndicator();

      return result;
    } catch (error) {
      console.error("Error in send message:", error);
      this.ui.hideTypingIndicator();
      // Add error message to UI
      this.ui.addMessage(
        "assistant",
        "I apologize, but I encountered an error. Please try again."
      );
      throw error;
    }
  }

  async handleButtonClick(buttonData) {
    console.log("Handling button click:", buttonData);
    try {
      this.ui.removeButtons();
      this.ui.showTypingIndicator();
      const result = await this.sendMessage(buttonData.name);
      this.ui.hideTypingIndicator();
      return result;
    } catch (error) {
      console.error("Error handling button click:", error);
      this.ui.hideTypingIndicator();
      throw error;
    }
  }

  // Override this method in child classes to handle special traces
  async handleSpecialTrace(trace) {
    console.log("Base handler received special trace:", trace);
  }
}
