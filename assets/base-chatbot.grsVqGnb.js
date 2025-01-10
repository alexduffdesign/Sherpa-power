import{E as c}from"./vendor.DqvJXvYX.js";import{S as l}from"./streaming-markdown-parser.Bd3zPGns.js";import{p as h}from"./markdown-util.DadijVe3.js";class y{constructor(e){if(!e.userID)throw new Error("ChatbotCore requires a userID");if(!e.endpoint)throw new Error("ChatbotCore requires an endpoint URL");if(!e.type)throw new Error("ChatbotCore requires a type ('main' or 'section')");this.userID=e.userID,this.endpoint=e.endpoint,this.type=e.type,this.eventBus=new c,this.abortController=null,this.currentCompletion=null,this.setupInteractiveElementHandling(),this.streamingParser=new l(t=>{this.eventBus.emit("assistantMessageStreamed",{content:t})}),this.eventBus.on("userMessage",t=>{this.sendMessage(t)}),this.eventBus.on("sendAction",t=>{this.sendAction({action:t})})}async sendLaunch(e={}){console.log("Constructing launch payload:",e),this.eventBus.emit("typing",{isTyping:!0,message:"Sherpa Guide Launching..."});const t=e.action?e:{action:{type:"launch"}};return this.sendAction(t)}async sendMessage(e){console.log("Message payload:",e);const t={action:{type:"text",payload:e}};return this.sendAction(t)}async sendAction(e){this.eventBus.emit("typing",{isTyping:!0,message:"Sherpa Guide Thinking..."});try{this.abortController&&(this.abortController.abort(),await new Promise(i=>setTimeout(i,100))),this.abortController=new AbortController;const{signal:t}=this.abortController,n=await fetch(this.endpoint,{method:"POST",headers:{"Content-Type":"application/json",Accept:"text/event-stream"},body:JSON.stringify({userID:this.userID,action:e.action}),credentials:"include",signal:t});if(!n.ok)throw new Error(`API responded with status ${n.status}`);await this.handleSSEResponse(n)}catch(t){if(t.name==="AbortError"){console.debug("Request aborted, new request in progress");return}this.handleError(t)}}setupInteractiveElementHandling(){this.eventBus.on("interactiveElementClicked",e=>{const t=e.label||"Button clicked";this.handleInteractiveElementAction(e,t)})}async handleInteractiveElementAction(e,t){if(e.type&&e.type.startsWith("path-")){const n={action:{type:e.type,payload:{label:t}}};return this.sendAction(n)}else if(e.type==="intent"){const n={action:{type:"intent",payload:{intent:e.payload.intent,query:e.payload.query||"",entities:e.payload.entities||[]}}};return this.sendAction(n)}else if(e.type==="button"){const n={action:{type:"button",payload:actionData}};this.core.sendAction(n)}else{if(e.action)return this.sendAction({action:e.action});{const n={request:{type:"text",payload:t}};this.core.sendAction(n)}}}async handleSSEResponse(e){const t=e.body.getReader(),n=new TextDecoder("utf-8");let i="";try{for(;;){const{done:s,value:o}=await t.read();if(s){this.eventBus.emit("end",{});break}i+=n.decode(o,{stream:!0});const r=i.split(`

`);i=r.pop(),r.forEach(a=>{a.trim()!==""&&this.processEventString(a)})}}catch(s){this.handleError(s)}}processEventString(e){try{const t=e.split(`
`),n=t.find(r=>r.startsWith("event:"));console.log("eventTypeLine:",n);const i=t.find(r=>r.startsWith("data:"));let s=null;if(i)try{s=JSON.parse(e.substring(e.indexOf("data:")+5).trim())}catch(r){console.error("Error parsing data:",r);return}let o=n?n.split(":")[1].trim():null;o==="trace"&&s&&s.type==="completion"?this.handleCompletion(s.payload):o==="trace"&&s?this.processTrace(s):o==="end"?(console.log("End event received"),this.eventBus.emit("end",{})):console.warn("Unknown event type:",o,s)}catch(t){this.handleError(t)}}processTrace(e){var t,n,i;if(!e.type){console.warn("Trace without type received:",e);return}switch(console.log("processTrace called with:",e),e.type){case"text":this.eventBus.emit("typing",{isTyping:!1}),this.eventBus.emit("assistantMessageNonStreamed",{content:e.payload.message,metadata:e.payload.metadata});break;case"choice":this.eventBus.emit("choicePresented",{buttons:e.payload.buttons});break;case"carousel":this.eventBus.emit("carouselPresented",{type:"carousel",items:e.payload.cards});break;case"device_answer":this.type==="section"&&this.eventBus.emit("deviceAnswer",e.payload);break;case"RedirectToProduct":this.eventBus.emit("productRedirect",{productHandle:(n=(t=e.payload)==null?void 0:t.body)==null?void 0:n.productHandle});break;case"waiting_text":this.eventBus.emit("waitingText",{text:((i=e.payload)==null?void 0:i.text)||"Sherpa Guide Thinking..."});break;case"deviceSources":this.eventBus.emit("deviceSources",{sources:e.payload});break;default:console.warn(`Unhandled trace type: ${e.type}`,e)}}handleCompletion(e){if(!e||!e.state){console.warn("Invalid completion payload:",e);return}switch(e.state){case"start":this.currentCompletion="";break;case"content":e.content&&(this.hasStartedStreaming||(this.eventBus.emit("typing",{isTyping:!1}),this.hasStartedStreaming=!0),this.currentCompletion+=e.content,this.streamingParser.appendText(e.content),console.log("appendText called with:",e.content));break;case"end":this.streamingParser.end();const t=h(this.currentCompletion);this.eventBus.emit("finalMessage",{content:t,isStreamed:!0}),console.log("Emitting assistantMessageFinalized with content:",t),this.eventBus.emit("assistantMessageFinalized",{content:t,metadata:null}),this.currentCompletion=null,this.hasStartedStreaming=!1;break;default:console.warn("Unknown completion state:",e.state)}}emitMessageReceived(e,t){this.eventBus.emit("messageReceived",{content:e,metadata:t,isStreamed:!1})}handleError(e){console.error("Chatbot error:",e),this.eventBus.emit("error",{message:e.message}),this.eventBus.emit("typing",{isTyping:!1})}destroy(){this.abortController&&this.abortController.abort(),this.eventBus.removeAllListeners()}}export{y as C};
//# sourceMappingURL=base-chatbot.grsVqGnb.js.map
