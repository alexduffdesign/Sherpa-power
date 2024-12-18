import"./vendor.DqvJXvYX.js";import{p as a}from"./markdown-util.gcjemE0m.js";class d{constructor(e){if(!e.container)throw new Error("ChatbotUI requires a container element");if(!e.eventBus)throw new Error("ChatbotUI requires an event bus");this.container=e.container,this.eventBus=e.eventBus,this.type=e.type,this.currentAssistantMessage=null,this.accumulatedContent="",this.setupUIElements(),this.setupEventListeners()}setupUIElements(){var i;const e=this.container.querySelectorAll(".message-container");this.messageContainer=e[0],console.log("Message container found:",!!this.messageContainer);const t=this.container.querySelectorAll(".chat-form");this.form=t[0],console.log("Chat form found:",!!this.form);const s=this.container.querySelectorAll(".chatbot-input");this.input=s[0],console.log("Chat input found:",!!this.input);const o=this.container.querySelectorAll(".chat-typing");if(this.typingIndicator=o[0],console.log("Typing indicator found:",!!this.typingIndicator),this.typingText=(i=this.typingIndicator)==null?void 0:i.querySelector(".typing-text"),console.log("Typing text found:",!!this.typingText),console.log("Container HTML:",this.container.innerHTML),!this.messageContainer||!this.form||!this.input){const n=[];throw this.messageContainer||n.push("message-container"),this.form||n.push("chat-form"),this.input||n.push("chatbot-input"),new Error(`Required UI elements not found: ${n.join(", ")}`)}}setupEventListeners(){this.form.addEventListener("submit",e=>{e.preventDefault();const t=this.input.value.trim();t&&(this.eventBus.emit("userMessage",t),this.input.value="")}),this.eventBus.on("messageReceived",({content:e,metadata:t})=>{console.log("UI received messageReceived event:",e,t),this.handleAssistantMessage(e,t)}),this.eventBus.on("partialMessage",e=>{this.handlePartialMessage(e)}),this.eventBus.on("finalMessage",e=>{this.handleFinalMessage(e)}),this.eventBus.on("typing",({isTyping:e})=>{e?this.showTypingIndicator():this.hideTypingIndicator()}),this.eventBus.on("error",({message:e})=>{this.displayError(e)}),this.eventBus.on("choicePresented",({buttons:e})=>{this.addButtons(e)}),this.eventBus.on("carouselPresented",({items:e})=>{this.addCarousel(e)}),this.eventBus.on("end",()=>{this.currentAssistantMessage=null,this.accumulatedContent=""})}handleAssistantMessage(e,t){const s=!t||!t.streamed,o=!0,i=s?10:void 0,n=s?{...t,fromHistory:(t==null?void 0:t.fromHistory)||!1}:t,r=a(e),l=this.createMessage("assistant",r,n,o,i);this.messageContainer.appendChild(l),this.scrollToBottom()}handlePartialMessage(e){this.accumulatedContent+=e;const t=/([.!?;]\s)|(\n)/,s=this.accumulatedContent.match(t);if(s){const o=s.index+s[0].length,i=this.accumulatedContent.slice(0,o).trim(),n=this.accumulatedContent.slice(o).trim();this.currentAssistantMessage?this.currentAssistantMessage.appendContent(a(i)):(this.currentAssistantMessage=this.createMessage("assistant",a(i),null,!0,void 0),this.messageContainer.appendChild(this.currentAssistantMessage)),this.accumulatedContent=n,this.scrollToBottom()}else this.currentAssistantMessage?this.currentAssistantMessage.appendContent(a(e)):(this.currentAssistantMessage=this.createMessage("assistant",a(e),null,!0,void 0),this.messageContainer.appendChild(this.currentAssistantMessage)),this.scrollToBottom()}handleFinalMessage(e){if(this.currentAssistantMessage)this.currentAssistantMessage.appendContent(a(e)),this.currentAssistantMessage=null,this.accumulatedContent="",this.scrollToBottom();else{const t=a(e),s=this.createMessage("assistant",t,null,!0,void 0);this.messageContainer.appendChild(s),this.scrollToBottom()}}createMessage(e,t,s=null,o=!0,i){const n=document.createElement("message-component");return n.eventBus=this.eventBus,n.setAttribute("sender",e),n.setAttribute("content",t),s&&n.setAttribute("metadata",JSON.stringify(s)),o||n.setAttribute("data-animate","false"),i&&n.setAttribute("data-animation-speed",i.toString()),n}addMessage(e,t,s=null,o=!1,i=void 0){if(console.log(`addMessage called with sender=${e}, content=${t}, metadata=`,s),e==="assistant")this.handleAssistantMessage(t,{...s,fromHistory:o});else{const n=!o,r=i||(o?10:void 0),l=this.createMessage(e,t,s,n,r);this.messageContainer.appendChild(l),this.scrollToBottom()}}addButtons(e,t=!1){if(!Array.isArray(e)){console.error("Invalid buttons data:",e);return}const s=document.createElement("div");s.className="button-group",e.forEach(o=>{const i=document.createElement("button-component");i.eventBus=this.eventBus,i.setAttribute("label",o.name),i.setAttribute("payload",JSON.stringify(o.request)),s.appendChild(i)}),this.messageContainer.appendChild(s),this.scrollToBottom()}addCarousel(e,t=!1){if(!Array.isArray(e)){console.error("Invalid carousel items:",e);return}const s=document.createElement("carousel-component");s.eventBus=this.eventBus,s.setAttribute("data-carousel",JSON.stringify({cards:e})),this.messageContainer.appendChild(s),this.scrollToBottom()}showTypingIndicator(){this.typingIndicator&&(this.typingIndicator.style.display="flex",this.scrollToBottom())}hideTypingIndicator(){this.typingIndicator&&(this.typingIndicator.style.display="none")}displayError(e){const t=document.createElement("div");t.classList.add("error-message"),t.textContent=e,this.messageContainer.appendChild(t),this.scrollToBottom()}removeInteractiveElements(){this.messageContainer.querySelectorAll("button-component, carousel-component, .button-group").forEach(t=>t.remove())}scrollToBottom(){this.messageContainer.scrollTop=this.messageContainer.scrollHeight}destroy(){this.eventBus.removeAllListeners()}}export{d as C};
//# sourceMappingURL=base-chatbot-ui.CfdBRW7I.js.map
