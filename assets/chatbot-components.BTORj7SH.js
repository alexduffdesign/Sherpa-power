import{m as c}from"./marked.esm.DtrQ3Nt4.js";function d(l){if(!l)return"";const t=l.replace(/([^\n])(#+ )/g,`$1
$2`);return c.parse(t)}class h extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._eventBus=null}set eventBus(t){this._eventBus=t}connectedCallback(){const t=this.getAttribute("label"),e=this.getAttribute("payload");this.render(t,e)}render(t,e){this.shadowRoot.innerHTML=`
      <style>
        .button-container {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: var(--spacing-4);
        }

        .button {
          padding: var(--spacing-3);
          background-color: #FFFFFF;
          border: none;
          border-radius: var(--rounded);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          transition: background-color 0.3s ease;
        }

        .button:hover {
          background-color: #f0f0f0;
        }
      </style>
      <div class="button-container">
        <button class="button" data-button-data='${e}' aria-label="${t}">${t}</button>
      </div>
    `,this.shadowRoot.querySelector(".button").addEventListener("click",()=>{if(!this._eventBus){console.error("No eventBus assigned to ButtonComponent");return}try{const i=JSON.parse(e);this._eventBus.emit("buttonClicked",i)}catch(i){console.error("Error parsing button payload:",i)}})}}class m extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.content="",this.animationFrameId=null,this.defaultAnimationSpeed=15,this.currentAnimationSpeed=this.defaultAnimationSpeed,this.shouldAnimate=!0,this.buffer=""}connectedCallback(){const t=this.getAttribute("sender"),e=this.getAttribute("content")||"";this.content=e;const i=this.getAttribute("data-animate");this.shouldAnimate=i!=="false";const n=this.getAttribute("data-animation-speed");if(n){const o=parseInt(n,10);isNaN(o)||(this.currentAnimationSpeed=o)}else this.currentAnimationSpeed=this.defaultAnimationSpeed;this.render(t,this.content)}appendContent(t){this.buffer+=t,this.processBuffer()}processBuffer(){let t=0;for(;t<this.buffer.length;){const e=this.extractNextMarkdownElement(this.buffer.slice(t));if(!e)break;const{elementContent:i,length:n}=e;this.appendContentStreamedBuffered(i),t+=n}this.buffer=this.buffer.slice(t)}extractNextMarkdownElement(t){const e=t.match(/^(#+)\s+([^\n]+)\n/);if(e)return{elementContent:e[0],length:e[0].length};const i=t.match(/^(\d+)\.\s+([^\n]+)\n/m);if(i){const a=t.slice(0,t.indexOf(`
`,i.index)+1);return{elementContent:a,length:a.length}}const n=t.match(/^([*\-+])\s+([^\n]+)\n/m);if(n){const a=t.slice(0,t.indexOf(`
`,n.index)+1);return{elementContent:a,length:a.length}}const o=t.match(/\*\*([^*]+?)\*\*/);if(o)return{elementContent:o[0],length:o[0].length};const r=t.match(/\*([^*]+?)\*/);if(r)return{elementContent:r[0],length:r[0].length};const s=t.match(/^([^\n]+?)(?:\n\n|$)/);return s?{elementContent:s[0],length:s[0].length}:null}appendContentStreamedBuffered(t){const e=this.shadowRoot.querySelector(".message__content");if(!e)return;const i=d(t),n=document.createElement("div");for(n.innerHTML=i;n.firstChild;)e.appendChild(n.firstChild);this.scrollToBottom()}updateContent(t){this.content=t;const e=this.shadowRoot.querySelector(".message__content");e&&(e.innerHTML=d(t))}render(t,e){const i=t==="assistant";this.shadowRoot.innerHTML=`
      <style>
        :host {
          display: block;
          width: 100%;
        }
        p {
          margin-top: var(--spacing-1);
          margin-bottom: var(--spacing-1);
        }
        .message-wrapper {
          display: flex;
          align-items: flex-end;
          width: 100%;
          margin-bottom: var(--spacing-6);
          gap: var(--spacing-2);
        }

        .message-wrapper--assistant {
          justify-content: flex-start;
        }

        .message-wrapper--user {
          justify-content: flex-end;
        }

        .assistant-icon {
          width: 30px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: var(--spacing-2);
        }

        .message {
          display: flex;
          max-width: 80%;
          padding: var(--spacing-4);
          border-radius: 20px;
          word-wrap: break-word;
          background-color: ${i?"#FFFFFF":"rgba(255, 255, 255, 0.1)"};
          color: ${i?"#231F25":"#FFFFFF"};
          border: ${i?"none":"1px solid #FFFFFF"};
          overflow: hidden;
          white-space: pre-wrap;
          font-family: inherit;
        }

        .message--assistant {
          background-color: #FFFFFF;
          color: #231F25 !important;
          border-bottom-left-radius: 4px;
        }

        .message--user {
          background-color: rgba(255, 255, 255, 0.1);
          border: 1px solid #FFFFFF;
          color: white;
        }

        .message__content {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          font-family: inherit;
        }

        /* Markdown styling */
        .message__content h1,
        .message__content h2,
        .message__content h3,
        .message__content h4,
        .message__content h5,
        .message__content h6 {
          margin: 1em 0 0.5em 0;
          line-height: 1.2;
        }

        .message__content h1:first-child,
        .message__content h2:first-child,
        .message__content h3:first-child,
        .message__content h4:first-child,
        .message__content h5:first-child,
        .message__content h6:first-child {
          margin-top: 0;
        }

        .message__content h1 { font-size: 1.6em; }
        .message__content h2 { font-size: 1.4em; }
        .message__content h3 { font-size: 1.2em; }
        .message__content h4 { font-size: 1.1em; }
        .message__content h5 { font-size: 1em; }
        .message__content h6 { font-size: 0.9em; }

        .message__content a {
          color: #0066cc;
          text-decoration: none;
        }

        .message__content a:hover {
          text-decoration: underline;
        }

        .message__content p {
          margin: 0.5em 0;
          line-height: 1.4;
        }

        .message__content ul,
        .message__content ol {
          margin: 0.5em 0;
          padding-left: 2em;
        }

        .message__content li {
          margin: 0.25em 0;
        }

        .message__content code {
          background-color: rgba(0, 0, 0, 0.05);
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-family: monospace;
        }

        .message__content pre {
          background-color: rgba(0, 0, 0, 0.05);
          padding: 1em;
          border-radius: 4px;
          overflow-x: auto;
          margin: 0.5em 0;
        }

        .message__content pre code {
          background-color: transparent;
          padding: 0;
          border-radius: 0;
        }

        .message__content blockquote {
          margin: 0.5em 0;
          padding-left: 1em;
          border-left: 4px solid rgba(0, 0, 0, 0.1);
          color: rgba(0, 0, 0, 0.7);
        }

        .message__content img {
          max-width: 100%;
          height: auto;
        }

        .message__content table {
          border-collapse: collapse;
          margin: 0.5em 0;
          width: 100%;
        }

        .message__content th,
        .message__content td {
          border: 1px solid rgba(0, 0, 0, 0.1);
          padding: 0.4em 0.8em;
          text-align: left;
        }

        .message__content th {
          background-color: rgba(0, 0, 0, 0.05);
        }
      </style>
      <div class="message-wrapper message-wrapper--${t}">
        ${i?'<div class="assistant-icon">🤖</div>':""}
        <div class="message message--${t}">
          <div class="message__content"></div>
        </div>
      </div>
    `,i&&this.shouldAnimate?this.animateContent(e):i&&!this.shouldAnimate?this.updateContentStreamedBuffered(e):this.updateContent(e)}async animateContent(t){const e=this.shadowRoot.querySelector(".message__content");if(!e)return;const i=d(t),n=document.createElement("div");n.innerHTML=i,await this.animateNodes(e,Array.from(n.childNodes))}async animateNodes(t,e){for(const i of e)if(i.nodeType===Node.TEXT_NODE)i.textContent.trim()&&await this.animateText(t,i.textContent);else if(i.nodeType===Node.ELEMENT_NODE){const n=document.createElement(i.tagName);for(const o of i.attributes||[])n.setAttribute(o.name,o.value);t.appendChild(n),await this.animateNodes(n,Array.from(i.childNodes))}}async animateNodesSequentially(t,e){const i=new Set(["p","div","h1","h2","h3","ul","ol","li","blockquote","pre","h4","h5","h6"]);for(const n of e)if(n.nodeType===Node.TEXT_NODE){if(n.textContent.trim()==="")continue;await this.animateTextNode(t,n.textContent)}else if(n.nodeType===Node.ELEMENT_NODE){const o=n.tagName.toLowerCase(),r=i.has(o),s=document.createElement(o);Array.from(n.attributes).forEach(a=>{s.setAttribute(a.name,a.value)}),t.appendChild(s),r?await this.animateNodesSequentially(s,n.childNodes):await this.animateNodesSequentially(s,n.childNodes)}}animateTextNode(t,e){return new Promise(i=>{let n=0;const o=document.createElement("span");t.appendChild(o);let r=performance.now();const s=a=>{a-r>=this.currentAnimationSpeed&&(o.textContent+=e[n],n++,this.scrollToBottom(),r=a),n<e.length?this.animationFrameId=requestAnimationFrame(s):i()};this.animationFrameId=requestAnimationFrame(s)})}scrollToBottom(){this.parentElement.scrollTop=this.parentElement.scrollHeight}disconnectedCallback(){this.animationFrameId&&cancelAnimationFrame(this.animationFrameId)}}class u extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._eventBus=null,this.items=[],this.currentIndex=0,this.isDesktop=window.matchMedia("(min-width: 1000px)").matches,this.itemsPerSlide=this.isDesktop?2:1,this.moveLeft=this.moveLeft.bind(this),this.moveRight=this.moveRight.bind(this),this.handleResize=this.handleResize.bind(this),this.handleButtonClick=this.handleButtonClick.bind(this)}set eventBus(t){this._eventBus=t}connectedCallback(){const t=this.getAttribute("data-carousel");if(!t){console.error("No data-carousel attribute found. Cannot render carousel.");return}let e;try{e=JSON.parse(t)}catch(i){console.error("Failed to parse carousel data:",i);return}if(!e||!Array.isArray(e.cards)){console.error("carouselData.cards is not defined or not an array");return}this.renderCarousel(e)}renderCarousel(t){this.carouselData=t,this.shadowRoot.innerHTML=`
      <style>
        h6 {
          font-family: var(--heading-font-family);
          font-weight: var(--heading-font-weight);
          font-style: var(--heading-font-style);
          letter-spacing: var(--heading-letter-spacing);
          text-transform: var(--heading-text-transform);
          overflow-wrap: anywhere;
          font-size: var(--text-sm);
        }

        .button {
          --button-background: var(--button-background-primary) /
            var(--button-background-opacity, 1);
          --button-text-color: var(--button-text-primary);
          --button-outline-color: white;
          -webkit-appearance: none;
          appearance: none;
          border-color: white;
          border-radius: 8px;
          border-width: 1px;
          background-color: rgb(var(--button-background));
          color: rgb(var(--button-text-color));
          text-align: center;
          font-size: var(--text-h6);
          letter-spacing: var(--text-letter-spacing);
          padding-block-start: var(--spacing-2-5);
          padding-block-end: var(--spacing-2-5);
          padding-inline-start: var(--spacing-5);
          padding-inline-end: var(--spacing-5);
          font-weight: bold;
          line-height: 1.6;
          transition: background-color 0.15s ease-in-out, color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
          display: inline-block;
          position: relative;
        }

        .carousel {
          position: relative;
          width: 100%;
          overflow: hidden;
          margin-bottom: var(--spacing-4);
          box-sizing: border-box;
        }

        .carousel__container {
          display: flex;
          transition: transform 0.3s ease-out;
          max-width: 100%;
        }

        .carousel__item {
          flex: 0 0 100%;
          display: flex;
          gap: var(--spacing-4);
          box-sizing: border-box;
          max-width: 100%;
          align-items: flex-start;
        }

        .carousel__item-wrapper {
          flex: 0 0 100%;
          max-width: 100%;
          min-width: 0;
        }

        .carousel__button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.8);
          border: solid 1px #403545;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 2;
        }

        .carousel__button--left {
          left: 10px;
        }

        .carousel__button--right {
          right: 10px;
        }

        .carousel__item-button {
          font-size: var(--text-sm);
        }

        .carousel__item-content {
          background: #FFFFFF;
          border-radius: 8px;
          padding: var(--spacing-4);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .carousel__item-image {
          width: 100%;
          height: auto;
          border-radius: 8px;
          margin-bottom: var(--spacing-2);
          object-fit: cover;
        }

        .carousel__item-title {
          font-weight: bold;
          margin-bottom: var(--spacing-0);
          margin-top: var(--spacing-0);
          font-size: var(--text-base);
        }

        .carousel__item-description {
          margin-bottom: var(--spacing-4);
          margin-top: var(--spacing-0);
          font-size: var(--text-sm);
          color: #403545 !important;
          flex-grow: 1;
        }

        @media (min-width: 1000px) {
          .carousel__item {
            flex: 0 0 50%;
            max-width: 50%;
          }

          .carousel__item-wrapper {
            flex: 0 0 calc(100% - var(--spacing-2));
            max-width: calc(100% - var(--spacing-2));
          }
        }
      </style>
      <div class="carousel">
        <div class="carousel__container">
          <!-- Items appended here -->
        </div>
        <button class="carousel__button carousel__button--left" aria-label="Previous slide">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
               xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="carousel__button carousel__button--right" aria-label="Next slide">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
               xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    `,this.carouselContainer=this.shadowRoot.querySelector(".carousel__container"),this.leftButton=this.shadowRoot.querySelector(".carousel__button--left"),this.rightButton=this.shadowRoot.querySelector(".carousel__button--right"),this.carouselData.cards.forEach((e,i)=>{const n=document.createElement("div");n.classList.add("carousel__item");const o=document.createElement("div");o.classList.add("carousel__item-wrapper");const r=document.createElement("div");if(r.classList.add("carousel__item-content"),e.imageUrl){const s=document.createElement("img");s.src=e.imageUrl,s.alt=e.title||"",s.classList.add("carousel__item-image"),r.appendChild(s)}if(e.title){const s=document.createElement("h6");s.classList.add("carousel__item-title"),s.textContent=e.title,r.appendChild(s)}if(e.description&&e.description.text){const s=document.createElement("p");s.classList.add("carousel__item-description"),s.textContent=e.description.text,r.appendChild(s)}if(e.buttons&&e.buttons.length>0){const s=e.buttons[0],a=document.createElement("button");a.classList.add("button","carousel__item-button"),a.setAttribute("data-button-index",i),a.setAttribute("data-button-payload",JSON.stringify(s.request)),a.setAttribute("data-button-text",s.name),a.textContent=s.name||"Select",r.appendChild(a),a.addEventListener("click",this.handleButtonClick)}o.appendChild(r),n.appendChild(o),this.carouselContainer.appendChild(n),this.items.push(n)}),this.initCarousel(),this.leftButton.addEventListener("click",this.moveLeft),this.rightButton.addEventListener("click",this.moveRight),window.addEventListener("resize",this.handleResize),this.updateVisibility(),this.updatePosition()}initCarousel(){this.isDesktop=window.matchMedia("(min-width: 1000px)").matches,this.itemsPerSlide=this.isDesktop?2:1,this.currentIndex=0,this.updateVisibility(),this.updatePosition()}handleResize(){this.isDesktop=window.matchMedia("(min-width: 1000px)").matches,this.itemsPerSlide=this.isDesktop?2:1,this.currentIndex=0,this.updatePosition(),this.updateVisibility()}moveLeft(){const t=this.itemsPerSlide;this.currentIndex=Math.max(0,this.currentIndex-t),this.updatePosition(),this.updateVisibility()}moveRight(){const t=this.itemsPerSlide;this.currentIndex=Math.min(this.items.length-t,this.currentIndex+t),this.updatePosition(),this.updateVisibility()}updatePosition(){const t=-(this.currentIndex/this.itemsPerSlide)*100;this.carouselContainer.style.transform=`translateX(${t}%)`}updateVisibility(){this.leftButton.disabled=this.currentIndex===0,this.rightButton.disabled=this.currentIndex>=this.items.length-this.itemsPerSlide}handleButtonClick(t){if(!this._eventBus){console.error("No eventBus assigned to CarouselComponent");return}const e=t.target,i=parseInt(e.getAttribute("data-button-index"),10),n=this.carouselData.cards[i];if(!n||!n.buttons||n.buttons.length===0){console.warn("No button data found for this card.");return}const o=n.buttons[0];console.log("Original button data:",o);const r=o.request.payload.title,s=r?`Selected ${r}`:"Selected Power Station";this._eventBus.emit("carouselButtonClicked",{action:o.request,label:s}),this.remove()}}customElements.define("button-component",h);customElements.define("message-component",m);customElements.define("carousel-component",u);console.log("MessageComponent defined");console.log("ButtonComponent defined");console.log("CarouselComponent defined");
//# sourceMappingURL=chatbot-components.BTORj7SH.js.map
