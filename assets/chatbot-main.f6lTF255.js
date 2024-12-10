import{C as r,M as h,e as s,E as i}from"./chatbot-components.bXnhWchX.js";import{g as c}from"./user-id-generator.DhYYxFTy.js";import"./vendor.DqvJXvYX.js";class u{constructor(t,e){this.core=t,this.ui=e,this.historyKey="mainChatbotHistory",this.launchKey="chatHasLaunched",this.isLaunched=this.hasLaunched(),this.setupEventListeners()}hasLaunched(){return localStorage.getItem(this.launchKey)==="true"}setLaunched(){localStorage.setItem(this.launchKey,"true"),this.isLaunched=!0}setupEventListeners(){s.on(i.MAIN_CHATBOT.MESSAGE_RECEIVED,t=>{this.ui.addMessage("assistant",t.content,t.metadata),this.saveToHistory("assistant",t.content,t.metadata)}),s.on("userMessage",t=>{this.ui.addMessage("user",t),this.saveToHistory("user",t),this.core.sendMessage(t)}),s.on("buttonClicked",t=>{const e=t.label||t.name||"Button clicked";this.ui.addMessage("user",e),this.saveToHistory("user",e),this.core.sendAction({action:{type:"text",payload:t}})}),s.on(i.MAIN_CHATBOT.CHOICE_PRESENTED,t=>{this.ui.addButtons(t.buttons)}),s.on(i.MAIN_CHATBOT.CAROUSEL_PRESENTED,t=>{this.ui.addCarousel(t.carouselItems)}),s.on(i.MAIN_CHATBOT.ERROR,t=>{this.ui.displayError(t.message)}),s.on(i.MAIN_CHATBOT.TYPING,t=>{t.isTyping?this.ui.showTypingIndicator():this.ui.hideTypingIndicator()}),document.addEventListener("chatbotLaunch",()=>{this.launch()}),this.ui.onUserMessage(t=>{this.sendMessage(t)}),this.ui.onButtonClick(t=>{this.sendAction(t)})}launch(){if(this.isLaunched){console.log("Chat already launched, skipping launch request");return}this.core.sendLaunch().then(()=>{console.log("Chatbot launched successfully."),this.setLaunched()}).catch(t=>{console.error("Error launching chatbot:",t),this.ui.displayError("Failed to launch the chatbot. Please try again later.")})}sendMessage(t){const e=this.sanitizeInput(t);this.ui.addMessage("user",e,{type:"message"}),this.saveToHistory("user",e,{type:"message"}),this.core.sendMessage(e).catch(a=>{console.error("Error sending message:",a),this.ui.displayError("Failed to send your message. Please try again.")})}sendAction(t){if(!t||typeof t!="object"){console.error("Invalid action payload:",t),this.ui.displayError("Invalid action triggered.");return}this.core.sendAction({action:t,config:{}}).then(()=>{console.log("Action sent successfully:",t),this.ui.addMessage("user",t.label||"Action executed.",{type:"action"}),this.saveToHistory("user",JSON.stringify(t),{type:"action"})}).catch(e=>{console.error("Error sending action:",e),this.ui.displayError("An error occurred while processing your request.")})}loadHistory(){(JSON.parse(localStorage.getItem(this.historyKey))||[]).forEach(e=>{if(e.sender==="user")this.ui.addMessage("user",e.message,e.metadata);else if(e.sender==="assistant"&&(this.ui.addMessage("assistant",e.message,e.metadata),e.metadata))switch(e.metadata.type){case"choice":this.ui.addButtons(e.metadata.buttons);break;case"carousel":this.ui.addCarousel(e.metadata.carouselItems);break}})}saveToHistory(t,e,a=null){const n=JSON.parse(localStorage.getItem(this.historyKey))||[];n.push({sender:t,message:e,metadata:a}),localStorage.setItem(this.historyKey,JSON.stringify(n))}sanitizeInput(t){const e=document.createElement("div");return e.textContent=t,e.innerHTML}}document.addEventListener("DOMContentLoaded",()=>{const o=document.getElementById("main-chatbot-ui");if(!o){console.error("Main Chatbot UI container not found");return}let t=localStorage.getItem("mainChatbotUserId");t||(t=c("mainChatbot"),localStorage.setItem("mainChatbotUserId",t));const e=new r({userID:t,endpoint:"https://chatbottings--development.gadget.app/voiceflowAPI/voiceflow-streaming",chatbotType:"main"}),a=new h(o);new u(e,a).loadHistory()});export{u as M};
//# sourceMappingURL=chatbot-main.f6lTF255.js.map
