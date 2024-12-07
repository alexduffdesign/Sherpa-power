console.log("Recent changes check : 3");console.log("ChatbotCore module loaded");class m{constructor(t){this.apiEndpoint=t.apiEndpoint,this.userID=this.generateUserID(t.userIDPrefix||"chatbot"),this.completionEvents=t.completionEvents||!1}generateUserID(t){const e=localStorage.getItem(`${t}_userID`);if(e)return e;const s=`${t}_${Date.now()}_${Math.random().toString(36).substr(2,9)}`;return localStorage.setItem(`${t}_userID`,s),s}async streamInteract(t,e={}){const s=this.apiEndpoint,o=t.action?t:{userID:this.userID,action:t,config:{...e}};console.log("Sending streaming interact request to gadget endpoint:",o);const i=await fetch(s,{method:"POST",headers:{"Content-Type":"application/json",Accept:"text/event-stream","Cache-Control":"no-cache",Connection:"keep-alive"},credentials:"include",cache:"no-store",body:JSON.stringify(o)});if(!i.ok){const r=await i.text();throw console.error("Stream request failed:",i.status,r),new Error(`HTTP error! status: ${i.status}, details: ${r}`)}if(!i.body)throw new Error("Response has no body");return i}async launch(t,e){const s={type:"launch",payload:{startBlock:t,powerStationDetails:e}};return this.streamInteract(s)}async sendUserMessage(t){const e={type:"text",payload:t};return this.streamInteract(e)}async sendEvent(t,e={}){const s={type:"event",payload:{event:{name:t,...e}}};return this.streamInteract(s)}}class y{constructor(t){console.log("UIManager constructor called with rootElement:",t),this.messageContainer=null,this.typingIndicator=null,this.drawerBody=null,this.onButtonClick=null,this.rootElement=t}setDOMElements(t,e,s){console.log("Setting DOM elements in UIManager",{messageContainer:t,typingIndicator:e,drawerBody:s,rootElement:this.rootElement}),this.messageContainer=t,this.typingIndicator=e,this.drawerBody=s,console.log("DOM elements after setting:",{messageContainerValid:this.messageContainer instanceof Element,typingIndicatorValid:this.typingIndicator instanceof Element,drawerBodyValid:this.drawerBody instanceof Element,rootElementValid:this.rootElement instanceof Element})}setButtonClickHandler(t){this.onButtonClick=t}addMessage(t,e){if(console.log("[UI] Adding message:",{role:t,message:e}),!this.messageContainer||!this.rootElement)return console.error("[UI] Message container or root element not available",{messageContainer:this.messageContainer,rootElement:this.rootElement}),null;this.hideTypingIndicator();try{const s=this.rootElement.ownerDocument,o=s.createElement("div");o.classList.add("message-wrapper",`message-wrapper--${t}`);const i=s.createElement("div");i.classList.add("message",`message--${t}`);const r=s.createElement("div");if(r.classList.add("message__content"),typeof e=="string")console.log("[UI] Adding string message"),r.innerHTML=this.formatMessage(e);else if(e.slate)console.log("[UI] Adding slate message:",e.slate);else if(e instanceof Element)console.log("[UI] Adding Element message"),r.appendChild(e);else if(e.message)console.log("[UI] Adding message object:",e.message),r.innerHTML=this.formatMessage(e.message);else return console.error("[UI] Unsupported message format:",e),null;return i.appendChild(r),o.appendChild(i),this.messageContainer.appendChild(o),console.log("[UI] Message added successfully"),this.scrollToBottom(),o}catch(s){return console.error("[UI] Error adding message:",s),console.error("[UI] Message that caused error:",e),null}}formatMessage(t){return t=t.replace(/\n/g,"<br>"),t=t.replace(/(https?:\/\/[^\s]+)/g,'<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'),t=t.split(/\n{2,}/).map(s=>s.startsWith("<h")||s.startsWith("<ul")||s.startsWith("<ol")||s.startsWith("<blockquote")||s.startsWith("<hr")||s.startsWith("<img")?s:`<p>${s}</p>`).join(`
`),t}addCarousel(t){if(!this.messageContainer||!this.rootElement){console.error("[UI] Message container not available for carousel");return}const e=this.rootElement.ownerDocument,s=e.createElement("div");s.classList.add("carousel-container");const o=e.createElement("div");o.classList.add("carousel"),o.innerHTML=`
      <div class="carousel__container"></div>
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
    `;const i=new f(o);t.cards.forEach((n,l)=>{const a=e.createElement("div");a.classList.add("carousel__item-wrapper"),a.innerHTML=`
        <div class="carousel__item-content">
          <img src="${n.imageUrl}" alt="${n.title}" class="carousel__item-image">
          <h6 class="carousel__item-title">${n.title}</h6>
          <p class="carousel__item-description">${n.description.text}</p>
          <button class="button carousel__item-button" data-button-index="${l}">${n.buttons[0].name}</button>
        </div>
      `,i.addItem(a)}),s.appendChild(o),this.messageContainer.appendChild(s),o.querySelectorAll(".carousel__item-button").forEach((n,l)=>{n.addEventListener("click",()=>{if(this.onButtonClick){const a=parseInt(n.getAttribute("data-button-index"),10),c=t.cards[a];s.remove(),this.onButtonClick(c.buttons[0])}})}),this.scrollToBottom()}addButtons(t){if(!this.messageContainer||!(t!=null&&t.length))return;const e=this.rootElement.ownerDocument,s=e.createElement("div");s.classList.add("buttons-wrapper"),t.forEach(o=>{const i=e.createElement("button");i.classList.add("chat-button"),i.textContent=o.name,i.addEventListener("click",()=>{this.onButtonClick&&this.onButtonClick(o)}),s.appendChild(i)}),this.addMessage("assistant",s)}showTypingIndicator(t=null){if(this.typingIndicator){if(this.typingIndicator.style.display="flex",t){const e=this.typingIndicator.querySelector("p");e&&(e.textContent=t)}this.scrollToBottom()}}hideTypingIndicator(){this.typingIndicator&&(this.typingIndicator.style.display="none")}scrollToBottom(){this.drawerBody&&setTimeout(()=>{this.drawerBody.scrollTop=this.drawerBody.scrollHeight},100)}addVisualImage(t){if(!this.messageContainer)return;const e=this.rootElement.ownerDocument,s=e.createElement("div");s.classList.add("image-wrapper");const o=e.createElement("img");o.src=t.image,o.alt=t.alt||"Visual content",o.classList.add("chat-image"),t.dimensions&&(o.width=t.dimensions.width,o.height=t.dimensions.height),s.appendChild(o),this.addMessage("assistant",s)}}class f{constructor(t){this.element=t,this.container=t.querySelector(".carousel__container"),this.leftButton=t.querySelector(".carousel__button--left"),this.rightButton=t.querySelector(".carousel__button--right"),this.items=[],this.currentIndex=0,this.mediaQuery=window.matchMedia("(min-width: 1000px)"),this.isDesktop=this.mediaQuery.matches,this.setupEventListeners(),this.updateVisibility()}setupEventListeners(){this.leftButton.addEventListener("click",()=>this.move("left")),this.rightButton.addEventListener("click",()=>this.move("right")),this.mediaQuery.addEventListener("change",t=>this.handleMediaQueryChange(t))}handleMediaQueryChange(t){this.isDesktop=t.matches,this.updateVisibility(),this.updatePosition()}addItem(t){return t instanceof Element?(this.items.push(t),this.container.appendChild(t),this.updateVisibility(),t):(console.error("[Carousel] Content must be a DOM element"),null)}move(t){const e=t==="left"?-1:1,s=this.isDesktop?2:1,o=Math.max(0,this.items.length-s);this.currentIndex=Math.max(0,Math.min(this.currentIndex+e,o)),this.updatePosition(),this.updateVisibility()}updatePosition(){var s;const t=((s=this.items[0])==null?void 0:s.offsetWidth)||0,e=-this.currentIndex*t;this.container.style.transform=`translateX(${e}px)`}updateVisibility(){const t=this.isDesktop?2:1;this.leftButton.style.display=this.currentIndex>0?"flex":"none",this.rightButton.style.display=this.currentIndex<this.items.length-t?"flex":"none",this.items.forEach((e,s)=>{const o=s>=this.currentIndex&&s<this.currentIndex+t;e.style.opacity=o?"1":"0",e.style.pointerEvents=o?"auto":"none"})}}class b{constructor(){this.currentReader=null,this.abortController=null}async handleStream(t,e){if(!t.body)throw new Error("No response body available for streaming");console.log("[Stream] Starting new stream processing"),this.closeCurrentStream(),this.abortController=new AbortController;const s=this.abortController.signal;try{this.currentReader=t.body.getReader();const o=new TextDecoder;let i="";for(;!s.aborted;){const{done:r,value:n}=await this.currentReader.read();if(r){console.log("[Stream] Stream complete");break}const l=o.decode(n,{stream:!0});console.log("[Stream] Received chunk:",l),i+=l;try{const a=JSON.parse(i);if(console.log("[Stream] Successfully parsed events:",a),Array.isArray(a)){for(const c of a)await e.handleTrace(c);i=""}else await e.handleTrace(a),i=""}catch{if(console.log("[Stream] Incomplete JSON, continuing to buffer"),i.includes("][")){const c=i.split("][");for(const d of c)try{const p=d.replace(/^\[?/,"[").replace(/\]?$/,"]"),u=JSON.parse(p);if(console.log("[Stream] Parsed partial buffer:",u),Array.isArray(u))for(const g of u)await e.handleTrace(g)}catch{console.log("[Stream] Could not parse part, skipping")}i=c[c.length-1]}}}}catch(o){throw console.error("[Stream] Fatal stream processing error:",o),o}finally{this.closeCurrentStream()}}closeCurrentStream(){if(this.abortController&&(this.abortController.abort(),this.abortController=null),this.currentReader){try{this.currentReader.cancel()}catch(t){console.error("Error cancelling stream reader:",t)}this.currentReader=null}}}class I{constructor(t,e,s){this.ui=t,this.history=e,this.onSpecialTrace=s||(async()=>{}),this.completionBuffer="",this.lastMessageContainer=null,this.pendingMessages=[],this.processingTrace=!1}async handleTrace(t){var e,s,o,i,r;if(this.processingTrace){console.log("Already processing a trace, queueing:",t),this.pendingMessages.push(t);return}this.processingTrace=!0;try{if(console.log("[Trace] Handling trace event:",t.type,JSON.stringify(t,null,2)),!t.type){console.error("[Trace] Received event with no type:",t);return}if(!this.ui){console.error("[Trace] UI manager not available");return}if(!["text","choice","carousel","visual","waiting_text","RedirectToProduct","completion","end"].includes(t.type)){console.warn("[Trace] Ignoring unknown trace type:",t.type);return}switch(t.type){case"text":if(!t.payload){console.error("[Trace] Invalid text payload:",t.payload);return}console.log("[Trace] Processing text event:",JSON.stringify(t,null,2)),this.ui.hideTypingIndicator();try{if(typeof t.payload=="string")console.log("[Trace] Processing string payload:",t.payload),this.lastMessageContainer=this.ui.addMessage("assistant",t.payload);else if(t.payload.slate){console.log("[Trace] Processing slate payload:",t.payload.slate);const a=t.payload.slate.content.map(c=>(console.log("[Trace] Processing slate block:",c),c.children.map(d=>(console.log("[Trace] Processing slate child:",d),d.text)).join(""))).join(`
`);console.log("[Trace] Extracted text from slate:",a),this.lastMessageContainer=this.ui.addMessage("assistant",a),this.history!==null&&this.history.updateHistory({type:"assistant",message:a})}else t.payload.message?(console.log("[Trace] Processing message payload:",t.payload.message),this.lastMessageContainer=this.ui.addMessage("assistant",t.payload.message),this.history!==null&&this.history.updateHistory({type:"assistant",message:t.payload.message})):console.error("[Trace] Unsupported text payload format:",t.payload)}catch(a){console.error("[Trace] Error processing text event:",a),console.error("[Trace] Event that caused error:",t)}break;case"waiting_text":console.log("[Trace] Showing typing indicator:",t.payload),this.ui.showTypingIndicator(t.payload);break;case"choice":if(!Array.isArray((e=t.payload)==null?void 0:e.buttons)){console.error("[Trace] Invalid choice payload:",t.payload);return}this.ui.hideTypingIndicator(),console.log("[Trace] Adding choice buttons:",t.payload.buttons),this.ui.addButtons(t.payload.buttons),this.history!==null&&this.history.updateHistory({type:"choice",buttons:t.payload.buttons});break;case"carousel":this.ui.hideTypingIndicator(),console.log("[Trace] Adding carousel:",t.payload),this.ui.addCarousel(t.payload),this.history!==null&&this.history.updateHistory({type:"carousel",cards:t.payload.cards});break;case"visual":((s=t.payload)==null?void 0:s.visualType)==="image"&&(this.ui.hideTypingIndicator(),console.log("[Trace] Adding visual image:",t.payload),this.ui.addVisualImage(t.payload),this.history!==null&&this.history.updateHistory({type:"visual",data:t.payload}));break;case"RedirectToProduct":const l=(i=(o=t.payload)==null?void 0:o.body)==null?void 0:i.productHandle;l&&(console.log("[Trace] Redirecting to product:",l),await this.onSpecialTrace({type:"RedirectToProduct",productHandle:l}));break;case"completion":if(!((r=t.payload)!=null&&r.state)){console.error("[Trace] Invalid completion payload:",t.payload);return}t.payload.state==="start"?(this.completionBuffer="",this.ui.showTypingIndicator()):t.payload.state==="content"?(this.completionBuffer+=t.payload.content||"",this.lastMessageContainer?this.ui.updateMessage(this.lastMessageContainer,this.completionBuffer):this.lastMessageContainer=this.ui.addMessage("assistant",this.completionBuffer)):t.payload.state==="end"&&(this.ui.hideTypingIndicator(),this.history!==null&&this.history.updateHistory({type:"assistant",message:this.completionBuffer}));break;case"end":console.log("[Trace] Stream ended"),this.ui.hideTypingIndicator();break}}catch(n){console.error("[Trace] Error handling trace:",n),console.error("[Trace] Event that caused error:",t),this.ui.hideTypingIndicator()}finally{if(this.processingTrace=!1,this.pendingMessages.length>0){const n=this.pendingMessages.shift();await this.handleTrace(n)}}}restoreHistory(){if(this.history===null)return;const t=this.history.getHistory();if(t.length===0)return;t.forEach(s=>{(s.type==="assistant"||s.type==="user")&&this.ui.addMessage(s.type,s.message)});const e=t[t.length-1];e.type==="choice"?this.ui.addButtons(e.buttons):e.type==="carousel"&&this.ui.addCarousel(e),this.ui.scrollToBottom()}}class w{constructor(){this.conversationHistory=[],this.hasLaunched=localStorage.getItem("chatHasLaunched")==="true"}updateHistory(t){console.log("Updating conversation history with:",t),this.conversationHistory.push(t),this.saveToStorage()}saveToStorage(){try{localStorage.setItem("chatHistory",JSON.stringify(this.conversationHistory)),localStorage.setItem("chatHasLaunched","true")}catch(t){console.error("Error saving conversation to storage:",t)}}loadFromStorage(){try{const t=localStorage.getItem("chatHistory");t&&(this.conversationHistory=JSON.parse(t))}catch(t){console.error("Error loading conversation from storage:",t),this.conversationHistory=[]}}clearHistory(){this.conversationHistory=[],localStorage.removeItem("chatHistory"),localStorage.removeItem("chatHasLaunched")}getHistory(){return this.conversationHistory}hasHistory(){return this.hasLaunched}}console.log("WOLLLOPPPP");class E{constructor(t){console.log("ChatbotBase constructor called with config:",t),this.config={isSection:!1,...t},this.storagePrefix=this.config.isSection?"section_":"main_",this.ui=new y(null),console.log("UIManager created:",this.ui),this.config.isSection||(this.history=new w(this.storagePrefix)),this.api=new m({apiEndpoint:this.config.apiEndpoint,userIDPrefix:this.config.userIDPrefix,completionEvents:this.config.completionEvents||!1}),this.stream=new b,this.traceHandler=new I(this.ui,this.history,this.handleSpecialTrace.bind(this)),console.log("TraceHandler created with UI:",this.traceHandler),this.ui.setButtonClickHandler(this.handleButtonClick.bind(this)),this.sendMessage=this.sendMessage.bind(this),this.handleButtonClick=this.handleButtonClick.bind(this),this.history&&this.history.hasHistory()&&this.history.loadFromStorage()}set element(t){console.log("Setting element on ChatbotBase:",t),this._element=t,this.ui.rootElement=t,console.log("Updated UIManager root element:",this.ui)}get element(){return this._element}setDOMElements(t,e,s){if(console.log("Setting DOM elements in ChatbotBase",{messageContainer:t,typingIndicator:e,drawerBody:s,element:this._element,ui:this.ui}),!this._element){console.error("Element reference not set in ChatbotBase");return}this.ui.rootElement=this._element,this.ui.setDOMElements(t,e,s),this.traceHandler.ui=this.ui,console.log("DOM elements set successfully. Current state:",{ui:this.ui,messageContainer:this.ui.messageContainer,rootElement:this.ui.rootElement,traceHandler:this.traceHandler})}async initializeChatIfNeeded(){this.isSectionChatbot()||(this.history.hasHistory()?(console.log("Chat history found, displaying saved conversation..."),this.displaySavedConversation()):(console.log("No chat history found, sending launch request..."),await this.sendLaunch("","{}"),this.history.hasLaunched=!0,localStorage.setItem(`${this.storagePrefix}chatHasLaunched`,"true")))}isSectionChatbot(){return this.config.isSection||this.element.classList.contains("section-chatbot")}displaySavedConversation(){const t=this.history.getHistory();if(!t||t.length===0)return;this.ui.messageContainer.innerHTML="";for(let s of t)(s.type==="user"||s.type==="assistant")&&this.ui.addMessage(s.type,s.message);const e=t[t.length-1];if(e)switch(e.type){case"choice":this.ui.addButtons(e.buttons);break;case"carousel":this.ui.addCarousel({cards:e.cards});break}this.ui.scrollToBottom()}async sendLaunch(t="",e="{}"){console.log("Sending launch request with:",{startBlock:t,productDetails:e});try{const s=await this.api.streamInteract({type:"launch",payload:{startBlock:t,powerStationDetails:e}});await this.stream.handleStream(s,this.traceHandler)}catch(s){console.error("Error in sendLaunch:",s),this.ui.addMessage("assistant","I apologize, but I encountered an error. Please try again.")}}async sendMessage(t){try{this.isSectionChatbot()||this.history.updateHistory({type:"user",message:t}),this.ui.addMessage("user",t);const e=await this.api.sendUserMessage(t);await this.stream.handleStream(e,this.traceHandler)}catch(e){console.error("Error in sendMessage:",e),this.ui.addMessage("assistant","I apologize, but I encountered an error processing your message. Please try again.")}}async handleButtonClick(t){try{this.isSectionChatbot()||this.history.updateHistory({type:"user",message:t.name}),this.ui.addMessage("user",t.name);const e=await this.api.streamInteract(t.request);await this.stream.handleStream(e,this.traceHandler)}catch(e){console.error("Error in handleButtonClick:",e),this.ui.addMessage("assistant","I apologize, but I encountered an error processing your selection. Please try again.")}}async handleSpecialTrace(t){if(t.type==="RedirectToProduct"){const e=t.productHandle;if(e){const o=`https://www.sherpapower.co.uk/products/${encodeURIComponent(e)}`;console.log(`Redirecting to product page: ${o}`),window.location.href=o}}}async jumpToMainMenu(){console.log("MainChatbot jumpToMainMenu called"),this.ui.showTypingIndicator("Returning to main menu...");try{const t=await this.api.streamInteract({action:{type:"event",payload:{event:{name:"main_menu"}}}});console.log("Main menu response received:",t),await this.stream.handleStream(t,this.traceHandler),console.log("Finished processing main menu stream")}catch(t){console.error("Error in jumpToMainMenu:",t),this.ui.addMessage("assistant","Sorry, I couldn't navigate to the main menu. Please try again.")}finally{this.ui.hideTypingIndicator(),this.ui.scrollToBottom()}}updateHistory(t){this.isSectionChatbot()||this.history.updateHistory(t)}}if(!customElements.get("main-chatbot")){class h extends HTMLElement{constructor(){super(),console.log("MainChatbotElement constructor called");const s={apiEndpoint:this.getAttribute("api-endpoint")||"https://chatbottings--development.gadget.app/voiceflowAPI/voiceflow-streaming",userIDPrefix:"mainChatbot",isSection:!1};this.chatbotBase=new E(s),this.chatbotBase.element=this}connectedCallback(){console.log("MainChatbotElement connected"),this.initialize()}initialize(){this.initialized||(console.log("Initializing MainChatbotElement"),this.initializeElements(),this.setupEventListeners(),this.chatbotBase.initializeChatIfNeeded(),this.initialized=!0)}initializeElements(){console.log("Initializing elements for MainChatbot");const e=this.closest(".drawer.sherpa-guide");if(!e){console.error("Could not find drawer container");return}if(this.backToStartButton=e.querySelector(".back-to-start"),console.log("Back to start button found:",this.backToStartButton),this.messageContainer=this.querySelector(".message-container"),this.typingIndicator=this.querySelector(".chat-typing"),this.drawerBody=e.querySelector(".drawer-body")||e,this.chatInput=this.querySelector("#userInput"),this.chatForm=this.querySelector("#chatForm"),this.sendButton=this.querySelector("button[type='submit']"),!this.chatForm||!this.chatInput||!this.sendButton){console.error("Required chat elements not found:",{form:this.chatForm,input:this.chatInput,button:this.sendButton});return}console.log("Chat elements found:",{form:this.chatForm,input:this.chatInput,button:this.sendButton,backToStart:this.backToStartButton}),this.chatbotBase.setDOMElements(this.messageContainer,this.typingIndicator,this.drawerBody)}setupEventListeners(){if(!this.eventListenersAttached){if(this.chatInput&&this.sendButton){const e=this.chatInput.closest("form");e&&(console.log("Form found:",e),e.addEventListener("submit",async s=>{s.preventDefault(),s.stopPropagation(),await this.handleUserInput()})),this.chatInput.addEventListener("keypress",async s=>{s.key==="Enter"&&!s.shiftKey&&(s.preventDefault(),s.stopPropagation(),await this.handleUserInput())}),this.sendButton.addEventListener("click",async s=>{s.preventDefault(),s.stopPropagation(),await this.handleUserInput()})}this.backToStartButton?(console.log("Setting up back-to-start button click listener"),this.backToStartButton.addEventListener("click",()=>{console.log("Main menu button clicked!"),this.jumpToMainMenu()})):(console.warn("Back to start button not found - will try again later"),setTimeout(()=>{const e=this.querySelector(".back-to-start");e?(console.log("Found back-to-start button after delay"),e.addEventListener("click",()=>{console.log("Main menu button clicked!"),this.jumpToMainMenu()})):console.error("Back to start button still not found after delay")},1e3)),this.messageContainer&&this.messageContainer.addEventListener("click",async e=>{const s=e.target.closest(".chat-button");if(s){const o=JSON.parse(s.dataset.buttonData);await this.chatbotBase.handleButtonClick(o)}}),this.eventListenersAttached=!0}}async handleUserInput(){const e=this.chatInput.value.trim();if(e)try{this.chatInput.value="",this.chatInput.disabled=!0,this.sendButton.disabled=!0,this.chatbotBase.ui.showTypingIndicator(),await this.chatbotBase.sendMessage(e)}catch(s){console.error("Error sending message:",s)}finally{this.chatInput.disabled=!1,this.sendButton.disabled=!1,this.chatInput.focus()}}async jumpToMainMenu(){console.log("MainChatbotElement jumpToMainMenu called");const e="Main Menu";this.chatbotBase.ui.addMessage("user",e),this.chatbotBase.history.updateHistory({type:"user",message:e});try{this.chatbotBase.ui.showTypingIndicator("Returning to main menu...");const s=await this.chatbotBase.api.streamInteract({type:"event",payload:{event:{name:"main_menu"}}});console.log("Main menu response received:",s),await this.chatbotBase.stream.handleStream(s,this.chatbotBase.traceHandler),console.log("Finished processing main menu stream")}catch(s){console.error("Error in jumpToMainMenu:",s),this.chatbotBase.ui.addMessage("assistant","Sorry, I couldn't navigate to the main menu. Please try again.")}finally{this.chatbotBase.ui.hideTypingIndicator(),this.chatbotBase.ui.scrollToBottom()}}}customElements.define("main-chatbot",h)}export{m as A,E as C,w as H,b as S,I as T,y as U};
//# sourceMappingURL=chatbot-core-file.BJdONvJ0.js.map
