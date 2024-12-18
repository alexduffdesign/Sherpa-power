import{p as d}from"./markdown-util.gcjemE0m.js";class c extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._eventBus=null}set eventBus(t){this._eventBus=t}connectedCallback(){const t=this.getAttribute("label"),e=this.getAttribute("payload");this.render(t,e)}render(t,e){this.shadowRoot.innerHTML=`
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
    `,this.shadowRoot.querySelector(".button").addEventListener("click",()=>{if(!this._eventBus){console.error("No eventBus assigned to ButtonComponent");return}try{const n=JSON.parse(e);this._eventBus.emit("buttonClicked",n)}catch(n){console.error("Error parsing button payload:",n)}})}}class u extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.content="",this.displayedContent="",this.animationInterval=null,this.animationSpeed=30}connectedCallback(){const t=this.getAttribute("sender"),e=this.getAttribute("content")||"";this.content=e,this.render(t,this.content)}appendContent(t){this.content+=t,this.animateContent()}updateContent(t){this.content=t;const e=this.getAttribute("sender");this.render(e,this.content)}render(t,e){const n=t==="assistant";this.displayedContent="",this.shadowRoot.innerHTML=`
      <style>
        :host {
          display: block;
          width: 100%;
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
          gap: 1em;
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
      <div class="message-wrapper message-wrapper--${t}">
        ${n?'<div class="assistant-icon">🤖</div>':""}
        <div class="message message--${t}">
          <div class="message__content">${e}</div>
        </div>
      </div>
    `,n&&this.animateContent()}animateContent(){if(!(this.getAttribute("sender")==="assistant"))return;const n=this.shadowRoot.querySelector(".message__content");if(!n)return;const s=this.content;this.displayedContent="",this.animationInterval&&clearInterval(this.animationInterval),n.innerHTML="";const o=d(s),a=document.createElement("div");a.innerHTML=o;const i=Array.from(a.childNodes);this.animateNodes(n,i)}animateNodes(t,e){e.forEach(n=>{if(n.nodeType===Node.TEXT_NODE)this.animateTextNode(t,n.textContent);else if(n.nodeType===Node.ELEMENT_NODE){const s=document.createElement(n.tagName.toLowerCase());Array.from(n.attributes).forEach(o=>{s.setAttribute(o.name,o.value)}),t.appendChild(s),this.animateNodes(s,n.childNodes)}})}animateTextNode(t,e){let n=0;const s=document.createElement("span");t.appendChild(s),this.animationInterval=setInterval(()=>{n<e.length?(s.textContent+=e[n],n++,this.scrollToBottom()):(clearInterval(this.animationInterval),this.animationInterval=null)},this.animationSpeed)}scrollToBottom(){this.parentElement.scrollTop=this.parentElement.scrollHeight}}class h extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._eventBus=null,this.items=[],this.currentIndex=0,this.isDesktop=window.matchMedia("(min-width: 1000px)").matches,this.itemsPerSlide=this.isDesktop?2:1,this.moveLeft=this.moveLeft.bind(this),this.moveRight=this.moveRight.bind(this),this.handleResize=this.handleResize.bind(this),this.handleButtonClick=this.handleButtonClick.bind(this)}set eventBus(t){this._eventBus=t}connectedCallback(){const t=this.getAttribute("data-carousel");if(!t){console.error("No data-carousel attribute found. Cannot render carousel.");return}let e;try{e=JSON.parse(t)}catch(n){console.error("Failed to parse carousel data:",n);return}if(!e||!Array.isArray(e.cards)){console.error("carouselData.cards is not defined or not an array");return}this.renderCarousel(e)}renderCarousel(t){this.carouselData=t,this.shadowRoot.innerHTML=`
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
    `,this.carouselContainer=this.shadowRoot.querySelector(".carousel__container"),this.leftButton=this.shadowRoot.querySelector(".carousel__button--left"),this.rightButton=this.shadowRoot.querySelector(".carousel__button--right"),this.carouselData.cards.forEach((e,n)=>{const s=document.createElement("div");s.classList.add("carousel__item");const o=document.createElement("div");o.classList.add("carousel__item-wrapper");const a=document.createElement("div");if(a.classList.add("carousel__item-content"),e.imageUrl){const i=document.createElement("img");i.src=e.imageUrl,i.alt=e.title||"",i.classList.add("carousel__item-image"),a.appendChild(i)}if(e.title){const i=document.createElement("h6");i.classList.add("carousel__item-title"),i.textContent=e.title,a.appendChild(i)}if(e.description&&e.description.text){const i=document.createElement("p");i.classList.add("carousel__item-description"),i.textContent=e.description.text,a.appendChild(i)}if(e.buttons&&e.buttons.length>0){const i=e.buttons[0],r=document.createElement("button");r.classList.add("button","carousel__item-button"),r.setAttribute("data-button-index",n),r.setAttribute("data-button-payload",JSON.stringify(i.request)),r.setAttribute("data-button-text",i.name),r.textContent=i.name||"Select",a.appendChild(r),r.addEventListener("click",this.handleButtonClick)}o.appendChild(a),s.appendChild(o),this.carouselContainer.appendChild(s),this.items.push(s)}),this.initCarousel(),this.leftButton.addEventListener("click",this.moveLeft),this.rightButton.addEventListener("click",this.moveRight),window.addEventListener("resize",this.handleResize),this.updateVisibility(),this.updatePosition()}initCarousel(){this.isDesktop=window.matchMedia("(min-width: 1000px)").matches,this.itemsPerSlide=this.isDesktop?2:1,this.currentIndex=0,this.updateVisibility(),this.updatePosition()}handleResize(){this.isDesktop=window.matchMedia("(min-width: 1000px)").matches,this.itemsPerSlide=this.isDesktop?2:1,this.currentIndex=0,this.updatePosition(),this.updateVisibility()}moveLeft(){const t=this.itemsPerSlide;this.currentIndex=Math.max(0,this.currentIndex-t),this.updatePosition(),this.updateVisibility()}moveRight(){const t=this.itemsPerSlide;this.currentIndex=Math.min(this.items.length-t,this.currentIndex+t),this.updatePosition(),this.updateVisibility()}updatePosition(){const t=-(this.currentIndex/this.itemsPerSlide)*100;this.carouselContainer.style.transform=`translateX(${t}%)`}updateVisibility(){this.leftButton.disabled=this.currentIndex===0,this.rightButton.disabled=this.currentIndex>=this.items.length-this.itemsPerSlide}handleButtonClick(t){if(!this._eventBus){console.error("No eventBus assigned to CarouselComponent");return}const e=t.target,n=parseInt(e.getAttribute("data-button-index"),10),s=this.carouselData.cards[n];if(!s||!s.buttons||s.buttons.length===0){console.warn("No button data found for this card.");return}const o=s.buttons[0];console.log("Original button data:",o);const a=o.request.payload.title,i=a?`Selected ${a}`:"Selected Power Station";this._eventBus.emit("carouselButtonClicked",{action:o.request,label:i}),this.remove()}}customElements.define("button-component",c);customElements.define("message-component",u);customElements.define("carousel-component",h);console.log("MessageComponent defined");console.log("ButtonComponent defined");console.log("CarouselComponent defined");
//# sourceMappingURL=chatbot-components.BnMkiqJb.js.map
