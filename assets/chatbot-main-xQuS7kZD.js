import{C as u}from"./chatbot-core-file-D_dkLCnc.js";console.log("MainChatbot module loading");class p{constructor(t,e){console.log("MainChatbot constructor called with config:",e),this.element=t,this.voiceflowEndpoint=e.voiceflowEndpoint,this.core=new u({apiEndpoint:this.voiceflowEndpoint,userIDPrefix:"mainChatbot"}),console.log("ChatbotCore instance created:",this.core),this.conversationHistory=[],this.hasLaunched=localStorage.getItem("chatHasLaunched")==="true",this.eventListenersAttached=!1,this.initializeElements(),this.setupEventListeners(),this.hasLaunched&&(this.loadConversationFromStorage(),this.displaySavedConversation())}initializeElements(){console.log("MainChatbot initializeElements called");const t=this.element.querySelector("#messageContainer"),e=this.element.querySelector(".chat-typing"),o=this.element.closest("x-drawer");let s=null;if(o&&o.shadowRoot&&(s=o.shadowRoot.querySelector('[part="body"]')),!t||!e||!s){console.error("Required DOM elements not found");return}this.core.setDOMElements(t,e,s),console.log("DOM elements set in ChatbotCore:",this.core)}setupEventListeners(){if(this.eventListenersAttached)return;console.log("MainChatbot setupEventListeners called");const t=this.element.querySelector("#chatForm"),e=this.element.querySelector("#userInput");if(!t||!e){console.error("Chat form or input not found");return}t.addEventListener("submit",async s=>{s.preventDefault();const n=e.value.trim();n&&(console.log("Form submitted with message:",n),e.value="",await this.handleUserMessage(n))}),this.element.addEventListener("click",async s=>{if(s.target.matches(".button-container button")){const n=JSON.parse(s.target.dataset.buttonData);try{const i=await this.core.handleButtonClick(n);this.conversationHistory.push({type:"user",message:n.name}),this.saveConversationToStorage(),await this.handleAgentResponse(i)}catch(i){console.error("Error handling button click:",i)}}});const o=document.querySelector(".back-to-start");o?o.addEventListener("click",()=>this.jumpToMainMenu()):console.error("Jump to start button not found"),this.eventListenersAttached=!0}async initializeChat(){if(console.log("Initializing chat"),this.hasLaunched)this.loadConversationFromStorage(),this.displaySavedConversation();else try{console.log("Initializing chat for the first time"),await this.sendLaunch(),this.hasLaunched=!0,localStorage.setItem("chatHasLaunched","true")}catch(t){console.error("Error during chat initialization:",t)}this.core.scrollToBottom(),console.log("Chat initialized")}async sendLaunch(t={}){console.log("Sending main chatbot launch request");const e={userAction:{type:"launch"}};try{const o=await this.core.sendLaunch(e);await this.handleAgentResponse(o)}catch(o){console.error("Error in main chatbot send launch:",o)}}async handleUserMessage(t){this.core.addMessage("user",t),this.conversationHistory.push({type:"user",message:t}),this.saveConversationToStorage(),this.core.showTypingIndicator();try{const e=await this.core.sendMessage(t);console.log("Response from sendMessage:",e),await this.handleAgentResponse(e)}catch(e){console.error("Error in send message:",e)}finally{this.core.hideTypingIndicator(),this.core.scrollToBottom()}}loadConversationFromStorage(){const t=localStorage.getItem("chatConversation");this.conversationHistory=t?JSON.parse(t):[],console.log("Loaded conversation from storage:",this.conversationHistory)}saveConversationToStorage(){localStorage.setItem("chatConversation",JSON.stringify(this.conversationHistory)),console.log("Saved conversation to storage")}displaySavedConversation(){console.log("Displaying saved conversation");const t=this.element.querySelector("#messageContainer");t?(t.innerHTML="",this.conversationHistory.forEach((e,o)=>{if(e.type==="user"||e.type==="assistant")this.core.addMessage(e.type,e.message);else if(e.type==="choice"){const s=this.conversationHistory[o+1];(!s||s.type!=="user")&&this.core.addButtons(e.buttons)}else if(e.type==="carousel"){const s=this.conversationHistory[o+1];(!s||s.type!=="user")&&this.addCarousel(e.data)}else e.type==="visual"&&e.data.visualType==="image"&&this.addVisualImage(e.data)}),this.core.scrollToBottom()):console.error("Message container not found")}async jumpToMainMenu(){console.log("MainChatbot jumpToMainMenu called");const t="Main menu";try{const e=await this.core.gadgetInteract({userID:this.core.userID,userAction:{type:"text",payload:{message:t}}});await this.handleAgentResponse(e)}catch(e){console.error("Error in jumpToMainMenu /:",e),this.core.addMessage("assistant","Sorry, I couldn't navigate to the main menu, Please try again.")}}handleProductRedirect(t){if(!t){console.error("Cannot redirect: Product handle is undefined or empty");return}const o=`https://www.sherpapower.co.uk/products/${encodeURIComponent(t)}`;console.log(`Redirecting to product page: ${o}`),window.location.href=o}async handleAgentResponse(t){var e,o;console.log("Handling agent response:",t);for(const s of t)if(s.type==="RedirectToProduct"){const n=(o=(e=s.payload)==null?void 0:e.body)==null?void 0:o.productHandle;if(n){this.handleProductRedirect(n);return}}else s.type==="text"?(this.core.addMessage("assistant",s.payload.message),this.conversationHistory.push({type:"assistant",message:s.payload.message})):s.type==="choice"?(this.core.addButtons(s.payload.buttons),this.conversationHistory.push({type:"choice",buttons:s.payload.buttons})):s.type==="carousel"?(this.addCarousel(s.payload),this.conversationHistory.push({type:"carousel",data:s.payload})):s.type==="visual"&&s.payload.visualType==="image"?(this.addVisualImage(s.payload),this.conversationHistory.push({type:"visual",data:s.payload})):console.log("Unknown trace type:",s.type);this.saveConversationToStorage(),this.core.scrollToBottom()}addVisualImage(t){console.log("Adding visual image:",t);const e=this.element.querySelector("#messageContainer");if(e){const o=document.createElement("div");o.classList.add("message-wrapper","message-wrapper--assistant");const s=document.createElement("img");s.src=t.image,s.alt="Visual content",s.classList.add("chat-image"),t.dimensions&&(s.width=t.dimensions.width,s.height=t.dimensions.height),s.loading="lazy",s.onerror=()=>{console.error("Failed to load image:",t.image),s.alt="Failed to load image"},o.appendChild(s),e.appendChild(o)}else console.error("Message container not found when adding visual image")}addCarousel(t){console.log("Adding carousel:",t);const e=document.createElement("div");e.className="carousel",e.innerHTML=`
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
    `;const o=new m(e);t.cards.forEach((i,a)=>{const r=`
        <div class="carousel__item-wrapper">
          <div class="carousel__item-content">
            <img src="${i.imageUrl}" alt="${i.title}" class="carousel__item-image">
            <h6 class="carousel__item-title">${i.title}</h6>
            <p class="carousel__item-description">${i.description.text}</p>
            <button class="button carousel__item-button" data-button-index="${a}">${i.buttons[0].name}</button>
          </div>
        </div>
      `;o.addItem(r)}),e.querySelectorAll(".carousel__item-button").forEach((i,a)=>{i.addEventListener("click",async()=>{const r=Math.floor(a/t.cards[0].buttons.length),d=a%t.cards[0].buttons.length,l=t.cards[r].buttons[d];try{e.remove(),this.conversationHistory.push({type:"user",message:l.name}),this.saveConversationToStorage();const c=await this.core.handleButtonClick(l);await this.handleAgentResponse(c)}catch(c){console.error("Error handling carousel button click:",c)}})});const n=this.element.querySelector("#messageContainer");n?(n.appendChild(e),this.core.scrollToBottom()):console.error("Message container not found when adding carousel")}}class m{constructor(t){this.element=t,this.container=t.querySelector(".carousel__container"),this.leftButton=t.querySelector(".carousel__button--left"),this.rightButton=t.querySelector(".carousel__button--right"),this.items=[],this.currentIndex=0,this.mediaQuery=window.matchMedia("(min-width: 1000px)"),this.isDesktop=this.mediaQuery.matches,this.leftButton.addEventListener("click",()=>this.move("left")),this.rightButton.addEventListener("click",()=>this.move("right")),this.mediaQuery.addListener(this.handleMediaQueryChange.bind(this))}handleMediaQueryChange(t){this.isDesktop=t.matches,this.currentIndex=0,this.updatePosition(),this.updateVisibility()}addItem(t){const e=document.createElement("div");e.className="carousel__item",e.innerHTML=t,this.container.appendChild(e),this.items.push(e),this.updateVisibility()}move(t){const e=this.isDesktop?2:1;t==="left"?this.currentIndex=Math.max(0,this.currentIndex-e):this.currentIndex=Math.min(this.items.length-e,this.currentIndex+e),this.updatePosition(),this.updateVisibility()}updatePosition(){const t=this.isDesktop?2:1,e=-(this.currentIndex/t)*100;this.container.style.transform=`translateX(${e}%)`}updateVisibility(){const t=this.isDesktop?2:1;this.leftButton.style.display=this.currentIndex===0?"none":"flex",this.rightButton.style.display=this.currentIndex>=this.items.length-t?"none":"flex"}}console.log("MainChatbot module loaded");export{p as M};
//# sourceMappingURL=chatbot-main-xQuS7kZD.js.map
