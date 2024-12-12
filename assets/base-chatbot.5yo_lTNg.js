import{E as l}from"./vendor.DqvJXvYX.js";function h(a){const e=Date.now().toString(36)+Math.random().toString(36).substr(2,9);return`${a}-${e}`}const d="https://chatbottings--development.gadget.app/voiceflowAPI/voiceflow-streaming";class p extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.eventBus=new l,this.userID=h(),this.abortController=null}static get observedAttributes(){return["endpoint"]}connectedCallback(){this.initialize()}disconnectedCallback(){this.cleanup()}initialize(){this.setupEventListeners()}launch(){this.sendLaunch()}setupEventListeners(){this.eventBus.on("userMessage",e=>this.sendMessage(e)),this.eventBus.on("buttonClicked",e=>this.sendMessage(e))}async sendLaunch(e={}){console.log("Constructing launch payload:",e);const t=e.action?e:{action:{type:"launch"}};return this.sendAction(t)}async sendMessage(e){console.log("Sending message:",e);const t={action:{type:"text",payload:e}};return this.sendAction(t)}async sendAction(e){try{this.abortController&&(this.abortController.abort(),await new Promise(n=>setTimeout(n,100))),this.abortController=new AbortController;const{signal:t}=this.abortController;this.eventBus.emit("typing",{isTyping:!0});const s=await fetch(d,{method:"POST",headers:{"Content-Type":"application/json",Accept:"text/event-stream"},body:JSON.stringify({userID:this.userID,action:e.action}),credentials:"include",signal:t});if(!s.ok)throw new Error(`API responded with status ${s.status}`);await this.handleSSEResponse(s)}catch(t){if(t.name==="AbortError"){console.debug("Request aborted, new request in progress");return}this.handleError(t)}}async handleSSEResponse(e){const t=e.body.getReader(),s=new TextDecoder("utf-8");let n="";try{for(;;){const{done:i,value:r}=await t.read();if(i){this.eventBus.emit("end",{});break}n+=s.decode(r,{stream:!0});const o=n.split(`

`);n=o.pop();for(const c of o)c.trim()!==""&&this.processEventString(c)}}catch(i){this.handleError(i)}finally{this.eventBus.emit("typing",{isTyping:!1})}}processEventString(e){try{const t=e.split(`
`),s=t.find(o=>o.startsWith("event:")),n=t.find(o=>o.startsWith("data:")),i=s?s.split(":")[1].trim():"trace",r=n?JSON.parse(e.substring(e.indexOf("data:")+5).trim()):null;i==="trace"&&this.processTrace(r)}catch(t){console.error("Error processing SSE event:",t)}}processTrace(e){if(!e.type){console.warn("Trace without type received:",e);return}switch(this.eventBus.emit("typing",{isTyping:!1}),e.type){case"text":this.eventBus.emit("messageReceived",{content:e.payload.message,metadata:e.payload.metadata||null});break;case"choice":this.eventBus.emit("choicePresented",{type:"choice",buttons:e.payload.buttons});break;case"carousel":this.eventBus.emit("carouselPresented",{type:"carousel",items:e.payload.cards});break;case"waiting_text":this.eventBus.emit("typingText",{text:e.payload.text}),this.eventBus.emit("typing",{isTyping:!0});break;default:console.warn(`Unhandled trace type: ${e.type}`,e)}}handleError(e){console.error("Chatbot error:",e),this.eventBus.emit("error",{message:e.message}),this.eventBus.emit("typing",{isTyping:!1})}cleanup(){this.abortController&&this.abortController.abort(),this.eventBus.removeAllListeners()}}export{p as B,h as g};
//# sourceMappingURL=base-chatbot.5yo_lTNg.js.map