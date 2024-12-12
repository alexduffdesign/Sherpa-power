import{E as u}from"./vendor.DqvJXvYX.js";function h(a){const t=Date.now().toString(36)+Math.random().toString(36).substr(2,9);return`${a}-${t}`}const y="https://chatbottings--development.gadget.app/voiceflowAPI/voiceflow-streaming";class p extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.eventBus=new u,this.userID=h(),this.abortController=null}static get observedAttributes(){return["endpoint"]}connectedCallback(){this.initialize()}disconnectedCallback(){this.cleanup()}initialize(){this.setupEventListeners()}launch(){this.sendLaunch()}setupEventListeners(){this.eventBus.on("userMessage",t=>this.sendMessage(t)),this.eventBus.on("buttonClicked",t=>this.sendMessage(t))}async sendLaunch(t={}){console.log("Constructing launch payload:",t);const e=t.action?t:{action:{type:"launch"}};return this.sendAction(e)}async sendMessage(t){console.log("Sending message:",t);const e={action:{type:"text",payload:t}};return this.sendAction(e)}async sendAction(t){try{const e=this.getAttribute("endpoint")||y;if(!e)throw new Error("Endpoint attribute is required");this.abortController&&this.abortController.abort(),this.abortController=new AbortController;const{signal:s}=this.abortController;this.eventBus.emit("typing",{isTyping:!0});const i=await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userID:this.userID,action:t.action}),credentials:"include",signal:s});if(!i.ok)throw new Error(`API responded with status ${i.status}`);await this.handleSSEResponse(i)}catch(e){this.handleError(e)}}async handleSSEResponse(t){const e=t.body.getReader(),s=new TextDecoder("utf-8");let i="";try{for(;;){const{done:n,value:r}=await e.read();if(n){this.eventBus.emit("end",{});break}i+=s.decode(r,{stream:!0});const o=i.split(`

`);i=o.pop();for(const c of o)c.trim()!==""&&this.processEventString(c)}}catch(n){this.handleError(n)}finally{this.eventBus.emit("typing",{isTyping:!1})}}processEventString(t){try{const e=t.split(`
`),s=e.find(o=>o.startsWith("event:")),i=e.find(o=>o.startsWith("data:")),n=s?s.split(":")[1].trim():"trace",r=i?JSON.parse(t.substring(t.indexOf("data:")+5).trim()):null;n==="trace"&&this.processTrace(r)}catch(e){console.error("Error processing SSE event:",e)}}processTrace(t){if(!t.type){console.warn("Trace without type received:",t);return}switch(this.eventBus.emit("typing",{isTyping:!1}),t.type){case"text":this.eventBus.emit("messageReceived",{content:t.payload.message,metadata:t.payload.metadata||null});break;case"choice":this.eventBus.emit("choicePresented",{type:"choice",buttons:t.payload.buttons});break;case"carousel":this.eventBus.emit("carouselPresented",{type:"carousel",items:t.payload.cards});break;case"waiting_text":this.eventBus.emit("typingText",{text:t.payload.text}),this.eventBus.emit("typing",{isTyping:!0});break;default:console.warn(`Unhandled trace type: ${t.type}`,t)}}handleError(t){console.error("Chatbot error:",t),this.eventBus.emit("error",{message:t.message}),this.eventBus.emit("typing",{isTyping:!1})}cleanup(){this.abortController&&this.abortController.abort(),this.eventBus.removeAllListeners()}}class m{constructor(t,e){this.shadowRoot=t,this.eventBus=e,this.setupUIElements(),this.setupEventListeners()}setupUIElements(){this.container=this.shadowRoot.querySelector(".chatbot-container"),this.messageContainer=this.shadowRoot.querySelector(".message-container"),this.typingIndicator=this.shadowRoot.querySelector(".chat-typing"),this.typingText=this.shadowRoot.querySelector(".typing-text"),this.form=this.shadowRoot.querySelector(".chat-form"),this.input=this.shadowRoot.querySelector(".chat-input")}setupEventListeners(){this.form.addEventListener("submit",t=>{t.preventDefault();const e=this.input.value.trim();e&&(this.addMessage("user",e),this.eventBus.emit("userMessage",e),this.input.value="")}),this.eventBus.on("messageReceived",({content:t,metadata:e})=>{this.addMessage("assistant",t,e)}),this.eventBus.on("typing",({isTyping:t})=>{t?this.showTypingIndicator():this.hideTypingIndicator()}),this.eventBus.on("typingText",({text:t})=>{this.updateTypingText(t)}),this.eventBus.on("error",({message:t})=>{this.displayError(t)})}addMessage(t,e,s=null){const i=document.createElement("message-component");i.setAttribute("sender",t),i.setAttribute("content",e),s&&i.setAttribute("metadata",JSON.stringify(s)),this.messageContainer.appendChild(i),this.scrollToBottom()}addButtons(t){const e=document.createElement("div");e.className="buttons-container",t.forEach(s=>{const i=document.createElement("button-component");i.setAttribute("label",s.name),i.setAttribute("payload",JSON.stringify(s.request)),e.appendChild(i)}),this.messageContainer.appendChild(e),this.scrollToBottom()}showTypingIndicator(){this.typingIndicator&&(this.typingIndicator.style.display="flex",this.scrollToBottom())}hideTypingIndicator(){this.typingIndicator&&(this.typingIndicator.style.display="none")}updateTypingText(t){this.typingText&&(this.typingText.textContent=t)}displayError(t){const e=document.createElement("div");e.classList.add("error-message"),e.textContent=t,this.messageContainer.appendChild(e),this.scrollToBottom()}removeInteractiveElements(){this.messageContainer.querySelectorAll("button-component, carousel-component, .buttons-container").forEach(e=>e.remove())}scrollToBottom(){this.messageContainer.scrollTop=this.messageContainer.scrollHeight}}const d={MESSAGE_RECEIVED:"messageReceived",TYPING:"typing",TYPING_TEXT:"typingText",CHOICE_PRESENTED:"choicePresented",CAROUSEL_PRESENTED:"carouselPresented",ERROR:"error",END:"end",USER_MESSAGE:"userMessage"},l={...Object.entries(d).reduce((a,[t,e])=>({...a,[t]:`mainChatbot:${e}`}),{}),MAIN_MENU_CLICKED:"mainChatbot:mainMenuClicked",HISTORY_LOADED:"mainChatbot:historyLoaded",BUTTON_CLICK:"mainChatbot:buttonClick",CAROUSEL_BUTTON_CLICK:"mainChatbot:carouselButtonClick",CLEAR_HISTORY:"mainChatbot:clearHistory",MINIMIZE:"mainChatbot:minimize"};({...Object.entries(d).reduce((a,[t,e])=>({...a,[t]:`sectionChatbot:${e}`}),{})});class f extends u{emitTyping(t,e){this.emit(`${t}:${d.TYPING}`,{isTyping:e})}emitError(t,e){this.emit(`${t}:${d.ERROR}`,{message:e})}emitEnd(t){this.emit(`${t}:${d.END}`,{})}getEventName(t,e){return`${t}:${e}`}}const g=new f;class b extends m{constructor(t,e){super(t,e),this.setupMainChatbotUI()}setupMainChatbotUI(){this.footer=this.shadowRoot.querySelector(".chatbot-footer"),this.setupFooterEventListeners()}setupEventListeners(){super.setupEventListeners(),this.messageContainer.addEventListener("click",t=>{const e=t.target.closest("button-component");if(e){const s=JSON.parse(e.getAttribute("payload")),i=e.getAttribute("label");this.eventBus.emit(l.BUTTON_CLICK,{...s,label:i,type:"choice"}),this.addMessage("user",i),this.removeInteractiveElements()}}),this.messageContainer.addEventListener("click",t=>{const e=t.target.closest("carousel-button");if(e){const s=JSON.parse(e.getAttribute("payload")),i=e.getAttribute("label");this.eventBus.emit(l.CAROUSEL_BUTTON_CLICK,{...s,label:i,type:"carousel_click"}),this.addMessage("user",i)}})}addButtons(t,e=!1){const s=document.createElement("div");s.className="buttons-container",t.forEach(i=>{const n=document.createElement("button-component");n.setAttribute("label",i.name),n.setAttribute("payload",JSON.stringify(i.request)),e&&n.setAttribute("data-restored","true"),s.appendChild(n)}),this.messageContainer.appendChild(s),this.scrollToBottom()}addCarousel(t,e=!1){const s=document.createElement("carousel-component");s.setAttribute("items",JSON.stringify(t)),e&&s.setAttribute("data-restored","true"),this.messageContainer.appendChild(s),this.scrollToBottom()}setupFooterEventListeners(){if(!this.footer)return;const t=this.footer.querySelector(".clear-history");t&&t.addEventListener("click",()=>{this.clearChat(),this.eventBus.emit(l.CLEAR_HISTORY)});const e=this.footer.querySelector(".minimize-chatbot");e&&e.addEventListener("click",()=>{this.eventBus.emit(l.MINIMIZE)})}clearChat(){for(;this.messageContainer.firstChild;)this.messageContainer.removeChild(this.messageContainer.firstChild)}updateFooterVisibility(t){this.footer&&(this.footer.style.display=t?"flex":"none")}}class v extends p{constructor(){super(),this.historyKey="mainChatbotHistory",this.launchKey="chatHasLaunched",this.isLaunched=this.hasLaunched()}initializeUI(){this.ui=new b(this.shadowRoot,this.eventBus),this.setupMainChatbotEventListeners(),this.loadHistory()}setupMainChatbotEventListeners(){this.eventBus.on(l.BUTTON_CLICK,t=>{this.sendAction(t)}),this.eventBus.on(l.CAROUSEL_BUTTON_CLICK,t=>{this.sendAction(t)}),this.eventBus.on("userMessage",t=>{this.saveToHistory("user",t),this.sendMessage(t)}),this.eventBus.on("messageReceived",({content:t,metadata:e})=>{this.saveToHistory("assistant",t,e)})}hasLaunched(){return localStorage.getItem(this.launchKey)==="true"}setLaunched(){localStorage.setItem(this.launchKey,"true"),this.isLaunched=!0}saveToHistory(t,e,s=null){const i=JSON.parse(localStorage.getItem(this.historyKey))||[],n={sender:t,message:e,timestamp:Date.now(),isInteractive:!1};t==="assistant"&&s&&(s.type==="choice"?(n.isInteractive=!0,n.traceType="choice",n.traceData={buttons:s.buttons}):s.type==="carousel"&&(n.isInteractive=!0,n.traceType="carousel",n.traceData={cards:s.carouselItems})),i.push(n),localStorage.setItem(this.historyKey,JSON.stringify(i))}loadHistory(){const t=JSON.parse(localStorage.getItem(this.historyKey))||[];t.forEach((e,s)=>{if(e.isInteractive){s===t.length-1&&this.restoreInteractiveElement(e);return}e.message&&this.ui.addMessage(e.sender,e.message)})}restoreInteractiveElement(t){t.traceType==="choice"?this.ui.addButtons(t.traceData.buttons,!0):t.traceType==="carousel"&&this.ui.addCarousel(t.traceData.cards,!0)}clearHistory(){localStorage.removeItem(this.historyKey),localStorage.removeItem(this.launchKey),this.isLaunched=!1}sanitizeInput(t){const e=document.createElement("div");return e.textContent=t,e.innerHTML}}document.addEventListener("DOMContentLoaded",()=>{const a=document.getElementById("main-chatbot-ui");if(!a){console.error("Main Chatbot UI container not found");return}let t=localStorage.getItem("mainChatbotUserId");t||(t=h("mainChatbot"),localStorage.setItem("mainChatbotUserId",t));const e=new ChatbotCore({userID:t,endpoint:"https://chatbottings--development.gadget.app/voiceflowAPI/voiceflow-streaming",chatbotType:"main"}),s=new b(a);new v(e,s).loadHistory()});console.log("Main chatbot script loading...");customElements.define("main-chatbot",v);console.log("Main chatbot component registered");class C extends m{constructor(t,e){super(t,e),this.setupSectionSpecificEventListeners()}setupSectionSpecificEventListeners(){this.eventBus.on("deviceAnswer",({applications:t})=>{this.displayDeviceAnswer(t)})}displayDeviceAnswer(t){const e=document.querySelector(".applications-grid");e&&(e.innerHTML="",t.forEach(s=>{const i=this.createApplicationElement(s);e.appendChild(i)}))}createApplicationElement(t){const e=document.createElement("div");e.className="application-item";const s=document.createElement("img");s.src=t.iconUrl||"",s.alt=t.name||"Application Icon",s.className="application-icon";const i=document.createElement("span");i.textContent=t.name||"Unknown Application",i.className="application-name";const n=document.createElement("span");return n.className="power-requirement",n.textContent=t.powerRequirement?`${t.powerRequirement}W`:"N/A",e.appendChild(s),e.appendChild(i),e.appendChild(n),e}addMessage(t,e,s=null){t==="assistant"&&(s!=null&&s.productContext)&&(e=this.formatMessageWithProductContext(e,s.productContext)),super.addMessage(t,e,s)}formatMessageWithProductContext(t,e){return t.replace(/\{(\w+)\}/g,(s,i)=>e[i]||s)}}class w extends p{constructor(){super(),this.productDetails={}}initializeUI(){this.ui=new C(this.shadowRoot,this.eventBus),this.setupSectionChatbotEventListeners()}initializeProductDetails(){this.productDetails={title:this.getAttribute("product-title"),capacity:this.getAttribute("product-capacity"),ac_output_continuous_power:this.getAttribute("product-ac_output_continuous_power"),ac_output_peak_power:this.getAttribute("product-ac_output_peak_power"),dc_output_power:this.getAttribute("product-dc_output_power")},this.validateProductDetails()}initialize(){this.initializeProductDetails(),super.initialize()}validateProductDetails(){const e=["title","capacity"].filter(s=>!this.productDetails[s]);e.length>0&&(console.error(`Missing required product details: ${e.join(", ")}`),this.eventBus.emit("error",{message:"Some product information is missing. Chat functionality may be limited."}))}setupSectionChatbotEventListeners(){var t;this.eventBus.on("trace",({type:e,payload:s})=>{e==="device_answer"&&this.handleDeviceAnswer(s)}),(t=this.shadowRoot.querySelector(".chat-input"))==null||t.addEventListener("focus",()=>{this.isLaunched||this.launch()})}handleDeviceAnswer(t){t.applications&&this.eventBus.emit("deviceAnswer",{applications:t.applications})}getProductLaunchPayload(){return{action:{type:"launch",payload:{context:{startBlock:"shopifySection",powerStationDetails:this.productDetails}}}}}launch(){this.sendLaunch(this.getProductLaunchPayload())}}customElements.define("section-chatbot",w);class x extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){const t=this.getAttribute("label"),e=this.getAttribute("payload");this.render(t,e)}render(t,e){this.shadowRoot.innerHTML=`
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
    `,this.shadowRoot.querySelector(".button").addEventListener("click",()=>{try{const s=JSON.parse(e);g.emit("buttonClicked",s)}catch(s){console.error("Error parsing button payload:",s)}})}}class E extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){const t=this.getAttribute("sender"),e=this.getAttribute("content");this.render(t,e)}render(t,e){const s=t==="assistant";this.shadowRoot.innerHTML=`
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
    `}markdownToHtml(t){return t?t.replace(/\n/g,"<br>"):""}}class _ extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.items=[],this.currentIndex=0,this.isDesktop=window.matchMedia("(min-width: 1000px)").matches,this.itemsPerSlide=this.isDesktop?2:1,this.moveLeft=this.moveLeft.bind(this),this.moveRight=this.moveRight.bind(this),this.handleResize=this.handleResize.bind(this),this.handleButtonClick=this.handleButtonClick.bind(this)}connectedCallback(){const t=this.getAttribute("data-carousel");if(!t){console.error("No data-carousel attribute found. Cannot render carousel.");return}let e;try{e=JSON.parse(t)}catch(s){console.error("Failed to parse carousel data:",s);return}if(!e||!Array.isArray(e.cards)){console.error("carouselData.cards is not defined or not an array");return}this.renderCarousel(e)}renderCarousel(t){this.carouselData=t,this.shadowRoot.innerHTML=`
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
    `,this.carouselContainer=this.shadowRoot.querySelector(".carousel__container"),this.leftButton=this.shadowRoot.querySelector(".carousel__button--left"),this.rightButton=this.shadowRoot.querySelector(".carousel__button--right"),this.carouselData.cards.forEach((e,s)=>{const i=document.createElement("div");i.classList.add("carousel__item");const n=document.createElement("div");n.classList.add("carousel__item-wrapper");const r=document.createElement("div");if(r.classList.add("carousel__item-content"),e.imageUrl){const o=document.createElement("img");o.src=e.imageUrl,o.alt=e.title||"",o.classList.add("carousel__item-image"),r.appendChild(o)}if(e.title){const o=document.createElement("h6");o.classList.add("carousel__item-title"),o.textContent=e.title,r.appendChild(o)}if(e.description&&e.description.text){const o=document.createElement("p");o.classList.add("carousel__item-description"),o.textContent=e.description.text,r.appendChild(o)}if(e.buttons&&e.buttons.length>0){const o=e.buttons[0],c=document.createElement("button");c.classList.add("button","carousel__item-button"),c.setAttribute("data-button-index",s),c.setAttribute("data-button-payload",JSON.stringify(o.request)),c.setAttribute("data-button-text",o.name),c.textContent=o.name||"Select",r.appendChild(c),c.addEventListener("click",this.handleButtonClick)}n.appendChild(r),i.appendChild(n),this.carouselContainer.appendChild(i),this.items.push(i)}),this.initCarousel(),this.leftButton.addEventListener("click",this.moveLeft),this.rightButton.addEventListener("click",this.moveRight),window.addEventListener("resize",this.handleResize),this.updateVisibility(),this.updatePosition()}initCarousel(){this.isDesktop=window.matchMedia("(min-width: 1000px)").matches,this.itemsPerSlide=this.isDesktop?2:1,this.currentIndex=0,this.updateVisibility(),this.updatePosition()}handleResize(){this.isDesktop=window.matchMedia("(min-width: 1000px)").matches,this.itemsPerSlide=this.isDesktop?2:1,this.currentIndex=0,this.updatePosition(),this.updateVisibility()}moveLeft(){const t=this.itemsPerSlide;this.currentIndex=Math.max(0,this.currentIndex-t),this.updatePosition(),this.updateVisibility()}moveRight(){const t=this.itemsPerSlide;this.currentIndex=Math.min(this.items.length-t,this.currentIndex+t),this.updatePosition(),this.updateVisibility()}updatePosition(){const t=this.itemsPerSlide,e=-(this.currentIndex/t)*100;this.carouselContainer.style.transform=`translateX(${e}%)`}updateVisibility(){const t=this.itemsPerSlide;this.leftButton.disabled=this.currentIndex===0,this.rightButton.disabled=this.currentIndex>=this.items.length-t}handleButtonClick(t){const e=t.target,s=parseInt(e.getAttribute("data-button-index"),10),i=this.carouselData.cards[s];if(!i||!i.buttons||i.buttons.length===0){console.warn("No button data found for this card.");return}const n=i.buttons[0];console.log("Original button data:",n);const r=n.request.payload.title,o=r?`Selected ${r}`:"Selected Power Station";g.emit("carouselButtonClicked",{action:n.request,label:o}),this.remove()}}customElements.define("button-component",x);customElements.define("message-component",E);customElements.define("carousel-component",_);export{m as B,b as M,C as S,v as a,w as b};
//# sourceMappingURL=base-chatbot.DoGTcDwl.js.map
