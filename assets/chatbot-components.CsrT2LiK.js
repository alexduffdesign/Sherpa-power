import{p as c}from"./markdown-util.DadijVe3.js";import{S as d}from"./streaming-markdown-parser.Bd3zPGns.js";function h(i,t,e=5){return new Promise(s=>{let n=0;i.textContent="";let o=performance.now();const a=r=>{r-o>=e&&n<t.length&&(i.textContent+=t[n],n++,o=r),n<t.length?requestAnimationFrame(a):s()};requestAnimationFrame(a)})}async function l(i,t,e=2){const s=document.createElement("div");s.innerHTML=t,i.innerHTML="";for(const n of s.childNodes)if(n.nodeType===Node.TEXT_NODE){if(n.textContent.trim()){const o=document.createElement("span");i.appendChild(o),await h(o,n.textContent,e)}}else if(n.nodeType===Node.ELEMENT_NODE){const o=n.cloneNode(!1);i.appendChild(o),await l(o,n.innerHTML,e)}}class m extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._eventBus=null}set eventBus(t){this._eventBus=t}connectedCallback(){const t=this.getAttribute("label"),e=this.getAttribute("payload");this.render(t,e)}render(t,e){this.shadowRoot.innerHTML=`
      <style>
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
      <button class="button" data-button-data='${e}' aria-label="${t}">${t}</button>
    `,this.shadowRoot.querySelector(".button").addEventListener("click",()=>{if(!this._eventBus){console.error("No eventBus assigned to ButtonComponent");return}try{const s=JSON.parse(e);this._eventBus.emit("buttonClicked",{action:s,label:t})}catch(s){console.error("Error parsing button payload:",s)}})}}class u extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.isStreaming=!1,this.animationFrameId=null,this.defaultAnimationSpeed=5,this.currentAnimationSpeed=this.defaultAnimationSpeed,this.streamingParser=null}connectedCallback(){const t=this.getAttribute("sender"),e=this.getAttribute("content")||"";this.isStreaming=this.hasAttribute("streaming");const s=this.getAttribute("data-animate")!=="false";this.currentAnimationSpeed=parseInt(this.getAttribute("data-animation-speed")||this.defaultAnimationSpeed,5),this.render(t,e);const n=this.shadowRoot.querySelector(".message__content");n&&(!this.isStreaming&&e?(s?l(n,e,this.currentAnimationSpeed):n.innerHTML=e,this.scrollToBottom()):this.isStreaming&&(this.streamingParser=new d(o=>{this.appendHTMLContent(o)}),this.streamingParser.appendText(e)))}appendContent(t){if(console.log("appendContent:",t),this.streamingParser)this.streamingParser.appendText(t);else{const e=c(t);this.appendHTMLContent(e)}}appendHTMLContent(t){const e=this.shadowRoot.querySelector(".message__content");if(e){const s=document.createElement("div");for(s.innerHTML=t;s.firstChild;)e.appendChild(s.firstChild);this.scrollToBottom()}}finalizeContentAndAnimate(){console.log("finalizeContentAndAnimate called"),this.streamingParser&&(this.streamingParser.end(),this.streamingParser=null)}render(t,e){const s=t==="assistant";this.shadowRoot.innerHTML=`
      <style>
        h1, h2, h3, h4, h5, h6 {
          font-family: var(--heading-font-family);
          font-weight: var(--heading-font-weight);
        }
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
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2em;
          line-height: 1;
        }

        .message {
          display: flex;
          max-width: 80%;
          padding: var(--spacing-4);
          border-radius: 20px;
          word-wrap: break-word;
          background-color: ${s?"#FFFFFF":"rgba(255, 255, 255, 0.1)"};
          color: ${s?"#231F25":"#FFFFFF"};
          border: ${s?"none":"1px solid #FFFFFF"};
          overflow: hidden;
          font-family: inherit;
          position: relative;
          opacity: 1;
          transition: opacity 0.3s ease-in-out;
          white-space: pre-wrap; /* Preserve newlines and spaces */
        }

        .message.fade-out {
          opacity: 0;
        }

        .message__content.fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
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
          grid-gap: 0.2rem;
          font-family: inherit;
          word-break: break-word;
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
        ${s?'<img class="assistant-icon" src="https://cdn.shopify.com/s/files/1/0641/4290/1439/files/sherpa-icon.svg?v=1736167714">':""}
        <div class="message message--${t}">
          <div class="message__content"></div>
        </div>
      </div>
    `}scrollToBottom(){this.parentElement&&(this.parentElement.scrollTop=this.parentElement.scrollHeight)}disconnectedCallback(){this.animationFrameId&&cancelAnimationFrame(this.animationFrameId),this.streamingParser&&(this.streamingParser.end(),this.streamingParser=null)}}class g extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._eventBus=null,this.items=[],this.currentIndex=0,this.mediaQuery=window.matchMedia("(min-width: 1000px)"),this.isDesktop=this.mediaQuery.matches,this.moveLeft=this.moveLeft.bind(this),this.moveRight=this.moveRight.bind(this),this.handleMediaQueryChange=this.handleMediaQueryChange.bind(this),this.handleButtonClick=this.handleButtonClick.bind(this)}set eventBus(t){this._eventBus=t}connectedCallback(){const t=this.getAttribute("data-carousel");if(!t){console.error("No data-carousel attribute found. Cannot render carousel.");return}let e;try{e=JSON.parse(t)}catch(s){console.error("Failed to parse carousel data:",s);return}if(!e||!Array.isArray(e.cards)){console.error("carouselData.cards is not defined or not an array");return}this.renderCarousel(e),this.mediaQuery.addEventListener("change",this.handleMediaQueryChange)}disconnectedCallback(){this.mediaQuery.removeEventListener("change",this.handleMediaQueryChange)}renderCarousel(t){this.carouselData=t,this.shadowRoot.innerHTML=`
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
          flex-wrap: nowrap;
          transition: transform 0.3s ease-out;
          width: 100%;
          overflow: visible;
        }

         .carousel__item {
          flex: 0 0 100%;
          display: block;
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
          margin-block-start: var(--spacing-0) !important;
        }

         .carousel__button[disabled] {
          opacity: 0;
          pointer-events: none;
        }

        .carousel__button--left {
          left: 10px;
        }

        .carousel__button--right {
          right: 20px;
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
    `,this.carouselContainer=this.shadowRoot.querySelector(".carousel__container"),this.leftButton=this.shadowRoot.querySelector(".carousel__button--left"),this.rightButton=this.shadowRoot.querySelector(".carousel__button--right"),this.carouselData.cards.forEach((e,s)=>{const n=document.createElement("div");n.classList.add("carousel__item"),n.innerHTML=`
        <div class="carousel__item-wrapper">
          <div class="carousel__item-content">
            ${e.imageUrl?`<img src="${e.imageUrl}" alt="${e.title||""}" class="carousel__item-image">`:""}
            ${e.title?`<h6 class="carousel__item-title">${e.title}</h6>`:""}
            ${e.description?`<p class="carousel__item-description">${e.description.text}</p>`:""}
            ${e.buttons&&e.buttons.length>0?`<button class="button carousel__item-button" data-button-index="${s}">${e.buttons[0].name}</button>`:""}
          </div>
        </div>
      `,e.buttons&&e.buttons.length>0&&n.querySelector(".carousel__item-button").addEventListener("click",this.handleButtonClick),this.carouselContainer.appendChild(n),this.items.push(n)}),this.leftButton.addEventListener("click",this.moveLeft),this.rightButton.addEventListener("click",this.moveRight),this.updateVisibility(),this.updatePosition()}handleMediaQueryChange(t){this.isDesktop=t.matches,this.currentIndex=0,this.updatePosition(),this.updateVisibility()}moveLeft(){const t=this.isDesktop?2:1;this.currentIndex=Math.max(0,this.currentIndex-t),this.updatePosition(),this.updateVisibility()}moveRight(){const t=this.isDesktop?2:1;this.currentIndex=Math.min(this.items.length-t,this.currentIndex+t),this.updatePosition(),this.updateVisibility()}updatePosition(){const t=this.isDesktop?2:1,e=-(this.currentIndex/t)*100;this.carouselContainer.style.transform=`translateX(${e}%)`}updateVisibility(){const t=this.isDesktop?2:1;this.leftButton.style.display=this.currentIndex===0?"none":"flex",this.rightButton.style.display=this.currentIndex>=this.items.length-t?"none":"flex"}handleButtonClick(t){if(!this._eventBus){console.error("No eventBus assigned to CarouselComponent");return}const e=t.target,s=parseInt(e.getAttribute("data-button-index"),10),n=this.carouselData.cards[s];if(!n||!n.buttons||n.buttons.length===0){console.warn("No button data found for this card.");return}const o=n.buttons[0],a=o.request.payload.title,r=a?`Selected ${a}`:"Selected Power Station";this._eventBus.emit("buttonClicked",{action:o.request,label:r}),this.remove()}}customElements.define("button-component",m);customElements.define("message-component",u);customElements.define("carousel-component",g);console.log("MessageComponent defined");console.log("ButtonComponent defined");console.log("CarouselComponent defined");
//# sourceMappingURL=chatbot-components.CsrT2LiK.js.map
