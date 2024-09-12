import { Drawer } from "./theme.js";
import MainChatbot from "./chatbot-main.js";

console.log("Chatbot drawer script loaded");

class ChatbotDrawer extends Drawer {
  constructor() {
    super();
    this.mainChatbotElement = null;
    this.mainChatbot = null;
    this.initialized = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.mainChatbotElement = this.querySelector("main-chatbot");
    if (!this.mainChatbotElement) {
      console.error("MainChatbotElement not found in ChatbotDrawer");
    } else {
      this.mainChatbot = new MainChatbot(this.mainChatbotElement, {
        voiceflowEndpoint: this.mainChatbotElement.getAttribute("api-endpoint"),
      });
    }
  }

  async show() {
    console.log("ChatbotDrawer show method called");
    await super.show();
    if (this.mainChatbot) {
      console.log("MainChatbot found, initializing chat");
      await this.mainChatbot.initializeNewChat();
    } else {
      console.error("MainChatbot not found when trying to show drawer");
    }
  }
}

customElements.define("chatbot-drawer", ChatbotDrawer);

function initChatbotDrawer(drawerId) {
  const drawerElement = document.getElementById(drawerId);
  if (drawerElement) {
    console.log("Initializing ChatbotDrawer");
    // This line ensures the element uses our custom ChatbotDrawer class
    if (!(drawerElement instanceof ChatbotDrawer)) {
      Object.setPrototypeOf(drawerElement, ChatbotDrawer.prototype);
    }
    drawerElement.connectedCallback();
  } else {
    console.error("Drawer element not found");
  }
}

window.initChatbotDrawer = initChatbotDrawer;

if (window.chatbotDrawerId) {
  initChatbotDrawer(window.chatbotDrawerId);
}
