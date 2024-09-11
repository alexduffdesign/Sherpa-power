import{C as u}from"./chatbot-core-file-D_dkLCnc.js";console.log("MainChatbot module loading");class p{constructor(e,t){console.log("MainChatbot constructor called with config:",t),this.element=e,this.voiceflowEndpoint=t.voiceflowEndpoint,this.core=new u({apiEndpoint:this.voiceflowEndpoint,userIDPrefix:"mainChatbot"}),console.log("ChatbotCore instance created:",this.core),this.conversationHistory=[],this.hasLaunched=localStorage.getItem("chatHasLaunched")==="true",this.eventListenersAttached=!1,this.initializeElements(),this.setupEventListeners(),this.hasLaunched?(this.loadConversationFromStorage(),this.displaySavedConversation()):this.initializeChat()}initializeElements(){console.log("MainChatbot initializeElements called");const e=this.element.querySelector("#messageContainer"),t=this.element.querySelector(".chat-typing"),s=this.element.closest("x-drawer");let o=null;if(s&&s.shadowRoot&&(o=s.shadowRoot.querySelector('[part="body"]')),!e||!t||!o){console.error("Required DOM elements not found");return}this.core.setDOMElements(e,t,o),console.log("DOM elements set in ChatbotCore:",this.core)}setupEventListeners(){if(this.eventListenersAttached)return;console.log("MainChatbot setupEventListeners called");const e=this.element.querySelector("#chatForm"),t=this.element.querySelector("#userInput");if(!e||!t){console.error("Chat form or input not found");return}e.addEventListener("submit",async s=>{s.preventDefault();const o=t.value.trim();o&&(console.log("Form submitted with message:",o),t.value="",await this.handleUserMessage(o))}),this.element.addEventListener("click",async s=>{if(s.target.matches(".button-container button")){const o=JSON.parse(s.target.dataset.buttonData);try{const i=await this.core.handleButtonClick(o);await this.handleAgentResponse(i)}catch(i){console.error("Error handling button click:",i)}}}),this.eventListenersAttached=!0}async handleUserMessage(e){this.core.addMessage("user",e),this.conversationHistory.push({type:"user",message:e}),this.saveConversationToStorage(),this.core.showTypingIndicator();try{const t=await this.core.sendMessage(e);console.log("Response from sendMessage:",t),await this.handleAgentResponse(t)}catch(t){console.error("Error in send message:",t)}finally{this.core.hideTypingIndicator(),this.core.scrollToBottom()}}loadConversationFromStorage(){const e=localStorage.getItem("chatConversation");this.conversationHistory=e?JSON.parse(e):[],console.log("Loaded conversation from storage:",this.conversationHistory)}saveConversationToStorage(){localStorage.setItem("chatConversation",JSON.stringify(this.conversationHistory)),console.log("Saved conversation to storage")}displaySavedConversation(){console.log("Displaying saved conversation");const e=this.element.querySelector("#messageContainer");e?(e.innerHTML="",this.conversationHistory.forEach(t=>{this.core.addMessage(t.type,t.message)}),this.core.scrollToBottom()):console.error("Message container not found")}async initializeChat(){console.log("Initializing chat"),this.hasLaunched||(console.log("Initializing chat for the first time"),await this.sendLaunch(),this.hasLaunched=!0,localStorage.setItem("chatHasLaunched","true")),console.log("Chat initialized")}async sendLaunch(){console.log("Sending main chatbot launch request");const e={userAction:{type:"launch"}};try{const t=await this.core.sendLaunch(e);await this.handleAgentResponse(t)}catch(t){console.error("Error in main chatbot send launch:",t)}}async handleAgentResponse(e){console.log("Handling agent response:",e);for(const t of e)t.type==="text"?(this.core.addMessage("assistant",t.payload.message),this.conversationHistory.push({type:"assistant",message:t.payload.message})):t.type==="choice"?this.core.addButtons(t.payload.buttons):t.type==="carousel"?this.addCarousel(t.payload):console.log("Unknown trace type:",t.type);this.saveConversationToStorage(),this.core.scrollToBottom()}addCarousel(e){console.log("Adding carousel:",e);const t=document.createElement("div");t.className="carousel",t.innerHTML=`
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
    `;const s=new g(t);e.cards.forEach((n,a)=>{const r=`
        <div class="carousel__item-wrapper">
          <div class="carousel__item-content">
            <img src="${n.imageUrl}" alt="${n.title}" class="carousel__item-image">
            <h6 class="carousel__item-title">${n.title}</h6>
            <p class="carousel__item-description">${n.description.text}</p>
            <button class="button carousel__item-button" data-button-index="${a}">${n.buttons[0].name}</button>
          </div>
        </div>
      `;s.addItem(r)}),t.querySelectorAll(".carousel__item-button").forEach((n,a)=>{n.addEventListener("click",async()=>{const r=Math.floor(a/e.cards[0].buttons.length),h=a%e.cards[0].buttons.length,d=e.cards[r].buttons[h];try{t.remove();const l=await this.core.handleButtonClick(d);await this.handleAgentResponse(l)}catch(l){console.error("Error handling carousel button click:",l)}})});const i=this.element.querySelector("#messageContainer");i?(i.appendChild(t),this.core.scrollToBottom()):console.error("Message container not found when adding carousel")}}class g{constructor(e){this.element=e,this.container=e.querySelector(".carousel__container"),this.leftButton=e.querySelector(".carousel__button--left"),this.rightButton=e.querySelector(".carousel__button--right"),this.items=[],this.currentIndex=0,this.mediaQuery=window.matchMedia("(min-width: 1000px)"),this.isDesktop=this.mediaQuery.matches,this.leftButton.addEventListener("click",()=>this.move("left")),this.rightButton.addEventListener("click",()=>this.move("right")),this.mediaQuery.addListener(this.handleMediaQueryChange.bind(this))}handleMediaQueryChange(e){this.isDesktop=e.matches,this.currentIndex=0,this.updatePosition(),this.updateVisibility()}addItem(e){const t=document.createElement("div");t.className="carousel__item",t.innerHTML=e,this.container.appendChild(t),this.items.push(t),this.updateVisibility()}move(e){const t=this.isDesktop?2:1;e==="left"?this.currentIndex=Math.max(0,this.currentIndex-t):this.currentIndex=Math.min(this.items.length-t,this.currentIndex+t),this.updatePosition(),this.updateVisibility()}updatePosition(){const e=this.isDesktop?2:1,t=-(this.currentIndex/e)*100;this.container.style.transform=`translateX(${t}%)`}updateVisibility(){const e=this.isDesktop?2:1;this.leftButton.style.display=this.currentIndex===0?"none":"flex",this.rightButton.style.display=this.currentIndex>=this.items.length-e?"none":"flex"}}console.log("MainChatbot module loaded");export{p as M};
//# sourceMappingURL=chatbot-main-C1QbmbOr.js.map
