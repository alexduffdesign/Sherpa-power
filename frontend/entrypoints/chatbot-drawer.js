// chatbot-drawer.js

console.log("Chatbot drawer script loaded");

function initChatbotDrawer(drawerId) {
  // Remove any code that defines the MainChatbotElement here.
  // main-chatbot is already defined by chatbot-main.js

  document.addEventListener("dialog:after-show", function (event) {
    if (event.target.id === drawerId) {
      console.log("Chatbot drawer opened");
      const mainChatbotElement = event.target.querySelector("main-chatbot");
      if (mainChatbotElement) {
        console.log("main-chatbot element is present");
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
        chatbotDrawer.show();
      });
    } else {
      console.error("Chatbot drawer or trigger not found");
    }
  });
}

// Expose the function to the global scope
window.initChatbotDrawer = initChatbotDrawer;

// If you have a global window.chatbotDrawerId, you can conditionally call initChatbotDrawer here if needed.
if (window.chatbotDrawerId) {
  initChatbotDrawer(window.chatbotDrawerId);
}
