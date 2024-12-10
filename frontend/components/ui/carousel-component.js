// /assets/scripts/chatbot/components/carousel-component.js

import eventBus from "../../utils/event-bus.js";

/**
 * CarouselComponent Class
 * Renders a carousel of cards with images, titles, descriptions, and action buttons.
 */
export class CarouselComponent extends HTMLElement {
  constructor() {
    super();
    // Attach Shadow DOM to encapsulate styles
    this.attachShadow({ mode: "open" });
    this.items = []; // Initialize this.items as an empty array
    this.currentIndex = 0;
    this.isDesktop = window.matchMedia("(min-width: 1000px)").matches;
    this.itemsPerSlide = this.isDesktop ? 2 : 1;

    // Bind methods to maintain context
    this.moveLeft = this.moveLeft.bind(this);
    this.moveRight = this.moveRight.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
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
        /* Integrated Custom CSS */
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

        .carousel__item-button {
          margin-top: auto;
          margin-block-start: 0 !important;
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
        <button class="carousel__button carousel__button--left" aria-label="Previous slide">&#9664;</button>
        <button class="carousel__button carousel__button--right" aria-label="Next slide">&#9654;</button>
      </div>
    `;

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

      // Wrapper for the content
      const wrapper = document.createElement("div");
      wrapper.classList.add("carousel__item-wrapper");

      // Content container
      const content = document.createElement("div");
      content.classList.add("carousel__item-content");

      // Image
      const imageUrl = card.imageUrl
        ? `<img src="${card.imageUrl}" alt="${
            card.title || ""
          }" class="carousel__item-image">`
        : "";

      // Title
      const title = card.title
        ? `<h6 class="carousel__item-title">${card.title}</h6>`
        : "";

      // Description
      const descriptionText =
        card.description && card.description.text ? card.description.text : "";
      const description = `<p class="carousel__item-description">${descriptionText}</p>`;

      // Button
      let buttonHTML = "";
      if (card.buttons && card.buttons.length > 0) {
        const buttonData = card.buttons[0];
        const buttonLabel = buttonData.name || "Select";
        buttonHTML = `<button class="carousel__item-button" data-button-index="${index}">${buttonLabel}</button>`;
      }

      // Assemble content
      content.innerHTML = `
        ${imageUrl}
        ${title}
        ${description}
        ${buttonHTML}
      `;

      // Assemble wrapper and item
      wrapper.appendChild(content);
      item.appendChild(wrapper);

      this.carouselContainer.appendChild(item);
      this.items.push(item);
    });

    // Initialize Carousel Functionality
    this.initCarousel();

    // Add event listeners to carousel navigation buttons
    this.leftButton.addEventListener("click", this.moveLeft);
    this.rightButton.addEventListener("click", this.moveRight);
    window.addEventListener("resize", this.handleResize);

    // Add event listeners to carousel item buttons
    this.shadowRoot
      .querySelectorAll(".carousel__item-button")
      .forEach((button) => {
        button.addEventListener("click", this.handleButtonClick);
      });

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
