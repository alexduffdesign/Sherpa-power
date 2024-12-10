// /assets/scripts/chatbot/components/carousel-component.js

import eventBus from "../../utils/event-bus.js";

/**
 * CarouselComponent Class
 * Renders a carousel of cards with images, titles, descriptions, and action buttons.
 */
export class CarouselComponent extends HTMLElement {
  constructor() {
    super();
    // Attach Shadow DOM to encapsulate styles and markup
    this.attachShadow({ mode: "open" });

    // Initialize properties
    this.items = []; // To store carousel items
    this.currentIndex = 0; // Current slide index
    this.isDesktop = window.matchMedia("(min-width: 1000px)").matches;
    this.itemsPerSlide = this.isDesktop ? 2 : 1;

    // Bind methods to maintain context
    this.moveLeft = this.moveLeft.bind(this);
    this.moveRight = this.moveRight.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  /**
   * Lifecycle method called when the component is added to the DOM.
   */
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

    // Ensure carouselData.cards is an array
    if (!carouselData || !Array.isArray(carouselData.cards)) {
      console.error("carouselData.cards is not defined or not an array");
      return;
    }

    this.renderCarousel(carouselData);
  }

  /**
   * Renders the carousel with embedded styles and initializes functionality.
   * @param {Object} carouselData - Data for the carousel containing a 'cards' array.
   */
  renderCarousel(carouselData) {
    this.carouselData = carouselData;
    this.shadowRoot.innerHTML = `
      <style>
        /* Custom Carousel Styling */

        :host h6 {
            font-family: var(--heading-font-family);
            font-weight: var(--heading-font-weight);
            font-style: var(--heading-font-style);
            letter-spacing: var(--heading-letter-spacing);
            text-transform: var(--heading-text-transform);
            overflow-wrap: anywhere;
        }

        :host .button {
          --button-background: var(--button-background-primary) /
            var(--button-background-opacity, 1);
          --button-text-color: var(--button-text-primary);
          --button-outline-color: var(--button-background-primary);
          -webkit-appearance: none;
          appearance: none;
          border-radius: var(--rounded-button);
          background-color: rgb(var(--button-background));
          color: rgb(var(--button-text-color));
          text-align: center;
          font-size: var(--text-sm);
          letter-spacing: var(--text-letter-spacing);
          padding-block-start: var(--spacing-2-5);
          padding-block-end: var(--spacing-2-5);
          padding-inline-start: var(--spacing-5);
          padding-inline-end: var(--spacing-5);
          font-weight: bold;
          line-height: 1.6;
          transition: background-color 0.15s ease-in-out, color 0.15s ease-in-out,
            box-shadow 0.15s ease-in-out;
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

        .carousel__button--left {
          left: 10px;
        }

        .carousel__button--right {
          right: 10px;
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
        }

        .carousel__item-description {
          margin-bottom: var(--spacing-4);
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
          <!-- Carousel items will be dynamically added here -->
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

    // Reference to carousel container and navigation buttons
    this.carouselContainer = this.shadowRoot.querySelector(
      ".carousel__container"
    );
    this.leftButton = this.shadowRoot.querySelector(".carousel__button--left");
    this.rightButton = this.shadowRoot.querySelector(
      ".carousel__button--right"
    );

    // Add carousel items
    this.carouselData.cards.forEach((card, index) => {
      const item = document.createElement("div");
      item.classList.add("carousel__item");

      const itemWrapper = document.createElement("div");
      itemWrapper.classList.add("carousel__item-wrapper");

      const itemContent = document.createElement("div");
      itemContent.classList.add("carousel__item-content");

      // Image
      if (card.imageUrl) {
        const img = document.createElement("img");
        img.src = card.imageUrl;
        img.alt = card.title || "";
        img.classList.add("carousel__item-image");
        itemContent.appendChild(img);
      }

      // Title
      if (card.title) {
        const title = document.createElement("h6");
        title.classList.add("carousel__item-title");
        title.textContent = card.title;
        itemContent.appendChild(title);
      }

      // Description
      if (card.description && card.description.text) {
        const description = document.createElement("p");
        description.classList.add("carousel__item-description");
        description.textContent = card.description.text;
        itemContent.appendChild(description);
      }

      // Button
      if (card.buttons && card.buttons.length > 0) {
        const button = document.createElement("button");
        button.classList.add("carousel__item-button");
        button.setAttribute("data-button-index", index);
        button.textContent = card.buttons[0].name || "Select";
        itemContent.appendChild(button);

        // Add event listener for button click
        button.addEventListener("click", this.handleButtonClick);
      }

      // Assemble the item structure
      itemWrapper.appendChild(itemContent);
      item.appendChild(itemWrapper);
      this.carouselContainer.appendChild(item);
      this.items.push(item);
    });

    // Initialize Carousel Functionality
    this.initCarousel();

    // Add event listeners to navigation buttons
    this.leftButton.addEventListener("click", this.moveLeft);
    this.rightButton.addEventListener("click", this.moveRight);

    // Add event listener for window resize to adjust carousel
    window.addEventListener("resize", this.handleResize);

    this.updateVisibility();
    this.updatePosition();
  }

  /**
   * Initializes carousel settings based on screen size.
   */
  initCarousel() {
    this.isDesktop = window.matchMedia("(min-width: 1000px)").matches;
    this.itemsPerSlide = this.isDesktop ? 2 : 1;
    this.currentIndex = 0;
    this.updateVisibility();
    this.updatePosition();
  }

  /**
   * Handles window resize events to adjust carousel settings.
   */
  handleResize() {
    this.isDesktop = window.matchMedia("(min-width: 1000px)").matches;
    this.itemsPerSlide = this.isDesktop ? 2 : 1;
    this.currentIndex = 0;
    this.updatePosition();
    this.updateVisibility();
  }

  /**
   * Moves the carousel to the left.
   */
  moveLeft() {
    const itemsPerSlide = this.itemsPerSlide;
    this.currentIndex = Math.max(0, this.currentIndex - itemsPerSlide);
    this.updatePosition();
    this.updateVisibility();
  }

  /**
   * Moves the carousel to the right.
   */
  moveRight() {
    const itemsPerSlide = this.itemsPerSlide;
    this.currentIndex = Math.min(
      this.items.length - itemsPerSlide,
      this.currentIndex + itemsPerSlide
    );
    this.updatePosition();
    this.updateVisibility();
  }

  /**
   * Updates the carousel's position based on the current index.
   */
  updatePosition() {
    const itemsPerSlide = this.itemsPerSlide;
    const offset = -(this.currentIndex / itemsPerSlide) * 100;
    this.carouselContainer.style.transform = `translateX(${offset}%)`;
  }

  /**
   * Updates the visibility of navigation buttons based on the current index.
   */
  updateVisibility() {
    const itemsPerSlide = this.itemsPerSlide;
    this.leftButton.disabled = this.currentIndex === 0;
    this.rightButton.disabled =
      this.currentIndex >= this.items.length - itemsPerSlide;
  }

  /**
   * Handles button clicks within carousel items.
   * @param {Event} e - The click event
   */
  handleButtonClick(e) {
    const button = e.target;
    const buttonIndex = parseInt(button.getAttribute("data-button-index"), 10);
    const card = this.carouselData.cards[buttonIndex];
    if (!card || !card.buttons || card.buttons.length === 0) {
      console.warn("No button data found for this card.");
      return;
    }

    const payload = card.buttons[0].request;
    if (payload) {
      eventBus.emit("carouselButtonClicked", payload);
    }

    // Remove the carousel from the UI after interaction if desired
    this.remove();
  }
}
