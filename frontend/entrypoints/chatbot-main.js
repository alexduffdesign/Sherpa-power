// /assets/scripts/chatbot/main/chatbot-main.js

import ChatbotCore from "../core/chatbot-core.js";
import MainChatbotUI from "../ui/chatbot-main-ui.js";
import eventBus from "../utils/event-bus.js";
import { generateUserId } from "../utils/user-id-generator.js";

class MainChatbot {
  constructor() {
    this.userID = generateUserId("mainChatbot");
    this.endpoint =
      "https://chatbottings--development.gadget.app/voiceflowAPI/voiceflow-streaming";

    this.ui = new MainChatbotUI(document.getElementById("main-chatbot-ui"));
    this.core = new ChatbotCore({
      userID: this.userID,
      endpoint: this.endpoint,
      chatbotType: "main",
    });

    this.setupEventListeners();
  }

  /**
   * Sets up event listeners for various chatbot events.
   */
  setupEventListeners() {
    // Listen for chatbot launch event
    document.addEventListener("chatbotLaunch", () => {
      console.log("chatbotLaunch event received");
      this.core.sendLaunch();
    });

    // Listen for messages from the user
    this.ui.onUserMessage((message) => {
      this.core.sendMessage(message);
    });

    // Listen for choices presented by the chatbot
    eventBus.on("mainChatbot:choicePresented", ({ buttons }) => {
      console.log("Received choices:", buttons);
      this.ui.addButtons(buttons);
    });

    // Listen for messages received from the chatbot
    eventBus.on("mainChatbot:messageReceived", ({ content }) => {
      this.ui.addMessage("assistant", content);
    });

    // Listen for carousels presented by the chatbot
    eventBus.on("mainChatbot:carouselPresented", ({ carouselItems }) => {
      this.ui.addCarousel(carouselItems);
    });

    // Listen for carousel button clicks
    eventBus.on("carouselButtonClicked", async (payload) => {
      try {
        // Send the button payload to the chatbot core
        await this.core.sendAction({
          action: payload,
          config: {},
        });
      } catch (error) {
        console.error("Error handling carousel button click:", error);
      }
    });

    // Listen for typing indicators
    eventBus.on("mainChatbot:typing", ({ isTyping }) => {
      if (isTyping) {
        this.ui.showTypingIndicator();
      } else {
        this.ui.hideTypingIndicator();
      }
    });

    // Listen for errors
    eventBus.on("mainChatbot:error", ({ message }) => {
      this.ui.displayError(message);
    });
  }

  /**
   * Launches the chatbot by sending the launch action.
   */
  launch() {
    if (this.isLaunched) return;
    console.log("Launching chatbot");
    this.core.sendLaunch();
    this.isLaunched = true;
  }

  /**
   * Destroys the chatbot instance, cleaning up resources.
   */
  destroy() {
    this.core.destroy();
  }
}

export default MainChatbot;
