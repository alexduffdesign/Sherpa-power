import{C as d}from"./chatbot-core-file-DN8_V_qZ.js";class l extends d{constructor(){const e={apiEndpoint:"https://chatbottings--development.gadget.app/voiceflow",chatFormId:"chatForm",userInputId:"userInput",chatMessagesId:"chatMessages",messageContainerId:"messageContainer",typingIndicatorSelector:".chat-typing"};super(e),this.userID=`section_${Math.floor(Math.random()*1e15)}`}connectedCallback(){console.log("SectionChatbot connected to the DOM"),this.init()}initialize(e){console.log("Initializing SectionChatbot with config:",e),this.productTitle=e.productTitle,this.productCapacity=e.productCapacity,this.productDetails=`Power Station: ${this.productTitle}, Wattage: ${this.productCapacity}`,this.setupEventListeners(),this.loadSavedDevices()}setupEventListeners(){this.viewMoreButton&&this.viewMoreButton.addEventListener("click",()=>this.toggleDevicesView())}toggleDevicesView(){this.isExpanded=!this.isExpanded,this.updateDevicesView()}updateDevicesView(){const e=this.applicationsGrid.querySelectorAll(".application-card.chatbot-card");e.length>this.devicesPerPage?(this.viewMoreButton.style.display="block",this.viewMoreButton.textContent=this.isExpanded?"View Less":"View More",e.forEach((t,i)=>{t.style.display=i<this.devicesPerPage||this.isExpanded?"flex":"none"})):this.viewMoreButton.style.display="none"}async sendMessage(e){try{const t=await this.gadgetInteract({userAction:{type:"text",payload:e}});this.hideTypingIndicator(),this.handleAgentResponse(t)}catch(t){console.error("Error sending message:",t),this.hideTypingIndicator()}}async sendLaunch(){this.showTypingIndicator();const e={userAction:{type:"launch",payload:{startBlock:"shopifySection",powerStationDetails:this.productDetails}}};try{const t=await this.gadgetInteract(e);console.log("Launch response:",t),this.hideTypingIndicator(),this.handleAgentResponse(t)}catch(t){console.error("Error launching conversation:",t),this.hideTypingIndicator()}}handleDeviceAnswer(e){console.log("Raw device answer payload:",e);let t;if(typeof e=="string")try{t=JSON.parse(e)}catch(s){console.error("Failed to parse payload string:",s);return}else if(typeof e=="object"&&e!==null)t=e;else{console.error("Invalid payload type:",typeof e);return}console.log("Processed device data:",t);let i=Array.isArray(t)?t:t.devices;if(!Array.isArray(i)){console.error("Invalid devices data:",i);return}i.forEach(s=>{console.log("Processing device:",s);const{name:o,estimatedRuntime:n,powerConsumption:c}=s;this.saveDeviceEstimate({name:o,estimatedRuntime:n,powerConsumption:c});const r=this.createDeviceCard(s);this.insertCard(r)}),this.updateDevicesView()}createDeviceCard(e){const t=document.createElement("div");return t.className="application-card chatbot-card",t.innerHTML=`
      <div class="application-card__image">
        <svg>...</svg>
      </div>
      <div class="application-card__content">
        <div class="application-card__title">${e.name}</div>
        <div class="application-card__runtime">
          ${e.estimatedRuntime.value} ${e.estimatedRuntime.unit}
        </div>
      </div>
    `,t}insertCard(e){const t=this.applicationsGrid.querySelector(".application-card.chatbot-card");t?this.applicationsGrid.insertBefore(e,t):this.applicationsGrid.appendChild(e)}saveDeviceEstimate(e){const t=`${this.productTitle}_devices`;let i=JSON.parse(localStorage.getItem(t)||"[]");const s=i.findIndex(o=>o.name===e.name);s!==-1&&i.splice(s,1),i.unshift(e),localStorage.setItem(t,JSON.stringify(i))}loadSavedDevices(){const e=`${this.productTitle}_devices`;JSON.parse(localStorage.getItem(e)||"[]").forEach(i=>{const s=this.createDeviceCard(i);this.insertCard(s)}),this.updateDevicesView()}async handleAgentResponse(e){await super.handleAgentResponse(e);for(const t of e)t.type==="device_answer"&&this.handleDeviceAnswer(t.payload)}}document.addEventListener("DOMContentLoaded",()=>{const a=document.querySelector(".section-chatbot");if(console.log("this is the section chatbot",a),a){const e=a.getAttribute("product-title"),t=a.getAttribute("product-capacity"),i={apiEndpoint:"https://chatbottings--development.gadget.app/voiceflow",chatFormId:"chatForm",userInputId:"userInput",chatMessagesId:"chatMessages",messageContainerId:"messageContainer",typingIndicatorSelector:".chat-typing",productTitle:e,productCapacity:t};a.initialize(i)}else console.error("section-chatbot element not found")});customElements.define("section-chatbot",l);
//# sourceMappingURL=chatbot-section-CIbN6slS.js.map
