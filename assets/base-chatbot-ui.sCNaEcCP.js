import"./vendor.DqvJXvYX.js";function l(r,t,e=5){return new Promise(s=>{let n=0;r.textContent="";let i=performance.now();const a=o=>{o-i>=e&&(r.textContent+=t[n],n++,i=o),n<t.length?requestAnimationFrame(a):s()};requestAnimationFrame(a)})}class u{constructor(t){if(!t.container)throw new Error("ChatbotUI requires a container element");if(!t.eventBus)throw new Error("ChatbotUI requires an event bus");this.container=t.container,this.eventBus=t.eventBus,this.type=t.type,this.currentAssistantMessage=null,this.setupUIElements(),this.setupEventListeners()}setupUIElements(){var i;const t=this.container.querySelectorAll(".message-container");this.messageContainer=t[0],console.log("Message container found:",!!this.messageContainer);const e=this.container.querySelectorAll(".chat-form");this.form=e[0],console.log("Chat form found:",!!this.form);const s=this.container.querySelectorAll(".chatbot-input");this.input=s[0],console.log("Chat input found:",!!this.input);const n=this.container.querySelectorAll(".chat-typing");if(this.typingIndicator=n[0],console.log("Typing indicator found:",!!this.typingIndicator),this.typingText=(i=this.typingIndicator)==null?void 0:i.querySelector(".typing-text"),console.log("Typing text found:",!!this.typingText),console.log("Container HTML:",this.container.innerHTML),!this.messageContainer||!this.form||!this.input){const a=[];throw this.messageContainer||a.push("message-container"),this.form||a.push("chat-form"),this.input||a.push("chatbot-input"),new Error(`Required UI elements not found: ${a.join(", ")}`)}}setupEventListeners(){this.form.addEventListener("submit",t=>{t.preventDefault();const e=this.input.value.trim();e&&(this.eventBus.emit("userMessage",e),this.input.value="")}),this.eventBus.on("buttonClicked",t=>{this.eventBus.emit("interactiveElementClicked",t),this.removeInteractiveElements()}),this.eventBus.on("carouselButtonClicked",t=>{this.eventBus.emit("interactiveElementClicked",t),this.removeInteractiveElements()}),this.eventBus.on("assistantMessageStreamed",({content:t})=>{this.handleAssistantStreamedMessage(t),console.log("assistnatmessageStreamed activated",t)}),this.eventBus.on("assistantMessageNonStreamed",({content:t,metadata:e})=>{this.handleAssistantNonStreamedMessage(t,e)}),this.eventBus.on("error",({message:t})=>{this.displayError(t)}),this.eventBus.on("choicePresented",({buttons:t})=>{this.addButtons(t)}),this.eventBus.on("carouselPresented",({items:t})=>{this.addCarousel(t)}),this.eventBus.on("end",()=>{this.currentAssistantMessage=null,this.hideTypingIndicator()})}handleAssistantStreamedMessage(t){this.currentAssistantMessage||(this.currentAssistantMessage=this.createMessage("assistant","",null,!1,!0,isStreamed),this.messageContainer.appendChild(this.currentAssistantMessage),this.currentAssistantMessage.appendHTMLContent(t),this.scrollToBottom())}handleAssistantNonStreamedMessage(t,e){const s=this.createMessage("assistant",t,e,!0,void 0,!1);this.messageContainer.appendChild(s),this.scrollToBottom(),this.showTypingIndicator();const n=s.shadowRoot.querySelector(".message__content");n&&l(n,t,5).then(()=>{this.scrollToBottom(),this.hideTypingIndicator()})}createMessage(t,e,s=null,n=!0,i,a=!1){const o=document.createElement("message-component");return o.eventBus=this.eventBus,o.setAttribute("sender",t),o.setAttribute("content",e),a&&o.setAttribute("streaming",""),s&&o.setAttribute("metadata",JSON.stringify(s)),n||o.setAttribute("data-animate","false"),i&&o.setAttribute("data-animation-speed",i.toString()),o}addButtons(t,e=!1){if(!Array.isArray(t)){console.error("Invalid buttons data:",t);return}const s=document.createElement("div");s.className="button-group",t.forEach(n=>{const i=document.createElement("button-component");i.eventBus=this.eventBus,i.setAttribute("label",n.name),i.setAttribute("payload",JSON.stringify(n.request)),s.appendChild(i)}),this.messageContainer.appendChild(s),this.scrollToBottom()}addCarousel(t,e=!1){if(!Array.isArray(t)){console.error("Invalid carousel items:",t);return}const s=document.createElement("carousel-component");s.eventBus=this.eventBus,s.setAttribute("data-carousel",JSON.stringify({cards:t})),this.messageContainer.appendChild(s),this.scrollToBottom()}showTypingIndicator(){this.typingIndicator&&(this.typingIndicator.style.display="flex",this.scrollToBottom())}hideTypingIndicator(){this.typingIndicator&&(this.typingIndicator.style.display="none")}displayError(t){const e=document.createElement("div");e.classList.add("error-message"),e.textContent=t,this.messageContainer.appendChild(e),this.scrollToBottom()}removeInteractiveElements(){this.messageContainer.querySelectorAll("button-component, carousel-component, .button-group").forEach(e=>e.remove())}scrollToBottom(){this.messageContainer.scrollTop=this.messageContainer.scrollHeight}destroy(){this.abortController&&this.abortController.abort(),this.eventBus.removeAllListeners()}addMessage(t,e,s=null,n=!1){const i=t==="assistant"&&!n,a=n?10:void 0,o=this.createMessage(t,e,s,i,a,!1);this.messageContainer.appendChild(o),this.scrollToBottom()}}export{u as C};
//# sourceMappingURL=base-chatbot-ui.sCNaEcCP.js.map
