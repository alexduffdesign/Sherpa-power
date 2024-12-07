// chatbot-ui.js

export class UIManager {
  constructor(rootElement) {
    this.messageContainer = null;
    this.typingIndicator = null;
    this.drawerBody = null;
    this.onButtonClick = null; // Callback for button clicks
    this.rootElement = rootElement; // Store reference to the root web component
  }

  setDOMElements(messageContainer, typingIndicator, drawerBody) {
    console.log("Setting DOM elements in UIManager");
    this.messageContainer = messageContainer;
    this.typingIndicator = typingIndicator;
    this.drawerBody = drawerBody;
  }

  setButtonClickHandler(callback) {
    this.onButtonClick = callback;
  }

  addMessage(role, message) {
    console.log("[UI] Adding message:", { role, message });
    console.log("[UI] Current state:", {
      messageContainer: this.messageContainer,
      rootElement: this.rootElement,
      containerChildren: this.messageContainer?.children.length,
    });

    if (!this.messageContainer || !this.rootElement) {
      console.error("[UI] Message container or root element not available", {
        messageContainer: this.messageContainer,
        rootElement: this.rootElement,
      });
      return null;
    }

    // Hide typing indicator when adding a message
    this.hideTypingIndicator();

    try {
      const doc = this.rootElement.ownerDocument;
      const messageWrapper = doc.createElement("div");
      messageWrapper.classList.add(
        "message-wrapper",
        `message-wrapper--${role}`
      );

      const messageDiv = doc.createElement("div");
      messageDiv.classList.add("message", `message--${role}`);

      const contentDiv = doc.createElement("div");
      contentDiv.classList.add("message__content");

      console.log("[UI] Processing message format:", typeof message, message);

      if (typeof message === "string") {
        console.log("[UI] Adding string message");
        contentDiv.innerHTML = this.formatMessage(message);
      } else if (message.slate) {
        console.log("[UI] Adding slate message:", message.slate);
        const text = message.slate.content
          .map((block) => block.children.map((child) => child.text).join(""))
          .join("\n");
        console.log("[UI] Extracted slate text:", text);
        contentDiv.innerHTML = this.formatMessage(text);
      } else if (message instanceof Element) {
        console.log("[UI] Adding Element message");
        contentDiv.appendChild(message);
      } else if (message.message) {
        console.log("[UI] Adding message object:", message.message);
        contentDiv.innerHTML = this.formatMessage(message.message);
      } else {
        console.error("[UI] Unsupported message format:", message);
        return null;
      }

      messageDiv.appendChild(contentDiv);
      messageWrapper.appendChild(messageDiv);
      this.messageContainer.appendChild(messageWrapper);

      console.log("[UI] Message added successfully");
      this.scrollToBottom();
      return messageWrapper;
    } catch (error) {
      console.error("[UI] Error adding message:", error);
      console.error("[UI] Message that caused error:", message);
      return null;
    }
  }

  formatMessage(message) {
    // Replace newlines with <br>
    message = message.replace(/\n/g, "<br>");

    // Create links
    message = message.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    // Split content into paragraphs
    const paragraphs = message.split(/\n{2,}/);
    message = paragraphs
      .map((para) => {
        if (
          para.startsWith("<h") ||
          para.startsWith("<ul") ||
          para.startsWith("<ol") ||
          para.startsWith("<blockquote") ||
          para.startsWith("<hr") ||
          para.startsWith("<img")
        ) {
          return para;
        }
        return `<p>${para}</p>`;
      })
      .join("\n");

    return message;
  }

  addCarousel(carouselData) {
    if (!this.messageContainer || !this.rootElement) {
      console.error("[UI] Message container not available for carousel");
      return;
    }

    const doc = this.rootElement.ownerDocument;
    const carouselContainer = doc.createElement("div");
    carouselContainer.classList.add("carousel-container");

    const carouselElement = doc.createElement("div");
    carouselElement.classList.add("carousel");
    carouselElement.innerHTML = `
      <div class="carousel__container"></div>
      <button class="carousel__button carousel__button--left" aria-label="Previous slide">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <button class="carousel__button carousel__button--right" aria-label="Next slide">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    `;

    const carousel = new Carousel(carouselElement);

    carouselData.cards.forEach((card, index) => {
      // Create DOM element for the item
      const itemElement = doc.createElement("div");
      itemElement.classList.add("carousel__item-wrapper");
      itemElement.innerHTML = `
        <div class="carousel__item-content">
          <img src="${card.imageUrl}" alt="${card.title}" class="carousel__item-image">
          <h6 class="carousel__item-title">${card.title}</h6>
          <p class="carousel__item-description">${card.description.text}</p>
          <button class="button carousel__item-button" data-button-index="${index}">${card.buttons[0].name}</button>
        </div>
      `;

      carousel.addItem(itemElement);
    });

    carouselContainer.appendChild(carouselElement);
    this.messageContainer.appendChild(carouselContainer);

    const buttons = carouselElement.querySelectorAll(".carousel__item-button");
    buttons.forEach((button, index) => {
      button.addEventListener("click", () => {
        if (this.onButtonClick) {
          const cardIndex = parseInt(
            button.getAttribute("data-button-index"),
            10
          );
          const card = carouselData.cards[cardIndex];
          // Remove the carousel container when a button is clicked
          carouselContainer.remove();
          this.onButtonClick(card.buttons[0]);
        }
      });
    });

    this.scrollToBottom();
  }

