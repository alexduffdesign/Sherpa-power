// /assets/scripts/chatbot/components/carousel-component.js

export class CarouselComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._eventBus = null;

    // Initialize properties
    this.items = [];
    this.currentIndex = 0;
    this.mediaQuery = window.matchMedia("(min-width: 1000px)");
    this.isDesktop = this.mediaQuery.matches;

    // Bind methods
    this.moveLeft = this.moveLeft.bind(this);
    this.moveRight = this.moveRight.bind(this);
    this.handleMediaQueryChange = this.handleMediaQueryChange.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  set eventBus(bus) {
    this._eventBus = bus;
  }

  connectedCallback() {
    const dataAttr = this.getAttribute("data-carousel");
    if (!dataAttr) {
      console.error(
        "No data-carousel attribute found. Cannot render carousel."
      );
      return;
    }

    let carouselData;
    try {
      carouselData = JSON.parse(dataAttr);
    } catch (err) {
      console.error("Failed to parse carousel data:", err);
      return;
    }

    if (!carouselData || !Array.isArray(carouselData.cards)) {
      console.error("carouselData.cards is not defined or not an array");
      return;
    }

    this.renderCarousel(carouselData);
    this.mediaQuery.addEventListener("change", this.handleMediaQueryChange);
  }

  disconnectedCallback() {
    this.mediaQuery.removeEventListener("change", this.handleMediaQueryChange);
  }
  /**
   * Renders the carousel with embedded styles and initializes functionality.
   * @param {Object} carouselData - Data for the carousel containing a 'cards' array.
   */
  renderCarousel(carouselData) {
    this.carouselData = carouselData;
    this.shadowRoot.innerHTML = `
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
          flex-wrap: nowrap;
          transition: transform 0.3s ease-out;
          width: 100%;
          overflow: visible;
          gap: var(--spacing-4);
        }

         .carousel__item {
          flex: 0 0 calc(50% - var(--spacing-2));
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
    `;

    this.carouselContainer = this.shadowRoot.querySelector(
      ".carousel__container"
    );
    this.leftButton = this.shadowRoot.querySelector(".carousel__button--left");
    this.rightButton = this.shadowRoot.querySelector(
      ".carousel__button--right"
    );

    // Add items to carousel
    this.carouselData.cards.forEach((card, index) => {
      const item = document.createElement("div");
      item.classList.add("carousel__item");

      item.innerHTML = `
        <div class="carousel__item-wrapper">
          <div class="carousel__item-content">
            ${
              card.imageUrl
                ? `<img src="${card.imageUrl}" alt="${
                    card.title || ""
                  }" class="carousel__item-image">`
                : ""
            }
            ${
              card.title
                ? `<h6 class="carousel__item-title">${card.title}</h6>`
                : ""
            }
            ${
              card.description
                ? `<p class="carousel__item-description">${card.description.text}</p>`
                : ""
            }
            ${
              card.buttons && card.buttons.length > 0
                ? `<button class="button carousel__item-button" data-button-index="${index}">${card.buttons[0].name}</button>`
                : ""
            }
          </div>
        </div>
      `;

      if (card.buttons && card.buttons.length > 0) {
        const button = item.querySelector(".carousel__item-button");
        button.addEventListener("click", this.handleButtonClick);
      }

      this.carouselContainer.appendChild(item);
      this.items.push(item);
    });

    // Set up event listeners
    this.leftButton.addEventListener("click", this.moveLeft);
    this.rightButton.addEventListener("click", this.moveRight);

    this.updateVisibility();
    this.updatePosition();
  }

  handleMediaQueryChange(e) {
    this.isDesktop = e.matches;
    this.currentIndex = 0;
    this.updatePosition();
    this.updateVisibility();
  }

  moveLeft() {
    const itemsPerSlide = this.isDesktop ? 2 : 1;
    this.currentIndex = Math.max(0, this.currentIndex - itemsPerSlide);
    this.updatePosition();
    this.updateVisibility();
  }

  moveRight() {
    const itemsPerSlide = this.isDesktop ? 2 : 1;
    this.currentIndex = Math.min(
      this.items.length - itemsPerSlide,
      this.currentIndex + itemsPerSlide
    );
    this.updatePosition();
    this.updateVisibility();
  }

  updatePosition() {
    const itemsPerSlide = this.isDesktop ? 2 : 1;
    const offset = -(this.currentIndex / itemsPerSlide) * 100;
    this.carouselContainer.style.transform = `translateX(${offset}%)`;
  }

  updateVisibility() {
    const itemsPerSlide = this.isDesktop ? 2 : 1;
    this.leftButton.style.display = this.currentIndex === 0 ? "none" : "flex";
    this.rightButton.style.display =
      this.currentIndex >= this.items.length - itemsPerSlide ? "none" : "flex";
  }

  handleButtonClick(e) {
    if (!this._eventBus) {
      console.error("No eventBus assigned to CarouselComponent");
      return;
    }

    const button = e.target;
    const buttonIndex = parseInt(button.getAttribute("data-button-index"), 10);
    const card = this.carouselData.cards[buttonIndex];

    if (!card || !card.buttons || card.buttons.length === 0) {
      console.warn("No button data found for this card.");
      return;
    }

    const buttonData = card.buttons[0];
    const productTitle = buttonData.request.payload.title;
    const displayLabel = productTitle
      ? `Selected ${productTitle}`
      : "Selected Power Station";

    this._eventBus.emit("buttonClicked", {
      action: buttonData.request,
      label: displayLabel,
    });

    this.remove();
  }
}
