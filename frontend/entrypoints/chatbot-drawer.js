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
      console.log("ChatbotDrawer constructor called");
    }

    connectedCallback() {
      super.connectedCallback();
      console.log("ChatbotDrawer connectedCallback called");
      this.mainChatbotElement = this.querySelector("main-chatbot");
      if (this.mainChatbotElement) {
        console.log("MainChatbotElement found in ChatbotDrawer");
      } else {
        console.error("MainChatbotElement not found in ChatbotDrawer");
      }
    }

    async show() {
      super.show();
      console.log("ChatbotDrawer show method called");
      if (this.mainChatbotElement) {
        console.log("MainChatbotElement exists in show method");
        const hasLaunched = localStorage.getItem("chatHasLaunched") === "true";
        console.log("hasLaunched:", hasLaunched);
        if (!hasLaunched) {
          console.log("Initializing new chat for the first time");
          if (this.mainChatbotElement.mainChatbot) {
            console.log("mainChatbot exists, calling initializeNewChat");
            await this.mainChatbotElement.mainChatbot.initializeNewChat();
            this.initialized = true;
            localStorage.setItem("chatHasLaunched", "true");
            console.log("Chat initialized and localStorage updated");
          } else {
            console.error("mainChatbot does not exist on MainChatbotElement");
          }
        } else if (!this.initialized) {
          console.log("Loading previous conversation");
          if (this.mainChatbotElement.mainChatbot) {
            this.mainChatbotElement.mainChatbot.loadConversationFromStorage();
            this.mainChatbotElement.mainChatbot.displaySavedConversation();
            this.initialized = true;
            console.log("Previous conversation loaded and displayed");
          } else {
            console.error("mainChatbot does not exist on MainChatbotElement");
          }
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
