// chatbot-drawer.js

console.log("Chatbot drawer script loaded");

function initChatbotDrawer(drawerId) {
  // Listen for dialog events
  document.addEventListener("dialog:after-show", function (event) {
    if (event.target.id === drawerId) {
      console.log("Chatbot drawer opened");
      const mainChatbotElement = event.target.querySelector("main-chatbot");
      if (mainChatbotElement) {
        console.log("main-chatbot element is present");
        if (typeof mainChatbotElement.initialize === "function") {
          mainChatbotElement.initialize();
        }
      } else {
        console.error("mainChatbotElement not found");
      }
    }
  });

  document.addEventListener("dialog:after-hide", function (event) {
    if (event.target.id === drawerId) {
      console.log("Chatbot drawer closed");
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    const chatbotDrawer = document.getElementById(drawerId);
    const chatbotTrigger = document.querySelector(
      `button[aria-controls="${drawerId}"]`
    );

    if (chatbotDrawer && chatbotTrigger) {
      chatbotTrigger.addEventListener("click", () => {
        if (typeof chatbotDrawer.show === "function") {
          chatbotDrawer.show();
        }
      });
    } else {
      console.error("Chatbot drawer or trigger not found");
    }
  });
}

// Expose the function to the global scope
window.initChatbotDrawer = initChatbotDrawer;

// Initialize if window.chatbotDrawerId exists
if (window.chatbotDrawerId) {
  initChatbotDrawer(window.chatbotDrawerId);
}
