import{E as l}from"./vendor.DqvJXvYX.js";function h(a){const t=Date.now().toString(36)+Math.random().toString(36).substr(2,9);return`${a}-${t}`}const d="https://chatbottings--development.gadget.app/voiceflowAPI/voiceflow-streaming";class p extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.eventBus=new l,this.userID=h(),this.abortController=null}static get observedAttributes(){return["endpoint"]}connectedCallback(){this.initialize()}disconnectedCallback(){this.cleanup()}initialize(){this.setupEventListeners()}launch(){this.sendLaunch()}setupEventListeners(){this.eventBus.on("userMessage",t=>this.sendMessage(t)),this.eventBus.on("buttonClicked",t=>this.sendMessage(t))}async sendLaunch(t={}){console.log("Constructing launch payload:",t);const e=t.action?t:{action:{type:"launch"}};return this.sendAction(e)}async sendMessage(t){console.log("Sending message:",t);const e={action:{type:"text",payload:t}};return this.sendAction(e)}async sendAction(t){try{const e=this.getAttribute("endpoint")||d;if(!e)throw new Error("Endpoint attribute is required");this.abortController&&this.abortController.abort(),this.abortController=new AbortController;const{signal:n}=this.abortController;this.eventBus.emit("typing",{isTyping:!0});const s=await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userID:this.userID,action:t.action}),credentials:"include",signal:n});if(!s.ok)throw new Error(`API responded with status ${s.status}`);await this.handleSSEResponse(s)}catch(e){this.handleError(e)}}async handleSSEResponse(t){const e=t.body.getReader(),n=new TextDecoder("utf-8");let s="";try{for(;;){const{done:o,value:r}=await e.read();if(o){this.eventBus.emit("end",{});break}s+=n.decode(r,{stream:!0});const i=s.split(`

`);s=i.pop();for(const c of i)c.trim()!==""&&this.processEventString(c)}}catch(o){this.handleError(o)}finally{this.eventBus.emit("typing",{isTyping:!1})}}processEventString(t){try{const e=t.split(`
`),n=e.find(i=>i.startsWith("event:")),s=e.find(i=>i.startsWith("data:")),o=n?n.split(":")[1].trim():"trace",r=s?JSON.parse(t.substring(t.indexOf("data:")+5).trim()):null;o==="trace"&&this.processTrace(r)}catch(e){console.error("Error processing SSE event:",e)}}processTrace(t){if(!t.type){console.warn("Trace without type received:",t);return}switch(this.eventBus.emit("typing",{isTyping:!1}),t.type){case"text":this.eventBus.emit("messageReceived",{content:t.payload.message,metadata:t.payload.metadata||null});break;case"choice":this.eventBus.emit("choicePresented",{type:"choice",buttons:t.payload.buttons});break;case"carousel":this.eventBus.emit("carouselPresented",{type:"carousel",items:t.payload.cards});break;case"waiting_text":this.eventBus.emit("typingText",{text:t.payload.text}),this.eventBus.emit("typing",{isTyping:!0});break;default:console.warn(`Unhandled trace type: ${t.type}`,t)}}handleError(t){console.error("Chatbot error:",t),this.eventBus.emit("error",{message:t.message}),this.eventBus.emit("typing",{isTyping:!1})}cleanup(){this.abortController&&this.abortController.abort(),this.eventBus.removeAllListeners()}}export{p as B,h as g};
//# sourceMappingURL=base-chatbot.CihohfVD.js.map
