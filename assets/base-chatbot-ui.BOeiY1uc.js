import"./vendor.DqvJXvYX.js";import{p as r}from"./markdown-util.DadijVe3.js";class m{constructor(t){if(!t.container)throw new Error("ChatbotUI requires a container element");if(!t.eventBus)throw new Error("ChatbotUI requires an event bus");this.container=t.container,this.eventBus=t.eventBus,this.type=t.type,this.currentAssistantMessage=null,this.setupUIElements(),this.setupEventListeners()}setupUIElements(){var s;const t=this.container.querySelectorAll(".message-container");this.messageContainer=t[0],console.log("Message container found:",!!this.messageContainer);const e=this.container.querySelectorAll(".chat-form");this.form=e[0],console.log("Chat form found:",!!this.form);const n=this.container.querySelectorAll(".chatbot-input");this.input=n[0],console.log("Chat input found:",!!this.input);const i=this.container.querySelectorAll(".chat-typing");if(this.typingIndicator=i[0],console.log("Typing indicator found:",!!this.typingIndicator),this.typingText=(s=this.typingIndicator)==null?void 0:s.querySelector(".typing-text"),console.log("Typing text found:",!!this.typingText),console.log("Container HTML:",this.container.innerHTML),!this.messageContainer||!this.form||!this.input){const o=[];throw this.messageContainer||o.push("message-container"),this.form||o.push("chat-form"),this.input||o.push("chatbot-input"),new Error(`Required UI elements not found: ${o.join(", ")}`)}}setupEventListeners(){this.form.addEventListener("submit",t=>{t.preventDefault();const e=this.input.value.trim();e&&(this.showTypingIndicator(),this.addMessage("user",e,null,!1),this.eventBus.emit("userMessage",e),this.input.value="")}),this.eventBus.on("typing",({isTyping:t,message:e})=>{t?this.showTypingIndicator(e):this.hideTypingIndicator()}),this.eventBus.on("buttonClicked",t=>{const e=t.label||"Button clicked";this.showTypingIndicator(),this.addMessage("user",e,null,!1),this.eventBus.emit("sendAction",t.action),this.removeInteractiveElements()}),this.eventBus.on("assistantMessageStreamed",({content:t})=>{this.handleAssistantStreamedMessage(t),console.log("assistnatmessageStreamed activated",t)}),this.eventBus.on("assistantMessageNonStreamed",({content:t,metadata:e})=>{this.handleAssistantNonStreamedMessage(t,e)}),this.eventBus.on("error",({message:t})=>{this.displayError(t)}),this.eventBus.on("choicePresented",({buttons:t})=>{this.addButtons(t)}),this.eventBus.on("carouselPresented",({items:t})=>{this.addCarousel(t)}),this.eventBus.on("end",()=>{this.currentAssistantMessage=null,this.hideTypingIndicator()})}handleAssistantStreamedMessage(t){this.currentAssistantMessage?this.currentAssistantMessage.appendHTMLContent(t):(this.currentAssistantMessage=this.createMessage("assistant","",null,!1,void 0,!0),this.messageContainer.appendChild(this.currentAssistantMessage),this.currentAssistantMessage.setAttribute("content",t),this.currentAssistantMessage.appendHTMLContent(t),this.scrollToBottom())}handleAssistantNonStreamedMessage(t,e){const n=r(t),i=this.createMessage("assistant",n,e,!0,2,!1);this.messageContainer.appendChild(i);const s=i.shadowRoot.querySelector(".message__content");if(s){const o=document.createElement("div");for(o.innerHTML=n,s.innerHTML="";o.firstChild;)s.appendChild(o.firstChild);s.classList.add("fade-in"),this.hideTypingIndicator()}this.scrollToBottom()}createMessage(t,e,n=null,i=!0,s,o=!1){const a=document.createElement("message-component");return a.eventBus=this.eventBus,a.setAttribute("sender",t),a.setAttribute("content",e),o&&a.setAttribute("streaming",""),n&&a.setAttribute("metadata",JSON.stringify(n)),i||a.setAttribute("data-animate","false"),s&&a.setAttribute("data-animation-speed",s.toString()),a}addButtons(t,e=!1){if(!Array.isArray(t)){console.error("Invalid buttons data:",t);return}const n=document.createElement("div");n.className="button-group",t.forEach(i=>{const s=document.createElement("button-component");s.eventBus=this.eventBus,s.setAttribute("label",i.name),s.setAttribute("payload",JSON.stringify(i.request)),n.appendChild(s)}),this.messageContainer.appendChild(n),this.scrollToBottom()}addCarousel(t,e=!1){if(!Array.isArray(t)){console.error("Invalid carousel items:",t);return}const n=document.createElement("carousel-component");n.eventBus=this.eventBus,n.setAttribute("data-carousel",JSON.stringify({cards:t})),this.messageContainer.appendChild(n),this.scrollToBottom()}showTypingIndicator(t=null){this.typingIndicator&&(this.typingIndicator.style.display="flex",t&&this.typingText&&(this.typingText.textContent=t),this.scrollToBottom())}hideTypingIndicator(){this.typingIndicator&&(this.typingIndicator.style.display="none")}displayError(t){const e=document.createElement("div");e.classList.add("error-message"),e.textContent=t,this.messageContainer.appendChild(e),this.scrollToBottom()}removeInteractiveElements(){this.messageContainer.querySelectorAll("button-component, carousel-component, .button-group").forEach(e=>e.remove())}scrollToBottom(){this.messageContainer.scrollTop=this.messageContainer.scrollHeight}destroy(){this.abortController&&this.abortController.abort(),this.eventBus.removeAllListeners()}addMessage(t,e,n=null,i=!1,s=!1){const o=t==="assistant"&&!s?r(e):e,a=t==="assistant"&&!i,l=i?2:void 0,h=this.createMessage(t,o,n,a,l,s);this.messageContainer.appendChild(h),this.scrollToBottom()}}export{m as C};
//# sourceMappingURL=base-chatbot-ui.BOeiY1uc.js.map
