import { Drawer } from "./theme.js";
import MainChatbot from "./chatbot-main.js";

console.log("Chatbot drawer script loaded");

function initChatbotDrawer(drawerId) {
  // Define the MainChatbot custom element
  class MainChatbotElement extends HTMLElement {
    constructor() {
      super();
      if (!MainChatbotElement.instance) {
        MainChatbotElement.instance = this;
        this.mainChatbot = null;
      }
      return MainChatbotElement.instance;
    }

    connectedCallback() {
      if (!this.mainChatbot) {
        console.log("MainChatbotElement connected");
        const config = {
          voiceflowEndpoint:
            "https://chatbottings--development.gadget.app/voiceflow",
        };
        this.mainChatbot = new MainChatbot(this, config);
        this.loadPreviousConversation();
      }
    }

    loadPreviousConversation() {
      if (this.mainChatbot) {
        this.mainChatbot.loadConversationFromStorage();
      }
    }

    async initializeNewChat() {
      console.log("MainChatbotElement initializeNewChat called");
      if (this.mainChatbot) {
        await this.mainChatbot.initializeNewChat();
      } else {
        console.error(
          "MainChatbot not initialized when trying to initialize new chat"
        );
      }
    }
  }

  // Define the ChatbotDrawer class
  class ChatbotDrawer extends Drawer {
    constructor() {
      super();
      this.mainChatbot = null;
      this.initialized = false;
    }

    connectedCallback() {
      super.connectedCallback();
      this.mainChatbot = this.querySelector("main-chatbot");
      if (!this.mainChatbot) {
        console.error("MainChatbot not found in ChatbotDrawer");
      }
    }

    async show() {
      super.show();
      if (this.mainChatbot) {
        if (!this.initialized) {
          console.log("Initializing new chat");
          await this.mainChatbot.initializeNewChat();
          this.initialized = true;
        } else {
          console.log("Chat already initialized");
        }
      } else {
        console.error("MainChatbot not found when trying to show drawer");
      }
    }
  }

  // Define custom elements
  customElements.define("main-chatbot", MainChatbotElement);
  customElements.define("chatbot-drawer", ChatbotDrawer);

  // Initialize the drawer
  document.addEventListener("DOMContentLoaded", () => {
    const chatbotDrawer = document.getElementById(drawerId);
    const chatbotTrigger = document.querySelector(
      `button[aria-controls="${drawerId}"]`
    );
    if (chatbotDrawer && chatbotTrigger) {
      chatbotTrigger.addEventListener("click", async () => {
        await chatbotDrawer.show();
      });
    } else {
      console.error("Chatbot drawer or trigger not found");
    }
  });

  // Event listeners for drawer open/close events
  document.addEventListener("dialog:after-show", (event) => {
    if (event.target.id === drawerId) {
      console.log("Chatbot drawer opened");
    }
  });

  document.addEventListener("dialog:after-hide", (event) => {
    if (event.target.id === drawerId) {
      console.log("Chatbot drawer closed");
    }
  });
}

// Expose the function to the global scope
window.initChatbotDrawer = initChatbotDrawer;

// Immediately invoke the function if the drawer ID is available
if (window.chatbotDrawerId) {
  initChatbotDrawer(window.chatbotDrawerId);
}
