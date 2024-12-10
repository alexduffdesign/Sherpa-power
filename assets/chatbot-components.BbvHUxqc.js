import{E as v}from"./vendor.DqvJXvYX.js";class y extends v{}const s=new y,C={MAIN_CHATBOT:{MESSAGE_RECEIVED:"mainChatbot:messageReceived",TYPING:"mainChatbot:typing",CHOICE_PRESENTED:"mainChatbot:choicePresented",CAROUSEL_PRESENTED:"mainChatbot:carouselPresented",ERROR:"mainChatbot:error"},SECTION_CHATBOT:{MESSAGE_RECEIVED:"sectionChatbot:messageReceived",DEVICE_ANSWER:"sectionChatbot:deviceAnswer",CHOICE_PRESENTED:"sectionChatbot:choicePresented",CAROUSEL_PRESENTED:"sectionChatbot:carouselPresented",ERROR:"sectionChatbot:error"}};class k{constructor({userID:t,endpoint:e,chatbotType:o}){if(!t)throw new Error("ChatbotCore requires a userID.");if(!e)throw new Error("ChatbotCore requires an endpoint URL.");if(!o)throw new Error('ChatbotCore requires a chatbotType ("main" or "section").');this.userID=t,this.endpoint=e,this.chatbotType=o,this.eventPrefix=o==="main"?"mainChatbot":"sectionChatbot",this.abortController=null,this.initialize()}initialize(){}sendLaunch(t={}){console.log("Constructing launch payload");const e={action:{type:"launch"}};return console.log("Final launch payload:",e),this.sendAction(e)}sendMessage(t){console.log("Constructing message payload:",t);const e={action:{type:"text",payload:t}};return console.log("Final message payload:",e),this.sendAction(e)}async sendAction(t){this.abortController=new AbortController;const{signal:e}=this.abortController;try{s.emit(`${this.eventPrefix}:typing`,{isTyping:!0});const o=await fetch(this.endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userID:this.userID,action:t.action}),credentials:"include",signal:e});if(!o.ok)throw new Error(`Gadget API responded with status ${o.status}`);const i=o.body.getReader(),a=new TextDecoder("utf-8");let r="";for(;;){const{done:n,value:g}=await i.read();if(n){s.emit(`${this.eventPrefix}:end`,{});break}r+=a.decode(g,{stream:!0});const h=r.split(`

`);r=h.pop(),h.forEach(l=>{if(l.trim()!=="")try{const d=l.split(`
`),p=d.find(u=>u.startsWith("event:")),b=d.find(u=>u.startsWith("data:")),m=p?p.split(":")[1].trim():"trace",f=b?JSON.parse(l.substring(l.indexOf("data:")+5).trim()):null;m==="trace"?this.processTrace(f):m==="end"&&s.emit(`${this.eventPrefix}:end`,{})}catch(d){console.error("Error parsing SSE event:",d)}})}}catch(o){s.emit(`${this.eventPrefix}:typing`,{isTyping:!1}),o.name==="AbortError"?console.warn("SSE connection aborted"):(console.error("SSE connection error:",o),s.emit(`${this.eventPrefix}:error`,{message:o.message}))}finally{this.abortController=null,s.emit(`${this.eventPrefix}:end`,{}),s.emit(`${this.eventPrefix}:typing`,{isTyping:!1})}}processTrace(t){if(!t.type){console.warn("Trace without type received:",t);return}switch(s.emit(`${this.eventPrefix}:typing`,{isTyping:!1}),t.type){case"text":console.log("Text received trace:",t),s.emit(`${this.eventPrefix}:messageReceived`,{content:t.payload.message,metadata:t.payload.metadata||null});break;case"choice":console.log("Choice received trace:",t),s.emit(`${this.eventPrefix}:choicePresented`,{buttons:t.payload.buttons});break;case"carousel":console.log("Carousel received trace:",t),s.emit(`${this.eventPrefix}:carouselPresented`,{carouselItems:t.payload.cards});break;case"speak":console.log("Speak received trace:",t);break;case"visual":console.log("Visual received trace:",t);break;case"no-reply":console.log("No-reply received trace:",t);break;case"end":console.log("End trace received:",t),s.emit(`${this.eventPrefix}:end`,{});break;case"completion-events":console.log("Completion event trace received:",t);break;default:console.warn(`Unhandled trace type: ${t.type}`,t)}}closeConnection(){this.abortController&&(this.abortController.abort(),console.log("SSE connection closed."))}destroy(){this.closeConnection(),s.removeAllListeners(`${this.eventPrefix}:messageReceived`),s.removeAllListeners(`${this.eventPrefix}:choicePresented`),s.removeAllListeners(`${this.eventPrefix}:carouselPresented`),s.removeAllListeners(`${this.eventPrefix}:deviceAnswer`),s.removeAllListeners(`${this.eventPrefix}:error`),s.removeAllListeners(`${this.eventPrefix}:typing`),s.removeAllListeners(`${this.eventPrefix}:end`)}}class P{constructor(t){if(this.container=t,this.form=this.container.querySelector(".chat-form"),this.input=this.container.querySelector("input[type='text']"),this.messageContainer=this.container.querySelector(".message-container"),this.typingIndicator=this.container.querySelector(".chat-typing"),console.log("Chatbot UI Container:",this.container),console.log("Chat Form:",this.form),console.log("Chat Input:",this.input),console.log("Message Container:",this.messageContainer),console.log("Typing Indicator:",this.typingIndicator),!this.container){console.error("Main Chatbot UI container not found");return}if(!this.form||!this.input){console.error("Main Chatbot form or input not found");return}this.setupEventListeners()}setupEventListeners(){this.form.addEventListener("submit",t=>{t.preventDefault();const e=this.input.value.trim();e&&(s.emit("userMessage",e),this.input.value="")}),s.on(`${C.MAIN_CHATBOT.PREFIX}:typing`,t=>{t.isTyping?this.showTypingIndicator():this.hideTypingIndicator()}),this.messageContainer.addEventListener("click",t=>{const e=t.target.closest("button-component");if(e){const o=JSON.parse(e.getAttribute("payload")||"{}"),i=e.getAttribute("label");i&&(s.emit("buttonClicked",{type:o.type,payload:o,label:i}),this.removeInteractiveElements())}}),s.on("carouselButtonClicked",t=>{if(!t||!t.type){console.error("Invalid carousel button payload:",t);return}s.emit("userMessage",JSON.stringify(t)),this.removeInteractiveElements()})}addMessage(t,e,o=null){if(!this.messageContainer){console.error("Message container not set");return}const i=document.createElement("message-component");if(i.setAttribute("sender",t),i.setAttribute("content",e),this.messageContainer.appendChild(i),console.log("Message appended to messageContainer"),this.scrollToBottom(),t==="assistant"&&o)switch(o.type){case"choice":this.addButtons(o.buttons);break;case"carousel":this.addCarousel(o.carouselItems);break}}addButtons(t){if(console.log("addButtons called with:",t),!Array.isArray(t)){console.error("addButtons expected an array but received:",t);return}t.forEach(e=>{const o=document.createElement("button-component");o.setAttribute("label",e.name),o.setAttribute("payload",JSON.stringify(e.request)),this.messageContainer.appendChild(o),console.log("Button appended to messageContainer")}),this.scrollToBottom()}addCarousel(t){console.log("Adding carousel with items:",t);const e={cards:t};if(console.log("Adding carousel:",e),!Array.isArray(t)){console.error("addCarousel expected an array but received:",t);return}const o=document.createElement("carousel-component");o.setAttribute("data-carousel",JSON.stringify(e)),this.messageContainer.appendChild(o),this.scrollToBottom()}showTypingIndicator(){this.typingIndicator&&(this.typingIndicator.style.display="flex",this.scrollToBottom())}hideTypingIndicator(){this.typingIndicator&&(this.typingIndicator.style.display="none")}displayError(t){const e=document.createElement("div");e.classList.add("error-message"),e.innerText=t,this.messageContainer.appendChild(e),this.scrollToBottom()}scrollToBottom(){this.messageContainer.scrollTop=this.messageContainer.scrollHeight}removeInteractiveElements(){this.messageContainer.querySelectorAll("button-component, carousel-component").forEach(e=>e.remove())}}class x extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){const t=this.getAttribute("label"),e=this.getAttribute("payload");this.render(t,e)}render(t,e){this.shadowRoot.innerHTML=`
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
    `,this.shadowRoot.querySelector(".button").addEventListener("click",()=>{try{const o=JSON.parse(e);s.emit("buttonClicked",o)}catch(o){console.error("Error parsing button payload:",o)}})}}class w extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){const t=this.getAttribute("sender"),e=this.getAttribute("content");this.render(t,e)}render(t,e){const o=t==="assistant";this.shadowRoot.innerHTML=`
      <style>
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
          background-color: ${o?"#FFFFFF":"rgba(255, 255, 255, 0.1)"};
          color: ${o?"#231F25":"#FFFFFF"};
          border: ${o?"none":"1px solid #FFFFFF"};
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
        ${o?'<div class="assistant-icon">🚀</div>':""}
        <div class="message message--${t}">
          <div class="message__content">${this.markdownToHtml(e)}</div>
        </div>
      </div>
    `}markdownToHtml(t){return t?t.replace(/\n/g,"<br>"):""}}class E extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.items=[],this.currentIndex=0,this.isDesktop=window.matchMedia("(min-width: 1000px)").matches,this.itemsPerSlide=this.isDesktop?2:1,this.moveLeft=this.moveLeft.bind(this),this.moveRight=this.moveRight.bind(this),this.handleResize=this.handleResize.bind(this),this.handleButtonClick=this.handleButtonClick.bind(this)}connectedCallback(){const t=this.getAttribute("data-carousel");if(!t){console.error("No data-carousel attribute found. Cannot render carousel.");return}let e;try{e=JSON.parse(t)}catch(o){console.error("Failed to parse carousel data:",o);return}if(!e||!Array.isArray(e.cards)){console.error("carouselData.cards is not defined or not an array");return}this.renderCarousel(e)}renderCarousel(t){this.carouselData=t,this.shadowRoot.innerHTML=`
      <style>
        /* Custom Carousel Styling */
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
        }

        .carousel__item-description {
          margin-bottom: var(--spacing-4);
          color: #403545 !important;
          flex-grow: 1;
        }

        .carousel__item-button {
          margin-top: auto;
          margin-block-start: 0 !important;
          padding: var(--spacing-3);
          background-color: #007BFF;
          border: none;
          border-radius: var(--rounded);
          color: white;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.3s ease;
        }

        .carousel__item-button:hover {
          background-color: #0056b3;
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
    `,this.carouselContainer=this.shadowRoot.querySelector(".carousel__container"),this.leftButton=this.shadowRoot.querySelector(".carousel__button--left"),this.rightButton=this.shadowRoot.querySelector(".carousel__button--right"),this.carouselData.cards.forEach((e,o)=>{const i=document.createElement("div");i.classList.add("carousel__item");const a=document.createElement("div");a.classList.add("carousel__item-wrapper");const r=document.createElement("div");if(r.classList.add("carousel__item-content"),e.imageUrl){const n=document.createElement("img");n.src=e.imageUrl,n.alt=e.title||"",n.classList.add("carousel__item-image"),r.appendChild(n)}if(e.title){const n=document.createElement("h6");n.classList.add("carousel__item-title"),n.textContent=e.title,r.appendChild(n)}if(e.description&&e.description.text){const n=document.createElement("p");n.classList.add("carousel__item-description"),n.textContent=e.description.text,r.appendChild(n)}if(e.buttons&&e.buttons.length>0){const n=document.createElement("button");n.classList.add("carousel__item-button"),n.setAttribute("data-button-index",o),n.textContent=e.buttons[0].name||"Select",r.appendChild(n),n.addEventListener("click",this.handleButtonClick)}a.appendChild(r),i.appendChild(a),this.carouselContainer.appendChild(i),this.items.push(i)}),this.initCarousel(),this.leftButton.addEventListener("click",this.moveLeft),this.rightButton.addEventListener("click",this.moveRight),window.addEventListener("resize",this.handleResize),this.updateVisibility(),this.updatePosition()}initCarousel(){this.isDesktop=window.matchMedia("(min-width: 1000px)").matches,this.itemsPerSlide=this.isDesktop?2:1,this.currentIndex=0,this.updateVisibility(),this.updatePosition()}handleResize(){this.isDesktop=window.matchMedia("(min-width: 1000px)").matches,this.itemsPerSlide=this.isDesktop?2:1,this.currentIndex=0,this.updatePosition(),this.updateVisibility()}moveLeft(){const t=this.itemsPerSlide;this.currentIndex=Math.max(0,this.currentIndex-t),this.updatePosition(),this.updateVisibility()}moveRight(){const t=this.itemsPerSlide;this.currentIndex=Math.min(this.items.length-t,this.currentIndex+t),this.updatePosition(),this.updateVisibility()}updatePosition(){const t=this.itemsPerSlide,e=-(this.currentIndex/t)*100;this.carouselContainer.style.transform=`translateX(${e}%)`}updateVisibility(){const t=this.itemsPerSlide;this.leftButton.disabled=this.currentIndex===0,this.rightButton.disabled=this.currentIndex>=this.items.length-t}handleButtonClick(t){const e=t.target,o=parseInt(e.getAttribute("data-button-index"),10),i=this.carouselData.cards[o];if(!i||!i.buttons||i.buttons.length===0){console.warn("No button data found for this card.");return}const a=i.buttons[0].request;a&&s.emit("carouselButtonClicked",a),this.remove()}}customElements.define("button-component",x);customElements.define("message-component",w);customElements.define("carousel-component",E);class S{constructor(t){if(this.container=t,this.form=this.container.querySelector(".chat-form"),this.input=this.container.querySelector("input[type='text']"),this.messageContainer=this.container.querySelector(".message-container"),!this.container){console.error("Section Chatbot UI container not found");return}if(!this.form||!this.input){console.error("Section Chatbot form or input not found");return}this.productTitle=this.container.dataset.productTitle,this.productCapacity=this.container.dataset.productCapacity,this.acOutputContinuousPower=this.container.dataset.productAcOutputContinuousPower,this.acOutputPeakPower=this.container.dataset.productAcOutputPeakPower,this.dcOutputPower=this.container.dataset.productDcOutputPower,this.startBlock="shopifySection",this.productDetails={title:this.productTitle,capacity:this.productCapacity,ac_output_continuous_power:this.acOutputContinuousPower,ac_output_peak_power:this.acOutputPeakPower,dc_output_power:this.dcOutputPower},this.setupEventListeners()}setupEventListeners(){this.form.addEventListener("submit",t=>{t.preventDefault();const e=this.input.value.trim();e&&(this.emit("userMessage",e),this.input.value="")})}onUserMessage(t){s.on("userMessage",t)}onButtonClick(t){s.on("buttonClicked",t)}emit(t,e){const o=new CustomEvent(t,{detail:e});this.container.dispatchEvent(o)}addMessage(t,e){const o=document.createElement("message-component");o.setAttribute("sender",t),o.setAttribute("content",e),this.messageContainer.appendChild(o),this.scrollToBottom()}addButtons(t){t.forEach(e=>{const o=document.createElement("button-component");o.setAttribute("label",e.name),o.setAttribute("payload",JSON.stringify(e.request)),this.messageContainer.appendChild(o)}),this.scrollToBottom(),this.messageContainer.addEventListener("click",e=>{if(e.target.closest("button-component")){const o=e.target.closest("button-component"),i=JSON.parse(o.getAttribute("payload"));this.emit("buttonClicked",i),this.removeInteractiveElements()}})}addCarousel(t){const e=document.createElement("carousel-component");e.setAttribute("items",JSON.stringify(t)),this.messageContainer.appendChild(e),this.scrollToBottom()}populateApplicationsGrid(t){const e=document.querySelector(".applications-grid");if(!e){console.error("Applications grid not found");return}t.forEach(o=>{const i=document.createElement("div");i.classList.add("application-card","chatbot-card"),i.innerHTML=`
        <div class="application-card__image">
          <img src="${o.imageUrl}" alt="${o.name}" />
        </div>
        <div class="application-card__content">
          <div class="application-card__title">${o.name}</div>
          <div class="application-card__runtime">${o.estimatedRuntime}</div>
        </div>
      `,e.appendChild(i)}),this.scrollToBottom()}displayError(t){const e=document.createElement("div");e.classList.add("error-message"),e.innerText=t,this.messageContainer.appendChild(e),this.scrollToBottom()}scrollToBottom(){this.container.scrollTop=this.container.scrollHeight}getAttribute(t){return this.container.getAttribute(t)}removeInteractiveElements(){this.messageContainer.querySelectorAll("button-component, carousel-component").forEach(e=>e.remove())}}export{k as C,C as E,P as M,S,s as e};
//# sourceMappingURL=chatbot-components.BbvHUxqc.js.map
