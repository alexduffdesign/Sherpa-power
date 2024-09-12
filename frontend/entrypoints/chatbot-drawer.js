import MainChatbot from "./chatbot-main.js";

console.log("Chatbot drawer script loaded");

function initChatbotDrawer(drawerId) {
  class MainChatbotElement extends HTMLElement {
    constructor() {
      super();
      this.mainChatbot = null;
      console.log("MainChatbotElement constructor called");
    }

    connectedCallback() {
      console.log("MainChatbotElement connectedCallback called");
      if (!this.mainChatbot) {
        console.log("Creating new MainChatbot instance");
        const config = {
          voiceflowEndpoint:
            "https://chatbottings--development.gadget.app/voiceflow",
        };
        this.mainChatbot = new MainChatbot(this, config);
        console.log("MainChatbot instance created:", this.mainChatbot);
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

  customElements.define("main-chatbot", MainChatbotElement);

  function setupChatbotDrawer() {
    const drawer = document.getElementById(drawerId);
    const mainChatbotElement = drawer.querySelector("main-chatbot");

    if (!drawer || !mainChatbotElement) {
      console.error("Drawer or MainChatbotElement not found");
      return;
    }

    drawer.addEventListener("dialog:after-show", async () => {
      console.log("Chatbot drawer opened");
      const hasLaunched = localStorage.getItem("chatHasLaunched") === "true";
      console.log("hasLaunched:", hasLaunched);

      if (!hasLaunched) {
        console.log("Initializing new chat for the first time");
        await mainChatbotElement.initializeNewChat();
        localStorage.setItem("chatHasLaunched", "true");
        console.log("Chat initialized and localStorage updated");
      } else {
        console.log("Chat has been launched before");
        // You can add logic here to load previous conversation if needed
      }
    });

    console.log("Chatbot drawer setup complete");
  }

  document.addEventListener("DOMContentLoaded", setupChatbotDrawer);
}

window.initChatbotDrawer = initChatbotDrawer;

if (window.chatbotDrawerId) {
  console.log("Initializing chatbot drawer with ID:", window.chatbotDrawerId);
  initChatbotDrawer(window.chatbotDrawerId);
} else {
  console.error("chatbotDrawerId not found on window object");
}
