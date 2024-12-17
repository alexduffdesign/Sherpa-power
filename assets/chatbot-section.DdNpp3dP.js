import{C as i}from"./base-chatbot.B-MLoxE6.js";import{S as n}from"./chatbot-section-ui.DR55kJL0.js";import"./vendor.DqvJXvYX.js";import"./base-chatbot-ui.BzGndWVX.js";class o{constructor(e,t){this.container=e,this.productDetails=t,this.isLaunched=!1,this.initialize(),this.validateProductDetails()}initialize(){this.core=new i({type:"section",endpoint:"https://chatbottings--development.gadget.app/voiceflowAPI/voiceflow-streaming",userID:this.generateSessionId()}),this.ui=new n({container:this.container,eventBus:this.core.eventBus,type:"section",productDetails:this.productDetails}),this.setupEventListeners(),this.loadStoredDeviceAnswers()}generateSessionId(){return`section_${Date.now()}_${Math.random().toString(36).substr(2,9)}`}validateProductDetails(){const t=["title","capacity"].filter(s=>!this.productDetails[s]);t.length>0&&(console.error("Missing required product details:",t.join(", ")),this.ui.displayError("Some product information is missing. Chat functionality may be limited."))}setupEventListeners(){this.core.eventBus.on("deviceAnswer",t=>{this.handleDeviceAnswer(t)}),this.core.eventBus.on("buttonClicked",t=>{this.handleButtonClicked(t)}),this.core.eventBus.on("carouselButtonClicked",t=>{this.handleCarouselButtonClicked(t)});const e=this.container.querySelector(".chatbot-input");e&&e.addEventListener("focus",()=>{this.isLaunched||this.launch()})}async launch(){if(this.isLaunched){console.log("Section chatbot already launched");return}try{const e=this.sanitizeProductDetails();await this.core.sendLaunch({action:{type:"event",payload:{event:{name:"launch_section"},variables:{startBlock:"shopifySection",powerStationDetails:e}}}}),this.isLaunched=!0}catch(e){console.error("Error launching section chatbot:",e),this.ui.displayError("Failed to start the chat. Please try again.")}}handleDeviceAnswer(e){if(!e||!e.data){console.warn("Invalid device answer payload:",e);return}const t=this.processDeviceAnswerData(e.data);this.ui.updateDeviceAnswers(t),this.saveDeviceAnswerToStorage(t)}processDeviceAnswerData(e){return{deviceName:e.deviceName||this.productDetails.title,results:e.results||[],recommendations:e.recommendations||[],calculationDetails:e.calculationDetails||{}}}sanitizeProductDetails(){return Object.entries(this.productDetails).reduce((e,[t,s])=>(e[t]=s?String(s).trim():"",e),{})}handleButtonClicked(e){this.processButtonOrCarouselClick(e)}handleCarouselButtonClicked(e){this.processButtonOrCarouselClick(e)}processButtonOrCarouselClick(e){const t=e.payload.label||"Button clicked";if(this.ui.addMessage("user",t),this.ui.removeInteractiveElements(),e.type&&e.type.startsWith("path-")){const s={action:{type:e.type,payload:{label:t}}};this.core.sendAction(s)}else if(e.type==="intent"){const s={action:{type:"intent",payload:{intent:e.payload.intent,query:e.payload.query||"",entities:e.payload.entities||[]}}};this.core.sendAction(s)}else this.core.sendMessage(t)}saveDeviceAnswerToStorage(e){const t=`sectionChatbot_${this.productDetails.title}_answers`;let s=JSON.parse(localStorage.getItem(t)||"[]");s.unshift(e),localStorage.setItem(t,JSON.stringify(s))}loadStoredDeviceAnswers(){const e=`sectionChatbot_${this.productDetails.title}_answers`;JSON.parse(localStorage.getItem(e)||"[]").forEach(s=>{this.ui.updateDeviceAnswers(s)})}destroy(){this.core.destroy(),this.ui.destroy()}}window.SectionChatbot=o;
//# sourceMappingURL=chatbot-section.DdNpp3dP.js.map
