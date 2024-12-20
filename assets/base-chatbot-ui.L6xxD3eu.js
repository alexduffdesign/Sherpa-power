import"./vendor.DqvJXvYX.js";import"./marked.esm.DtrQ3Nt4.js";class d{constructor(e){if(!e.container)throw new Error("ChatbotUI requires a container element");if(!e.eventBus)throw new Error("ChatbotUI requires an event bus");this.container=e.container,this.eventBus=e.eventBus,this.type=e.type,this.currentAssistantMessage=null,this.accumulatedContent="",this.setupUIElements(),this.setupEventListeners()}setupUIElements(){var n;const e=this.container.querySelectorAll(".message-container");this.messageContainer=e[0],console.log("Message container found:",!!this.messageContainer);const t=this.container.querySelectorAll(".chat-form");this.form=t[0],console.log("Chat form found:",!!this.form);const s=this.container.querySelectorAll(".chatbot-input");this.input=s[0],console.log("Chat input found:",!!this.input);const i=this.container.querySelectorAll(".chat-typing");if(this.typingIndicator=i[0],console.log("Typing indicator found:",!!this.typingIndicator),this.typingText=(n=this.typingIndicator)==null?void 0:n.querySelector(".typing-text"),console.log("Typing text found:",!!this.typingText),console.log("Container HTML:",this.container.innerHTML),!this.messageContainer||!this.form||!this.input){const o=[];throw this.messageContainer||o.push("message-container"),this.form||o.push("chat-form"),this.input||o.push("chatbot-input"),new Error(`Required UI elements not found: ${o.join(", ")}`)}}setupEventListeners(){this.form.addEventListener("submit",e=>{e.preventDefault();const t=this.input.value.trim();t&&(this.eventBus.emit("userMessage",t),this.input.value="")}),this.eventBus.on("messageReceived",({content:e,metadata:t,isStreamed:s})=>{console.log("UI received messageReceived event:",e,t,s),this.handleAssistantMessage(e,t,s)}),this.eventBus.on("partialMessage",({content:e,isStreamed:t})=>{this.handlePartialMessage(e,t)}),this.eventBus.on("finalMessage",({content:e,isStreamed:t})=>{this.handleFinalMessage(e,t)}),this.eventBus.on("typing",({isTyping:e})=>{e?this.showTypingIndicator():this.hideTypingIndicator()}),this.eventBus.on("error",({message:e})=>{this.displayError(e)}),this.eventBus.on("choicePresented",({buttons:e})=>{this.addButtons(e)}),this.eventBus.on("carouselPresented",({items:e})=>{this.addCarousel(e)}),this.eventBus.on("end",()=>{this.currentAssistantMessage=null,this.accumulatedContent=""})}handleAssistantMessage(e,t,s){const i=t&&t.fromHistory,n=!s&&!i,o=i?10:void 0,a=this.createMessage("assistant",e,t,n,o,s);this.messageContainer.appendChild(a),this.scrollToBottom()}handlePartialMessage(e,t){this.accumulatedContent+=e;const s=/([.!?;]\s)|(\n)/,i=this.accumulatedContent.match(s);if(i){const n=i.index+i[0].length,o=this.accumulatedContent.slice(0,n).trim(),a=this.accumulatedContent.slice(n).trim();this.currentAssistantMessage?this.currentAssistantMessage.appendContent(o):(this.currentAssistantMessage=this.createMessage("assistant",o,null,!t,void 0,t),this.messageContainer.appendChild(this.currentAssistantMessage)),this.accumulatedContent=a,this.scrollToBottom()}else this.currentAssistantMessage?this.currentAssistantMessage.appendContent(e):(this.currentAssistantMessage=this.createMessage("assistant",e,null,!t,void 0,t),this.messageContainer.appendChild(this.currentAssistantMessage)),this.scrollToBottom()}handleFinalMessage(e,t){if(this.currentAssistantMessage)this.currentAssistantMessage.appendContent(e),this.currentAssistantMessage=null,this.accumulatedContent="",this.scrollToBottom();else{const s=this.createMessage("assistant",e,null,!t,void 0,t);this.messageContainer.appendChild(s),this.scrollToBottom()}}createMessage(e,t,s=null,i=!0,n,o=!1){const a=document.createElement("message-component");return a.eventBus=this.eventBus,a.setAttribute("sender",e),a.setAttribute("content",t),o&&a.setAttribute("streaming",""),s&&a.setAttribute("metadata",JSON.stringify(s)),i||a.setAttribute("data-animate","false"),n&&a.setAttribute("data-animation-speed",n.toString()),a}addMessage(e,t,s=null,i=!1,n=!1,o=void 0){if(console.log(`addMessage called with sender=${e}, content=${t}, metadata=`,s,`, fromHistory=${i}, isStreamed=${n}, animationSpeed=${o}`),e==="assistant"){const a=!n&&!i,l=n?void 0:i?10:o,r=this.createMessage("assistant",t,s,a,l,n);this.messageContainer.appendChild(r),n&&r.appendContent(t),this.scrollToBottom()}else if(e==="user"){const a=!i,l=o||(i?10:void 0),r=this.createMessage(e,t,s,a,l,n);this.messageContainer.appendChild(r),this.scrollToBottom()}}handlePartialMessage(e,t){this.currentAssistantMessage||(this.currentAssistantMessage=this.createMessage("assistant","",null,!1,void 0,!0),this.messageContainer.appendChild(this.currentAssistantMessage)),this.currentAssistantMessage.appendContent(e),this.scrollToBottom()}handleFinalMessage(e,t){if(console.log("handleFinalMessage called",{fullContent:e,isStreamed:t}),this.currentAssistantMessage)this.currentAssistantMessage.finalizeContentAndAnimate(),this.currentAssistantMessage=null,this.accumulatedContent="";else{console.warn("handleFinalMessage called but currentAssistantMessage is null",{fullContent:e,isStreamed:t});const s=this.createMessage("assistant",e,null,!1,void 0,t);this.messageContainer.appendChild(s)}this.scrollToBottom()}addButtons(e,t=!1){if(!Array.isArray(e)){console.error("Invalid buttons data:",e);return}const s=document.createElement("div");s.className="button-group",e.forEach(i=>{const n=document.createElement("button-component");n.eventBus=this.eventBus,n.setAttribute("label",i.name),n.setAttribute("payload",JSON.stringify(i.request)),s.appendChild(n)}),this.messageContainer.appendChild(s),this.scrollToBottom()}addCarousel(e,t=!1){if(!Array.isArray(e)){console.error("Invalid carousel items:",e);return}const s=document.createElement("carousel-component");s.eventBus=this.eventBus,s.setAttribute("data-carousel",JSON.stringify({cards:e})),this.messageContainer.appendChild(s),this.scrollToBottom()}showTypingIndicator(){this.typingIndicator&&(this.typingIndicator.style.display="flex",this.scrollToBottom())}hideTypingIndicator(){this.typingIndicator&&(this.typingIndicator.style.display="none")}displayError(e){const t=document.createElement("div");t.classList.add("error-message"),t.textContent=e,this.messageContainer.appendChild(t),this.scrollToBottom()}removeInteractiveElements(){this.messageContainer.querySelectorAll("button-component, carousel-component, .button-group").forEach(t=>t.remove())}scrollToBottom(){this.messageContainer.scrollTop=this.messageContainer.scrollHeight}destroy(){this.abortController&&this.abortController.abort(),this.eventBus.removeAllListeners()}}export{d as C};
//# sourceMappingURL=base-chatbot-ui.L6xxD3eu.js.map
