console.log("Recent changes check : 3");console.log("ChatbotCore module loaded");class u{constructor(t){this.apiEndpoint=t.apiEndpoint,this.streamingEndpoint="https://chatbottings--development.gadget.app/voiceflowAPI/voiceflow-streaming",this.userID=this.generateUserID(t.userIDPrefix||"chatbot")}generateUserID(t){const e=localStorage.getItem(`${t}_userID`);if(e)return e;const s=`${t}_${Date.now()}_${Math.random().toString(36).substr(2,9)}`;return localStorage.setItem(`${t}_userID`,s),s}async streamInteract(t,e="text"){console.log("Streaming interaction with message:",t,"type:",e);const s=new URL(this.streamingEndpoint);s.searchParams.append("userID",this.userID);const i={action:{type:e,payload:e==="launch"?void 0:t},userID:this.userID,config:{tts:!1,stripSSML:!0}};try{const n=await fetch(s,{method:"POST",headers:{"Content-Type":"application/json",Accept:"text/event-stream"},body:JSON.stringify(i)});if(!n.ok)throw new Error(`HTTP error! status: ${n.status}`);return n}catch(n){throw console.error("Error in stream interact:",n),n}}async launch(){return this.streamInteract(null,"launch")}async gadgetInteract(t){console.log("Gadget interaction with message:",t);try{const e=await fetch(this.apiEndpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:t,userID:this.userID})});if(!e.ok)throw new Error(`HTTP error! status: ${e.status}`);return await e.json()}catch(e){throw console.error("Error in gadget interact:",e),e}}}class g{constructor(){this.messageContainer=null,this.typingIndicator=null,this.drawerBody=null}setDOMElements(t,e,s){this.messageContainer=t,this.typingIndicator=e,this.drawerBody=s}addMessage(t,e){if(!this.messageContainer)return;const s=document.createElement("div");s.classList.add("message-wrapper",`message-wrapper--${t}`);const i=document.createElement("div");i.classList.add("message",`message--${t}`);const n=document.createElement("div");if(n.classList.add("message__content"),t==="assistant"){const a=document.createElement("div");a.classList.add("message-icon"),a.innerHTML=`
        <svg width="30" height="20" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.8566 0.0949741C20.5706 0.0327174 20.1796 -0.00878708 19.9985 0.00158904C19.8173 0.0119652 19.4741 0.0534703 19.2357 0.105351C18.9973 0.157232 18.5492 0.333624 18.2345 0.499642C17.8817 0.676036 15.6315 2.51261 12.4183 5.23115C10.1121 7.17766 8.14608 8.8729 7.4516 9.50931C7.26478 9.68051 7.23297 9.89295 7.36802 10.1074C7.56866 10.4259 7.91296 10.9361 8.2993 11.488C9.04301 12.5394 9.45301 13.0409 9.52929 12.9925C9.59603 12.951 11.9702 10.9588 14.802 8.57226C17.6338 6.18575 20.0461 4.18316 20.1606 4.13128C20.2845 4.0794 20.561 4.0379 20.7803 4.0379C21.0091 4.0379 21.3047 4.12091 21.4478 4.22467C21.5908 4.31805 22.7826 5.9056 24.0889 7.75255C26.0721 10.523 26.4821 11.1559 26.4821 11.4361C26.4916 11.6125 26.4154 11.8719 26.32 11.986C26.2247 12.1105 25.2044 13.0029 24.0507 13.9782C22.897 14.9432 21.8387 15.794 21.6861 15.8563C21.5145 15.9289 21.3429 15.9393 21.1617 15.8667C21.0091 15.8148 20.6754 15.4516 20.3512 14.9847C20.2856 14.8902 20.2209 14.7993 20.1594 14.715C19.8981 14.3568 19.5448 14.3315 19.2009 14.6114C19.0718 14.7164 18.9276 14.8362 18.778 14.964C18.2822 15.379 17.7959 15.7837 17.6815 15.8874C17.5638 15.9806 17.5395 16.1501 17.626 16.2729C18.6307 17.6989 19.1539 18.3732 19.4264 18.6994C19.722 19.0418 20.1606 19.4153 20.4275 19.5606C20.685 19.6955 21.1617 19.8615 21.4764 19.9134C21.8673 19.986 22.2296 19.9756 22.6205 19.903C22.9352 19.8407 23.4024 19.6747 23.6693 19.5294C23.9268 19.3842 25.2617 18.3154 26.6251 17.1637C28.4653 15.5969 29.1804 14.9224 29.3997 14.5489C29.5714 14.2791 29.7811 13.7707 29.867 13.4283C29.9814 12.9925 30.0195 12.5878 29.9909 12.0794C29.9623 11.6125 29.8669 11.1455 29.7144 10.7824C29.5714 10.44 28.2174 8.44775 26.3295 5.81222C24.6038 3.3842 23.021 1.2571 22.8112 1.07033C22.6015 0.883558 22.1915 0.61378 21.9054 0.468515C21.6194 0.323249 21.1426 0.157231 20.8566 0.0949741Z" fill="white"/>
          <path d="M9.51022 0.47889C9.00487 0.219487 8.74743 0.146855 8.12767 0.126103C7.67 0.105351 7.21234 0.157231 6.9835 0.229863C6.77374 0.312872 6.44955 0.458139 6.26839 0.5619C6.08723 0.665661 4.81911 1.6929 3.45563 2.84465C2.09216 3.99639 0.890782 5.07551 0.776364 5.24153C0.661947 5.40755 0.490321 5.72921 0.385438 5.95748C0.271021 6.18576 0.137534 6.65268 0.0707907 6.99509C-0.0150223 7.44127 -0.0245558 7.79405 0.0517223 8.24023C0.0993962 8.58264 0.223347 9.07032 0.32823 9.32972C0.433112 9.58912 1.8824 11.7059 3.54145 14.0509C5.21003 16.3959 6.7642 18.5126 7.0121 18.7616C7.26001 19.0106 7.75582 19.3738 8.12767 19.5709C8.65209 19.8407 8.9572 19.9341 9.55789 19.986C10.006 20.0171 10.54 19.9964 10.8451 19.9237C11.1311 19.8615 11.5983 19.6747 11.8653 19.5191C12.1418 19.3634 14.7257 17.2571 17.6052 14.8291C20.4943 12.401 22.8494 10.357 22.8494 10.2947C22.8589 10.2221 22.3536 9.45423 21.7338 8.60339C21.4117 8.14881 21.1108 7.73759 20.8915 7.45214C20.6737 7.16862 20.3983 7.15354 20.1216 7.38003C19.3039 8.04956 17.3858 9.65415 15.1834 11.5087C11.5411 14.58 9.79626 15.9912 9.57696 16.0327C9.41487 16.0638 9.11929 16.0431 8.93813 15.9808C8.75697 15.9186 8.53767 15.8044 8.45185 15.7318C8.36604 15.6592 7.27908 14.1857 6.03956 12.4426C4.7905 10.6994 3.70354 9.14295 3.62726 8.96655C3.50331 8.71753 3.49377 8.59301 3.57959 8.34399C3.65587 8.11571 4.3233 7.49315 5.98235 6.09237C7.79396 4.54633 8.3279 4.14166 8.55674 4.14166C8.70929 4.14166 8.91906 4.18316 9.00487 4.23504C9.10022 4.28692 9.41487 4.66047 9.70091 5.06514C9.98695 5.48018 10.2825 5.79146 10.3397 5.78109C10.4065 5.76033 10.9118 5.37642 11.4553 4.91987C11.7575 4.67041 12.0283 4.42714 12.2134 4.24762C12.3954 4.0712 12.4181 3.84719 12.2814 3.63385C12.1117 3.3692 11.8416 2.97785 11.5411 2.56449C11.0358 1.85891 10.5114 1.18447 10.3683 1.04958C10.2349 0.914687 9.85347 0.66566 9.51022 0.47889Z" fill="white"/>
          <path d="M9.51022 0.47889C9.00487 0.219487 8.74743 0.146855 8.12767 0.126103C7.67 0.105351 7.21234 0.157231 6.9835 0.229863C6.77374 0.312872 6.44955 0.458139 6.26839 0.5619C6.08723 0.665661 4.81911 1.6929 3.45563 2.84465C2.09216 3.99639 0.890782 5.07551 0.776364 5.24153C0.661947 5.40755 0.490321 5.72921 0.385438 5.95748C0.271021 6.18576 0.137534 6.65268 0.0707907 6.99509C-0.0150223 7.44127 -0.0245558 7.79405 0.0517223 8.24023C0.0993962 8.58264 0.223347 9.07032 0.32823 9.32972C0.433112 9.58912 1.8824 11.7059 3.54145 14.0509C5.21003 16.3959 6.7642 18.5126 7.0121 18.7616C7.26001 19.0106 7.75582 19.3738 8.12767 19.5709C8.65209 19.8407 8.9572 19.9341 9.55789 19.986C10.006 20.0171 10.54 19.9964 10.8451 19.9237C11.1311 19.8615 11.5983 19.6747 11.8653 19.5191C12.1418 19.3634 14.7257 17.2571 17.6052 14.8291C20.4943 12.401 22.8494 10.357 22.8494 10.2947C22.8589 10.2221 22.3536 9.45423 21.7338 8.60339C21.4117 8.14881 21.1108 7.73759 20.8915 7.45214C20.6737 7.16862 20.3983 7.15354 20.1216 7.38003C19.3039 8.04956 17.3858 9.65415 15.1834 11.5087C11.5411 14.58 9.79626 15.9912 9.57696 16.0327C9.41487 16.0638 9.11929 16.0431 8.93813 15.9808C8.75697 15.9186 8.53767 15.8044 8.45185 15.7318C8.36604 15.6592 7.27908 14.1857 6.03956 12.4426C4.7905 10.6994 3.70354 9.14295 3.62726 8.96655C3.50331 8.71753 3.49377 8.59301 3.57959 8.34399C3.65587 8.11571 4.3233 7.49315 5.98235 6.09237C7.79396 4.54633 8.3279 4.14166 8.55674 4.14166C8.70929 4.14166 8.91906 4.18316 9.00487 4.23504C9.10022 4.28692 9.41487 4.66047 9.70091 5.06514C9.98695 5.48018 10.2825 5.79146 10.3397 5.78109C10.4065 5.76033 10.9118 5.37642 11.4553 4.91987C11.7575 4.67041 12.0283 4.42714 12.2134 4.24762C12.3954 4.0712 12.4181 3.84719 12.2814 3.63385C12.1117 3.3692 11.8416 2.97785 11.5411 2.56449C11.0358 1.85891 10.5114 1.18447 10.3683 1.04958C10.2349 0.914687 9.85347 0.66566 9.51022 0.47889Z" fill="white"/>
        </svg>
      `,s.appendChild(a)}n.innerHTML=this.markdownToHtml(e),i.appendChild(n),s.appendChild(i),this.messageContainer.appendChild(s),this.scrollToBottom()}markdownToHtml(t){let s=(a=>a.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"))(t);s=s.replace(/^###### (.*)$/gm,'<h6 class="h6">$1</h6>'),s=s.replace(/^##### (.*)$/gm,'<h6 class="h6">$1</h6>'),s=s.replace(/^#### (.*)$/gm,'<h6 class="h6">$1</h6>'),s=s.replace(/^### (.*)$/gm,'<h6 class="h6">$1</h6>'),s=s.replace(/^## (.*)$/gm,'<h6 class="h5">$1</h6>'),s=s.replace(/^# (.*)$/gm,'<h6 class="h4">$1</h6>'),s=s.replace(/\*\*\*(.*?)\*\*\*/g,"<strong><em>$1</em></strong>"),s=s.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>"),s=s.replace(/\*(.*?)\*/g,"<em>$1</em>"),s=s.replace(/`([^`]+)`/g,"<code>$1</code>");let i=!1;return s=s.split(`
`).map(a=>a.match(/^\s*[-*+]\s/)?i?"<li>"+a.replace(/^\s*[-*+]\s/,"")+"</li>":(i=!0,`<ul>
<li>`+a.replace(/^\s*[-*+]\s/,"")+"</li>"):a.match(/^\s*\d+\.\s/)?i?"<li>"+a.replace(/^\s*\d+\.\s/,"")+"</li>":(i=!0,`<ol>
<li>`+a.replace(/^\s*\d+\.\s/,"")+"</li>"):i&&a.trim()===""?(i=!1,`</ul>
`):a).join(`
`),i&&(s+=`
</ul>`),s=s.replace(/\[(.*?)\]\((.*?)\)/g,'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'),s=s.split(/\n{2,}/).map(a=>a.startsWith("<h")||a.startsWith("<ul")||a.startsWith("<ol")||a.startsWith("<blockquote")||a.startsWith("<hr")||a.startsWith("<img")?a:`<p>${a}</p>`).join(`
`),s}addCarousel(t){if(!this.messageContainer||!(t!=null&&t.cards))return;const e=document.createElement("div");e.className="carousel",e.innerHTML=`
      <div class="carousel__container">
        <!-- Carousel items will be dynamically added here -->
      </div>
      <button class="carousel__button carousel__button--left" aria-label="Previous slide">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <button class="carousel__button carousel__button--right" aria-label="Next slide">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    `;const s=new m(e);t.cards.forEach((a,o)=>{const r=`
        <div class="carousel__item-wrapper">
          <div class="carousel__item-content">
            <img src="${a.imageUrl}" alt="${a.title}" class="carousel__item-image">
            <h6 class="carousel__item-title">${a.title}</h6>
            <p class="carousel__item-description">${a.description.text}</p>
            <button class="button carousel__item-button" data-button-index="${o}">${a.buttons[0].name}</button>
          </div>
        </div>
      `;s.addItem(r)}),e.querySelectorAll(".carousel__item-button").forEach((a,o)=>{a.addEventListener("click",async()=>{const r=Math.floor(o/t.cards[0].buttons.length),c=o%t.cards[0].buttons.length,d=t.cards[r].buttons[c];try{e.remove(),this.conversationHistory.push({type:"user",message:d.name}),this.saveConversationToStorage();const h=await this.core.handleButtonClick(d);await this.handleAgentResponse(h)}catch(h){console.error("Error handling carousel button click:",h)}})});const n=this.element.querySelector("#messageContainer");n?(n.appendChild(e),this.scrollToBottom()):console.error("Message container not found when adding carousel")}addButtons(t){if(!this.messageContainer||!(t!=null&&t.length))return;const e=document.createElement("div");e.className="message";const s=document.createElement("div");s.className="message-content assistant-message";const i=document.createElement("div");i.className="logo-container";const n=document.createElement("div");n.className="logo-background",i.appendChild(n),s.appendChild(i);const a=document.createElement("div");a.className="buttons-container",t.forEach(o=>{const r=document.createElement("button");r.className="chat-button",r.textContent=o.name,r.dataset.buttonData=JSON.stringify(o),a.appendChild(r)}),s.appendChild(a),e.appendChild(s),this.messageContainer.appendChild(e),this.scrollToBottom()}addVisualImage(t){if(!this.messageContainer||!(t!=null&&t.image))return;const e=document.createElement("div");e.className="message";const s=document.createElement("div");s.className="message-content assistant-message";const i=document.createElement("div");i.className="logo-container";const n=document.createElement("div");n.className="logo-background",i.appendChild(n),s.appendChild(i);const a=document.createElement("div");a.className="visual-image-container";const o=document.createElement("img");o.src=t.image,o.alt=t.alt||"Visual response",o.className="visual-image",a.appendChild(o),s.appendChild(a),e.appendChild(s),this.messageContainer.appendChild(e),this.scrollToBottom()}removeButtons(){if(!this.messageContainer)return;this.messageContainer.querySelectorAll(".buttons-container").forEach(e=>{const s=e.closest(".message");s&&s.remove()})}showTypingIndicator(t="Sherpa Guide Is Typing..."){if(this.typingIndicator){if(!this.typingIndicator.querySelector(".logo-container")){const s=document.createElement("div");s.className="logo-container";const i=document.createElement("div");i.className="logo-background",s.appendChild(i),this.typingIndicator.insertBefore(s,this.typingIndicator.firstChild)}this.typingIndicator.style.display="flex",this.scrollToBottom()}}hideTypingIndicator(){this.typingIndicator&&(this.typingIndicator.style.display="none")}scrollToBottom(){this.drawerBody&&(this.drawerBody.scrollTop=this.drawerBody.scrollHeight)}}class m{constructor(t){this.element=t,this.container=t.querySelector(".carousel__container"),this.leftButton=t.querySelector(".carousel__button--left"),this.rightButton=t.querySelector(".carousel__button--right"),this.items=[],this.currentIndex=0,this.mediaQuery=window.matchMedia("(min-width: 1000px)"),this.isDesktop=this.mediaQuery.matches,this.leftButton.addEventListener("click",()=>this.move("left")),this.rightButton.addEventListener("click",()=>this.move("right")),this.mediaQuery.addListener(this.handleMediaQueryChange.bind(this))}handleMediaQueryChange(t){this.isDesktop=t.matches,this.currentIndex=0,this.updatePosition(),this.updateVisibility()}addItem(t){const e=document.createElement("div");e.className="carousel__item",e.innerHTML=t,this.container.appendChild(e),this.items.push(e),this.updateVisibility()}move(t){const e=this.isDesktop?2:1;t==="left"?this.currentIndex=Math.max(0,this.currentIndex-e):this.currentIndex=Math.min(this.items.length-e,this.currentIndex+e),this.updatePosition(),this.updateVisibility()}updatePosition(){const t=this.isDesktop?2:1,e=-(this.currentIndex/t)*100;this.container.style.transform=`translateX(${e}%)`}updateVisibility(){const t=this.isDesktop?2:1;this.leftButton.style.display=this.currentIndex===0?"none":"flex",this.rightButton.style.display=this.currentIndex>=this.items.length-t?"none":"flex"}}class p{constructor(){this.currentStream=null}async handleStream(t,e){if(!t.body)throw new Error("No response body available");const s=t.body.getReader(),i=new TextDecoder;let n="";try{for(;;){const{done:a,value:o}=await s.read();if(a)break;n+=i.decode(o,{stream:!0});const r=n.split(`
`);n=r.pop()||"";for(const c of r)if(c.trim()!==""&&c.startsWith("data: ")){const d=c.slice(6);try{const h=JSON.parse(d);await e.handleTrace(h)}catch(h){console.error("Error parsing stream data:",h)}}}if(n){const a=n.split(`
`);for(const o of a){if(o.trim()===""||!o.startsWith("data: "))continue;const r=o.slice(6);try{const c=JSON.parse(r);await e.handleTrace(c)}catch(c){console.error("Error parsing remaining stream data:",c)}}}}catch(a){throw console.error("Error reading stream:",a),a}}closeCurrentStream(){this.currentStream&&(this.currentStream.cancel(),this.currentStream=null)}}class C{constructor(t){this.ui=t,this.onSpecialTrace=null}async handleTrace(t){var e,s,i;switch(console.log("Handling trace:",t),this.onSpecialTrace&&await this.onSpecialTrace(t),t.type){case"text":(e=t.payload)!=null&&e.message&&this.ui.addMessage("assistant",t.payload.message);break;case"path":console.log("Path trace received:",t.payload);break;case"choice":(s=t.payload)!=null&&s.buttons&&this.ui.addButtons(t.payload.buttons);break;case"carousel":t.payload&&this.ui.addCarousel(t.payload);break;case"visual":((i=t.payload)==null?void 0:i.visualType)==="image"&&this.ui.addVisualImage(t.payload);break;case"waiting_text":this.ui.showTypingIndicator(t.payload);break;case"end":console.log("Stream ended"),this.ui.hideTypingIndicator();break;default:console.log("Unhandled trace type:",t.type)}}}class y{constructor(t){console.log("ChatbotBase constructor called with config:",t),this.api=new u(t),this.ui=new g,this.stream=new p,this.traceHandler=new C(this.ui),this.traceHandler.onSpecialTrace=this.handleSpecialTrace.bind(this),this.sendMessage=this.sendMessage.bind(this),this.handleButtonClick=this.handleButtonClick.bind(this)}setDOMElements(t,e,s){this.ui.setDOMElements(t,e,s)}async sendMessage(t){console.log("Sending message:",t);try{this.stream.closeCurrentStream(),this.ui.showTypingIndicator();const e=await this.api.streamInteract(t),s=await this.stream.handleStream(e,this.traceHandler);return this.ui.hideTypingIndicator(),s}catch(e){throw console.error("Error in send message:",e),this.ui.hideTypingIndicator(),this.ui.addMessage("assistant","I apologize, but I encountered an error. Please try again."),e}}async handleButtonClick(t){console.log("Handling button click:",t);try{this.ui.removeButtons(),this.ui.showTypingIndicator();const e=await this.sendMessage(t.name);return this.ui.hideTypingIndicator(),e}catch(e){throw console.error("Error handling button click:",e),this.ui.hideTypingIndicator(),e}}async handleSpecialTrace(t){console.log("Base handler received special trace:",t)}}class f{constructor(){this.conversationHistory=[],this.hasLaunched=localStorage.getItem("chatHasLaunched")==="true"}updateHistory(t){console.log("Updating conversation history with:",t),this.conversationHistory.push(t),this.saveToStorage()}saveToStorage(){try{localStorage.setItem("chatHistory",JSON.stringify(this.conversationHistory)),localStorage.setItem("chatHasLaunched","true")}catch(t){console.error("Error saving conversation to storage:",t)}}loadFromStorage(){try{const t=localStorage.getItem("chatHistory");t&&(this.conversationHistory=JSON.parse(t))}catch(t){console.error("Error loading conversation from storage:",t),this.conversationHistory=[]}}clearHistory(){this.conversationHistory=[],localStorage.removeItem("chatHistory")}getHistory(){return this.conversationHistory}hasHistory(){return this.hasLaunched}}class b extends y{constructor(t,e){console.log("MainChatbot constructor called with config:",e),super(e),this.element=t,this.history=new f,this.initializeElements(),this.setupEventListeners(),this.launchChatbot()}async launchChatbot(){try{await this.api.launch()}catch(t){console.error("Error launching chatbot:",t),this.ui.addMessage("assistant","Sorry, there was an error initializing the chatbot. Please refresh the page.")}}initializeElements(){this.messageContainer=this.element.querySelector(".message-container"),this.typingIndicator=this.element.querySelector(".typing-indicator"),this.drawerBody=this.element.querySelector(".drawer-body"),this.chatInput=this.element.querySelector(".chat-input"),this.sendButton=this.element.querySelector(".send-button"),this.backToStartButton=this.element.querySelector(".back-to-start-button"),this.setDOMElements(this.messageContainer,this.typingIndicator,this.drawerBody)}setupEventListeners(){if(this.chatInput&&this.sendButton){const t=this.chatInput.closest("form");t&&t.addEventListener("submit",async e=>(e.preventDefault(),e.stopPropagation(),await this.handleUserInput(),!1)),this.chatInput.addEventListener("keypress",async e=>{e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),e.stopPropagation(),await this.handleUserInput())}),this.sendButton.addEventListener("click",async e=>{e.preventDefault(),e.stopPropagation(),await this.handleUserInput()})}this.backToStartButton&&this.backToStartButton.addEventListener("click",()=>{this.jumpToMainMenu()}),this.messageContainer&&this.messageContainer.addEventListener("click",async t=>{const e=t.target.closest(".chat-button");if(e){const s=JSON.parse(e.dataset.buttonData);await this.handleButtonClick(s)}})}async handleUserInput(){const t=this.chatInput.value.trim();if(t){this.chatInput.value="",this.chatInput.disabled=!0;try{this.ui.addMessage("user",t),this.history.updateHistory({type:"user",message:t}),await this.sendMessage(t)}catch(e){console.error("Error sending message:",e),this.ui.addMessage("assistant","Sorry, there was an error sending your message. Please try again.")}finally{this.chatInput.disabled=!1,this.chatInput.focus()}}}async handleSpecialTrace(t){var e,s,i,n,a;switch(console.log("Main chatbot handling special trace:",t),t.type){case"text":(e=t.payload)!=null&&e.message&&this.history.updateHistory({type:"assistant",message:t.payload.message});break;case"choice":(s=t.payload)!=null&&s.buttons&&this.history.updateHistory({type:"choice",buttons:t.payload.buttons});break;case"carousel":t.payload&&this.history.updateHistory({type:"carousel",data:t.payload});break;case"visual":((i=t.payload)==null?void 0:i.visualType)==="image"&&this.history.updateHistory({type:"visual",data:t.payload});break;case"RedirectToProduct":const o=(a=(n=t.payload)==null?void 0:n.body)==null?void 0:a.productHandle;o&&this.handleProductRedirect(o);break}}async jumpToMainMenu(){console.log("MainChatbot jumpToMainMenu called"),this.history.clearHistory(),this.messageContainer.innerHTML="",await this.sendMessage("start")}handleProductRedirect(t){t&&(window.location.href=`/products/${t}`)}displaySavedConversation(){this.history.getHistory().forEach(e=>{switch(e.type){case"user":case"assistant":this.ui.addMessage(e.type,e.message);break;case"choice":this.ui.addButtons(e.buttons);break;case"carousel":this.ui.addCarousel(e.data);break;case"visual":this.ui.addVisualImage(e.data);break}})}}console.log("MainChatbot module loaded");export{u as A,y as C,f as H,b as M,p as S,C as T,g as U};
//# sourceMappingURL=chatbot-core-file.B4RQzswn.js.map
