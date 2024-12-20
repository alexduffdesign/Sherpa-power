import"./vendor.DqvJXvYX.js";function l(a,t,e=5){return new Promise(s=>{let n=0;a.textContent="";let i=performance.now();const r=o=>{o-i>=e&&(a.textContent+=t[n],n++,i=o),n<t.length?requestAnimationFrame(r):s()};requestAnimationFrame(r)})}class c{constructor(t){if(!t.container)throw new Error("ChatbotUI requires a container element");if(!t.eventBus)throw new Error("ChatbotUI requires an event bus");this.container=t.container,this.eventBus=t.eventBus,this.type=t.type,this.currentAssistantMessage=null,this.setupUIElements(),this.setupEventListeners()}setupUIElements(){var i;const t=this.container.querySelectorAll(".message-container");this.messageContainer=t[0],console.log("Message container found:",!!this.messageContainer);const e=this.container.querySelectorAll(".chat-form");this.form=e[0],console.log("Chat form found:",!!this.form);const s=this.container.querySelectorAll(".chatbot-input");this.input=s[0],console.log("Chat input found:",!!this.input);const n=this.container.querySelectorAll(".chat-typing");if(this.typingIndicator=n[0],console.log("Typing indicator found:",!!this.typingIndicator),this.typingText=(i=this.typingIndicator)==null?void 0:i.querySelector(".typing-text"),console.log("Typing text found:",!!this.typingText),console.log("Container HTML:",this.container.innerHTML),!this.messageContainer||!this.form||!this.input){const r=[];throw this.messageContainer||r.push("message-container"),this.form||r.push("chat-form"),this.input||r.push("chatbot-input"),new Error(`Required UI elements not found: ${r.join(", ")}`)}}setupEventListeners(){this.form.addEventListener("submit",t=>{t.preventDefault();const e=this.input.value.trim();e&&(this.eventBus.emit("userMessage",e),this.input.value="")}),this.eventBus.on("buttonClicked",t=>{this.eventBus.emit("userMessage",t),this.removeInteractiveElements()}),this.eventBus.on("carouselButtonClicked",t=>{this.eventBus.emit("userMessage",t),this.removeInteractiveElements()}),this.eventBus.on("assistantMessageStreamed",({content:t})=>{this.handleAssistantStreamedMessage(t)}),this.eventBus.on("assistantMessageNonStreamed",({content:t,metadata:e})=>{this.handleAssistantNonStreamedMessage(t,e)}),this.eventBus.on("error",({message:t})=>{this.displayError(t)}),this.eventBus.on("choicePresented",({buttons:t})=>{this.addButtons(t)}),this.eventBus.on("carouselPresented",({items:t})=>{this.addCarousel(t)}),this.eventBus.on("end",()=>{this.currentAssistantMessage=null})}handleAssistantStreamedMessage(t){this.currentAssistantMessage||(this.currentAssistantMessage=this.createMessage("assistant","",null,!1,void 0,!0),this.messageContainer.appendChild(this.currentAssistantMessage)),this.currentAssistantMessage.appendHTMLContent(t),this.scrollToBottom()}handleAssistantNonStreamedMessage(t,e){const s=this.createMessage("assistant",t,e,!0,void 0,!1);this.messageContainer.appendChild(s),this.scrollToBottom();const n=s.shadowRoot.querySelector(".message__content");n&&l(n,t,5).then(()=>{this.scrollToBottom()})}createMessage(t,e,s=null,n=!0,i,r=!1){const o=document.createElement("message-component");return o.eventBus=this.eventBus,o.setAttribute("sender",t),o.setAttribute("content",e),r&&o.setAttribute("streaming",""),s&&o.setAttribute("metadata",JSON.stringify(s)),n||o.setAttribute("data-animate","false"),i&&o.setAttribute("data-animation-speed",i.toString()),o}addButtons(t,e=!1){if(!Array.isArray(t)){console.error("Invalid buttons data:",t);return}const s=document.createElement("div");s.className="button-group",t.forEach(n=>{const i=document.createElement("button-component");i.eventBus=this.eventBus,i.setAttribute("label",n.name),i.setAttribute("payload",JSON.stringify(n.request)),s.appendChild(i)}),this.messageContainer.appendChild(s),this.scrollToBottom()}addCarousel(t,e=!1){if(!Array.isArray(t)){console.error("Invalid carousel items:",t);return}const s=document.createElement("carousel-component");s.eventBus=this.eventBus,s.setAttribute("data-carousel",JSON.stringify({cards:t})),this.messageContainer.appendChild(s),this.scrollToBottom()}showTypingIndicator(){this.typingIndicator&&(this.typingIndicator.style.display="flex",this.scrollToBottom())}hideTypingIndicator(){this.typingIndicator&&(this.typingIndicator.style.display="none")}displayError(t){const e=document.createElement("div");e.classList.add("error-message"),e.textContent=t,this.messageContainer.appendChild(e),this.scrollToBottom()}removeInteractiveElements(){this.messageContainer.querySelectorAll("button-component, carousel-component, .button-group").forEach(e=>e.remove())}scrollToBottom(){this.messageContainer.scrollTop=this.messageContainer.scrollHeight}destroy(){this.abortController&&this.abortController.abort(),this.eventBus.removeAllListeners()}addMessage(t,e,s=null,n=!1){const i=t==="assistant"&&!n,r=n?10:void 0,o=this.createMessage(t,e,s,i,r,!1);this.messageContainer.appendChild(o),this.scrollToBottom()}}export{c as C};
//# sourceMappingURL=base-chatbot-ui.C58mxLy-.js.map
