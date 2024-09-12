import { Drawer } from "./theme.js";
import MainChatbot from "./chatbot-main.js";

console.log("Chatbot drawer script loaded");

function initChatbotDrawer(drawerId) {
  class MainChatbotElement extends HTMLElement {
    constructor() {
      super();
      this.mainChatbot = null;
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

  class ChatbotDrawer extends Drawer {
    constructor() {
      super();
      this.mainChatbotElement = null;
      this.initialized = false;
    }

    connectedCallback() {
      super.connectedCallback();
      this.mainChatbotElement = this.querySelector("main-chatbot");
      if (!this.mainChatbotElement) {
        console.error("MainChatbotElement not found in ChatbotDrawer");
      }
    }

    async show() {
      super.show();
      if (this.mainChatbotElement) {
        if (!this.initialized) {
          console.log("Initializing new chat");
          await this.mainChatbotElement.initializeNewChat();
          this.initialized = true;
        } else {
          console.log("Chat already initialized");
        }
      } else {
        console.error(
          "MainChatbotElement not found when trying to show drawer"
        );
      }
    }
  }

  customElements.define("main-chatbot", MainChatbotElement);
  customElements.define("chatbot-drawer", ChatbotDrawer);

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

window.initChatbotDrawer = initChatbotDrawer;

if (window.chatbotDrawerId) {
  initChatbotDrawer(window.chatbotDrawerId);
}
