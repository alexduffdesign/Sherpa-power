import{m as c}from"./marked.esm.DtrQ3Nt4.js";function d(l){return l?c.parse(l):""}class h extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._eventBus=null}set eventBus(e){this._eventBus=e}connectedCallback(){const e=this.getAttribute("label"),t=this.getAttribute("payload");this.render(e,t)}render(e,t){this.shadowRoot.innerHTML=`
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
    `,this.shadowRoot.querySelector(".button").addEventListener("click",()=>{if(!this._eventBus){console.error("No eventBus assigned to ButtonComponent");return}try{const i=JSON.parse(t);this._eventBus.emit("buttonClicked",i)}catch(i){console.error("Error parsing button payload:",i)}})}}class u extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.content="",this.animationFrameId=null,this.defaultAnimationSpeed=15,this.currentAnimationSpeed=this.defaultAnimationSpeed,this.shouldAnimate=!0,this.buffer=""}connectedCallback(){const e=this.getAttribute("sender"),t=this.getAttribute("content")||"";this.content=t;const i=this.getAttribute("data-animate");this.shouldAnimate=i!=="false";const n=this.getAttribute("data-animation-speed");if(n){const o=parseInt(n,10);isNaN(o)||(this.currentAnimationSpeed=o)}else this.currentAnimationSpeed=this.defaultAnimationSpeed;this.render(e,this.content)}appendContent(e){this.buffer+=e;const t=this.extractCompleteBlock(this.buffer);if(t){const{block:i,remaining:n}=t;this.content+=i,this.buffer=n,this.shouldAnimate?this.animateContent(i):this.appendContentStreamed(i)}}extractCompleteBlock(e){const t=/[\.\?\!]\s/,i=e.match(t);if(i){const n=i.index+i[0].length,o=e.slice(0,n).trim(),a=e.slice(n).trim();return{block:o,remaining:a}}return null}appendContentStreamed(e){const t=this.shadowRoot.querySelector(".message__content");if(!t)return;const i=d(e),n=document.createElement("div");n.innerHTML=i,Array.from(n.childNodes).forEach(o=>{t.appendChild(o.cloneNode(!0))}),this.scrollToBottom()}updateContent(e){this.content=e;const t=this.shadowRoot.querySelector(".message__content");t&&(t.innerHTML=d(e))}render(e,t){const i=e==="assistant";this.shadowRoot.innerHTML=`
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
        .message__content h1, .message__content h2, .message__content h3 {
          margin: 0.5em 0;
        }

        .message__content a {
          color: #0066cc;
          text-decoration: none;
        }

        .message__content a:hover {
          text-decoration: underline;
        }

        .message__content strong {
          font-weight: bold;
        }

        .message__content em {
          font-style: italic;
        }

        /* Add more markdown styles as needed */
      </style>
      <div class="message-wrapper message-wrapper--${e}">
        ${i?'<div class="assistant-icon">🤖</div>':""}
        <div class="message message--${e}">
          <div class="message__content"></div>
        </div>
      </div>
    `,i&&this.shouldAnimate?this.animateContent(t):i&&!this.shouldAnimate?this.updateContentStreamed(t):this.updateContent(t)}animateContent(e){if(!(this.getAttribute("sender")==="assistant"))return;const n=this.shadowRoot.querySelector(".message__content");if(!n)return;const o=d(e);n.innerHTML="";const a=document.createElement("div");a.innerHTML=o;const s=Array.from(a.childNodes);this.animateNodesSequentially(n,s).then(()=>{})}async animateNodesSequentially(e,t){const i=new Set(["p","div","h1","h2","h3","ul","ol","li","blockquote","pre","h4","h5","h6"]);for(const n of t)if(n.nodeType===Node.TEXT_NODE){if(n.textContent.trim()==="")continue;await this.animateTextNode(e,n.textContent)}else if(n.nodeType===Node.ELEMENT_NODE){const o=n.tagName.toLowerCase(),a=i.has(o),s=document.createElement(o);Array.from(n.attributes).forEach(r=>{s.setAttribute(r.name,r.value)}),e.appendChild(s),a?await this.animateNodesSequentially(s,n.childNodes):await this.animateNodesSequentially(s,n.childNodes)}}animateTextNode(e,t){return new Promise(i=>{let n=0;const o=document.createElement("span");e.appendChild(o);let a=performance.now();const s=r=>{r-a>=this.currentAnimationSpeed&&(o.textContent+=t[n],n++,this.scrollToBottom(),a=r),n<t.length?this.animationFrameId=requestAnimationFrame(s):i()};this.animationFrameId=requestAnimationFrame(s)})}updateContentStreamed(e){const t=this.shadowRoot.querySelector(".message__content");if(!t)return;const i=d(e),n=document.createElement("div");n.innerHTML=i,Array.from(n.childNodes).forEach(o=>{t.appendChild(o.cloneNode(!0))}),this.scrollToBottom()}scrollToBottom(){this.parentElement.scrollTop=this.parentElement.scrollHeight}disconnectedCallback(){this.animationFrameId&&cancelAnimationFrame(this.animationFrameId)}}class m extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._eventBus=null,this.items=[],this.currentIndex=0,this.isDesktop=window.matchMedia("(min-width: 1000px)").matches,this.itemsPerSlide=this.isDesktop?2:1,this.moveLeft=this.moveLeft.bind(this),this.moveRight=this.moveRight.bind(this),this.handleResize=this.handleResize.bind(this),this.handleButtonClick=this.handleButtonClick.bind(this)}set eventBus(e){this._eventBus=e}connectedCallback(){const e=this.getAttribute("data-carousel");if(!e){console.error("No data-carousel attribute found. Cannot render carousel.");return}let t;try{t=JSON.parse(e)}catch(i){console.error("Failed to parse carousel data:",i);return}if(!t||!Array.isArray(t.cards)){console.error("carouselData.cards is not defined or not an array");return}this.renderCarousel(t)}renderCarousel(e){this.carouselData=e,this.shadowRoot.innerHTML=`
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
    `,this.carouselContainer=this.shadowRoot.querySelector(".carousel__container"),this.leftButton=this.shadowRoot.querySelector(".carousel__button--left"),this.rightButton=this.shadowRoot.querySelector(".carousel__button--right"),this.carouselData.cards.forEach((t,i)=>{const n=document.createElement("div");n.classList.add("carousel__item");const o=document.createElement("div");o.classList.add("carousel__item-wrapper");const a=document.createElement("div");if(a.classList.add("carousel__item-content"),t.imageUrl){const s=document.createElement("img");s.src=t.imageUrl,s.alt=t.title||"",s.classList.add("carousel__item-image"),a.appendChild(s)}if(t.title){const s=document.createElement("h6");s.classList.add("carousel__item-title"),s.textContent=t.title,a.appendChild(s)}if(t.description&&t.description.text){const s=document.createElement("p");s.classList.add("carousel__item-description"),s.textContent=t.description.text,a.appendChild(s)}if(t.buttons&&t.buttons.length>0){const s=t.buttons[0],r=document.createElement("button");r.classList.add("button","carousel__item-button"),r.setAttribute("data-button-index",i),r.setAttribute("data-button-payload",JSON.stringify(s.request)),r.setAttribute("data-button-text",s.name),r.textContent=s.name||"Select",a.appendChild(r),r.addEventListener("click",this.handleButtonClick)}o.appendChild(a),n.appendChild(o),this.carouselContainer.appendChild(n),this.items.push(n)}),this.initCarousel(),this.leftButton.addEventListener("click",this.moveLeft),this.rightButton.addEventListener("click",this.moveRight),window.addEventListener("resize",this.handleResize),this.updateVisibility(),this.updatePosition()}initCarousel(){this.isDesktop=window.matchMedia("(min-width: 1000px)").matches,this.itemsPerSlide=this.isDesktop?2:1,this.currentIndex=0,this.updateVisibility(),this.updatePosition()}handleResize(){this.isDesktop=window.matchMedia("(min-width: 1000px)").matches,this.itemsPerSlide=this.isDesktop?2:1,this.currentIndex=0,this.updatePosition(),this.updateVisibility()}moveLeft(){const e=this.itemsPerSlide;this.currentIndex=Math.max(0,this.currentIndex-e),this.updatePosition(),this.updateVisibility()}moveRight(){const e=this.itemsPerSlide;this.currentIndex=Math.min(this.items.length-e,this.currentIndex+e),this.updatePosition(),this.updateVisibility()}updatePosition(){const e=-(this.currentIndex/this.itemsPerSlide)*100;this.carouselContainer.style.transform=`translateX(${e}%)`}updateVisibility(){this.leftButton.disabled=this.currentIndex===0,this.rightButton.disabled=this.currentIndex>=this.items.length-this.itemsPerSlide}handleButtonClick(e){if(!this._eventBus){console.error("No eventBus assigned to CarouselComponent");return}const t=e.target,i=parseInt(t.getAttribute("data-button-index"),10),n=this.carouselData.cards[i];if(!n||!n.buttons||n.buttons.length===0){console.warn("No button data found for this card.");return}const o=n.buttons[0];console.log("Original button data:",o);const a=o.request.payload.title,s=a?`Selected ${a}`:"Selected Power Station";this._eventBus.emit("carouselButtonClicked",{action:o.request,label:s}),this.remove()}}customElements.define("button-component",h);customElements.define("message-component",u);customElements.define("carousel-component",m);console.log("MessageComponent defined");console.log("ButtonComponent defined");console.log("CarouselComponent defined");
//# sourceMappingURL=chatbot-components.CKl79kXh.js.map
