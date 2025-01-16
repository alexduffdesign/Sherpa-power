import"./vendor.DqvJXvYX.js";import{p as d}from"./markdown-util.DadijVe3.js";class v{constructor(e){if(!e.container)throw new Error("ChatbotUI requires a container element");if(!e.eventBus)throw new Error("ChatbotUI requires an event bus");this.container=e.container,this.eventBus=e.eventBus,this.type=e.type,this.currentAssistantMessage=null,this.setupUIElements(),this.setupEventListeners()}setupUIElements(){var n;const e=this.container.querySelectorAll(".message-container");this.messageContainer=e[0];const t=this.container.querySelectorAll(".chat-form");this.form=t[0];const s=this.container.querySelectorAll(".chatbot-input");this.input=s[0];const o=this.container.querySelectorAll(".chat-typing");if(this.typingIndicator=o[0],this.typingText=(n=this.typingIndicator)==null?void 0:n.querySelector(".typing-text"),this.chatMessages=this.container.querySelector(".chat-messages"),console.log("Container HTML:",this.container.innerHTML),!this.messageContainer||!this.form||!this.input){const a=[];throw this.messageContainer||a.push("message-container"),this.form||a.push("chat-form"),this.input||a.push("chatbot-input"),new Error(`Required UI elements not found: ${a.join(", ")}`)}}setupEventListeners(){this.form.addEventListener("submit",e=>{e.preventDefault();const t=this.input.value.trim();t&&(this.removeInteractiveElements(),this.showTypingIndicator("Sherpa Guide Thinking..."),this.addMessage("user",t,null,!1),this.eventBus.emit("userMessage",t),this.input.value="")}),this.eventBus.on("typing",({isTyping:e,message:t})=>{e?this.showTypingIndicator(t):this.hideTypingIndicator()}),this.eventBus.on("waitingText",({text:e})=>{this.showTypingIndicator(e)}),this.eventBus.on("buttonClicked",e=>{const t=e.label||"Button clicked";this.showTypingIndicator(),this.addMessage("user",t,null,!1),this.eventBus.emit("sendAction",e.action),this.removeInteractiveElements()}),this.eventBus.on("assistantMessageStreamed",({content:e})=>{this.handleAssistantStreamedMessage(e),console.log("assistnatmessageStreamed activated",e)}),this.eventBus.on("assistantMessageNonStreamed",({content:e,metadata:t})=>{this.handleAssistantNonStreamedMessage(e,t)}),this.eventBus.on("error",({message:e})=>{this.displayError(e)}),this.eventBus.on("choicePresented",({buttons:e})=>{this.addButtons(e)}),this.eventBus.on("carouselPresented",({items:e})=>{this.addCarousel(e)}),this.eventBus.on("end",()=>{this.currentAssistantMessage=null,this.hideTypingIndicator()}),this.eventBus.on("deviceSources",({sources:e})=>{this.addDeviceSources(e)})}handleAssistantStreamedMessage(e){this.currentAssistantMessage?this.currentAssistantMessage.appendHTMLContent(e):(this.currentAssistantMessage=this.createMessage("assistant","",null,!1,void 0,!0),this.messageContainer.appendChild(this.currentAssistantMessage),this.currentAssistantMessage.setAttribute("content",e),this.currentAssistantMessage.appendHTMLContent(e),this.scrollToBottom())}handleAssistantNonStreamedMessage(e,t){const s=d(e),o=this.createMessage("assistant",s,t,!0,2,!1);this.messageContainer.appendChild(o),this.hideTypingIndicator(),this.scrollToBottom()}createMessage(e,t,s=null,o=!0,n,a=!1){const i=document.createElement("message-component");return i.eventBus=this.eventBus,i.setAttribute("sender",e),i.setAttribute("content",t),a&&i.setAttribute("streaming",""),s&&i.setAttribute("metadata",JSON.stringify(s)),o||i.setAttribute("data-animate","false"),n&&i.setAttribute("data-animation-speed",n.toString()),i}addButtons(e,t=!1){if(!Array.isArray(e)){console.error("Invalid buttons data:",e);return}const s=document.createElement("div");s.className="button-group",e.forEach(o=>{const n=document.createElement("button-component");n.eventBus=this.eventBus,n.setAttribute("label",o.name),n.setAttribute("payload",JSON.stringify(o.request)),s.appendChild(n)}),this.messageContainer.appendChild(s),this.scrollToBottom()}addCarousel(e,t=!1){if(!Array.isArray(e)){console.error("Invalid carousel items:",e);return}const s=document.createElement("carousel-component");s.eventBus=this.eventBus,s.setAttribute("data-carousel",JSON.stringify({cards:e})),this.messageContainer.appendChild(s),this.scrollToBottom()}showTypingIndicator(e="Sherpa Guide Thinking"){this.typingIndicator&&(this.typingIndicator.style.display="flex",e&&this.typingText&&(this.typingText.textContent=e),this.scrollToBottom())}hideTypingIndicator(){this.typingIndicator&&(this.typingIndicator.style.display="none")}displayError(e){const t=document.createElement("div");t.classList.add("error-message"),t.textContent=e,this.messageContainer.appendChild(t),this.scrollToBottom()}removeInteractiveElements(){this.messageContainer.querySelectorAll("button-component, carousel-component, .button-group").forEach(t=>t.remove())}scrollToBottom(){var e,t;if(this.type==="main"){const s=(t=(e=this.container.closest("custom-drawer"))==null?void 0:e.shadowRoot)==null?void 0:t.querySelector('[part="body"]');s&&(s.scrollTop=s.scrollHeight)}else this.chatMessages.scrollTop=this.chatMessages.scrollHeight}destroy(){this.abortController&&this.abortController.abort(),this.eventBus.removeAllListeners()}addMessage(e,t,s=null,o=!1,n=!1){const a=e==="assistant"&&!n?d(t):t,i=e==="assistant"&&!o,r=o?2:void 0,c=this.createMessage(e,a,s,i,r,n);this.messageContainer.appendChild(c),this.scrollToBottom()}addDeviceSources(e){const t=document.createElement("div");t.className="device-sources";const s=document.createElement("div");s.className="device-sources__header";const o=document.createElement("h4");o.className="device-sources__title",o.textContent="Sources Used For Device Calculations";const n=document.createElement("span");n.className="device-sources__chevron",n.innerHTML=`
      <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.41 0.589844L6 5.16984L10.59 0.589844L12 1.99984L6 7.99984L0 1.99984L1.41 0.589844Z" fill="white"/>
      </svg>
    `,s.appendChild(o),s.appendChild(n);const a=document.createElement("div");a.className="device-sources__content",a.style.display="none",e.forEach(i=>{const r=document.createElement("div");r.className="device-sources__section";const c=document.createElement("div");c.className="device-sources__device",c.textContent=i.name.charAt(0).toUpperCase()+i.name.slice(1),r.appendChild(c);const l=document.createElement("ul");l.className="device-sources__list",i.sources.forEach(u=>{const h=document.createElement("li");h.textContent=u,h.style.color="white",l.appendChild(h)}),r.appendChild(l),a.appendChild(r)}),t.appendChild(s),t.appendChild(a),s.addEventListener("click",()=>{const i=a.style.display!=="none";a.style.display=i?"none":"block",s.classList.toggle("expanded")}),this.messageContainer.appendChild(t),this.scrollToBottom()}}export{v as C};
//# sourceMappingURL=base-chatbot-ui.CISkE6vQ.js.map
