import{E}from"./vendor.DqvJXvYX.js";class w extends E{}const i=new w,l={MAIN_CHATBOT:{MESSAGE_RECEIVED:"mainChatbot:messageReceived",TYPING:"mainChatbot:typing",CHOICE_PRESENTED:"mainChatbot:choicePresented",CAROUSEL_PRESENTED:"mainChatbot:carouselPresented",ERROR:"mainChatbot:error"},SECTION_CHATBOT:{MESSAGE_RECEIVED:"sectionChatbot:messageReceived",DEVICE_ANSWER:"sectionChatbot:deviceAnswer",CHOICE_PRESENTED:"sectionChatbot:choicePresented",CAROUSEL_PRESENTED:"sectionChatbot:carouselPresented",ERROR:"sectionChatbot:error"}};class f{constructor({userID:t,endpoint:e,chatbotType:s}){if(!t)throw new Error("ChatbotCore requires a userID.");if(!e)throw new Error("ChatbotCore requires an endpoint URL.");if(!s)throw new Error('ChatbotCore requires a chatbotType ("main" or "section").');this.userID=t,this.endpoint=e,this.chatbotType=s,this.eventPrefix=s==="main"?"mainChatbot":"sectionChatbot",this.abortController=null,this.initialize()}initialize(){}sendLaunch(t={}){console.log("Constructing launch payload");const e={action:{type:"launch"}};return console.log("Final launch payload:",e),this.sendAction(e)}sendMessage(t){console.log("Constructing message payload:",t);const e={action:{type:"text",payload:t}};return console.log("Final message payload:",e),this.sendAction(e)}async sendAction(t){this.abortController=new AbortController;const{signal:e}=this.abortController;try{console.log("Sending action to Gadget API:",t),i.emit(`${this.eventPrefix}:typing`,{isTyping:!0});const s=await fetch(this.endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userID:this.userID,action:t.action}),credentials:"include",signal:e});if(!s.ok)throw new Error(`Gadget API responded with status ${s.status}`);const o=s.body.getReader(),n=new TextDecoder("utf-8");let c="";for(;;){const{done:r,value:d}=await o.read();if(r){i.emit(`${this.eventPrefix}:end`,{});break}c+=n.decode(d,{stream:!0});const m=c.split(`

`);c=m.pop(),m.forEach(u=>{if(u.trim()!=="")try{const h=u.split(`
`),g=h.find(p=>p.startsWith("event:")),y=h.find(p=>p.startsWith("data:")),b=g?g.split(":")[1].trim():"trace",C=y?JSON.parse(u.substring(u.indexOf("data:")+5).trim()):null;b==="trace"?this.processTrace(C):b==="end"&&i.emit(`${this.eventPrefix}:end`,{})}catch(h){console.error("Error parsing SSE event:",h)}})}}catch(s){i.emit(`${this.eventPrefix}:typing`,{isTyping:!1}),s.name==="AbortError"?console.warn("SSE connection aborted"):(console.error("SSE connection error:",s),i.emit(`${this.eventPrefix}:error`,{message:s.message}))}finally{this.abortController=null,i.emit(`${this.eventPrefix}:end`,{}),i.emit(`${this.eventPrefix}:typing`,{isTyping:!1})}}processTrace(t){if(!t.type){console.warn("Trace without type received:",t);return}switch(i.emit(`${this.eventPrefix}:typing`,{isTyping:!1}),t.type){case"text":console.log("Text received trace:",t),i.emit(`${this.eventPrefix}:messageReceived`,{content:t.payload.message,metadata:t.payload.metadata||null});break;case"choice":console.log("Choice received trace:",t),i.emit(`${this.eventPrefix}:choicePresented`,{type:"choice",buttons:t.payload.buttons});break;case"carousel":console.log("Carousel received trace:",t),i.emit(`${this.eventPrefix}:carouselPresented`,{type:"carousel",carouselItems:t.payload.cards});break;case"speak":console.log("Speak received trace:",t);break;case"visual":console.log("Visual received trace:",t);break;case"no-reply":console.log("No-reply received trace:",t);break;case"end":console.log("End trace received:",t),i.emit(`${this.eventPrefix}:end`,{});break;case"completion-events":console.log("Completion event trace received:",t);break;default:console.warn(`Unhandled trace type: ${t.type}`,t)}}closeConnection(){this.abortController&&(this.abortController.abort(),console.log("SSE connection closed."))}destroy(){this.closeConnection(),i.removeAllListeners(`${this.eventPrefix}:messageReceived`),i.removeAllListeners(`${this.eventPrefix}:choicePresented`),i.removeAllListeners(`${this.eventPrefix}:carouselPresented`),i.removeAllListeners(`${this.eventPrefix}:deviceAnswer`),i.removeAllListeners(`${this.eventPrefix}:error`),i.removeAllListeners(`${this.eventPrefix}:typing`),i.removeAllListeners(`${this.eventPrefix}:end`)}}class x{constructor(t){if(this.container=t,this.form=this.container.querySelector(".chat-form"),this.input=this.container.querySelector("input[type='text']"),this.messageContainer=this.container.querySelector(".message-container"),this.typingIndicator=this.container.querySelector(".chat-typing"),console.log("Chatbot UI Container:",this.container),console.log("Chat Form:",this.form),console.log("Chat Input:",this.input),console.log("Message Container:",this.messageContainer),console.log("Typing Indicator:",this.typingIndicator),!this.container){console.error("Main Chatbot UI container not found");return}if(!this.form||!this.input){console.error("Main Chatbot form or input not found");return}this.setupEventListeners()}setupEventListeners(){this.form.addEventListener("submit",t=>{t.preventDefault();const e=this.input.value.trim();e&&(i.emit("userMessage",e),this.input.value="")}),i.on(`${l.MAIN_CHATBOT.PREFIX}:typing`,t=>{t.isTyping?this.showTypingIndicator():this.hideTypingIndicator()}),this.messageContainer.addEventListener("click",t=>{const e=t.target.closest("button-component");if(e){const s=JSON.parse(e.getAttribute("payload")||"{}"),o=e.getAttribute("label");o&&(i.emit("buttonClicked",{type:s.type,payload:s,label:o}),this.removeInteractiveElements())}})}addMessage(t,e,s=null,o=!1){if(!this.messageContainer){console.error("Message container not set");return}!o&&(!s||!s.isInteractive)&&this.removeInteractiveElements();const n=document.createElement("message-component");if(n.setAttribute("sender",t),n.setAttribute("content",e),s!=null&&s.imageUrl&&n.setAttribute("image-url",s.imageUrl),this.messageContainer.appendChild(n),console.log("Message appended to messageContainer"),this.scrollToBottom(),t==="assistant"&&s)switch(s.type){case"choice":this.addButtons(s.buttons,o);break;case"carousel":this.addCarousel(s.carouselItems,o);break}}addButtons(t,e=!1){if(console.log("addButtons called with:",t),!Array.isArray(t)){console.error("addButtons expected an array but received:",t);return}e||(this.removeInteractiveElements(),this.storeInteractiveState("choice",t)),t.forEach(s=>{const o=document.createElement("button-component");o.setAttribute("label",s.name),o.setAttribute("payload",JSON.stringify(s.request)),this.messageContainer.appendChild(o),console.log("Button appended to messageContainer")}),this.scrollToBottom()}addCarousel(t,e=!1){if(console.log("Adding carousel with items:",t),!Array.isArray(t)){console.error("addCarousel expected an array but received:",t);return}e||(this.removeInteractiveElements(),this.storeInteractiveState("carousel",t));const s={cards:t},o=document.createElement("carousel-component");o.setAttribute("data-carousel",JSON.stringify(s)),this.messageContainer.appendChild(o),this.scrollToBottom()}storeInteractiveState(t,e){const s={type:t,data:e,timestamp:Date.now()};localStorage.setItem("lastInteractiveElement",JSON.stringify(s))}restoreInteractiveElement(){const t=localStorage.getItem("lastInteractiveElement");if(t)try{const e=JSON.parse(t);e.type==="choice"?this.addButtons(e.data,!0):e.type==="carousel"&&this.addCarousel(e.data,!0)}catch(e){console.error("Error restoring interactive element:",e)}}showTypingIndicator(){this.typingIndicator&&(this.typingIndicator.style.display="flex",this.scrollToBottom())}hideTypingIndicator(){this.typingIndicator&&(this.typingIndicator.style.display="none")}displayError(t){const e=document.createElement("div");e.classList.add("error-message"),e.innerText=t,this.messageContainer.appendChild(e),this.scrollToBottom()}scrollToBottom(){this.messageContainer.scrollTop=this.messageContainer.scrollHeight}removeInteractiveElements(){this.messageContainer.querySelectorAll("button-component, carousel-component").forEach(e=>e.remove()),localStorage.removeItem("lastInteractiveElement")}}function v(a){const t=Date.now().toString(36)+Math.random().toString(36).substr(2,9);return`${a}-${t}`}class I{constructor(t,e){this.core=t,this.ui=e,this.historyKey="mainChatbotHistory",this.launchKey="chatHasLaunched",this.isLaunched=this.hasLaunched(),this.setupEventListeners()}hasLaunched(){return localStorage.getItem(this.launchKey)==="true"}setLaunched(){localStorage.setItem(this.launchKey,"true"),this.isLaunched=!0}setupEventListeners(){i.on(l.MAIN_CHATBOT.MESSAGE_RECEIVED,t=>{this.ui.addMessage("assistant",t.content,t.metadata),this.saveToHistory("assistant",t.content,t.metadata)}),i.on("userMessage",t=>{this.ui.addMessage("user",t),this.saveToHistory("user",t),this.core.sendMessage(t)}),i.on(l.MAIN_CHATBOT.CHOICE_PRESENTED,t=>{this.ui.addButtons(t.buttons),this.saveToHistory("assistant","",{type:"choice",buttons:t.buttons})}),i.on(l.MAIN_CHATBOT.CAROUSEL_PRESENTED,t=>{this.ui.addCarousel(t.carouselItems),this.saveToHistory("assistant","",{type:"carousel",carouselItems:t.carouselItems})}),i.on(l.MAIN_CHATBOT.ERROR,t=>{this.ui.displayError(t.message)}),i.on(l.MAIN_CHATBOT.TYPING,t=>{t.isTyping?this.ui.showTypingIndicator():this.ui.hideTypingIndicator()}),document.addEventListener("chatbotLaunch",()=>{this.launch()}),i.on("carouselButtonClicked",t=>{if(!t||!t.action){console.error("Invalid carousel button data:",t);return}this.ui.addMessage("user",t.label),this.saveToHistory("user",t.label),this.core.sendAction({action:t.action})})}launch(){if(this.isLaunched){console.log("Chat already launched, skipping launch request");return}this.core.sendLaunch().then(()=>{console.log("Chatbot launched successfully."),this.setLaunched()}).catch(t=>{console.error("Error launching chatbot:",t),this.ui.displayError("Failed to launch the chatbot. Please try again later.")})}sendMessage(t){const e=this.sanitizeInput(t);this.ui.addMessage("user",e,{type:"message"}),this.saveToHistory("user",e,{type:"message"}),this.core.sendMessage(e).catch(s=>{console.error("Error sending message:",s),this.ui.displayError("Failed to send your message. Please try again.")})}sendAction(t){if(!t||typeof t!="object"){console.error("Invalid action payload:",t),this.ui.displayError("Invalid action triggered.");return}this.core.sendAction({action:t,config:{}}).then(()=>{console.log("Action sent successfully:",t),this.ui.addMessage("user",t.label||"Action executed.",{type:"action"}),this.saveToHistory("user",JSON.stringify(t),{type:"action"})}).catch(e=>{console.error("Error sending action:",e),this.ui.displayError("An error occurred while processing your request.")})}saveToHistory(t,e,s=null){const o=JSON.parse(localStorage.getItem(this.historyKey))||[],n={sender:t,message:e,timestamp:Date.now(),isInteractive:!1};t==="assistant"&&s&&(s.type==="choice"?(n.isInteractive=!0,n.traceType="choice",n.traceData={buttons:s.buttons}):s.type==="carousel"&&(n.isInteractive=!0,n.traceType="carousel",n.traceData={cards:s.carouselItems})),o.push(n),localStorage.setItem(this.historyKey,JSON.stringify(o))}loadHistory(){const t=JSON.parse(localStorage.getItem(this.historyKey))||[];for(let e=0;e<t.length-1;e++){const s=t[e];s.message&&s.message.trim()!==""&&this.ui.addMessage(s.sender,s.message)}if(t.length>0){const e=t[t.length-1];e.message&&e.message.trim()!==""&&!e.isInteractive&&this.ui.addMessage(e.sender,e.message),e.isInteractive&&e.sender==="assistant"&&this.restoreInteractiveElement(e)}}restoreInteractiveElement(t){t.traceType==="choice"?this.ui.addButtons(t.traceData.buttons):t.traceType==="carousel"&&this.ui.addCarousel(t.traceData.cards)}sanitizeInput(t){const e=document.createElement("div");return e.textContent=t,e.innerHTML}}document.addEventListener("DOMContentLoaded",()=>{const a=document.getElementById("main-chatbot-ui");if(!a){console.error("Main Chatbot UI container not found");return}let t=localStorage.getItem("mainChatbotUserId");t||(t=v("mainChatbot"),localStorage.setItem("mainChatbotUserId",t));const e=new f({userID:t,endpoint:"https://chatbottings--development.gadget.app/voiceflowAPI/voiceflow-streaming",chatbotType:"main"}),s=new x(a);new I(e,s).loadHistory()});class S{constructor(t){if(this.container=t,this.form=this.container.querySelector(".chat-form"),this.input=this.container.querySelector("input[type='text']"),this.messageContainer=this.container.querySelector(".message-container"),!this.container){console.error("Section Chatbot UI container not found");return}if(!this.form||!this.input){console.error("Section Chatbot form or input not found");return}this.productTitle=this.container.dataset.productTitle,this.productCapacity=this.container.dataset.productCapacity,this.acOutputContinuousPower=this.container.dataset.productAcOutputContinuousPower,this.acOutputPeakPower=this.container.dataset.productAcOutputPeakPower,this.dcOutputPower=this.container.dataset.productDcOutputPower,this.startBlock="shopifySection",this.productDetails={title:this.productTitle,capacity:this.productCapacity,ac_output_continuous_power:this.acOutputContinuousPower,ac_output_peak_power:this.acOutputPeakPower,dc_output_power:this.dcOutputPower},this.setupEventListeners()}setupEventListeners(){this.form.addEventListener("submit",t=>{t.preventDefault();const e=this.input.value.trim();e&&(this.emit("userMessage",e),this.input.value="")})}onUserMessage(t){i.on("userMessage",t)}onButtonClick(t){i.on("buttonClicked",t)}emit(t,e){const s=new CustomEvent(t,{detail:e});this.container.dispatchEvent(s)}addMessage(t,e){const s=document.createElement("message-component");s.setAttribute("sender",t),s.setAttribute("content",e),this.messageContainer.appendChild(s),this.scrollToBottom()}addButtons(t){t.forEach(e=>{const s=document.createElement("button-component");s.setAttribute("label",e.name),s.setAttribute("payload",JSON.stringify(e.request)),this.messageContainer.appendChild(s)}),this.scrollToBottom(),this.messageContainer.addEventListener("click",e=>{if(e.target.closest("button-component")){const s=e.target.closest("button-component"),o=JSON.parse(s.getAttribute("payload"));this.emit("buttonClicked",o),this.removeInteractiveElements()}})}addCarousel(t){const e=document.createElement("carousel-component");e.setAttribute("items",JSON.stringify(t)),this.messageContainer.appendChild(e),this.scrollToBottom()}populateApplicationsGrid(t){const e=document.querySelector(".applications-grid");if(!e){console.error("Applications grid not found");return}t.forEach(s=>{const o=document.createElement("div");o.classList.add("application-card","chatbot-card"),o.innerHTML=`
        <div class="application-card__image">
          <img src="${s.imageUrl}" alt="${s.name}" />
        </div>
        <div class="application-card__content">
          <div class="application-card__title">${s.name}</div>
          <div class="application-card__runtime">${s.estimatedRuntime}</div>
        </div>
      `,e.appendChild(o)}),this.scrollToBottom()}displayError(t){const e=document.createElement("div");e.classList.add("error-message"),e.innerText=t,this.messageContainer.appendChild(e),this.scrollToBottom()}scrollToBottom(){this.container.scrollTop=this.container.scrollHeight}getAttribute(t){return this.container.getAttribute(t)}removeInteractiveElements(){this.messageContainer.querySelectorAll("button-component, carousel-component").forEach(e=>e.remove())}}class T{constructor(t,e){this.core=t,this.ui=e,this.isLaunched=!1,this.setupEventListeners()}setupEventListeners(){i.on(l.SECTION_CHATBOT.MESSAGE_RECEIVED,t=>{this.ui.addMessage("assistant",t.content)}),i.on(l.SECTION_CHATBOT.CHOICE_PRESENTED,t=>{this.ui.addButtons(t.choices)}),i.on(l.SECTION_CHATBOT.CAROUSEL_PRESENTED,t=>{this.ui.addCarousel(t.carouselItems)}),i.on(l.SECTION_CHATBOT.DEVICE_ANSWER,t=>{this.ui.populateApplicationsGrid(t.devices)}),i.on(l.SECTION_CHATBOT.ERROR,t=>{this.ui.displayError(t.message)})}launch(){if(this.isLaunched)return;const t={action:{type:"launch",payload:{startBlock:"shopifySection",productDetails:this.ui.productDetails}}};this.core.sendLaunch(t),this.isLaunched=!0}sendMessage(t){this.core.sendMessage(t),this.ui.addMessage("user",t)}}document.addEventListener("DOMContentLoaded",()=>{const a=document.getElementById("section-chatbot-ui");if(!a){console.error("Section Chatbot UI container not found");return}let t=localStorage.getItem("sectionChatbotUserId");t||(t=v("sectionChatbot"),localStorage.setItem("sectionChatbotUserId",t));const e=new f({userID:t,endpoint:"https://chatbottings--development.gadget.app/voiceflowAPI/voiceflow-streaming",chatbotType:"section"}),s=new S(a),o=new T(e,s);s.onUserMessage(r=>{o.sendMessage(r)}),s.onButtonClick(r=>{o.sendMessage(JSON.stringify(r))});let n=!1;const c=a.querySelector("#section-chatbot-input");c?c.addEventListener("focus",()=>{n||(o.launch(),n=!0)}):console.error("Section Chatbot input field not found")});class _ extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){const t=this.getAttribute("label"),e=this.getAttribute("payload");this.render(t,e)}render(t,e){this.shadowRoot.innerHTML=`
      <style>
        .button-container {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: var(--spacing-4);
        }

        .button {
          padding: var(--spacing-3);
          background-color: #FFFFFF;
          border: none;
          border-radius: var(--rounded);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          transition: background-color 0.3s ease;
        }

        .button:hover {
          background-color: #f0f0f0;
        }

        /* Additional styles as needed */
      </style>
      <div class="button-container">
        <button class="button" data-button-data='${e}' aria-label="${t}">${t}</button>
      </div>
    `,this.shadowRoot.querySelector(".button").addEventListener("click",()=>{try{const s=JSON.parse(e);i.emit("buttonClicked",s)}catch(s){console.error("Error parsing button payload:",s)}})}}class A extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){const t=this.getAttribute("sender"),e=this.getAttribute("content");this.render(t,e)}render(t,e){const s=t==="assistant";this.shadowRoot.innerHTML=`
      <style>
        message-component {
          width: 100%;
        }
        .message-wrapper {
          display: flex;
          align-items: flex-end;
          width: 100%;
          margin-bottom: var(--spacing-6);
          gap: var(--spacing-2);
        }

        .message-wrapper--assistant {
          justify-content: flex-start;
        }

        .message-wrapper--user {
          justify-content: flex-end;
        }

        .assistant-icon {
          width: 30px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: var(--spacing-2);
        }

        .message {
          max-width: 80%;
          padding: var(--spacing-4);
          border-radius: 20px;
          word-wrap: break-word;
          background-color: ${s?"#FFFFFF":"rgba(255, 255, 255, 0.1)"};
          color: ${s?"#231F25":"#FFFFFF"};
          border: ${s?"none":"1px solid #FFFFFF"};
        }

        .message--assistant {
          background-color: #FFFFFF;
          color: #231F25 !important;
          border-bottom-left-radius: 4px;
        }

        .message--user {
          background-color: rgba(255, 255, 255, 0.1);
          border: 1px solid #FFFFFF;
          color: white;
        }

        .message__content {
          display: flex;
          flex-direction: column;
          gap: 1em;
          flex-grow: 1;
          font-family: inherit;
        }
      </style>
      <div class="message-wrapper message-wrapper--${t}">
        ${s?'<div class="assistant-icon">🚀</div>':""}
        <div class="message message--${t}">
          <div class="message__content">${this.markdownToHtml(e)}</div>
        </div>
      </div>
    `}markdownToHtml(t){return t?t.replace(/\n/g,"<br>"):""}}class L extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.items=[],this.currentIndex=0,this.isDesktop=window.matchMedia("(min-width: 1000px)").matches,this.itemsPerSlide=this.isDesktop?2:1,this.moveLeft=this.moveLeft.bind(this),this.moveRight=this.moveRight.bind(this),this.handleResize=this.handleResize.bind(this),this.handleButtonClick=this.handleButtonClick.bind(this)}connectedCallback(){const t=this.getAttribute("data-carousel");if(!t){console.error("No data-carousel attribute found. Cannot render carousel.");return}let e;try{e=JSON.parse(t)}catch(s){console.error("Failed to parse carousel data:",s);return}if(!e||!Array.isArray(e.cards)){console.error("carouselData.cards is not defined or not an array");return}this.renderCarousel(e)}renderCarousel(t){this.carouselData=t,this.shadowRoot.innerHTML=`
      <style>
        /* Custom Carousel Styling */

        h6 {
            font-family: var(--heading-font-family);
            font-weight: var(--heading-font-weight);
            font-style: var(--heading-font-style);
            letter-spacing: var(--heading-letter-spacing);
            text-transform: var(--heading-text-transform);
            overflow-wrap: anywhere;
            font-size: var(--text-sm);
        }

        .button {
          --button-background: var(--button-background-primary) /
            var(--button-background-opacity, 1);
          --button-text-color: var(--button-text-primary);
          --button-outline-color: white;
          -webkit-appearance: none;
          appearance: none;
          border-color: white;
          border-radius: 8px;
          border-width: 1px;
          background-color: rgb(var(--button-background));
          color: rgb(var(--button-text-color));
          text-align: center;
          font-size: var(--text-h6);
          letter-spacing: var(--text-letter-spacing);
          padding-block-start: var(--spacing-2-5);
          padding-block-end: var(--spacing-2-5);
          padding-inline-start: var(--spacing-5);
          padding-inline-end: var(--spacing-5);
          font-weight: bold;
          line-height: 1.6;
          transition: background-color 0.15s ease-in-out, color 0.15s ease-in-out,
            box-shadow 0.15s ease-in-out;
          display: inline-block;
          position: relative;
        }

        .carousel {
          position: relative;
          width: 100%;
          overflow: hidden;
          margin-bottom: var(--spacing-4);
          box-sizing: border-box;
        }

        .carousel__container {
          display: flex;
          transition: transform 0.3s ease-out;
          max-width: 100%;
        }

        .carousel__item {
          flex: 0 0 100%;
          display: flex;
          gap: var(--spacing-4);
          box-sizing: border-box;
          max-width: 100%;
          align-items: flex-start;
        }

        .carousel__item-wrapper {
          flex: 0 0 100%;
          max-width: 100%;
          min-width: 0;
        }

        .carousel__button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.8);
          border: solid 1px #403545;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 2;
          margin-block-start: var(--spacing-0) !important;
        }

        .carousel__button--left {
          left: 10px;
        }

        .carousel__button--right {
          right: 10px;
        }

        .carousel__item-button {
        font-size: var(--text-sm);
        }

        .carousel__item-content {
          background: #FFFFFF;
          border-radius: 8px;
          padding: var(--spacing-4);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .carousel__item-image {
          width: 100%;
          height: auto;
          border-radius: 8px;
          margin-bottom: var(--spacing-2);
          object-fit: cover;
        }

        .carousel__item-title {
          font-weight: bold;
          margin-bottom: var(--spacing-0);
          margin-top: var(--spacing-0);
          font-size: var(--text-base);
        }

        .carousel__item-description {
          margin-bottom: var(--spacing-4);
          margin-top: var(--spacing-0);
          font-size: var(--text-sm);
          color: #403545 !important;
          flex-grow: 1;
        }

        @media (min-width: 1000px) {
          .carousel__item {
            flex: 0 0 50%;
            max-width: 50%;
          }

          .carousel__item-wrapper {
            flex: 0 0 calc(100% - var(--spacing-2));
            max-width: calc(100% - var(--spacing-2));
          }
        }
      </style>
      <div class="carousel">
        <div class="carousel__container">
          <!-- Carousel items will be dynamically added here -->
        </div>
        <button class="carousel__button carousel__button--left" aria-label="Previous slide">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
               xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="carousel__button carousel__button--right" aria-label="Next slide">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
               xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    `,this.carouselContainer=this.shadowRoot.querySelector(".carousel__container"),this.leftButton=this.shadowRoot.querySelector(".carousel__button--left"),this.rightButton=this.shadowRoot.querySelector(".carousel__button--right"),this.carouselData.cards.forEach((e,s)=>{const o=document.createElement("div");o.classList.add("carousel__item");const n=document.createElement("div");n.classList.add("carousel__item-wrapper");const c=document.createElement("div");if(c.classList.add("carousel__item-content"),e.imageUrl){const r=document.createElement("img");r.src=e.imageUrl,r.alt=e.title||"",r.classList.add("carousel__item-image"),c.appendChild(r)}if(e.title){const r=document.createElement("h6");r.classList.add("carousel__item-title"),r.textContent=e.title,c.appendChild(r)}if(e.description&&e.description.text){const r=document.createElement("p");r.classList.add("carousel__item-description"),r.textContent=e.description.text,c.appendChild(r)}if(e.buttons&&e.buttons.length>0){const r=e.buttons[0],d=document.createElement("button");d.classList.add("button","carousel__item-button"),d.setAttribute("data-button-index",s),d.setAttribute("data-button-payload",JSON.stringify(r.request)),d.setAttribute("data-button-text",r.name),d.textContent=r.name||"Select",c.appendChild(d),d.addEventListener("click",this.handleButtonClick)}n.appendChild(c),o.appendChild(n),this.carouselContainer.appendChild(o),this.items.push(o)}),this.initCarousel(),this.leftButton.addEventListener("click",this.moveLeft),this.rightButton.addEventListener("click",this.moveRight),window.addEventListener("resize",this.handleResize),this.updateVisibility(),this.updatePosition()}initCarousel(){this.isDesktop=window.matchMedia("(min-width: 1000px)").matches,this.itemsPerSlide=this.isDesktop?2:1,this.currentIndex=0,this.updateVisibility(),this.updatePosition()}handleResize(){this.isDesktop=window.matchMedia("(min-width: 1000px)").matches,this.itemsPerSlide=this.isDesktop?2:1,this.currentIndex=0,this.updatePosition(),this.updateVisibility()}moveLeft(){const t=this.itemsPerSlide;this.currentIndex=Math.max(0,this.currentIndex-t),this.updatePosition(),this.updateVisibility()}moveRight(){const t=this.itemsPerSlide;this.currentIndex=Math.min(this.items.length-t,this.currentIndex+t),this.updatePosition(),this.updateVisibility()}updatePosition(){const t=this.itemsPerSlide,e=-(this.currentIndex/t)*100;this.carouselContainer.style.transform=`translateX(${e}%)`}updateVisibility(){const t=this.itemsPerSlide;this.leftButton.disabled=this.currentIndex===0,this.rightButton.disabled=this.currentIndex>=this.items.length-t}handleButtonClick(t){const e=t.target,s=parseInt(e.getAttribute("data-button-index"),10),o=this.carouselData.cards[s];if(!o||!o.buttons||o.buttons.length===0){console.warn("No button data found for this card.");return}const n=o.buttons[0];console.log("Original button data:",n);const c=n.request.payload.title,r=c?`Selected ${c}`:"Selected Power Station";i.emit("carouselButtonClicked",{action:n.request,label:r}),this.remove()}}customElements.define("button-component",_);customElements.define("message-component",A);customElements.define("carousel-component",L);export{I as M,S,x as a,T as b};
//# sourceMappingURL=chatbot-core.B6hP1Zk1.js.map