  addButtons(buttons) {
    if (!this.messageContainer || !buttons?.length) return;

    const doc = this.rootElement.ownerDocument;
    const buttonsWrapper = doc.createElement("div");
    buttonsWrapper.classList.add("buttons-wrapper");

    buttons.forEach((button) => {
      const buttonElement = doc.createElement("button");
      buttonElement.classList.add("chat-button");
      buttonElement.textContent = button.name;
      buttonElement.addEventListener("click", () => {
        if (this.onButtonClick) {
          this.onButtonClick(button);
        }
      });
      buttonsWrapper.appendChild(buttonElement);
    });

    this.addMessage("assistant", buttonsWrapper);
  }

  showTypingIndicator(customText = null) {
    if (this.typingIndicator) {
      this.typingIndicator.style.display = "flex";
      if (customText) {
        const textElement = this.typingIndicator.querySelector("p");
        if (textElement) {
          textElement.textContent = customText;
        }
      }
      this.scrollToBottom();
    }
  }

  hideTypingIndicator() {
    if (this.typingIndicator) {
      this.typingIndicator.style.display = "none";
    }
  }

  scrollToBottom() {
    if (this.drawerBody) {
      setTimeout(() => {
        this.drawerBody.scrollTop = this.drawerBody.scrollHeight;
      }, 100);
    }
  }

  addVisualImage(payload) {
    if (!this.messageContainer) return;

    const doc = this.rootElement.ownerDocument;
    const imageWrapper = doc.createElement("div");
    imageWrapper.classList.add("image-wrapper");

    const img = doc.createElement("img");
    img.src = payload.image;
    img.alt = payload.alt || "Visual content";
    img.classList.add("chat-image");

    if (payload.dimensions) {
      img.width = payload.dimensions.width;
      img.height = payload.dimensions.height;
    }

    imageWrapper.appendChild(img);
    this.addMessage("assistant", imageWrapper);
  }
}

class Carousel {
  constructor(element) {
    this.element = element;
    this.container = element.querySelector(".carousel__container");
    this.leftButton = element.querySelector(".carousel__button--left");
    this.rightButton = element.querySelector(".carousel__button--right");
    this.items = [];
    this.currentIndex = 0;

    this.mediaQuery = window.matchMedia("(min-width: 1000px)");
    this.isDesktop = this.mediaQuery.matches;

    this.setupEventListeners();
    this.updateVisibility();
  }

  setupEventListeners() {
    this.leftButton.addEventListener("click", () => this.move("left"));
    this.rightButton.addEventListener("click", () => this.move("right"));
    this.mediaQuery.addEventListener("change", (e) =>
      this.handleMediaQueryChange(e)
    );
  }

  handleMediaQueryChange(e) {
    this.isDesktop = e.matches;
    this.updateVisibility();
    this.updatePosition();
  }

  addItem(element) {
    if (!(element instanceof Element)) {
      console.error("[Carousel] Content must be a DOM element");
      return null;
    }

    this.items.push(element);
    this.container.appendChild(element);
    this.updateVisibility();
    return element;
  }

  move(direction) {
    const increment = direction === "left" ? -1 : 1;
    const itemsPerPage = this.isDesktop ? 2 : 1;
    const maxIndex = Math.max(0, this.items.length - itemsPerPage);

    this.currentIndex = Math.max(
      0,
      Math.min(this.currentIndex + increment, maxIndex)
    );
    this.updatePosition();
    this.updateVisibility();
  }

  updatePosition() {
    const itemWidth = this.items[0]?.offsetWidth || 0;
    const translateX = -this.currentIndex * itemWidth;
    this.container.style.transform = `translateX(${translateX}px)`;
  }

  updateVisibility() {
    const itemsPerPage = this.isDesktop ? 2 : 1;

    // Update navigation buttons visibility
    this.leftButton.style.display = this.currentIndex > 0 ? "flex" : "none";
    this.rightButton.style.display =
      this.currentIndex < this.items.length - itemsPerPage ? "flex" : "none";

    // Update items visibility and animation
    this.items.forEach((item, index) => {
      const isVisible =
        index >= this.currentIndex && index < this.currentIndex + itemsPerPage;

      item.style.opacity = isVisible ? "1" : "0";
      item.style.pointerEvents = isVisible ? "auto" : "none";
    });
  }
}
