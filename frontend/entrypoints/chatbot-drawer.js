// chatbot-drawer.js

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
        // Removed: this.mainChatbot.initializeChat();
      }
    }
  }

  // Define the ChatbotDrawer class
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
        console.error("MainChatbot not found in ChatbotDrawer");
      } else {
        console.log(
          "MainChatbotElement found in ChatbotDrawer:",
          this.mainChatbotElement
        );
      }

      // Listen to 'dialog:after-show' event to initialize the chatbot
      this.addEventListener("dialog:after-show", this.onAfterShow.bind(this));
    }

    onAfterShow() {
      console.log("dialog:after-show event received");
      if (this.mainChatbotElement && !this.initialized) {
        console.log("Initializing Chatbot on drawer open");
        this.mainChatbotElement.mainChatbot.initializeChat();
        this.initialized = true;
      } else if (this.initialized) {
        console.log("Chatbot already initialized");
      } else {
        console.error("mainChatbotElement or mainChatbot is missing");
      }
    }

    // Optionally, handle 'dialog:after-hide' if needed
    onAfterHide() {
      console.log("dialog:after-hide event received");
      // If you want to re-initialize chatbot every time the drawer is opened,
      // set this.initialized to false here.
      // this.initialized = false;
    }
  }

  // Define custom elements
  if (!window.customElements.get("main-chatbot")) {
    window.customElements.define("main-chatbot", MainChatbotElement);
  }
  if (!window.customElements.get("chatbot-drawer")) {
    window.customElements.define("chatbot-drawer", ChatbotDrawer);
  }

  // Initialize the drawer
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

  // Event listeners for drawer open/close events
  document.addEventListener("dialog:after-show", (event) => {
    if (event.target.id === drawerId) {
      console.log("Chatbot drawer opened");
      // Initialization is handled in ChatbotDrawer's onAfterShow
    }
  });

  document.addEventListener("dialog:after-hide", (event) => {
    if (event.target.id === drawerId) {
      console.log("Chatbot drawer closed");
      // Optionally handle post-hide actions
    }
  });
}

// Expose the function to the global scope
window.initChatbotDrawer = initChatbotDrawer;

// Immediately invoke the function if the drawer ID is available
if (window.chatbotDrawerId) {
  initChatbotDrawer(window.chatbotDrawerId);
}
