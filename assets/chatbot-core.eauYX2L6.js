import{E}from"./vendor.DqvJXvYX.js";class I extends E{}const s=new I,l={MAIN_CHATBOT:{MESSAGE_RECEIVED:"mainChatbot:messageReceived",TYPING:"mainChatbot:typing",CHOICE_PRESENTED:"mainChatbot:choicePresented",CAROUSEL_PRESENTED:"mainChatbot:carouselPresented",ERROR:"mainChatbot:error",MAIN_MENU_CLICKED:"mainChatbot:mainMenuClicked"},SECTION_CHATBOT:{MESSAGE_RECEIVED:"sectionChatbot:messageReceived",DEVICE_ANSWER:"sectionChatbot:deviceAnswer",CHOICE_PRESENTED:"sectionChatbot:choicePresented",CAROUSEL_PRESENTED:"sectionChatbot:carouselPresented",ERROR:"sectionChatbot:error"}};class y{constructor({userID:t,endpoint:e,chatbotType:i}){if(!t)throw new Error("ChatbotCore requires a userID.");if(!e)throw new Error("ChatbotCore requires an endpoint URL.");if(!i)throw new Error('ChatbotCore requires a chatbotType ("main" or "section").');this.userID=t,this.endpoint=e,this.chatbotType=i,this.eventPrefix=i==="main"?"mainChatbot":"sectionChatbot",this.abortController=null,this.initialize()}initialize(){}sendLaunch(t={}){console.log("Constructing launch payload with:",t);const e=t.action?t:{action:{type:"launch"}};return console.log("Final launch payload:",e),this.sendAction(e)}sendMessage(t){console.log("Constructing message payload:",t);const e={action:{type:"text",payload:t}};return console.log("Final message payload:",e),this.sendAction(e)}async sendAction(t){this.abortController=new AbortController;const{signal:e}=this.abortController;try{console.log("Sending action to Gadget API:",t),s.emit(`${this.eventPrefix}:typing`,{isTyping:!0});const i=await fetch(this.endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userID:this.userID,action:t.action}),credentials:"include",signal:e});if(!i.ok)throw new Error(`Gadget API responded with status ${i.status}`);const o=i.body.getReader(),n=new TextDecoder("utf-8");let c="";for(;;){const{done:r,value:d}=await o.read();if(r){s.emit(`${this.eventPrefix}:end`,{});break}c+=n.decode(d,{stream:!0});const g=c.split(`

`);c=g.pop(),g.forEach(u=>{if(u.trim()!=="")try{const h=u.split(`
`),m=h.find(p=>p.startsWith("event:")),v=h.find(p=>p.startsWith("data:")),b=m?m.split(":")[1].trim():"trace",C=v?JSON.parse(u.substring(u.indexOf("data:")+5).trim()):null;b==="trace"?this.processTrace(C):b==="end"&&s.emit(`${this.eventPrefix}:end`,{})}catch(h){console.error("Error parsing SSE event:",h)}})}}catch(i){s.emit(`${this.eventPrefix}:typing`,{isTyping:!1}),i.name==="AbortError"?console.warn("SSE connection aborted"):(console.error("SSE connection error:",i),s.emit(`${this.eventPrefix}:error`,{message:i.message}))}finally{this.abortController=null,s.emit(`${this.eventPrefix}:end`,{}),s.emit(`${this.eventPrefix}:typing`,{isTyping:!1})}}processTrace(t){if(!t.type){console.warn("Trace without type received:",t);return}switch(s.emit(`${this.eventPrefix}:typing`,{isTyping:!1}),t.type){case"text":console.log("Text received trace:",t),s.emit(`${this.eventPrefix}:messageReceived`,{content:t.payload.message,metadata:t.payload.metadata||null});break;case"choice":console.log("Choice received trace:",t),s.emit(`${this.eventPrefix}:choicePresented`,{type:"choice",buttons:t.payload.buttons});break;case"carousel":console.log("Carousel received trace:",t),s.emit(`${this.eventPrefix}:carouselPresented`,{type:"carousel",carouselItems:t.payload.cards});break;case"waiting_text":console.log("Waiting text received trace:",t),s.emit(`${this.eventPrefix}:typingText`,{text:t.payload.text}),s.emit(`${this.eventPrefix}:typing`,{isTyping:!0});break;case"speak":console.log("Speak received trace:",t);break;case"visual":console.log("Visual received trace:",t);break;case"no-reply":console.log("No-reply received trace:",t);break;case"end":console.log("End trace received:",t),s.emit(`${this.eventPrefix}:end`,{});break;case"completion-events":console.log("Completion event trace received:",t);break;default:console.warn(`Unhandled trace type: ${t.type}`,t)}}closeConnection(){this.abortController&&(this.abortController.abort(),console.log("SSE connection closed."))}destroy(){this.closeConnection(),s.removeAllListeners(`${this.eventPrefix}:messageReceived`),s.removeAllListeners(`${this.eventPrefix}:choicePresented`),s.removeAllListeners(`${this.eventPrefix}:carouselPresented`),s.removeAllListeners(`${this.eventPrefix}:deviceAnswer`),s.removeAllListeners(`${this.eventPrefix}:error`),s.removeAllListeners(`${this.eventPrefix}:typing`),s.removeAllListeners(`${this.eventPrefix}:end`)}}class w{constructor(t){if(this.container=t,this.form=this.container.querySelector(".chat-form"),this.input=this.container.querySelector("input[type='text']"),this.messageContainer=this.container.querySelector(".message-container"),this.typingIndicator=this.container.querySelector(".chat-typing"),console.log("Chatbot UI Container:",this.container),console.log("Chat Form:",this.form),console.log("Chat Input:",this.input),console.log("Message Container:",this.messageContainer),console.log("Typing Indicator:",this.typingIndicator),!this.container){console.error("Main Chatbot UI container not found");return}if(!this.form||!this.input){console.error("Main Chatbot form or input not found");return}this.setupEventListeners()}setupEventListeners(){var t;this.form.addEventListener("submit",e=>{e.preventDefault();const i=this.input.value.trim();i&&(s.emit("userMessage",i),this.input.value="")}),s.on(`${l.MAIN_CHATBOT.PREFIX}:typing`,e=>{e.isTyping?this.showTypingIndicator():this.hideTypingIndicator()}),this.messageContainer.addEventListener("click",e=>{const i=e.target.closest("button-component");if(i){const o=JSON.parse(i.getAttribute("payload")||"{}"),n=i.getAttribute("label");n&&(s.emit("buttonClicked",{type:o.type,payload:o,label:n}),this.removeInteractiveElements())}}),(t=document.querySelector("custom-drawer"))==null||t.addEventListener("click",e=>{e.target.closest(".main-menu")&&(e.preventDefault(),s.emit("buttonClicked",{type:"event",payload:{event:{name:"main_menu"}},label:"Back to Menu"}))})}addMessage(t,e,i=null,o=!1){if(!this.messageContainer){console.error("Message container not set");return}!o&&(!i||!i.isInteractive)&&this.removeInteractiveElements();const n=document.createElement("message-component");if(n.setAttribute("sender",t),n.setAttribute("content",e),i!=null&&i.imageUrl&&n.setAttribute("image-url",i.imageUrl),this.messageContainer.appendChild(n),console.log("Message appended to messageContainer"),this.scrollToBottom(),t==="assistant"&&i)switch(i.type){case"choice":this.addButtons(i.buttons,o);break;case"carousel":this.addCarousel(i.carouselItems,o);break}}addButtons(t,e=!1){if(console.log("addButtons called with:",t),!Array.isArray(t)){console.error("addButtons expected an array but received:",t);return}e||(this.removeInteractiveElements(),this.storeInteractiveState("choice",t)),t.forEach(i=>{const o=document.createElement("button-component");o.setAttribute("label",i.name),o.setAttribute("payload",JSON.stringify(i.request)),this.messageContainer.appendChild(o),console.log("Button appended to messageContainer")}),this.scrollToBottom()}addCarousel(t,e=!1){if(console.log("Adding carousel with items:",t),!Array.isArray(t)){console.error("addCarousel expected an array but received:",t);return}e||(this.removeInteractiveElements(),this.storeInteractiveState("carousel",t));const i={cards:t},o=document.createElement("carousel-component");o.setAttribute("data-carousel",JSON.stringify(i)),this.messageContainer.appendChild(o),this.scrollToBottom()}storeInteractiveState(t,e){const i={type:t,data:e,timestamp:Date.now()};localStorage.setItem("lastInteractiveElement",JSON.stringify(i))}restoreInteractiveElement(){const t=localStorage.getItem("lastInteractiveElement");if(t)try{const e=JSON.parse(t);e.type==="choice"?this.addButtons(e.data,!0):e.type==="carousel"&&this.addCarousel(e.data,!0)}catch(e){console.error("Error restoring interactive element:",e)}}showTypingIndicator(){this.typingIndicator&&(this.typingIndicator.style.display="flex",this.scrollToBottom())}hideTypingIndicator(){this.typingIndicator&&(this.typingIndicator.style.display="none")}displayError(t){const e=document.createElement("div");e.classList.add("error-message"),e.innerText=t,this.messageContainer.appendChild(e),this.scrollToBottom()}scrollToBottom(){this.messageContainer.scrollTop=this.messageContainer.scrollHeight}removeInteractiveElements(){this.messageContainer.querySelectorAll("button-component, carousel-component").forEach(e=>e.remove()),localStorage.removeItem("lastInteractiveElement")}}function f(a){const t=Date.now().toString(36)+Math.random().toString(36).substr(2,9);return`${a}-${t}`}class x{constructor(t,e){this.core=t,this.ui=e,this.historyKey="mainChatbotHistory",this.launchKey="chatHasLaunched",this.isLaunched=this.hasLaunched(),this.setupEventListeners()}hasLaunched(){return localStorage.getItem(this.launchKey)==="true"}setLaunched(){localStorage.setItem(this.launchKey,"true"),this.isLaunched=!0}setupEventListeners(){s.on(l.MAIN_CHATBOT.MESSAGE_RECEIVED,t=>{this.ui.addMessage("assistant",t.content,t.metadata),this.saveToHistory("assistant",t.content,t.metadata)}),s.on("userMessage",t=>{this.ui.addMessage("user",t),this.saveToHistory("user",t),this.core.sendMessage(t)}),s.on("buttonClicked",t=>{if(!t||!t.label){console.error("Invalid button data:",t);return}this.ui.addMessage("user",t.label),this.saveToHistory("user",t.label);const e={action:{type:t.type}};t.payload&&Object.keys(t.payload).length>0&&(e.action.payload=t.payload),this.core.sendAction(e)}),s.on(l.MAIN_CHATBOT.CHOICE_PRESENTED,t=>{this.ui.addButtons(t.buttons),this.saveToHistory("assistant","",{type:"choice",buttons:t.buttons})}),s.on(l.MAIN_CHATBOT.CAROUSEL_PRESENTED,t=>{this.ui.addCarousel(t.carouselItems),this.saveToHistory("assistant","",{type:"carousel",carouselItems:t.carouselItems})}),s.on(l.MAIN_CHATBOT.ERROR,t=>{this.ui.displayError(t.message)}),s.on(l.MAIN_CHATBOT.TYPING,t=>{t.isTyping?this.ui.showTypingIndicator():this.ui.hideTypingIndicator()}),document.addEventListener("chatbotLaunch",()=>{this.launch()}),s.on("carouselButtonClicked",t=>{if(!t||!t.action){console.error("Invalid carousel button data:",t);return}this.ui.addMessage("user",t.label),this.saveToHistory("user",t.label),this.core.sendAction({action:t.action})})}launch(){if(this.isLaunched){console.log("Chat already launched, skipping launch request");return}this.core.sendLaunch().then(()=>{console.log("Chatbot launched successfully."),this.setLaunched()}).catch(t=>{console.error("Error launching chatbot:",t),this.ui.displayError("Failed to launch the chatbot. Please try again later.")})}sendMessage(t){const e=this.sanitizeInput(t);this.ui.addMessage("user",e,{type:"message"}),this.saveToHistory("user",e,{type:"message"}),this.core.sendMessage(e).catch(i=>{console.error("Error sending message:",i),this.ui.displayError("Failed to send your message. Please try again.")})}sendAction(t){if(!t||typeof t!="object"){console.error("Invalid action payload:",t),this.ui.displayError("Invalid action triggered.");return}this.core.sendAction({action:t,config:{}}).then(()=>{console.log("Action sent successfully:",t),this.ui.addMessage("user",t.label||"Action executed.",{type:"action"}),this.saveToHistory("user",JSON.stringify(t),{type:"action"})}).catch(e=>{console.error("Error sending action:",e),this.ui.displayError("An error occurred while processing your request.")})}saveToHistory(t,e,i=null){const o=JSON.parse(localStorage.getItem(this.historyKey))||[],n={sender:t,message:e,timestamp:Date.now(),isInteractive:!1};t==="assistant"&&i&&(i.type==="choice"?(n.isInteractive=!0,n.traceType="choice",n.traceData={buttons:i.buttons}):i.type==="carousel"&&(n.isInteractive=!0,n.traceType="carousel",n.traceData={cards:i.carouselItems})),o.push(n),localStorage.setItem(this.historyKey,JSON.stringify(o))}loadHistory(){const t=JSON.parse(localStorage.getItem(this.historyKey))||[];t.forEach((e,i)=>{if(e.isInteractive){i===t.length-1&&(e.traceType==="choice"?this.ui.addButtons(e.traceData.buttons,!0):e.traceType==="carousel"&&this.ui.addCarousel(e.traceData.cards,!0));return}e.message&&this.ui.addMessage(e.sender,e.message)})}restoreInteractiveElement(t){t.traceType==="choice"?this.ui.addButtons(t.traceData.buttons,!0):t.traceType==="carousel"&&this.ui.addCarousel(t.traceData.cards,!0)}sanitizeInput(t){const e=document.createElement("div");return e.textContent=t,e.innerHTML}}document.addEventListener("DOMContentLoaded",()=>{const a=document.getElementById("main-chatbot-ui");if(!a){console.error("Main Chatbot UI container not found");return}let t=localStorage.getItem("mainChatbotUserId");t||(t=f("mainChatbot"),localStorage.setItem("mainChatbotUserId",t));const e=new y({userID:t,endpoint:"https://chatbottings--development.gadget.app/voiceflowAPI/voiceflow-streaming",chatbotType:"main"}),i=new w(a);new x(e,i).loadHistory()});class T{constructor(t){var e;if(!t)throw new Error("SectionChatbotUI requires a container element");if(this.container=t,this.form=this.container.querySelector("#chatForm"),this.input=this.container.querySelector("#userInput"),this.messageContainer=this.container.querySelector("#messageContainer"),this.typingIndicator=this.container.querySelector(".chat-typing"),this.typingText=(e=this.typingIndicator)==null?void 0:e.querySelector(".typing-text"),console.log("Chatbot UI Container:",this.container),console.log("Chat Form:",this.form),console.log("Chat Input:",this.input),console.log("Message Container:",this.messageContainer),console.log("Typing Indicator:",this.typingIndicator),console.log("Typing Text:",this.typingText),!this.form)throw new Error("Chat form not found (id: chatForm)");if(!this.input)throw new Error("Input field not found (id: userInput)");if(!this.messageContainer)throw new Error("Message container not found (id: messageContainer)");this.initializeProductDetails(),this.setupEventListeners()}initializeProductDetails(){this.productDetails={title:this.getAttribute("product-title"),capacity:this.getAttribute("product-capacity"),ac_output_continuous_power:this.getAttribute("product-ac_output_continuous_power"),ac_output_peak_power:this.getAttribute("product-ac_output_peak_power"),dc_output_power:this.getAttribute("product-dc_output_power")},console.log("Initialized product details:",this.productDetails)}setupEventListeners(){this.form.addEventListener("submit",t=>{t.preventDefault();const e=this.input.value.trim();e&&(s.emit("userMessage",e),this.input.value="")}),this.messageContainer.addEventListener("click",t=>{const e=t.target.closest("button-component");if(e){const i=this.getButtonPayload(e);i&&(s.emit("buttonClicked",i),this.removeInteractiveElements())}}),this.messageContainer.addEventListener("click",t=>{if(t.target.closest("carousel-component")){const i=t.target.closest(".carousel-button");if(i){const o=this.getButtonPayload(i);o&&s.emit("carouselButtonClicked",o)}}})}getButtonPayload(t){try{return JSON.parse(t.getAttribute("payload")||"null")}catch(e){return console.error("Error parsing button payload:",e),null}}addMessage(t,e,i=null){const o=document.createElement("message-component");o.setAttribute("sender",t),o.setAttribute("content",e),i&&o.setAttribute("metadata",JSON.stringify(i)),this.messageContainer.appendChild(o),this.scrollToBottom()}addButtons(t){if(!Array.isArray(t)){console.error("Invalid buttons data:",t);return}const e=document.createElement("div");e.className="buttons-container",t.forEach(i=>{const o=document.createElement("button-component");o.setAttribute("label",i.name),o.setAttribute("payload",JSON.stringify(i.request)),e.appendChild(o)}),this.messageContainer.appendChild(e),this.scrollToBottom()}addCarousel(t){if(!Array.isArray(t)){console.error("Invalid carousel items:",t);return}const e=document.createElement("carousel-component");e.setAttribute("items",JSON.stringify(t)),this.messageContainer.appendChild(e),this.scrollToBottom()}updateTypingText(t){this.typingText&&(this.typingText.textContent=t)}showTypingIndicator(){this.typingIndicator&&(this.typingIndicator.style.display="flex",this.scrollToBottom())}hideTypingIndicator(){this.typingIndicator&&(this.typingIndicator.style.display="none")}displayError(t){const e=document.createElement("div");e.classList.add("error-message"),e.innerText=t,this.messageContainer.appendChild(e),this.scrollToBottom()}scrollToBottom(){this.messageContainer.scrollTop=this.messageContainer.scrollHeight}getAttribute(t){return this.container.getAttribute(t)}removeInteractiveElements(){this.messageContainer.querySelectorAll("button-component, carousel-component, .buttons-container").forEach(e=>e.remove())}}class S{constructor(t,e){if(!t||!e)throw new Error("SectionChatbot requires both core and ui instances");this.core=t,this.ui=e,this.isLaunched=!1,this.validateProductDetails(),this.setupEventListeners()}validateProductDetails(){const e=["title","capacity"].filter(i=>!this.ui.productDetails[i]);e.length>0&&(console.error(`Missing required product details: ${e.join(", ")}`),this.ui.displayError("Some product information is missing. Chat functionality may be limited."))}setupEventListeners(){s.on(l.SECTION_CHATBOT.MESSAGE_RECEIVED,t=>{this.ui.hideTypingIndicator(),this.ui.addMessage("assistant",t.content,t.metadata)}),s.on(l.SECTION_CHATBOT.TYPING,t=>{t.isTyping?this.ui.showTypingIndicator():this.ui.hideTypingIndicator()}),s.on(l.SECTION_CHATBOT.TYPING_TEXT,t=>{this.ui.updateTypingText(t.text),this.ui.showTypingIndicator()}),s.on(l.SECTION_CHATBOT.CHOICE_PRESENTED,t=>{this.ui.hideTypingIndicator(),this.ui.addButtons(t.buttons)}),s.on(l.SECTION_CHATBOT.CAROUSEL_PRESENTED,t=>{this.ui.hideTypingIndicator(),this.ui.addCarousel(t.carouselItems)}),s.on(l.SECTION_CHATBOT.ERROR,t=>{this.ui.hideTypingIndicator(),this.ui.displayError(t.message)}),s.on("userMessage",t=>{this.sendMessage(t)}),s.on("buttonClicked",t=>{this.handleButtonClick(t)}),s.on("carouselButtonClicked",t=>{this.handleButtonClick(t)}),window.addEventListener("unload",()=>{this.destroy()})}launch(){if(this.isLaunched){console.log("Section chatbot already launched");return}const e={action:{type:"launch",payload:{startBlock:"shopifySection",powerStationDetails:this.sanitizeProductDetails(this.ui.productDetails)}}};console.log("Launching section chatbot with payload:",e),this.ui.showTypingIndicator(),this.core.sendLaunch(e),this.isLaunched=!0}sanitizeProductDetails(t){return Object.entries(t).reduce((e,[i,o])=>(e[i]=o?String(o).trim():"",e),{})}sendMessage(t){t.trim()&&(this.ui.showTypingIndicator(),this.core.sendMessage(t),this.ui.addMessage("user",t))}handleButtonClick(t){t&&(this.ui.showTypingIndicator(),this.core.sendAction({action:t}),this.ui.removeInteractiveElements())}destroy(){this.core.closeConnection(),s.removeAllListeners(`${l.SECTION_CHATBOT.PREFIX}:`),s.removeAllListeners("userMessage"),s.removeAllListeners("buttonClicked"),s.removeAllListeners("carouselButtonClicked")}}document.addEventListener("DOMContentLoaded",()=>{const a=document.getElementById("section-chatbot-ui");if(!a){console.error("Section Chatbot UI container not found");return}let t=localStorage.getItem("sectionChatbotUserId");t||(t=f("sectionChatbot"),localStorage.setItem("sectionChatbotUserId",t));const e=new y({userID:t,endpoint:"https://chatbottings--development.gadget.app/voiceflowAPI/voiceflow-streaming",chatbotType:"section"}),i=new T(a),o=new S(e,i),n=a.querySelector("#userInput");console.log("Section Chatbot UI input:",n),n?n.addEventListener("focus",()=>{o.isLaunched||o.launch()}):console.error("Section Chatbot input field not found")});class A extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){const t=this.getAttribute("label"),e=this.getAttribute("payload");this.render(t,e)}render(t,e){this.shadowRoot.innerHTML=`
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
    `,this.shadowRoot.querySelector(".button").addEventListener("click",()=>{try{const i=JSON.parse(e);s.emit("buttonClicked",i)}catch(i){console.error("Error parsing button payload:",i)}})}}class _ extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){const t=this.getAttribute("sender"),e=this.getAttribute("content");this.render(t,e)}render(t,e){const i=t==="assistant";this.shadowRoot.innerHTML=`
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
          background-color: ${i?"#FFFFFF":"rgba(255, 255, 255, 0.1)"};
          color: ${i?"#231F25":"#FFFFFF"};
          border: ${i?"none":"1px solid #FFFFFF"};
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
        ${i?'<div class="assistant-icon">🚀</div>':""}
        <div class="message message--${t}">
          <div class="message__content">${this.markdownToHtml(e)}</div>
        </div>
      </div>
    `}markdownToHtml(t){return t?t.replace(/\n/g,"<br>"):""}}class k extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.items=[],this.currentIndex=0,this.isDesktop=window.matchMedia("(min-width: 1000px)").matches,this.itemsPerSlide=this.isDesktop?2:1,this.moveLeft=this.moveLeft.bind(this),this.moveRight=this.moveRight.bind(this),this.handleResize=this.handleResize.bind(this),this.handleButtonClick=this.handleButtonClick.bind(this)}connectedCallback(){const t=this.getAttribute("data-carousel");if(!t){console.error("No data-carousel attribute found. Cannot render carousel.");return}let e;try{e=JSON.parse(t)}catch(i){console.error("Failed to parse carousel data:",i);return}if(!e||!Array.isArray(e.cards)){console.error("carouselData.cards is not defined or not an array");return}this.renderCarousel(e)}renderCarousel(t){this.carouselData=t,this.shadowRoot.innerHTML=`
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
    `,this.carouselContainer=this.shadowRoot.querySelector(".carousel__container"),this.leftButton=this.shadowRoot.querySelector(".carousel__button--left"),this.rightButton=this.shadowRoot.querySelector(".carousel__button--right"),this.carouselData.cards.forEach((e,i)=>{const o=document.createElement("div");o.classList.add("carousel__item");const n=document.createElement("div");n.classList.add("carousel__item-wrapper");const c=document.createElement("div");if(c.classList.add("carousel__item-content"),e.imageUrl){const r=document.createElement("img");r.src=e.imageUrl,r.alt=e.title||"",r.classList.add("carousel__item-image"),c.appendChild(r)}if(e.title){const r=document.createElement("h6");r.classList.add("carousel__item-title"),r.textContent=e.title,c.appendChild(r)}if(e.description&&e.description.text){const r=document.createElement("p");r.classList.add("carousel__item-description"),r.textContent=e.description.text,c.appendChild(r)}if(e.buttons&&e.buttons.length>0){const r=e.buttons[0],d=document.createElement("button");d.classList.add("button","carousel__item-button"),d.setAttribute("data-button-index",i),d.setAttribute("data-button-payload",JSON.stringify(r.request)),d.setAttribute("data-button-text",r.name),d.textContent=r.name||"Select",c.appendChild(d),d.addEventListener("click",this.handleButtonClick)}n.appendChild(c),o.appendChild(n),this.carouselContainer.appendChild(o),this.items.push(o)}),this.initCarousel(),this.leftButton.addEventListener("click",this.moveLeft),this.rightButton.addEventListener("click",this.moveRight),window.addEventListener("resize",this.handleResize),this.updateVisibility(),this.updatePosition()}initCarousel(){this.isDesktop=window.matchMedia("(min-width: 1000px)").matches,this.itemsPerSlide=this.isDesktop?2:1,this.currentIndex=0,this.updateVisibility(),this.updatePosition()}handleResize(){this.isDesktop=window.matchMedia("(min-width: 1000px)").matches,this.itemsPerSlide=this.isDesktop?2:1,this.currentIndex=0,this.updatePosition(),this.updateVisibility()}moveLeft(){const t=this.itemsPerSlide;this.currentIndex=Math.max(0,this.currentIndex-t),this.updatePosition(),this.updateVisibility()}moveRight(){const t=this.itemsPerSlide;this.currentIndex=Math.min(this.items.length-t,this.currentIndex+t),this.updatePosition(),this.updateVisibility()}updatePosition(){const t=this.itemsPerSlide,e=-(this.currentIndex/t)*100;this.carouselContainer.style.transform=`translateX(${e}%)`}updateVisibility(){const t=this.itemsPerSlide;this.leftButton.disabled=this.currentIndex===0,this.rightButton.disabled=this.currentIndex>=this.items.length-t}handleButtonClick(t){const e=t.target,i=parseInt(e.getAttribute("data-button-index"),10),o=this.carouselData.cards[i];if(!o||!o.buttons||o.buttons.length===0){console.warn("No button data found for this card.");return}const n=o.buttons[0];console.log("Original button data:",n);const c=n.request.payload.title,r=c?`Selected ${c}`:"Selected Power Station";s.emit("carouselButtonClicked",{action:n.request,label:r}),this.remove()}}customElements.define("button-component",A);customElements.define("message-component",_);customElements.define("carousel-component",k);export{x as M,T as S,w as a,S as b};
//# sourceMappingURL=chatbot-core.eauYX2L6.js.map
