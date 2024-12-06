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
    if (!this.messageContainer || !this.rootElement) {
      console.error("Message container or root element not available");
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

      // Handle different message formats
      if (typeof message === "string") {
        contentDiv.innerHTML = this.formatMessage(message);
      } else if (message.slate) {
        // Handle slate format
        const text = message.slate.content
          .map((block) => block.children.map((child) => child.text).join(""))
          .join("\n");
        contentDiv.innerHTML = this.formatMessage(text);
      } else if (message instanceof Element) {
        contentDiv.appendChild(message);
      } else if (message.message) {
        // Handle message object with direct message property
        contentDiv.innerHTML = this.formatMessage(message.message);
      } else {
        console.error("Unsupported message format:", message);
        return null;
      }

      messageDiv.appendChild(contentDiv);
      messageWrapper.appendChild(messageDiv);
      this.messageContainer.appendChild(messageWrapper);
      this.scrollToBottom();
      return messageWrapper;
    } catch (error) {
      console.error("Error adding message:", error);
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
    if (!this.messageContainer) {
      console.error("Message container not found when adding carousel");
      return;
    }

    console.log("Adding carousel:", carouselData);
    const carouselElement = this.rootElement.ownerDocument.createElement("div");
    carouselElement.className = "carousel";
    carouselElement.innerHTML = `
      <div class="carousel__container">
        <!-- Carousel items will be dynamically added here -->
      </div>
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
      const itemContent = `
        <div class="carousel__item-wrapper">
          <div class="carousel__item-content">
            <img src="${card.imageUrl}" alt="${card.title}" class="carousel__item-image">
            <h6 class="carousel__item-title">${card.title}</h6>
            <p class="carousel__item-description">${card.description.text}</p>
            <button class="button carousel__item-button" data-button-index="${index}">${card.buttons[0].name}</button>
          </div>
        </div>
      `;

      carousel.addItem(itemContent);
    });

    const buttons = carouselElement.querySelectorAll(".carousel__item-button");
    buttons.forEach((button, index) => {
      button.addEventListener("click", () => {
        const cardIndex = Math.floor(
          index / carouselData.cards[0].buttons.length
        );
        const buttonIndex = index % carouselData.cards[0].buttons.length;
        const buttonData = carouselData.cards[cardIndex].buttons[buttonIndex];

        // Remove the carousel element
        carouselElement.remove();

        // Handle button click through the callback
        if (this.onButtonClick) {
          this.onButtonClick(buttonData);
        }
      });
    });

    this.messageContainer.appendChild(carouselElement);
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

  showTypingIndicator(message = "Sherpa Guide Is Typing...") {
    if (!this.typingIndicator) {
      console.error("Typing indicator not found");
      return;
    }

    const typingText = this.typingIndicator.querySelector("p");
    if (typingText) {
      typingText.textContent = message;
    }

    this.typingIndicator.style.display = "flex";
    this.scrollToBottom();
  }

  hideTypingIndicator() {
    if (!this.typingIndicator) {
      console.error("Typing indicator not found");
      return;
    }
    this.typingIndicator.style.display = "none";
  }

  addVisualImage(payload) {
    if (!this.messageContainer || !payload?.image) return;

    const messageDiv = this.rootElement.ownerDocument.createElement("div");
    messageDiv.className = "message";

    const contentDiv = this.rootElement.ownerDocument.createElement("div");
    contentDiv.className = "message-content assistant-message";

    const logoContainer = this.rootElement.ownerDocument.createElement("div");
    logoContainer.className = "logo-container";
    const logoBg = this.rootElement.ownerDocument.createElement("div");
    logoBg.className = "logo-background";
    logoContainer.appendChild(logoBg);
    contentDiv.appendChild(logoContainer);

    const imageContainer = this.rootElement.ownerDocument.createElement("div");
    imageContainer.className = "visual-image-container";

    const img = this.rootElement.ownerDocument.createElement("img");
    img.src = payload.image;
    img.alt = payload.alt || "Visual response";
    img.className = "visual-image";

    imageContainer.appendChild(img);
    contentDiv.appendChild(imageContainer);
    messageDiv.appendChild(contentDiv);
    this.messageContainer.appendChild(messageDiv);
    this.scrollToBottom();
  }

  scrollToBottom() {
    if (this.drawerBody) {
      setTimeout(() => {
        this.drawerBody.scrollTop = this.drawerBody.scrollHeight;
      }, 0);
    }
  }

  clearMessages() {
    if (this.messageContainer) {
      this.messageContainer.innerHTML = "";
    }
  }
}

// Carousel class for handling product carousels
export class Carousel {
  constructor(element) {
    this.element = element;
    this.container = element.querySelector(".carousel__container");
    this.leftButton = element.querySelector(".carousel__button--left");
    this.rightButton = element.querySelector(".carousel__button--right");
    this.items = [];
    this.currentIndex = 0;

    this.mediaQuery = window.matchMedia("(min-width: 1000px)");
    this.isDesktop = this.mediaQuery.matches;

    this.leftButton.addEventListener("click", () => this.move("left"));
    this.rightButton.addEventListener("click", () => this.move("right"));

    this.mediaQuery.addListener(this.handleMediaQueryChange.bind(this));
  }

  handleMediaQueryChange(e) {
    this.isDesktop = e.matches;
    this.updatePosition();
    this.updateVisibility();
  }

  addItem(content) {
    const item = this.element.ownerDocument.createElement("div");
    item.classList.add("carousel__item");
    item.appendChild(content);
    this.container.appendChild(item);
    this.items.push(item);
    this.updateVisibility();
  }

  move(direction) {
    const increment = direction === "left" ? -1 : 1;
    this.currentIndex = Math.max(
      0,
      Math.min(this.currentIndex + increment, this.items.length - 1)
    );
    this.updatePosition();
    this.updateVisibility();
  }

  updatePosition() {
    const offset = this.isDesktop ? -400 : -300; // Adjust based on item width
    this.container.style.transform = `translateX(${
      this.currentIndex * offset
    }px)`;
  }

  updateVisibility() {
    this.leftButton.style.visibility =
      this.currentIndex === 0 ? "hidden" : "visible";
    this.rightButton.style.visibility =
      this.currentIndex >= this.items.length - 1 ? "hidden" : "visible";
  }
}
