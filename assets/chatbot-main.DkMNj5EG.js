import{C as n}from"./base-chatbot.CDL27SDT.js";import{M as r}from"./chatbot-main-ui.D60AVE9Z.js";import"./vendor.DqvJXvYX.js";import"./base-chatbot-ui.CfdBRW7I.js";import"./markdown-util.gcjemE0m.js";function c(a){const e=Date.now().toString(36)+Math.random().toString(36).substr(2,9);return`${a}-${e}`}class h{constructor(e){this.container=e,this.historyKey="mainChatbotHistory",this.launchKey="chatHasLaunched",this.isLaunched=this.hasLaunched(),this.initialize()}initialize(){let e=localStorage.getItem("mainChatbotUserId");e||(e=c("mainChatbot"),localStorage.setItem("mainChatbotUserId",e)),this.core=new n({type:"main",endpoint:"https://chatbottings--development.gadget.app/voiceflowAPI/voiceflow-streaming",userID:e}),this.ui=new r({container:this.container,eventBus:this.core.eventBus,type:"main"}),this.setupEventListeners(),this.loadHistory()}setupEventListeners(){this.core.eventBus.on("userMessage",e=>{this.ui.addMessage("user",e),this.saveToHistory("user",e),this.core.sendMessage(e)}),this.core.eventBus.on("messageReceived",({content:e,metadata:t})=>{!t||t.streamed,this.saveToHistory("assistant",e,{...t,streamed:!1})}),this.core.eventBus.on("partialMessage",e=>{this.saveToHistory("assistant",e,{streamed:!0})}),this.core.eventBus.on("finalMessage",e=>{this.saveToHistory("assistant",e,{streamed:!0})}),this.core.eventBus.on("choicePresented",({buttons:e})=>{this.saveToHistory("assistant","Choice presented",{type:"choice",buttons:e})}),this.core.eventBus.on("carouselPresented",({items:e})=>{this.saveToHistory("assistant","Carousel presented",{type:"carousel",carouselItems:e})}),this.core.eventBus.on("buttonClicked",e=>{const t=e.payload.label||"Button clicked";if(this.saveToHistory("user",t),this.ui.addMessage("user",t),this.ui.removeInteractiveElements(),e.type&&e.type.startsWith("path-")){const s={action:{type:e.type,payload:{label:t}}};this.core.sendAction(s)}else if(e.type==="intent"){const s={action:{type:"intent",payload:{intent:e.payload.intent,query:e.payload.query||"",entities:e.payload.entities||[]}}};this.core.sendAction(s)}else this.core.sendMessage(t)}),this.core.eventBus.on("carouselButtonClicked",e=>{const t=e.label||"Button clicked";this.saveToHistory("user",t),this.ui.addMessage("user",t);const{type:s,payload:o}=e.action;if(s&&s.startsWith("path-")){const i={request:{type:s,payload:{label:t}}};this.core.sendAction(i)}else if(s==="intent"){const i={request:{type:"intent",payload:{intent:o.intent,query:o.query||"",entities:o.entities||[]}}};this.core.sendAction(i)}else if(s==="button"){const i={action:{type:"button",payload:o}};this.core.sendAction(i)}else{const i={request:{type:"text",payload:t}};this.core.sendAction(i)}}),this.core.eventBus.on("mainMenu",()=>{const e="Main menu";this.saveToHistory("user",e),this.ui.addMessage("user",e,null,!1,10),this.core.sendAction({action:{type:"event",payload:{event:{name:"main_menu"}}}})}),this.core.eventBus.on("clearHistory",()=>{this.clearHistory()}),this.core.eventBus.on("minimize",()=>{console.log("Minimize chatbot"),this.container.classList.toggle("minimized")})}hasLaunched(){return localStorage.getItem(this.launchKey)==="true"}setLaunched(){localStorage.setItem(this.launchKey,"true"),this.isLaunched=!0}async launch(){if(this.isLaunched){console.log("Chat already launched, skipping launch request");return}try{await this.core.sendLaunch(),this.setLaunched()}catch(e){console.error("Error launching chatbot:",e),this.ui.displayError("Failed to launch the chatbot. Please try again later.")}}saveToHistory(e,t,s=null){const o=JSON.parse(localStorage.getItem(this.historyKey))||[],i={sender:e,message:t,timestamp:Date.now(),isInteractive:!1};e==="assistant"&&s&&(s.type==="choice"?(i.isInteractive=!0,i.traceType="choice",i.traceData={buttons:s.buttons}):s.type==="carousel"&&(i.isInteractive=!0,i.traceType="carousel",i.traceData={cards:s.carouselItems})),o.push(i),localStorage.setItem(this.historyKey,JSON.stringify(o))}loadHistory(){const e=JSON.parse(localStorage.getItem(this.historyKey))||[];console.log("Loading history:",e),e.forEach((t,s)=>{if(console.log("Processing history entry:",t),t.isInteractive){console.log("Entry is interactive:",t),s===e.length-1&&(console.log("Restoring interactive element from history"),this.restoreInteractiveElement(t));return}t.message&&(console.log("Adding message from history:",t),this.ui.addMessage(sender,message,metadata,!0),this.ui.addMessage(t.sender,t.message,{fromHistory:!0}))})}restoreInteractiveElement(e){e.traceType==="choice"?this.ui.addButtons(e.traceData.buttons,!0):e.traceType==="carousel"&&this.ui.addCarousel(e.traceData.cards,!0)}clearHistory(){localStorage.removeItem(this.historyKey),localStorage.removeItem(this.launchKey),this.isLaunched=!1,this.ui.clearChat()}destroy(){this.core.destroy(),this.ui.destroy()}}window.MainChatbot=h;
//# sourceMappingURL=chatbot-main.DkMNj5EG.js.map
