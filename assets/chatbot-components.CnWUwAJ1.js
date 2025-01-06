import{p as c}from"./markdown-util.DadijVe3.js";import{S as h}from"./streaming-markdown-parser.Bd3zPGns.js";function m(r,e,t=5){return new Promise(n=>{let i=0;r.textContent="";let o=performance.now();const a=s=>{s-o>=t&&i<e.length&&(r.textContent+=e[i],i++,o=s),i<e.length?requestAnimationFrame(a):n()};requestAnimationFrame(a)})}async function d(r,e,t=2){const n=document.createElement("div");n.innerHTML=e,r.innerHTML="";for(const i of n.childNodes)if(i.nodeType===Node.TEXT_NODE){if(i.textContent.trim()){const o=document.createElement("span");r.appendChild(o),await m(o,i.textContent,t)}}else if(i.nodeType===Node.ELEMENT_NODE){const o=i.cloneNode(!1);r.appendChild(o),await d(o,i.innerHTML,t)}}class u extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._eventBus=null}set eventBus(e){this._eventBus=e}connectedCallback(){const e=this.getAttribute("label"),t=this.getAttribute("payload");this.render(e,t)}render(e,t){this.shadowRoot.innerHTML=`
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
    `,this.shadowRoot.querySelector(".button").addEventListener("click",()=>{if(!this._eventBus){console.error("No eventBus assigned to ButtonComponent");return}try{const n=JSON.parse(t);this._eventBus.emit("buttonClicked",{action:n,label:e})}catch(n){console.error("Error parsing button payload:",n)}})}}class p extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.isStreaming=!1,this.animationFrameId=null,this.defaultAnimationSpeed=5,this.currentAnimationSpeed=this.defaultAnimationSpeed,this.streamingParser=null}connectedCallback(){const e=this.getAttribute("sender"),t=this.getAttribute("content")||"";this.isStreaming=this.hasAttribute("streaming");const n=this.getAttribute("data-animate")!=="false";this.currentAnimationSpeed=parseInt(this.getAttribute("data-animation-speed")||this.defaultAnimationSpeed,5),this.render(e,t);const i=this.shadowRoot.querySelector(".message__content");i&&(!this.isStreaming&&t?(n?d(i,t,this.currentAnimationSpeed):i.innerHTML=t,this.scrollToBottom()):this.isStreaming&&(this.streamingParser=new h(o=>{this.appendHTMLContent(o)}),this.streamingParser.appendText(t)))}appendContent(e){if(console.log("appendContent:",e),this.streamingParser)this.streamingParser.appendText(e);else{const t=c(e);this.appendHTMLContent(t)}}appendHTMLContent(e){const t=this.shadowRoot.querySelector(".message__content");if(t){const n=document.createElement("div");for(n.innerHTML=e;n.firstChild;)t.appendChild(n.firstChild);this.scrollToBottom()}}finalizeContentAndAnimate(){console.log("finalizeContentAndAnimate called"),this.streamingParser&&(this.streamingParser.end(),this.streamingParser=null)}render(e,t){const n=e==="assistant";this.shadowRoot.innerHTML=`
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
        ul {
          display: flex;
          flex-direction: column;
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
          background-color: ${n?"#FFFFFF":"rgba(255, 255, 255, 0.1)"};
          color: ${n?"#231F25":"#FFFFFF"};
          border: ${n?"none":"1px solid #FFFFFF"};
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
      <div class="message-wrapper message-wrapper--${e}">
        ${n?'<img class="assistant-icon" src="https://cdn.shopify.com/s/files/1/0641/4290/1439/files/sherpa-icon.svg?v=1736167714">':""}
        <div class="message message--${e}">
          <div class="message__content"></div>
        </div>
      </div>
    `}scrollToBottom(){this.parentElement&&(this.parentElement.scrollTop=this.parentElement.scrollHeight)}disconnectedCallback(){this.animationFrameId&&cancelAnimationFrame(this.animationFrameId),this.streamingParser&&(this.streamingParser.end(),this.streamingParser=null)}}class g extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._eventBus=null,this.items=[],this.currentIndex=0,this.isDesktop=window.matchMedia("(min-width: 1000px)").matches,this.itemsPerSlide=this.isDesktop?2:1,this.moveLeft=this.moveLeft.bind(this),this.moveRight=this.moveRight.bind(this),this.handleResize=this.handleResize.bind(this),this.handleButtonClick=this.handleButtonClick.bind(this)}set eventBus(e){this._eventBus=e}connectedCallback(){const e=this.getAttribute("data-carousel");if(!e){console.error("No data-carousel attribute found. Cannot render carousel.");return}let t;try{t=JSON.parse(e)}catch(n){console.error("Failed to parse carousel data:",n);return}if(!t||!Array.isArray(t.cards)){console.error("carouselData.cards is not defined or not an array");return}this.renderCarousel(t)}renderCarousel(e){this.carouselData=e,this.shadowRoot.innerHTML=`
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
    `,this.carouselContainer=this.shadowRoot.querySelector(".carousel__container"),this.leftButton=this.shadowRoot.querySelector(".carousel__button--left"),this.rightButton=this.shadowRoot.querySelector(".carousel__button--right"),this.carouselData.cards.forEach((t,n)=>{const i=document.createElement("div");i.classList.add("carousel__item");const o=document.createElement("div");o.classList.add("carousel__item-wrapper");const a=document.createElement("div");if(a.classList.add("carousel__item-content"),t.imageUrl){const s=document.createElement("img");s.src=t.imageUrl,s.alt=t.title||"",s.classList.add("carousel__item-image"),a.appendChild(s)}if(t.title){const s=document.createElement("h6");s.classList.add("carousel__item-title"),s.textContent=t.title,a.appendChild(s)}if(t.description&&t.description.text){const s=document.createElement("p");s.classList.add("carousel__item-description"),s.textContent=t.description.text,a.appendChild(s)}if(t.buttons&&t.buttons.length>0){const s=t.buttons[0],l=document.createElement("button");l.classList.add("button","carousel__item-button"),l.setAttribute("data-button-index",n),l.setAttribute("data-button-payload",JSON.stringify(s.request)),l.setAttribute("data-button-text",s.name),l.textContent=s.name||"Select",a.appendChild(l),l.addEventListener("click",this.handleButtonClick)}o.appendChild(a),i.appendChild(o),this.carouselContainer.appendChild(i),this.items.push(i)}),this.initCarousel(),this.leftButton.addEventListener("click",this.moveLeft),this.rightButton.addEventListener("click",this.moveRight),window.addEventListener("resize",this.handleResize),this.updateVisibility(),this.updatePosition()}initCarousel(){this.isDesktop=window.matchMedia("(min-width: 1000px)").matches,this.itemsPerSlide=this.isDesktop?2:1,this.currentIndex=0,this.updateVisibility(),this.updatePosition()}handleResize(){const e=this.isDesktop;this.isDesktop=window.matchMedia("(min-width: 1000px)").matches,this.itemsPerSlide=this.isDesktop?2:1,e!==this.isDesktop&&(this.currentIndex=0,this.updatePosition()),this.updateVisibility()}moveLeft(){this.currentIndex<=0||(this.currentIndex-=this.itemsPerSlide,this.currentIndex<0&&(this.currentIndex=0),this.updatePosition(),this.updateVisibility())}moveRight(){const e=this.items.length-this.itemsPerSlide;this.currentIndex>=e||(this.currentIndex+=this.itemsPerSlide,this.currentIndex>e&&(this.currentIndex=e),this.updatePosition(),this.updateVisibility())}updatePosition(){const e=this.isDesktop?50:100,t=-(this.currentIndex*e);this.carouselContainer.style.transform=`translateX(${t}%)`}updateVisibility(){const e=Math.ceil(this.items.length/this.itemsPerSlide),t=Math.floor(this.currentIndex/this.itemsPerSlide);t===0?this.leftButton.setAttribute("disabled",""):this.leftButton.removeAttribute("disabled"),t>=e-1?this.rightButton.setAttribute("disabled",""):this.rightButton.removeAttribute("disabled")}handleButtonClick(e){if(!this._eventBus){console.error("No eventBus assigned to CarouselComponent");return}const t=e.target,n=parseInt(t.getAttribute("data-button-index"),10),i=this.carouselData.cards[n];if(!i||!i.buttons||i.buttons.length===0){console.warn("No button data found for this card.");return}const o=i.buttons[0];console.log("Original button data:",o);const a=o.request.payload.title,s=a?`Selected ${a}`:"Selected Power Station";this._eventBus.emit("buttonClicked",{action:o.request,label:s}),this.remove()}}customElements.define("button-component",u);customElements.define("message-component",p);customElements.define("carousel-component",g);console.log("MessageComponent defined");console.log("ButtonComponent defined");console.log("CarouselComponent defined");
//# sourceMappingURL=chatbot-components.CnWUwAJ1.js.map
