import{C as u}from"./chatbot-core-file-D_dkLCnc.js";console.log("MainChatbot module loading");class p{constructor(e,t){console.log("MainChatbot constructor called with config:",t),this.element=e,this.voiceflowEndpoint=t.voiceflowEndpoint,this.core=new u({apiEndpoint:this.voiceflowEndpoint,userIDPrefix:"mainChatbot"}),console.log("ChatbotCore instance created:",this.core),this.conversationHistory=[],this.hasLaunched=localStorage.getItem("chatHasLaunched")==="true",this.eventListenersAttached=!1,this.initializeElements(),this.setupEventListeners(),this.hasLaunched&&(this.loadConversationFromStorage(),this.displaySavedConversation())}initializeElements(){console.log("MainChatbot initializeElements called");const e=this.element.querySelector("#messageContainer"),t=this.element.querySelector(".chat-typing"),o=this.element.closest("x-drawer");let s=null;if(o&&o.shadowRoot&&(s=o.shadowRoot.querySelector('[part="body"]')),!e||!t||!s){console.error("Required DOM elements not found");return}this.core.setDOMElements(e,t,s),console.log("DOM elements set in ChatbotCore:",this.core)}setupEventListeners(){if(this.eventListenersAttached)return;console.log("MainChatbot setupEventListeners called");const e=this.element.querySelector("#chatForm"),t=this.element.querySelector("#userInput");if(!e||!t){console.error("Chat form or input not found");return}e.addEventListener("submit",async o=>{o.preventDefault();const s=t.value.trim();s&&(console.log("Form submitted with message:",s),t.value="",await this.handleUserMessage(s))}),this.element.addEventListener("click",async o=>{if(o.target.matches(".button-container button")){const s=JSON.parse(o.target.dataset.buttonData);try{const i=await this.core.handleButtonClick(s);this.conversationHistory.push({type:"user",message:s.name}),this.saveConversationToStorage(),await this.handleAgentResponse(i)}catch(i){console.error("Error handling button click:",i)}}}),this.eventListenersAttached=!0}async initializeChat(){if(console.log("Initializing chat"),this.hasLaunched)this.loadConversationFromStorage(),this.displaySavedConversation();else try{console.log("Initializing chat for the first time"),await this.sendLaunch(),this.hasLaunched=!0,localStorage.setItem("chatHasLaunched","true")}catch(e){console.error("Error during chat initialization:",e)}this.core.scrollToBottom(),console.log("Chat initialized")}async sendLaunch(e={}){console.log("Sending main chatbot launch request");const t={userAction:{type:"launch"}};try{const o=await this.core.sendLaunch(t);await this.handleAgentResponse(o)}catch(o){console.error("Error in main chatbot send launch:",o)}}async handleUserMessage(e){this.core.addMessage("user",e),this.conversationHistory.push({type:"user",message:e}),this.saveConversationToStorage(),this.core.showTypingIndicator();try{const t=await this.core.sendMessage(e);console.log("Response from sendMessage:",t),await this.handleAgentResponse(t)}catch(t){console.error("Error in send message:",t)}finally{this.core.hideTypingIndicator(),this.core.scrollToBottom()}}loadConversationFromStorage(){const e=localStorage.getItem("chatConversation");this.conversationHistory=e?JSON.parse(e):[],console.log("Loaded conversation from storage:",this.conversationHistory)}saveConversationToStorage(){localStorage.setItem("chatConversation",JSON.stringify(this.conversationHistory)),console.log("Saved conversation to storage")}displaySavedConversation(){console.log("Displaying saved conversation");const e=this.element.querySelector("#messageContainer");e?(e.innerHTML="",this.conversationHistory.forEach((t,o)=>{if(t.type==="user"||t.type==="assistant")this.core.addMessage(t.type,t.message);else if(t.type==="choice"){const s=this.conversationHistory[o+1];(!s||s.type!=="user")&&this.core.addButtons(t.buttons)}else if(t.type==="carousel"){const s=this.conversationHistory[o+1];(!s||s.type!=="user")&&this.addCarousel(t.data)}else t.type==="visual"&&t.data.visualType==="image"&&this.addVisualImage(t.data)}),this.core.scrollToBottom()):console.error("Message container not found")}handleProductRedirect(e){if(!e){console.error("Cannot redirect: Product handle is undefined or empty");return}const o=`https://www.sherpapower.co.uk/products/${encodeURIComponent(e)}`;console.log(`Redirecting to product page: ${o}`),window.location.href=o}async handleAgentResponse(e){var t,o;console.log("Handling agent response:",e);for(const s of e)if(s.type==="RedirectToProduct"){const i=(o=(t=s.payload)==null?void 0:t.body)==null?void 0:o.productHandle;if(i){this.handleProductRedirect(i);return}}else s.type==="text"?(this.core.addMessage("assistant",s.payload.message),this.conversationHistory.push({type:"assistant",message:s.payload.message})):s.type==="choice"?(this.core.addButtons(s.payload.buttons),this.conversationHistory.push({type:"choice",buttons:s.payload.buttons})):s.type==="carousel"?(this.addCarousel(s.payload),this.conversationHistory.push({type:"carousel",data:s.payload})):s.type==="visual"&&s.payload.visualType==="image"?(this.addVisualImage(s.payload),this.conversationHistory.push({type:"visual",data:s.payload})):console.log("Unknown trace type:",s.type);this.saveConversationToStorage(),this.core.scrollToBottom()}addVisualImage(e){console.log("Adding visual image:",e);const t=this.element.querySelector("#messageContainer");if(t){const o=document.createElement("div");o.classList.add("message-wrapper","message-wrapper--assistant");const s=document.createElement("img");s.src=e.image,s.alt="Visual content",s.classList.add("chat-image"),e.dimensions&&(s.width=e.dimensions.width,s.height=e.dimensions.height),s.loading="lazy",s.onerror=()=>{console.error("Failed to load image:",e.image),s.alt="Failed to load image"},o.appendChild(s),t.appendChild(o)}else console.error("Message container not found when adding visual image")}addCarousel(e){console.log("Adding carousel:",e);const t=document.createElement("div");t.className="carousel",t.innerHTML=`
      <div class="carousel__container">
        <!-- Carousel items will be dynamically added here -->
      </div>
      <button class="carousel__button carousel__button--left" aria-label="Previous slide">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <button class="carousel__button carousel__button--right" aria-label="Next slide">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    `;const o=new m(t);e.cards.forEach((n,a)=>{const r=`
        <div class="carousel__item-wrapper">
          <div class="carousel__item-content">
            <img src="${n.imageUrl}" alt="${n.title}" class="carousel__item-image">
            <h6 class="carousel__item-title">${n.title}</h6>
            <p class="carousel__item-description">${n.description.text}</p>
            <button class="button carousel__item-button" data-button-index="${a}">${n.buttons[0].name}</button>
          </div>
        </div>
      `;o.addItem(r)}),t.querySelectorAll(".carousel__item-button").forEach((n,a)=>{n.addEventListener("click",async()=>{const r=Math.floor(a/e.cards[0].buttons.length),d=a%e.cards[0].buttons.length,c=e.cards[r].buttons[d];try{t.remove(),this.conversationHistory.push({type:"user",message:c.name}),this.saveConversationToStorage();const l=await this.core.handleButtonClick(c);await this.handleAgentResponse(l)}catch(l){console.error("Error handling carousel button click:",l)}})});const i=this.element.querySelector("#messageContainer");i?(i.appendChild(t),this.core.scrollToBottom()):console.error("Message container not found when adding carousel")}}class m{constructor(e){this.element=e,this.container=e.querySelector(".carousel__container"),this.leftButton=e.querySelector(".carousel__button--left"),this.rightButton=e.querySelector(".carousel__button--right"),this.items=[],this.currentIndex=0,this.mediaQuery=window.matchMedia("(min-width: 1000px)"),this.isDesktop=this.mediaQuery.matches,this.leftButton.addEventListener("click",()=>this.move("left")),this.rightButton.addEventListener("click",()=>this.move("right")),this.mediaQuery.addListener(this.handleMediaQueryChange.bind(this))}handleMediaQueryChange(e){this.isDesktop=e.matches,this.currentIndex=0,this.updatePosition(),this.updateVisibility()}addItem(e){const t=document.createElement("div");t.className="carousel__item",t.innerHTML=e,this.container.appendChild(t),this.items.push(t),this.updateVisibility()}move(e){const t=this.isDesktop?2:1;e==="left"?this.currentIndex=Math.max(0,this.currentIndex-t):this.currentIndex=Math.min(this.items.length-t,this.currentIndex+t),this.updatePosition(),this.updateVisibility()}updatePosition(){const e=this.isDesktop?2:1,t=-(this.currentIndex/e)*100;this.container.style.transform=`translateX(${t}%)`}updateVisibility(){const e=this.isDesktop?2:1;this.leftButton.style.display=this.currentIndex===0?"none":"flex",this.rightButton.style.display=this.currentIndex>=this.items.length-e?"none":"flex"}}console.log("MainChatbot module loaded");export{p as M};
//# sourceMappingURL=chatbot-main-DsYIHRcN.js.map
