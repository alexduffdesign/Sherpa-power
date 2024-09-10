console.log("Recent changes check : 3");class a{constructor(t){console.log("ChatbotCore constructor called with config:",t),this.apiEndpoint=t.apiEndpoint,this.userID=this.loadUserID(),this.messageContainer=null,this.typingIndicator=null,this.chatMessages=null,this.sendMessage=this.sendMessage.bind(this),this.gadgetInteract=this.gadgetInteract.bind(this),this.addMessage=this.addMessage.bind(this),console.log("ChatbotCore instance created:",this)}loadUserID(){let t=localStorage.getItem("chatbotUserID");return t||(t=`user_${Math.floor(Math.random()*1e15)}`,localStorage.setItem("chatbotUserID",t)),console.log("ChatbotCore userID loaded:",t),t}setDOMElements(t,e,s){console.log("setDOMElements called:",{messageContainer:t,typingIndicator:e,chatMessages:s}),this.messageContainer=t,this.typingIndicator=e,this.chatMessages=s,console.log("DOM elements set:",this)}scrollToBottom(){this.chatMessages?this.chatMessages.scrollTop=this.chatMessages.scrollHeight:console.error("Chat messages element not found for scrolling")}async sendMessage(t){console.log("sendMessage called with:",t),console.log("this in sendMessage:",this);try{const e=await this.gadgetInteract({userAction:{type:"text",payload:t}});return console.log("gadgetInteract response:",e),this.hideTypingIndicator(),e}catch(e){throw console.error("Error sending message:",e),this.hideTypingIndicator(),e}}async sendLaunch(){console.log("ChatbotCore sendLaunch called"),this.showTypingIndicator();const t={userAction:{type:"launch"}};try{const e=await this.gadgetInteract(t);return console.log("Launch response:",e),this.hideTypingIndicator(),e}catch(e){throw console.error("Error launching conversation:",e),this.hideTypingIndicator(),e}}async gadgetInteract(t){console.log("Sending payload to Gadget:",t);const e={userID:this.userID,userAction:t.userAction||t},s=await fetch(this.apiEndpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!s.ok)throw new Error(`Gadget API error: ${s.status}`);return await s.json()}showTypingIndicator(){console.log("Showing typing indicator"),this.typingIndicator&&(this.typingIndicator.style.display="flex",this.typingIndicator.classList.add("active"),this.scrollToBottom())}hideTypingIndicator(){console.log("Hiding typing indicator"),this.typingIndicator&&(this.typingIndicator.style.display="none",this.typingIndicator.classList.remove("active"))}addMessage(t,e){if(console.log(`Adding message from ${t}: ${e}`),this.messageContainer){const s=document.createElement("div");s.classList.add("message",`message--${t}`),s.innerHTML=this.markdownToHtml(e),this.messageContainer.appendChild(s),this.scrollToBottom()}}markdownToHtml(t){return t.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\*(.*?)\*/g,"<em>$1</em>").replace(/\[(.*?)\]\((.*?)\)/g,'<a href="$2" target="_blank">$1</a>').replace(/\n/g,"<br>")}addButtons(t){console.log("Adding buttons:",t);const e=document.createElement("div");e.classList.add("button-container"),t.forEach(s=>{const o=document.createElement("button");o.classList.add("button"),o.textContent=s.name,o.dataset.buttonData=JSON.stringify(s),e.appendChild(o)}),this.messageContainer?(this.messageContainer.appendChild(e),this.scrollToBottom()):console.error("Message container not found when adding buttons")}removeButtons(){this.messageContainer.querySelectorAll(".button-container").forEach(e=>e.remove())}async handleButtonClick(t){console.log("Button clicked:",t),this.removeButtons(),this.addMessage("user",t.name),this.showTypingIndicator();try{const e=await this.gadgetInteract({userID:this.userID,userAction:t.request});return this.hideTypingIndicator(),e}catch(e){throw console.error("Error handling button click:",e),this.hideTypingIndicator(),e}}}console.log("ChatbotCore module loaded");export{a as C};
//# sourceMappingURL=chatbot-core-file-CikaHu9r.js.map
