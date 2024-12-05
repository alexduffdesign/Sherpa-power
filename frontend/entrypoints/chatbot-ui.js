export class UIManager {
  constructor() {
    this.messageContainer = null;
    this.typingIndicator = null;
    this.drawerBody = null;
  }

  setDOMElements(messageContainer, typingIndicator, drawerBody) {
    this.messageContainer = messageContainer;
    this.typingIndicator = typingIndicator;
    this.drawerBody = drawerBody;
  }

  addMessage(role, message) {
    if (!this.messageContainer) return;

    const messageDiv = document.createElement("div");
    messageDiv.className = "message";

    const contentDiv = document.createElement("div");
    contentDiv.className = `message-content ${role}-message`;

    // For assistant messages, add the logo
    if (role === "assistant") {
      const logoContainer = document.createElement("div");
      logoContainer.className = "logo-container";
      const logoBg = document.createElement("div");
      logoBg.className = "logo-background";
      logoContainer.appendChild(logoBg);
      contentDiv.appendChild(logoContainer);
    }

    const textDiv = document.createElement("div");
    textDiv.className = "message-text";
    textDiv.innerHTML = message; // Use innerHTML to support HTML in messages

    contentDiv.appendChild(textDiv);
    messageDiv.appendChild(contentDiv);
    this.messageContainer.appendChild(messageDiv);
    this.scrollToBottom();
  }

  addCarousel(payload) {
    if (!this.messageContainer || !payload?.data) return;

    const messageDiv = document.createElement("div");
    messageDiv.className = "message";

    const contentDiv = document.createElement("div");
    contentDiv.className = "message-content assistant-message";

    const logoContainer = document.createElement("div");
    logoContainer.className = "logo-container";
    const logoBg = document.createElement("div");
    logoBg.className = "logo-background";
    logoContainer.appendChild(logoBg);
    contentDiv.appendChild(logoContainer);

    const carouselContainer = document.createElement("div");
    carouselContainer.className = "carousel-container";

    payload.data.forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "carousel-card";

      if (item.image) {
        const img = document.createElement("img");
        img.src = item.image;
        img.alt = item.title || `Carousel item ${index + 1}`;
        img.className = "carousel-image";
        card.appendChild(img);
      }

      const cardContent = document.createElement("div");
      cardContent.className = "carousel-card-content";

      if (item.title) {
        const title = document.createElement("h3");
        title.className = "carousel-title";
        title.textContent = item.title;
        cardContent.appendChild(title);
      }

      if (item.description) {
        const desc = document.createElement("p");
        desc.className = "carousel-description";
        desc.textContent = item.description;
        cardContent.appendChild(desc);
      }

      card.appendChild(cardContent);
      carouselContainer.appendChild(card);
    });

    contentDiv.appendChild(carouselContainer);
    messageDiv.appendChild(contentDiv);
    this.messageContainer.appendChild(messageDiv);
    this.scrollToBottom();
  }

  addButtons(buttons) {
    if (!this.messageContainer || !buttons?.length) return;

    const messageDiv = document.createElement("div");
    messageDiv.className = "message";

    const contentDiv = document.createElement("div");
    contentDiv.className = "message-content assistant-message";

    const logoContainer = document.createElement("div");
    logoContainer.className = "logo-container";
    const logoBg = document.createElement("div");
    logoBg.className = "logo-background";
    logoContainer.appendChild(logoBg);
    contentDiv.appendChild(logoContainer);

    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "buttons-container";

    buttons.forEach((button) => {
      const buttonElement = document.createElement("button");
      buttonElement.className = "chat-button";
      buttonElement.textContent = button.name;
      buttonElement.dataset.buttonData = JSON.stringify(button);
      buttonsContainer.appendChild(buttonElement);
    });

    contentDiv.appendChild(buttonsContainer);
    messageDiv.appendChild(contentDiv);
    this.messageContainer.appendChild(messageDiv);
    this.scrollToBottom();
  }

  addVisualImage(payload) {
    if (!this.messageContainer || !payload?.image) return;

    const messageDiv = document.createElement("div");
    messageDiv.className = "message";

    const contentDiv = document.createElement("div");
    contentDiv.className = "message-content assistant-message";

    const logoContainer = document.createElement("div");
    logoContainer.className = "logo-container";
    const logoBg = document.createElement("div");
    logoBg.className = "logo-background";
    logoContainer.appendChild(logoBg);
    contentDiv.appendChild(logoContainer);

    const imageContainer = document.createElement("div");
    imageContainer.className = "visual-image-container";

    const img = document.createElement("img");
    img.src = payload.image;
    img.alt = payload.alt || "Visual response";
    img.className = "visual-image";

    imageContainer.appendChild(img);
    contentDiv.appendChild(imageContainer);
    messageDiv.appendChild(contentDiv);
    this.messageContainer.appendChild(messageDiv);
    this.scrollToBottom();
  }

  removeButtons() {
    if (!this.messageContainer) return;
    const buttonsContainers =
      this.messageContainer.querySelectorAll(".buttons-container");
    buttonsContainers.forEach((container) => {
      const message = container.closest(".message");
      if (message) message.remove();
    });
  }

  showTypingIndicator(text = "Sherpa Guide Is Typing...") {
    if (this.typingIndicator) {
      const logoContainer =
        this.typingIndicator.querySelector(".logo-container");
      if (!logoContainer) {
        const newLogoContainer = document.createElement("div");
        newLogoContainer.className = "logo-container";
        const logoBg = document.createElement("div");
        logoBg.className = "logo-background";
        newLogoContainer.appendChild(logoBg);
        this.typingIndicator.insertBefore(
          newLogoContainer,
          this.typingIndicator.firstChild
        );
      }
      this.typingIndicator.style.display = "flex";
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
      this.drawerBody.scrollTop = this.drawerBody.scrollHeight;
    }
  }
}
