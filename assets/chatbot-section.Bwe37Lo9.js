import{C as i}from"./base-chatbot.B-MLoxE6.js";import{S as n}from"./chatbot-section-ui.CD3bOnY6.js";import"./vendor.DqvJXvYX.js";import"./base-chatbot-ui.BzGndWVX.js";class o{constructor(t,e){this.container=t,this.productDetails=e,this.isLaunched=!1,this.initialize(),this.validateProductDetails()}initialize(){this.core=new i({type:"section",endpoint:"https://chatbottings--development.gadget.app/voiceflowAPI/voiceflow-streaming",userID:this.generateSessionId()}),this.ui=new n({container:this.container,eventBus:this.core.eventBus,type:"section",productDetails:this.productDetails}),this.setupEventListeners(),this.loadStoredDeviceAnswers()}generateSessionId(){return`section_${Date.now()}_${Math.random().toString(36).substr(2,9)}`}validateProductDetails(){const e=["title","capacity"].filter(s=>!this.productDetails[s]);e.length>0&&(console.error("Missing required product details:",e.join(", ")),this.ui.displayError("Some product information is missing. Chat functionality may be limited."))}setupEventListeners(){this.core.eventBus.on("deviceAnswer",e=>{this.handleDeviceAnswer(e)}),this.core.eventBus.on("buttonClicked",e=>{this.handleButtonClicked(e)}),this.core.eventBus.on("carouselButtonClicked",e=>{this.handleCarouselButtonClicked(e)});const t=this.container.querySelector(".chatbot-input");t&&t.addEventListener("focus",()=>{this.isLaunched||this.launch()})}async launch(){if(this.isLaunched){console.log("Section chatbot already launched");return}try{const t=this.sanitizeProductDetails();await this.core.sendLaunch({action:{type:"launch",payload:{startBlock:"shopifySection",powerStationDetails:t}}}),this.isLaunched=!0}catch(t){console.error("Error launching section chatbot:",t),this.ui.displayError("Failed to start the chat. Please try again.")}}handleDeviceAnswer(t){if(!t||!t.data){console.warn("Invalid device answer payload:",t);return}const e=this.processDeviceAnswerData(t.data);this.ui.updateDeviceAnswers(e),this.saveDeviceAnswerToStorage(e)}processDeviceAnswerData(t){return{deviceName:t.deviceName||this.productDetails.title,results:t.results||[],recommendations:t.recommendations||[],calculationDetails:t.calculationDetails||{}}}sanitizeProductDetails(){return Object.entries(this.productDetails).reduce((t,[e,s])=>(t[e]=s?String(s).trim():"",t),{})}handleButtonClicked(t){this.processButtonOrCarouselClick(t)}handleCarouselButtonClicked(t){this.processButtonOrCarouselClick(t)}processButtonOrCarouselClick(t){const e=t.payload.label||"Button clicked";if(this.ui.addMessage("user",e),this.ui.removeInteractiveElements(),t.type&&t.type.startsWith("path-")){const s={action:{type:t.type,payload:{label:e}}};this.core.sendAction(s)}else if(t.type==="intent"){const s={action:{type:"intent",payload:{intent:t.payload.intent,query:t.payload.query||"",entities:t.payload.entities||[]}}};this.core.sendAction(s)}else this.core.sendMessage(e)}saveDeviceAnswerToStorage(t){const e=`sectionChatbot_${this.productDetails.title}_answers`;let s=JSON.parse(localStorage.getItem(e)||"[]");s.unshift(t),localStorage.setItem(e,JSON.stringify(s))}loadStoredDeviceAnswers(){const t=`sectionChatbot_${this.productDetails.title}_answers`;JSON.parse(localStorage.getItem(t)||"[]").forEach(s=>{this.ui.updateDeviceAnswers(s)})}destroy(){this.core.destroy(),this.ui.destroy()}}window.SectionChatbot=o;
//# sourceMappingURL=chatbot-section.Bwe37Lo9.js.map
