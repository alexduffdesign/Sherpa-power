import{m}from"./marked.esm.DtrQ3Nt4.js";function c(d){if(!d)return"";const e=d.replace(/([^\n])(#+ )/g,`$1
$2`);return m.parse(e)}class u extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._eventBus=null}set eventBus(e){this._eventBus=e}connectedCallback(){const e=this.getAttribute("label"),t=this.getAttribute("payload");this.render(e,t)}render(e,t){this.shadowRoot.innerHTML=`
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
        <button class="button" data-button-data='${t}' aria-label="${e}">${e}</button>
      </div>
    `,this.shadowRoot.querySelector(".button").addEventListener("click",()=>{if(!this._eventBus){console.error("No eventBus assigned to ButtonComponent");return}try{const n=JSON.parse(t);this._eventBus.emit("buttonClicked",n)}catch(n){console.error("Error parsing button payload:",n)}})}}class p extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.content="",this.animationFrameId=null,this.defaultAnimationSpeed=15,this.currentAnimationSpeed=this.defaultAnimationSpeed,this.shouldAnimate=!0,this.buffer=""}connectedCallback(){const e=this.getAttribute("sender"),t=this.getAttribute("content")||"";this.content=t;const n=this.getAttribute("data-animate");this.shouldAnimate=n!=="false";const i=this.getAttribute("data-animation-speed");if(i){const s=parseInt(i,10);isNaN(s)||(this.currentAnimationSpeed=s)}else this.currentAnimationSpeed=this.defaultAnimationSpeed;this.render(e,this.content)}appendContent(e){this.buffer+=e;let t;for(;t=this.extractCompleteBlock(this.buffer);){const{block:n,remaining:i}=t;this.buffer=i,this.content+=n,this.shouldAnimate?this.animateContent(n):this.appendContentStreamed(n)}}extractCompleteBlock(e){const t=e.indexOf(`
`);if(t!==-1){const n=e.slice(0,t+1),i=e.slice(t+1);return{block:n,remaining:i}}return null}appendContentStreamed(e){var r,o;const t=this.shadowRoot.querySelector(".message__content");if(!t)return;const n=document.createElement("div"),i=c(e);n.innerHTML=i;const s=t.lastChild;if(s){const a=(r=s.tagName)==null?void 0:r.toLowerCase(),l=n.firstChild,h=(o=l==null?void 0:l.tagName)==null?void 0:o.toLowerCase();if(a===h&&(a!=null&&a.startsWith("h")||a==="p"))s.innerHTML+=" "+l.innerHTML,n.removeChild(l);else if(a==="ul"&&h==="ul"||a==="ol"&&h==="ol"){for(;l.firstChild;)s.appendChild(l.firstChild);n.removeChild(l)}}for(;n.firstChild;)t.appendChild(n.firstChild);this.scrollToBottom()}updateContent(e){this.content=e;const t=this.shadowRoot.querySelector(".message__content");t&&(t.innerHTML=c(e))}render(e,t){const n=e==="assistant";this.shadowRoot.innerHTML=`
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
          background-color: ${n?"#FFFFFF":"rgba(255, 255, 255, 0.1)"};
          color: ${n?"#231F25":"#FFFFFF"};
          border: ${n?"none":"1px solid #FFFFFF"};
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
      <div class="message-wrapper message-wrapper--${e}">
        ${n?'<div class="assistant-icon">🤖</div>':""}
        <div class="message message--${e}">
          <div class="message__content"></div>
        </div>
      </div>
    `,n&&this.shouldAnimate?this.animateContent(t):n&&!this.shouldAnimate?this.updateContentStreamed(t):this.updateContent(t)}async animateContent(e){const t=this.shadowRoot.querySelector(".message__content");if(!t)return;const n=c(e),i=document.createElement("div");i.innerHTML=n,await this.animateNodes(t,Array.from(i.childNodes))}async animateNodes(e,t){for(const n of t)if(n.nodeType===Node.TEXT_NODE)n.textContent.trim()&&await this.animateText(e,n.textContent);else if(n.nodeType===Node.ELEMENT_NODE){const i=document.createElement(n.tagName);for(const s of n.attributes||[])i.setAttribute(s.name,s.value);e.appendChild(i),await this.animateNodes(i,Array.from(n.childNodes))}}async animateNodesSequentially(e,t){const n=new Set(["p","div","h1","h2","h3","ul","ol","li","blockquote","pre","h4","h5","h6"]);for(const i of t)if(i.nodeType===Node.TEXT_NODE){if(i.textContent.trim()==="")continue;await this.animateTextNode(e,i.textContent)}else if(i.nodeType===Node.ELEMENT_NODE){const s=i.tagName.toLowerCase(),r=n.has(s),o=document.createElement(s);Array.from(i.attributes).forEach(a=>{o.setAttribute(a.name,a.value)}),e.appendChild(o),r?await this.animateNodesSequentially(o,i.childNodes):await this.animateNodesSequentially(o,i.childNodes)}}animateTextNode(e,t){return new Promise(n=>{let i=0;const s=document.createElement("span");e.appendChild(s);let r=performance.now();const o=a=>{a-r>=this.currentAnimationSpeed&&(s.textContent+=t[i],i++,this.scrollToBottom(),r=a),i<t.length?this.animationFrameId=requestAnimationFrame(o):n()};this.animationFrameId=requestAnimationFrame(o)})}updateContentStreamed(e){const t=this.shadowRoot.querySelector(".message__content");if(!t)return;const n=c(e),i=document.createElement("div");i.innerHTML=n,Array.from(i.childNodes).forEach(s=>{t.appendChild(s.cloneNode(!0))}),this.scrollToBottom()}scrollToBottom(){this.parentElement.scrollTop=this.parentElement.scrollHeight}disconnectedCallback(){this.animationFrameId&&cancelAnimationFrame(this.animationFrameId)}}class g extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._eventBus=null,this.items=[],this.currentIndex=0,this.isDesktop=window.matchMedia("(min-width: 1000px)").matches,this.itemsPerSlide=this.isDesktop?2:1,this.moveLeft=this.moveLeft.bind(this),this.moveRight=this.moveRight.bind(this),this.handleResize=this.handleResize.bind(this),this.handleButtonClick=this.handleButtonClick.bind(this)}set eventBus(e){this._eventBus=e}connectedCallback(){const e=this.getAttribute("data-carousel");if(!e){console.error("No data-carousel attribute found. Cannot render carousel.");return}let t;try{t=JSON.parse(e)}catch(n){console.error("Failed to parse carousel data:",n);return}if(!t||!Array.isArray(t.cards)){console.error("carouselData.cards is not defined or not an array");return}this.renderCarousel(t)}renderCarousel(e){this.carouselData=e,this.shadowRoot.innerHTML=`
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
    `,this.carouselContainer=this.shadowRoot.querySelector(".carousel__container"),this.leftButton=this.shadowRoot.querySelector(".carousel__button--left"),this.rightButton=this.shadowRoot.querySelector(".carousel__button--right"),this.carouselData.cards.forEach((t,n)=>{const i=document.createElement("div");i.classList.add("carousel__item");const s=document.createElement("div");s.classList.add("carousel__item-wrapper");const r=document.createElement("div");if(r.classList.add("carousel__item-content"),t.imageUrl){const o=document.createElement("img");o.src=t.imageUrl,o.alt=t.title||"",o.classList.add("carousel__item-image"),r.appendChild(o)}if(t.title){const o=document.createElement("h6");o.classList.add("carousel__item-title"),o.textContent=t.title,r.appendChild(o)}if(t.description&&t.description.text){const o=document.createElement("p");o.classList.add("carousel__item-description"),o.textContent=t.description.text,r.appendChild(o)}if(t.buttons&&t.buttons.length>0){const o=t.buttons[0],a=document.createElement("button");a.classList.add("button","carousel__item-button"),a.setAttribute("data-button-index",n),a.setAttribute("data-button-payload",JSON.stringify(o.request)),a.setAttribute("data-button-text",o.name),a.textContent=o.name||"Select",r.appendChild(a),a.addEventListener("click",this.handleButtonClick)}s.appendChild(r),i.appendChild(s),this.carouselContainer.appendChild(i),this.items.push(i)}),this.initCarousel(),this.leftButton.addEventListener("click",this.moveLeft),this.rightButton.addEventListener("click",this.moveRight),window.addEventListener("resize",this.handleResize),this.updateVisibility(),this.updatePosition()}initCarousel(){this.isDesktop=window.matchMedia("(min-width: 1000px)").matches,this.itemsPerSlide=this.isDesktop?2:1,this.currentIndex=0,this.updateVisibility(),this.updatePosition()}handleResize(){this.isDesktop=window.matchMedia("(min-width: 1000px)").matches,this.itemsPerSlide=this.isDesktop?2:1,this.currentIndex=0,this.updatePosition(),this.updateVisibility()}moveLeft(){const e=this.itemsPerSlide;this.currentIndex=Math.max(0,this.currentIndex-e),this.updatePosition(),this.updateVisibility()}moveRight(){const e=this.itemsPerSlide;this.currentIndex=Math.min(this.items.length-e,this.currentIndex+e),this.updatePosition(),this.updateVisibility()}updatePosition(){const e=-(this.currentIndex/this.itemsPerSlide)*100;this.carouselContainer.style.transform=`translateX(${e}%)`}updateVisibility(){this.leftButton.disabled=this.currentIndex===0,this.rightButton.disabled=this.currentIndex>=this.items.length-this.itemsPerSlide}handleButtonClick(e){if(!this._eventBus){console.error("No eventBus assigned to CarouselComponent");return}const t=e.target,n=parseInt(t.getAttribute("data-button-index"),10),i=this.carouselData.cards[n];if(!i||!i.buttons||i.buttons.length===0){console.warn("No button data found for this card.");return}const s=i.buttons[0];console.log("Original button data:",s);const r=s.request.payload.title,o=r?`Selected ${r}`:"Selected Power Station";this._eventBus.emit("carouselButtonClicked",{action:s.request,label:o}),this.remove()}}customElements.define("button-component",u);customElements.define("message-component",p);customElements.define("carousel-component",g);console.log("MessageComponent defined");console.log("ButtonComponent defined");console.log("CarouselComponent defined");
//# sourceMappingURL=chatbot-components.DC1i4991.js.map
