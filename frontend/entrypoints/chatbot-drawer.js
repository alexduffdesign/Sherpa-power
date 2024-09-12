import { Drawer } from "./theme.js";
import MainChatbot from "./chatbot-main.js";

console.log("Chatbot drawer script loaded");

function initChatbotDrawer(drawerId) {
  // Define the MainChatbotElement custom element
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

  // Define custom elements
  customElements.define("main-chatbot", MainChatbotElement);

  // Function to initialize the chat
  async function initializeChat(drawerElement) {
    const mainChatbotElement = drawerElement.querySelector("main-chatbot");
    if (mainChatbotElement) {
      const hasLaunched = localStorage.getItem("chatHasLaunched") === "true";
      if (!hasLaunched) {
        console.log("First time opening chatbot, initializing new chat");
        await mainChatbotElement.initializeNewChat();
        localStorage.setItem("chatHasLaunched", "true");
      } else {
        console.log("Chatbot has been launched before");
      }
    } else {
      console.error("MainChatbot element not found in drawer");
    }
  }

  // Event listeners for drawer open/close events
  document.addEventListener("dialog:after-show", async (event) => {
    if (event.target.id === drawerId) {
      console.log("Chatbot drawer opened");
      const chatbotDrawer = document.getElementById(drawerId);
      if (chatbotDrawer) {
        await initializeChat(chatbotDrawer);
      } else {
        console.error("Chatbot drawer not found");
      }
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
