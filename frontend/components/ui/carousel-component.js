// /assets/scripts/chatbot/components/carousel-component.js

import eventBus from "../../utils/event-bus.js";

export class CarouselComponent extends HTMLElement {
  constructor() {
    super();
    // Attach Shadow DOM to encapsulate styles
    this.attachShadow({ mode: "open" });
    this.currentIndex = 0;
    this.isDesktop = window.matchMedia("(min-width: 1000px)").matches;
    this.itemsPerSlide = this.isDesktop ? 2 : 1;

    // Bind methods
    this.moveLeft = this.moveLeft.bind(this);
    this.moveRight = this.moveRight.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  connectedCallback() {
    const carouselData = JSON.parse(this.getAttribute("data-carousel"));
    this.renderCarousel(carouselData);
  }

  /**
   * Renders the carousel with embedded styles and initializes functionality.
   * @param {Object} carouselData - Data for the carousel
   */
  renderCarousel(carouselData) {
    this.carouselData = carouselData;
    this.shadowRoot.innerHTML = `
      <style>
        .carousel {
          position: relative;
          overflow: hidden;
          width: 100%;
          margin-bottom: var(--spacing-6);
        }

        .carousel__container {
          display: flex;
          transition: transform 0.3s ease-in-out;
        }

        .carousel__item {
          min-width: 100%;
          box-sizing: border-box;
          padding: var(--spacing-2);
        }

        .carousel__item-image {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
        }

        .carousel__item-title {
          margin: var(--spacing-2) 0 0 0;
          font-size: 16px;
          color: #231F25;
        }

        .carousel__item-description {
          margin: var(--spacing-1) 0 0 0;
          font-size: 14px;
          color: #231F25;
        }

        .carousel__item-button {
          margin-top: var(--spacing-2);
          padding: var(--spacing-3);
          background-color: #007BFF;
          border: none;
          border-radius: var(--rounded);
          color: white;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.3s ease;
        }

        .carousel__item-button:hover {
          background-color: #0056b3;
        }

        .carousel__button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background-color: rgba(0, 0, 0, 0.5);
          border: none;
          color: white;
          padding: 10px;
          cursor: pointer;
          border-radius: 50%;
          font-size: 18px;
          transition: background-color 0.3s ease;
        }

        .carousel__button:hover {
          background-color: rgba(0, 0, 0, 0.7);
        }

        .carousel__button:disabled {
          background-color: rgba(0, 0, 0, 0.2);
          cursor: not-allowed;
        }

        /* Responsive adjustments */
        @media (min-width: 1000px) {
          .carousel__item {
            min-width: 50%;
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
      item.innerHTML = `
        <img src="${card.imageUrl}" alt="${card.title}" class="carousel__item-image">
        <h6 class="carousel__item-title">${card.title}</h6>
        <p class="carousel__item-description">${card.description.text}</p>
        <button class="carousel__item-button" data-button-index="${index}">${card.buttons[0].name}</button>
      `;
      this.carouselContainer.appendChild(item);
      this.items.push(item);
    });

    // Initialize Carousel Functionality
    this.initCarousel();

    // Add event listeners to carousel buttons
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
  handleResize(e) {
    const newIsDesktop = e.matches;
    if (newIsDesktop !== this.isDesktop) {
      this.isDesktop = newIsDesktop;
      this.itemsPerSlide = this.isDesktop ? 2 : 1;
      this.currentIndex = 0;
      this.updatePosition();
      this.updateVisibility();
    }
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

    // Emit event with button payload
    const payload = card.buttons[0].request;
    eventBus.emit("carouselButtonClicked", payload);

    // Remove the carousel from the UI
    this.remove();
  }
}
