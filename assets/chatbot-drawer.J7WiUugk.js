<<<<<<<< HEAD:assets/chatbot-drawer.DHQrR99M.js
import{M as a}from"./chatbot-main.Ctj-9EXP.js";import"./chatbot-components.DTeG7EXr.js";import"./vendor.DqvJXvYX.js";import"./user-id-generator.DhYYxFTy.js";console.log("Chatbot drawer script loaded");function i(n){class e extends HTMLElement{constructor(){return super(),e.instance||(e.instance=this,this.mainChatbot=null),e.instance}connectedCallback(){if(!this.mainChatbot){console.log("MainChatbotElement connected");const t={voiceflowEndpoint:"https://chatbottings--development.gadget.app/voiceflowAPI/voiceflow-streaming"};this.mainChatbot=new a(this,t)}}}window.customElements.get("main-chatbot")||window.customElements.define("main-chatbot",e),document.addEventListener("dialog:after-show",function(o){if(o.target.id===n){console.log("Chatbot drawer opened");const t=o.target.querySelector("main-chatbot");t&&t.mainChatbot?(console.log("Initializing Chatbot on drawer open"),t.mainChatbot.initializeChat()):console.error("mainChatbotElement or mainChatbot not found")}}),document.addEventListener("dialog:after-hide",function(o){o.target.id===n&&console.log("Chatbot drawer closed")}),document.addEventListener("DOMContentLoaded",()=>{const o=document.getElementById(n),t=document.querySelector(`button[aria-controls="${n}"]`);o&&t?t.addEventListener("click",()=>{o.show()}):console.error("Chatbot drawer or trigger not found")})}window.initChatbotDrawer=i;window.chatbotDrawerId&&i(window.chatbotDrawerId);
//# sourceMappingURL=chatbot-drawer.DHQrR99M.js.map
========
import{M as a}from"./chatbot-main.jSLDKLMp.js";import"./chatbot-components.B5kW0R_E.js";import"./vendor.DqvJXvYX.js";import"./user-id-generator.DhYYxFTy.js";console.log("Chatbot drawer script loaded");function i(n){class e extends HTMLElement{constructor(){return super(),e.instance||(e.instance=this,this.mainChatbot=null),e.instance}connectedCallback(){if(!this.mainChatbot){console.log("MainChatbotElement connected");const t={voiceflowEndpoint:"https://chatbottings--development.gadget.app/voiceflowAPI/voiceflow-streaming"};this.mainChatbot=new a(this,t)}}}window.customElements.get("main-chatbot")||window.customElements.define("main-chatbot",e),document.addEventListener("dialog:after-show",function(o){if(o.target.id===n){console.log("Chatbot drawer opened");const t=o.target.querySelector("main-chatbot");t&&t.mainChatbot?(console.log("Initializing Chatbot on drawer open"),t.mainChatbot.initializeChat()):console.error("mainChatbotElement or mainChatbot not found")}}),document.addEventListener("dialog:after-hide",function(o){o.target.id===n&&console.log("Chatbot drawer closed")}),document.addEventListener("DOMContentLoaded",()=>{const o=document.getElementById(n),t=document.querySelector(`button[aria-controls="${n}"]`);o&&t?t.addEventListener("click",()=>{o.show()}):console.error("Chatbot drawer or trigger not found")})}window.initChatbotDrawer=i;window.chatbotDrawerId&&i(window.chatbotDrawerId);
//# sourceMappingURL=chatbot-drawer.J7WiUugk.js.map
>>>>>>>> parent of 5256455 (clicking buttons, sending payload and adding correct user message):assets/chatbot-drawer.J7WiUugk.js
