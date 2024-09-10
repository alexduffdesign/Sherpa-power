import{C as r}from"./chatbot-core-file-DN8_V_qZ.js";console.log("SectionChatbot module loading");class c extends HTMLElement{constructor(){super(),console.log("SectionChatbot constructor called"),this.core=null,this.eventListenersAttached=!1}connectedCallback(){console.log("SectionChatbot connected to the DOM"),this.initialize()}initialize(){console.log("SectionChatbot initializing");const e={apiEndpoint:"https://chatbottings--development.gadget.app/voiceflow"};this.core=new r(e),console.log("ChatbotCore instance created:",this.core),this.initializeElements(),this.setupEventListeners(),this.initializeChat()}initializeElements(){console.log("SectionChatbot initializeElements called");const e=this.querySelector("#messageContainer"),t=this.querySelector(".chat-typing"),i=this.querySelector(".applications-grid");if(!e||!t||!i){console.error("Required DOM elements not found");return}this.core.setDOMElements(e,t,this),this.applicationsGrid=i,console.log("DOM elements set in ChatbotCore:",this.core)}setupEventListeners(){if(this.eventListenersAttached)return;console.log("SectionChatbot setupEventListeners called");const e=this.querySelector("#chatForm"),t=this.querySelector("#userInput");if(!e||!t){console.error("Chat form or input not found");return}e.addEventListener("submit",async i=>{i.preventDefault();const s=t.value.trim();s&&(console.log("Form submitted with message:",s),t.value="",await this.handleUserMessage(s))}),this.addEventListener("click",async i=>{if(i.target.matches(".button-container button")){const s=JSON.parse(i.target.dataset.buttonData);try{const n=await this.core.handleButtonClick(s);await this.handleAgentResponse(n)}catch(n){console.error("Error handling button click:",n)}}}),this.eventListenersAttached=!0}async handleUserMessage(e){this.core.addMessage("user",e),this.core.showTypingIndicator();try{const t=await this.core.sendMessage(e);console.log("Response from sendMessage:",t),await this.handleAgentResponse(t)}catch(t){console.error("Error in send message:",t)}finally{this.core.hideTypingIndicator(),this.core.scrollToBottom()}}async handleAgentResponse(e){console.log("Handling agent response:",e);for(const t of e)t.type==="device_answer"?this.handleDeviceAnswer(t.payload):await this.core.handleAgentResponse([t]);this.core.scrollToBottom()}handleDeviceAnswer(e){console.log("Handling device answer:",e);let t=Array.isArray(e)?e:e.devices;if(!Array.isArray(t)){console.error("Invalid devices data:",t);return}t.forEach(i=>{console.log("Processing device:",i);const{name:s,estimatedRuntime:n,powerConsumption:o}=i;this.saveDeviceEstimate({name:s,estimatedRuntime:n,powerConsumption:o});const a=this.createDeviceCard(i);this.insertCard(a)}),this.updateDevicesView()}createDeviceCard(e){const t=document.createElement("div");return t.className="application-card chatbot-card",t.innerHTML=`
      <div class="application-card__image">
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="50" height="50" rx="25" fill="#DB9BFB"/>
          <path d="M35.2941 18.5294H14.7059C13.7647 18.5294 13 19.2941 13 20.2353V32.7647C13 33.7059 13.7647 34.4706 14.7059 34.4706H35.2941C36.2353 34.4706 37 33.7059 37 32.7647V20.2353C37 19.2941 36.2353 18.5294 35.2941 18.5294ZM35.2941 32.7647H14.7059V20.2353H35.2941V32.7647ZM34.4412 15.5882L36.1471 13.8824C36.4412 13.5882 36.4412 13.1471 36.1471 12.8529C35.8529 12.5588 35.4118 12.5588 35.1176 12.8529L33.4118 14.5588C31.9412 13.5882 30.1765 13 28.2647 13H21.7353C19.8235 13 18.0588 13.5882 16.5882 14.5588L14.8824 12.8529C14.5882 12.5588 14.1471 12.5588 13.8529 12.8529C13.5588 13.1471 13.5588 13.5882 13.8529 13.8824L15.5588 15.5882C13.7941 17.3529 12.7059 19.7059 12.7059 22.2941V23.1471H37.2941V22.2941C37.2941 19.7059 36.2059 17.3529 34.4412 15.5882ZM20.8824 20.2353H18.3235V17.6765H20.8824V20.2353ZM31.6765 20.2353H29.1176V17.6765H31.6765V20.2353Z" fill="white"/>
        </svg>
      </div>
      <div class="application-card__content">
        <div class="application-card__title">${e.name}</div>
        <div class="application-card__runtime">
          ${e.estimatedRuntime.value} ${e.estimatedRuntime.unit}
        </div>
      </div>
    `,t}insertCard(e){const t=this.applicationsGrid.querySelector(".application-card.chatbot-card");t?this.applicationsGrid.insertBefore(e,t):this.applicationsGrid.appendChild(e)}saveDeviceEstimate(e){const t=`${this.getAttribute("product-title")}_devices`;let i=JSON.parse(localStorage.getItem(t)||"[]");const s=i.findIndex(n=>n.name===e.name);s!==-1&&i.splice(s,1),i.unshift(e),localStorage.setItem(t,JSON.stringify(i))}updateDevicesView(){const e=this.applicationsGrid.querySelectorAll(".application-card.chatbot-card"),t=this.querySelector(".view-more-button"),i=3;e.length>i?(t.style.display="block",e.forEach((s,n)=>{s.style.display=n<i?"flex":"none"})):t.style.display="none"}async initializeChat(){console.log("Initializing chat"),await this.sendLaunch(),console.log("Chat initialized")}async sendLaunch(){console.log("Sending launch request"),this.core.showTypingIndicator();try{const e=await this.core.sendLaunch();await this.handleAgentResponse(e)}catch(e){console.error("Error in send launch:",e)}finally{this.core.hideTypingIndicator()}}}customElements.define("section-chatbot",c);console.log("SectionChatbot module loaded");
//# sourceMappingURL=chatbot-section-CxPXJyC8.js.map
