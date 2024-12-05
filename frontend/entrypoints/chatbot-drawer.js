// chatbot-drawer.js

import { MainChatbot } from "./chatbot-main.js";

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
          apiEndpoint:
            "https://chatbottings--development.gadget.app/voiceflowAPI/voiceflow-new",
          userIDPrefix: "mainChatbot",
        };
        this.mainChatbot = new MainChatbot(this, config);
      }
    }
  }

  // Define the MainChatbot custom element if not already defined
  if (!window.customElements.get("main-chatbot")) {
    window.customElements.define("main-chatbot", MainChatbotElement);
  }

  // Listen to 'dialog:after-show' event globally
  document.addEventListener("dialog:after-show", function (event) {
    if (event.target.id === drawerId) {
      console.log("Chatbot drawer opened");
      const mainChatbotElement = event.target.querySelector("main-chatbot");
      if (mainChatbotElement && mainChatbotElement.mainChatbot) {
        console.log("Initializing Chatbot on drawer open");
        // Send initial message to start the conversation if needed
        mainChatbotElement.mainChatbot.sendMessage("start");
      } else {
        console.error("mainChatbotElement or mainChatbot not found");
      }
    }
  });

  // Listen to 'dialog:after-hide' event
  document.addEventListener("dialog:after-hide", function (event) {
    if (event.target.id === drawerId) {
      console.log("Chatbot drawer closed");
    }
  });

  // Initialize the drawer trigger
  document.addEventListener("DOMContentLoaded", () => {
    const chatbotDrawer = document.getElementById(drawerId);
    const chatbotTrigger = document.querySelector(
      `button[aria-controls="${drawerId}"]`
    );
    if (chatbotDrawer && chatbotTrigger) {
      chatbotTrigger.addEventListener("click", () => {
        chatbotDrawer.show();
      });
    } else {
      console.error("Chatbot drawer or trigger not found");
    }
  });
}

// Expose the function to the global scope
window.initChatbotDrawer = initChatbotDrawer;

// Immediately invoke the function if the drawer ID is available
if (window.chatbotDrawerId) {
  initChatbotDrawer(window.chatbotDrawerId);
}
