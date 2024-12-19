import{m as u}from"./marked.esm.DtrQ3Nt4.js";function h(d){if(!d)return"";const n=d.replace(/([^\n])(#+ )/g,`$1
$2`);return u.parse(n)}class p extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._eventBus=null}set eventBus(n){this._eventBus=n}connectedCallback(){const n=this.getAttribute("label"),t=this.getAttribute("payload");this.render(n,t)}render(n,t){this.shadowRoot.innerHTML=`
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
        <button class="button" data-button-data='${t}' aria-label="${n}">${n}</button>
      </div>
    `,this.shadowRoot.querySelector(".button").addEventListener("click",()=>{if(!this._eventBus){console.error("No eventBus assigned to ButtonComponent");return}try{const e=JSON.parse(t);this._eventBus.emit("buttonClicked",e)}catch(e){console.error("Error parsing button payload:",e)}})}}class g extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.content="",this.animationFrameId=null,this.defaultAnimationSpeed=15,this.currentAnimationSpeed=this.defaultAnimationSpeed,this.shouldAnimate=!0,this.buffer=""}connectedCallback(){const n=this.getAttribute("sender"),t=this.getAttribute("content")||"";this.content=t;const e=this.getAttribute("data-animate");this.shouldAnimate=e!=="false";const i=this.getAttribute("data-animation-speed");if(i){const o=parseInt(i,10);isNaN(o)||(this.currentAnimationSpeed=o)}else this.currentAnimationSpeed=this.defaultAnimationSpeed;this.render(n,this.content)}appendContent(n){this.buffer+=n;const t=this.extractCompleteBlock(this.buffer);if(t){const{block:e,remaining:i}=t;this.content+=e,this.buffer=i,this.shouldAnimate?this.animateContent(e):this.appendContentStreamed(e)}}extractCompleteBlock(n){const t={inCodeBlock:!1,codeBlockDelimiters:0,inHeader:!1,inList:!1,inParagraph:!1,listIndentation:0},e=n.split(`
`);let i=[],o=[],r=!1;for(let s=0;s<e.length;s++){const a=e[s],l=a.trim();if(l.startsWith("```")){if(t.codeBlockDelimiters++,t.inCodeBlock=t.codeBlockDelimiters%2!==0,i.push(a),!t.inCodeBlock){r=!0,o=e.slice(s+1);break}continue}if(t.inCodeBlock){i.push(a);continue}if(l.match(/^(#{1,6})\s/)){if(t.inHeader&&i.length>0){r=!0,o=e.slice(s);break}t.inHeader=!0,t.inParagraph=!1,t.inList=!1}if(l.match(/^([-*+]|\d+\.)\s/)){const m=a.search(/\S/);if(!t.inList||m!==t.listIndentation){if(i.length>0){r=!0,o=e.slice(s);break}t.listIndentation=m}t.inList=!0,t.inParagraph=!1,t.inHeader=!1}if(l===""){if(i.length>0){r=!0,o=e.slice(s+1);break}t.inParagraph=!1,t.inHeader=!1,t.inList=!1}else!t.inHeader&&!t.inList&&(t.inParagraph=!0);if(i.push(a),t.inParagraph&&l.match(/[.!?](\s|$)/)&&s<e.length-1&&!e[s+1].trim().match(/^[-*+]|\d+\.|#/)){r=!0,o=e.slice(s+1);break}}return r||t.codeBlockDelimiters%2===0&&t.inCodeBlock?{block:i.join(`
`),remaining:o.join(`
`)}:null}appendContentStreamed(n){var r,s;const t=this.shadowRoot.querySelector(".message__content");if(!t)return;const e=document.createElement("div"),i=h(n);e.innerHTML=i;const o=t.lastChild;if(o){const a=(r=o.tagName)==null?void 0:r.toLowerCase(),l=e.firstChild,c=(s=l==null?void 0:l.tagName)==null?void 0:s.toLowerCase();if(a===c&&(a!=null&&a.startsWith("h")||a==="p"))o.innerHTML+=" "+l.innerHTML,e.removeChild(l);else if(a==="ul"&&c==="ul"||a==="ol"&&c==="ol"){for(;l.firstChild;)o.appendChild(l.firstChild);e.removeChild(l)}}for(;e.firstChild;)t.appendChild(e.firstChild);this.scrollToBottom()}updateContent(n){this.content=n;const t=this.shadowRoot.querySelector(".message__content");t&&(t.innerHTML=h(n))}render(n,t){const e=n==="assistant";this.shadowRoot.innerHTML=`
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
          background-color: ${e?"#FFFFFF":"rgba(255, 255, 255, 0.1)"};
          color: ${e?"#231F25":"#FFFFFF"};
          border: ${e?"none":"1px solid #FFFFFF"};
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
      <div class="message-wrapper message-wrapper--${n}">
        ${e?'<div class="assistant-icon">🤖</div>':""}
        <div class="message message--${n}">
          <div class="message__content"></div>
        </div>
      </div>
    `,e&&this.shouldAnimate?this.animateContent(t):e&&!this.shouldAnimate?this.updateContentStreamed(t):this.updateContent(t)}async animateContent(n){const t=this.shadowRoot.querySelector(".message__content");if(!t)return;const e=h(n),i=document.createElement("div");i.innerHTML=e,await this.animateNodes(t,Array.from(i.childNodes))}async animateNodes(n,t){for(const e of t)if(e.nodeType===Node.TEXT_NODE)e.textContent.trim()&&await this.animateText(n,e.textContent);else if(e.nodeType===Node.ELEMENT_NODE){const i=document.createElement(e.tagName);for(const o of e.attributes||[])i.setAttribute(o.name,o.value);n.appendChild(i),await this.animateNodes(i,Array.from(e.childNodes))}}async animateNodesSequentially(n,t){const e=new Set(["p","div","h1","h2","h3","ul","ol","li","blockquote","pre","h4","h5","h6"]);for(const i of t)if(i.nodeType===Node.TEXT_NODE){if(i.textContent.trim()==="")continue;await this.animateTextNode(n,i.textContent)}else if(i.nodeType===Node.ELEMENT_NODE){const o=i.tagName.toLowerCase(),r=e.has(o),s=document.createElement(o);Array.from(i.attributes).forEach(a=>{s.setAttribute(a.name,a.value)}),n.appendChild(s),r?await this.animateNodesSequentially(s,i.childNodes):await this.animateNodesSequentially(s,i.childNodes)}}animateTextNode(n,t){return new Promise(e=>{let i=0;const o=document.createElement("span");n.appendChild(o);let r=performance.now();const s=a=>{a-r>=this.currentAnimationSpeed&&(o.textContent+=t[i],i++,this.scrollToBottom(),r=a),i<t.length?this.animationFrameId=requestAnimationFrame(s):e()};this.animationFrameId=requestAnimationFrame(s)})}updateContentStreamed(n){const t=this.shadowRoot.querySelector(".message__content");if(!t)return;const e=h(n),i=document.createElement("div");i.innerHTML=e,Array.from(i.childNodes).forEach(o=>{t.appendChild(o.cloneNode(!0))}),this.scrollToBottom()}scrollToBottom(){this.parentElement.scrollTop=this.parentElement.scrollHeight}disconnectedCallback(){this.animationFrameId&&cancelAnimationFrame(this.animationFrameId)}}class f extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._eventBus=null,this.items=[],this.currentIndex=0,this.isDesktop=window.matchMedia("(min-width: 1000px)").matches,this.itemsPerSlide=this.isDesktop?2:1,this.moveLeft=this.moveLeft.bind(this),this.moveRight=this.moveRight.bind(this),this.handleResize=this.handleResize.bind(this),this.handleButtonClick=this.handleButtonClick.bind(this)}set eventBus(n){this._eventBus=n}connectedCallback(){const n=this.getAttribute("data-carousel");if(!n){console.error("No data-carousel attribute found. Cannot render carousel.");return}let t;try{t=JSON.parse(n)}catch(e){console.error("Failed to parse carousel data:",e);return}if(!t||!Array.isArray(t.cards)){console.error("carouselData.cards is not defined or not an array");return}this.renderCarousel(t)}renderCarousel(n){this.carouselData=n,this.shadowRoot.innerHTML=`
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
    `,this.carouselContainer=this.shadowRoot.querySelector(".carousel__container"),this.leftButton=this.shadowRoot.querySelector(".carousel__button--left"),this.rightButton=this.shadowRoot.querySelector(".carousel__button--right"),this.carouselData.cards.forEach((t,e)=>{const i=document.createElement("div");i.classList.add("carousel__item");const o=document.createElement("div");o.classList.add("carousel__item-wrapper");const r=document.createElement("div");if(r.classList.add("carousel__item-content"),t.imageUrl){const s=document.createElement("img");s.src=t.imageUrl,s.alt=t.title||"",s.classList.add("carousel__item-image"),r.appendChild(s)}if(t.title){const s=document.createElement("h6");s.classList.add("carousel__item-title"),s.textContent=t.title,r.appendChild(s)}if(t.description&&t.description.text){const s=document.createElement("p");s.classList.add("carousel__item-description"),s.textContent=t.description.text,r.appendChild(s)}if(t.buttons&&t.buttons.length>0){const s=t.buttons[0],a=document.createElement("button");a.classList.add("button","carousel__item-button"),a.setAttribute("data-button-index",e),a.setAttribute("data-button-payload",JSON.stringify(s.request)),a.setAttribute("data-button-text",s.name),a.textContent=s.name||"Select",r.appendChild(a),a.addEventListener("click",this.handleButtonClick)}o.appendChild(r),i.appendChild(o),this.carouselContainer.appendChild(i),this.items.push(i)}),this.initCarousel(),this.leftButton.addEventListener("click",this.moveLeft),this.rightButton.addEventListener("click",this.moveRight),window.addEventListener("resize",this.handleResize),this.updateVisibility(),this.updatePosition()}initCarousel(){this.isDesktop=window.matchMedia("(min-width: 1000px)").matches,this.itemsPerSlide=this.isDesktop?2:1,this.currentIndex=0,this.updateVisibility(),this.updatePosition()}handleResize(){this.isDesktop=window.matchMedia("(min-width: 1000px)").matches,this.itemsPerSlide=this.isDesktop?2:1,this.currentIndex=0,this.updatePosition(),this.updateVisibility()}moveLeft(){const n=this.itemsPerSlide;this.currentIndex=Math.max(0,this.currentIndex-n),this.updatePosition(),this.updateVisibility()}moveRight(){const n=this.itemsPerSlide;this.currentIndex=Math.min(this.items.length-n,this.currentIndex+n),this.updatePosition(),this.updateVisibility()}updatePosition(){const n=-(this.currentIndex/this.itemsPerSlide)*100;this.carouselContainer.style.transform=`translateX(${n}%)`}updateVisibility(){this.leftButton.disabled=this.currentIndex===0,this.rightButton.disabled=this.currentIndex>=this.items.length-this.itemsPerSlide}handleButtonClick(n){if(!this._eventBus){console.error("No eventBus assigned to CarouselComponent");return}const t=n.target,e=parseInt(t.getAttribute("data-button-index"),10),i=this.carouselData.cards[e];if(!i||!i.buttons||i.buttons.length===0){console.warn("No button data found for this card.");return}const o=i.buttons[0];console.log("Original button data:",o);const r=o.request.payload.title,s=r?`Selected ${r}`:"Selected Power Station";this._eventBus.emit("carouselButtonClicked",{action:o.request,label:s}),this.remove()}}customElements.define("button-component",p);customElements.define("message-component",g);customElements.define("carousel-component",f);console.log("MessageComponent defined");console.log("ButtonComponent defined");console.log("CarouselComponent defined");
//# sourceMappingURL=chatbot-components.CIXyIWBV.js.map
