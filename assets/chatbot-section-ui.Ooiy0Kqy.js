import{B as c}from"./base-chatbot-ui.VFY9Qhos.js";class p extends c{constructor(t,e){super(t,e),this.setupSectionSpecificEventListeners()}setupSectionSpecificEventListeners(){this.eventBus.on("deviceAnswer",({applications:t})=>{this.displayDeviceAnswer(t)})}displayDeviceAnswer(t){const e=document.querySelector(".applications-grid");e&&(e.innerHTML="",t.forEach(n=>{const i=this.createApplicationElement(n);e.appendChild(i)}))}createApplicationElement(t){const e=document.createElement("div");e.className="application-item";const n=document.createElement("img");n.src=t.iconUrl||"",n.alt=t.name||"Application Icon",n.className="application-icon";const i=document.createElement("span");i.textContent=t.name||"Unknown Application",i.className="application-name";const s=document.createElement("span");return s.className="power-requirement",s.textContent=t.powerRequirement?`${t.powerRequirement}W`:"N/A",e.appendChild(n),e.appendChild(i),e.appendChild(s),e}addMessage(t,e,n=null){t==="assistant"&&(n!=null&&n.productContext)&&(e=this.formatMessageWithProductContext(e,n.productContext)),super.addMessage(t,e,n)}formatMessageWithProductContext(t,e){return t.replace(/\{(\w+)\}/g,(n,i)=>e[i]||n)}}export{p as S};
//# sourceMappingURL=chatbot-section-ui.Ooiy0Kqy.js.map
