import"./vendor.DqvJXvYX.js";class h{constructor(e){if(!e.container)throw new Error("ChatbotUI requires a container element");if(!e.eventBus)throw new Error("ChatbotUI requires an event bus");this.container=e.container,this.eventBus=e.eventBus,this.type=e.type,this.currentAssistantMessage=null,this.setupUIElements(),this.setupEventListeners()}setupUIElements(){var n;const e=this.container.querySelectorAll(".message-container");this.messageContainer=e[0],console.log("Message container found:",!!this.messageContainer);const t=this.container.querySelectorAll(".chat-form");this.form=t[0],console.log("Chat form found:",!!this.form);const s=this.container.querySelectorAll(".chatbot-input");this.input=s[0],console.log("Chat input found:",!!this.input);const o=this.container.querySelectorAll(".chat-typing");if(this.typingIndicator=o[0],console.log("Typing indicator found:",!!this.typingIndicator),this.typingText=(n=this.typingIndicator)==null?void 0:n.querySelector(".typing-text"),console.log("Typing text found:",!!this.typingText),console.log("Container HTML:",this.container.innerHTML),!this.messageContainer||!this.form||!this.input){const r=[];throw this.messageContainer||r.push("message-container"),this.form||r.push("chat-form"),this.input||r.push("chatbot-input"),new Error(`Required UI elements not found: ${r.join(", ")}`)}}setupEventListeners(){this.form.addEventListener("submit",e=>{e.preventDefault();const t=this.input.value.trim();t&&(this.eventBus.emit("userMessage",t),this.input.value="")}),this.eventBus.on("messageReceived",({content:e,metadata:t,isStreamed:s})=>{console.log("UI received messageReceived event:",e,t,s),this.handleAssistantMessage(e,t,s)}),this.eventBus.on("partialMessage",({content:e,isStreamed:t})=>{this.handlePartialMessage(e,t)}),this.eventBus.on("finalMessage",({content:e,isStreamed:t})=>{this.handleFinalMessage(e,t)}),this.eventBus.on("typing",({isTyping:e})=>{e?this.showTypingIndicator():this.hideTypingIndicator()}),this.eventBus.on("error",({message:e})=>{this.displayError(e)}),this.eventBus.on("choicePresented",({buttons:e})=>{this.addButtons(e)}),this.eventBus.on("carouselPresented",({items:e})=>{this.addCarousel(e)}),this.eventBus.on("end",()=>{this.currentAssistantMessage=null})}handleAssistantMessage(e,t,s){const o=t&&t.fromHistory,n=!s&&!o,r=o?10:void 0,i=this.createMessage("assistant",e,t,n,r,s);this.messageContainer.appendChild(i),this.scrollToBottom()}handlePartialMessage(e,t){this.currentAssistantMessage||(this.currentAssistantMessage=this.createMessage("assistant","",null,!1,void 0,!0),this.messageContainer.appendChild(this.currentAssistantMessage)),this.currentAssistantMessage.appendHTMLContent(e),this.scrollToBottom()}handleFinalMessage(e,t){if(console.log("handleFinalMessage called",{fullContent:e,isStreamed:t}),this.currentAssistantMessage)this.currentAssistantMessage.finalizeContentAndAnimate(),this.currentAssistantMessage=null,this.eventBus.emit("messageReceived",{content:e,metadata:null,isStreamed:!0});else{console.warn("handleFinalMessage called but currentAssistantMessage is null",{fullContent:e,isStreamed:t});const s=this.createMessage("assistant",e,null,!1,void 0,t);this.messageContainer.appendChild(s),this.scrollToBottom()}}createMessage(e,t,s=null,o=!0,n,r=!1){const i=document.createElement("message-component");return i.eventBus=this.eventBus,i.setAttribute("sender",e),i.setAttribute("content",t),r&&i.setAttribute("streaming",""),s&&i.setAttribute("metadata",JSON.stringify(s)),o||i.setAttribute("data-animate","false"),n&&i.setAttribute("data-animation-speed",n.toString()),i}addButtons(e,t=!1){if(!Array.isArray(e)){console.error("Invalid buttons data:",e);return}const s=document.createElement("div");s.className="button-group",e.forEach(o=>{const n=document.createElement("button-component");n.eventBus=this.eventBus,n.setAttribute("label",o.name),n.setAttribute("payload",JSON.stringify(o.request)),s.appendChild(n)}),this.messageContainer.appendChild(s),this.scrollToBottom()}addCarousel(e,t=!1){if(!Array.isArray(e)){console.error("Invalid carousel items:",e);return}const s=document.createElement("carousel-component");s.eventBus=this.eventBus,s.setAttribute("data-carousel",JSON.stringify({cards:e})),this.messageContainer.appendChild(s),this.scrollToBottom()}showTypingIndicator(){this.typingIndicator&&(this.typingIndicator.style.display="flex",this.scrollToBottom())}hideTypingIndicator(){this.typingIndicator&&(this.typingIndicator.style.display="none")}displayError(e){const t=document.createElement("div");t.classList.add("error-message"),t.textContent=e,this.messageContainer.appendChild(t),this.scrollToBottom()}removeInteractiveElements(){this.messageContainer.querySelectorAll("button-component, carousel-component, .button-group").forEach(t=>t.remove())}scrollToBottom(){this.messageContainer.scrollTop=this.messageContainer.scrollHeight}destroy(){this.abortController&&this.abortController.abort(),this.eventBus.removeAllListeners()}}export{h as C};
//# sourceMappingURL=base-chatbot-ui.vaTv-FDm.js.map
