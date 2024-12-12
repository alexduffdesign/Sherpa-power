class o{constructor(t,e){this.shadowRoot=t,this.eventBus=e,this.setupUIElements(),this.setupEventListeners()}setupUIElements(){this.container=this.shadowRoot.querySelector(".chatbot-container"),this.messageContainer=this.shadowRoot.querySelector(".message-container"),this.typingIndicator=this.shadowRoot.querySelector(".chat-typing"),this.typingText=this.shadowRoot.querySelector(".typing-text"),this.form=this.shadowRoot.querySelector(".chat-form"),this.input=this.shadowRoot.querySelector(".chat-input")}setupEventListeners(){this.form.addEventListener("submit",t=>{t.preventDefault();const e=this.input.value.trim();e&&(this.addMessage("user",e),this.eventBus.emit("userMessage",e),this.input.value="")}),this.eventBus.on("messageReceived",({content:t,metadata:e})=>{this.addMessage("assistant",t,e)}),this.eventBus.on("typing",({isTyping:t})=>{t?this.showTypingIndicator():this.hideTypingIndicator()}),this.eventBus.on("typingText",({text:t})=>{this.updateTypingText(t)}),this.eventBus.on("error",({message:t})=>{this.displayError(t)})}addMessage(t,e,i=null){const s=document.createElement("message-component");s.setAttribute("sender",t),s.setAttribute("content",e),i&&s.setAttribute("metadata",JSON.stringify(i)),this.messageContainer.appendChild(s),this.scrollToBottom()}addButtons(t){const e=document.createElement("div");e.className="buttons-container",t.forEach(i=>{const s=document.createElement("button-component");s.setAttribute("label",i.name),s.setAttribute("payload",JSON.stringify(i.request)),e.appendChild(s)}),this.messageContainer.appendChild(e),this.scrollToBottom()}showTypingIndicator(){this.typingIndicator&&(this.typingIndicator.style.display="flex",this.scrollToBottom())}hideTypingIndicator(){this.typingIndicator&&(this.typingIndicator.style.display="none")}updateTypingText(t){this.typingText&&(this.typingText.textContent=t)}displayError(t){const e=document.createElement("div");e.classList.add("error-message"),e.textContent=t,this.messageContainer.appendChild(e),this.scrollToBottom()}removeInteractiveElements(){this.messageContainer.querySelectorAll("button-component, carousel-component, .buttons-container").forEach(e=>e.remove())}scrollToBottom(){this.messageContainer.scrollTop=this.messageContainer.scrollHeight}}export{o as B};
//# sourceMappingURL=base-chatbot-ui.VFY9Qhos.js.map