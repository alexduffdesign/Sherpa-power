import{D as r}from"./theme-Bz2ETus0.js";import{M as s}from"./chatbot-main-DCBKiRPo.js";import"//www.sherpapower.co.uk/cdn/shop/t/7/assets/vendor.min.js?v=52426788336887041471721044204";import"./chatbot-core-file-BIP7t546.js";console.log("Chatbot drawer script loaded");function n(o){class e extends HTMLElement{constructor(){return super(),e.instance||(e.instance=this,this.mainChatbot=null),e.instance}connectedCallback(){if(!this.mainChatbot){console.log("MainChatbotElement connected");const i={voiceflowEndpoint:"https://chatbottings--development.gadget.app/voiceflow"};this.mainChatbot=new s(this,i),this.mainChatbot.initializeChat()}}}class a extends r{constructor(){super(),this.mainChatbot=null,this.initialized=!1}connectedCallback(){super.connectedCallback(),this.mainChatbot=this.querySelector("main-chatbot"),this.mainChatbot||console.error("MainChatbot not found in ChatbotDrawer")}show(){super.show(),this.mainChatbot&&!this.initialized&&(this.mainChatbot.initializeChat(),this.initialized=!0)}}customElements.define("main-chatbot",e),customElements.define("chatbot-drawer",a),document.addEventListener("DOMContentLoaded",()=>{const t=document.getElementById(o),i=document.querySelector(`button[aria-controls="${o}"]`);t&&i?i.addEventListener("click",()=>{t.show()}):console.error("Chatbot drawer or trigger not found")}),document.addEventListener("dialog:after-show",t=>{t.target.id===o&&console.log("Chatbot drawer opened")}),document.addEventListener("dialog:after-hide",t=>{t.target.id===o&&console.log("Chatbot drawer closed")})}window.initChatbotDrawer=n;window.chatbotDrawerId&&n(window.chatbotDrawerId);
//# sourceMappingURL=chatbot-drawer-FSGNM4Ua.js.map
