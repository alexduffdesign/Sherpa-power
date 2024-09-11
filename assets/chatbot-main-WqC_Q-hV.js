import{C as u}from"./chatbot-core-file-BEFLNIma.js";console.log("MainChatbot module loading");class p{constructor(e,t){console.log("MainChatbot constructor called with config:",t),this.element=e,this.voiceflowEndpoint=t.voiceflowEndpoint,this.core=new u({apiEndpoint:this.voiceflowEndpoint,userIDPrefix:"mainChatbot"}),console.log("ChatbotCore instance created:",this.core),this.conversationHistory=[],this.hasLaunched=localStorage.getItem("chatHasLaunched")==="true",this.eventListenersAttached=!1,this.initializeElements(),this.setupEventListeners(),this.hasLaunched?(this.loadConversationFromStorage(),this.displaySavedConversation()):this.initializeChat()}initializeElements(){console.log("MainChatbot initializeElements called");const e=this.element.querySelector("#messageContainer"),t=this.element.querySelector(".chat-typing"),o=this.element.closest("x-drawer");let s=null;if(o&&o.shadowRoot&&(s=o.shadowRoot.querySelector('[part="body"]')),!e||!t||!s){console.error("Required DOM elements not found");return}this.core.setDOMElements(e,t,s),console.log("DOM elements set in ChatbotCore:",this.core)}setupEventListeners(){if(this.eventListenersAttached)return;console.log("MainChatbot setupEventListeners called");const e=this.element.querySelector("#chatForm"),t=this.element.querySelector("#userInput");if(!e||!t){console.error("Chat form or input not found");return}e.addEventListener("submit",async o=>{o.preventDefault();const s=t.value.trim();s&&(console.log("Form submitted with message:",s),t.value="",await this.handleUserMessage(s))}),this.element.addEventListener("click",async o=>{if(o.target.matches(".button-container button")){const s=JSON.parse(o.target.dataset.buttonData);try{const i=await this.core.handleButtonClick(s);await this.handleAgentResponse(i)}catch(i){console.error("Error handling button click:",i)}}}),this.eventListenersAttached=!0}async handleUserMessage(e){this.core.addMessage("user",e),this.conversationHistory.push({type:"user",message:e}),this.saveConversationToStorage(),this.core.showTypingIndicator();try{const t=await this.core.sendMessage(e);console.log("Response from sendMessage:",t),await this.handleAgentResponse(t)}catch(t){console.error("Error in send message:",t)}finally{this.core.hideTypingIndicator(),this.core.scrollToBottom()}}loadConversationFromStorage(){const e=localStorage.getItem("chatConversation");this.conversationHistory=e?JSON.parse(e):[],console.log("Loaded conversation from storage:",this.conversationHistory)}saveConversationToStorage(){localStorage.setItem("chatConversation",JSON.stringify(this.conversationHistory)),console.log("Saved conversation to storage")}displaySavedConversation(){console.log("Displaying saved conversation");const e=this.element.querySelector("#messageContainer");e?(e.innerHTML="",this.conversationHistory.forEach(t=>{this.core.addMessage(t.type,t.message)}),this.core.scrollToBottom()):console.error("Message container not found")}async initializeChat(){console.log("Initializing chat"),this.hasLaunched||(console.log("Initializing chat for the first time"),await this.sendLaunch(),this.hasLaunched=!0,localStorage.setItem("chatHasLaunched","true")),console.log("Chat initialized")}async sendLaunch(){console.log("Sending main chatbot launch request");const e={userAction:{type:"launch"}};try{const t=await this.core.sendLaunch(e);await this.handleAgentResponse(t)}catch(t){console.error("Error in main chatbot send launch:",t)}}async handleAgentResponse(e){console.log("Handling agent response:",e);for(const t of e)t.type==="text"?(this.core.addMessage("assistant",t.payload.message),this.conversationHistory.push({type:"assistant",message:t.payload.message})):t.type==="choice"?this.core.addButtons(t.payload.buttons):t.type==="carousel"?this.addCarousel(t.payload):console.log("Unknown trace type:",t.type);this.saveConversationToStorage(),this.core.scrollToBottom()}addCarousel(e){console.log("Adding carousel:",e);const t=document.createElement("div");t.className="carousel",t.innerHTML=`
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
  `;const o=new g(t);for(let a=0;a<e.cards.length;a+=2){const r=e.cards.slice(a,a+2).map(n=>`
      <div class="carousel__item-wrapper">
        <div class="carousel__item-content">
          <img src="${n.imageUrl}" alt="${n.title}" class="carousel__item-image">
          <h6 class="carousel__item-title">${n.title}</h6>
          <p class="carousel__item-description">${n.description.text}</p>
          <button class="button carousel__item-button" data-button-index="0">${n.buttons[0].name}</button>
        </div>
      </div>
    `).join("");o.addItem(r)}t.querySelectorAll(".carousel__item-button").forEach((a,r)=>{a.addEventListener("click",async()=>{const n=Math.floor(r/e.cards[0].buttons.length),h=r%e.cards[0].buttons.length,d=e.cards[n].buttons[h];try{const l=await this.core.handleButtonClick(d);await this.handleAgentResponse(l)}catch(l){console.error("Error handling carousel button click:",l)}})});const i=this.element.querySelector("#messageContainer");i?(i.appendChild(t),this.core.scrollToBottom()):console.error("Message container not found when adding carousel")}}class g{constructor(e){this.element=e,this.container=e.querySelector(".carousel__container"),this.leftButton=e.querySelector(".carousel__button--left"),this.rightButton=e.querySelector(".carousel__button--right"),this.items=[],this.currentIndex=0,this.leftButton.addEventListener("click",()=>this.move("left")),this.rightButton.addEventListener("click",()=>this.move("right"))}addItem(e){const t=document.createElement("div");t.className="carousel__item",t.innerHTML=e,this.container.appendChild(t),this.items.push(t),this.updateVisibility()}move(e){e==="left"?this.currentIndex=Math.max(0,this.currentIndex-1):this.currentIndex=Math.min(this.items.length-1,this.currentIndex+1),this.updatePosition(),this.updateVisibility()}updatePosition(){const e=-this.currentIndex*100;this.container.style.transform=`translateX(${e}%)`}updateVisibility(){this.leftButton.style.display=this.currentIndex===0?"none":"flex",this.rightButton.style.display=this.currentIndex===this.items.length-1?"none":"flex"}}console.log("MainChatbot module loaded");export{p as M};
//# sourceMappingURL=chatbot-main-WqC_Q-hV.js.map
