console.log("Chatbot drawer script loaded");function n(e){document.addEventListener("dialog:after-show",function(t){t.target.id===e&&(console.log("Chatbot drawer opened"),t.target.querySelector("main-chatbot")?console.log("main-chatbot element is present"):console.error("mainChatbotElement not found"))}),document.addEventListener("dialog:after-hide",function(t){t.target.id===e&&console.log("Chatbot drawer closed")}),document.addEventListener("DOMContentLoaded",()=>{const t=document.getElementById(e),o=document.querySelector(`button[aria-controls="${e}"]`);t&&o?o.addEventListener("click",()=>{t.show()}):console.error("Chatbot drawer or trigger not found")})}window.initChatbotDrawer=n;window.chatbotDrawerId&&n(window.chatbotDrawerId);
//# sourceMappingURL=chatbot-drawer.shRpA52A.js.map
