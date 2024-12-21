import{E as c}from"./vendor.DqvJXvYX.js";import{S as l,p as h}from"./markdown-util.C8tULyzw.js";class m{constructor(e){if(!e.userID)throw new Error("ChatbotCore requires a userID");if(!e.endpoint)throw new Error("ChatbotCore requires an endpoint URL");if(!e.type)throw new Error("ChatbotCore requires a type ('main' or 'section')");this.userID=e.userID,this.endpoint=e.endpoint,this.type=e.type,this.eventBus=new c,this.abortController=null,this.currentCompletion=null,this.setupInteractiveElementHandling(),this.streamingParser=new l(t=>{this.eventBus.emit("assistantMessageStreamed",{content:t})})}async sendLaunch(e={}){console.log("Constructing launch payload:",e);const t=e.action?e:{action:{type:"launch"}};return this.sendAction(t)}async sendMessage(e){console.log("Message payload:",e);const t={action:{type:"text",payload:e}};return this.sendAction(t)}async sendAction(e){try{this.abortController&&(this.abortController.abort(),await new Promise(s=>setTimeout(s,100))),this.abortController=new AbortController;const{signal:t}=this.abortController;this.eventBus.emit("typing",{isTyping:!0});const n=await fetch(this.endpoint,{method:"POST",headers:{"Content-Type":"application/json",Accept:"text/event-stream"},body:JSON.stringify({userID:this.userID,action:e.action}),credentials:"include",signal:t});if(!n.ok)throw new Error(`API responded with status ${n.status}`);await this.handleSSEResponse(n)}catch(t){if(t.name==="AbortError"){console.debug("Request aborted, new request in progress");return}this.handleError(t)}}setupInteractiveElementHandling(){this.eventBus.on("interactiveElementClicked",e=>{const t=e.label||"Button clicked";this.eventBus.emit("userMessage",t),this.handleInteractiveElementAction(e,t)})}async handleInteractiveElementAction(e,t){if(e.type&&e.type.startsWith("path-")){const n={action:{type:e.type,payload:{label:t}}};return this.sendAction(n)}else if(e.type==="intent"){const n={action:{type:"intent",payload:{intent:e.payload.intent,query:e.payload.query||"",entities:e.payload.entities||[]}}};return this.sendAction(n)}else if(e.type==="button"){const n={action:{type:"button",payload:actionData}};this.core.sendAction(n)}else{if(e.action)return this.sendAction({action:e.action});{const n={request:{type:"text",payload:t}};this.core.sendAction(n)}}}async handleSSEResponse(e){console.log("handleSSEResponse called");const t=e.body.getReader(),n=new TextDecoder("utf-8");let s="";try{for(;;){const{done:r,value:i}=await t.read();if(r){this.eventBus.emit("end",{});break}s+=n.decode(i,{stream:!0}),console.log("SSE buffer:",s);const o=s.split(`

`);console.log("SSE events:",o),s=o.pop(),o.forEach(a=>{console.log("Processing event string:",a),a.trim()!==""&&this.processEventString(a)})}}catch(r){this.handleError(r)}finally{this.eventBus.emit("typing",{isTyping:!1})}}processEventString(e){console.log("processEventString called with:",e);try{const t=e.split(`
`),n=t.find(o=>o.startsWith("event:")),s=t.find(o=>o.startsWith("data:")),r=n?n.split(":")[1].trim():"trace",i=s?JSON.parse(e.substring(e.indexOf("data:")+5).trim()):null;switch(console.log("Parsed eventType:",r),console.log("Parsed data:",i),r){case"trace":this.processTrace(i);break;case"completion":this.handleCompletion(i);break}}catch(t){this.handleError(t)}}processTrace(e){if(!e.type){console.warn("Trace without type received:",e);return}switch(console.log("processTrace called with:",e),e.type){case"text":this.eventBus.emit("assistantMessageNonStreamed",{content:e.payload.message,metadata:e.payload.metadata});break;case"choice":this.eventBus.emit("choicePresented",{buttons:e.payload.buttons});break;case"carousel":this.eventBus.emit("carouselPresented",{type:"carousel",items:e.payload.cards});break;case"device_answer":this.type==="section"&&this.eventBus.emit("deviceAnswer",e.payload);break;default:console.warn(`Unhandled trace type: ${e.type}`,e)}}handleCompletion(e){if(!e||!e.state){console.warn("Invalid completion payload:",e);return}switch(e.state){case"start":this.currentCompletion="",console.log("Streaming started");break;case"content":e.content&&(console.log("Streaming content received:",e.content),this.currentCompletion+=e.content,this.streamingParser.appendText(e.content));break;case"end":this.streamingParser.end(),console.log("Streaming ended, final completion:",this.currentCompletion);const t=h(this.currentCompletion);this.eventBus.emit("finalMessage",{content:t,isStreamed:!0}),this.eventBus.emit("assistantMessageFinalized",{content:t,metadata:null}),this.currentCompletion=null;break;default:console.warn("Unknown completion state:",e.state)}}emitMessageReceived(e,t){this.eventBus.emit("messageReceived",{content:e,metadata:t,isStreamed:!1})}handleError(e){console.error("Chatbot error:",e),this.eventBus.emit("error",{message:e.message}),this.eventBus.emit("typing",{isTyping:!1})}destroy(){this.abortController&&this.abortController.abort(),this.eventBus.removeAllListeners()}}export{m as C};
//# sourceMappingURL=base-chatbot.BBo8VlEz.js.map
