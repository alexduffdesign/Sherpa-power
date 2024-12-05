// chatbot-ui.js

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

    const messageWrapper = document.createElement("div");
    messageWrapper.classList.add("message-wrapper", `message-wrapper--${role}`);

    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", `message--${role}`);

    const contentDiv = document.createElement("div");
    contentDiv.classList.add("message__content");

    if (role === "assistant") {
      const iconSvg = document.createElement("div");
      iconSvg.classList.add("message-icon");
      iconSvg.innerHTML = `
        <svg width="30" height="20" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.8566 0.0949741C20.5706 0.0327174 20.1796 -0.00878708 19.9985 0.00158904C19.8173 0.0119652 19.4741 0.0534703 19.2357 0.105351C18.9973 0.157232 18.5492 0.333624 18.2345 0.499642C17.8817 0.676036 15.6315 2.51261 12.4183 5.23115C10.1121 7.17766 8.14608 8.8729 7.4516 9.50931C7.26478 9.68051 7.23297 9.89295 7.36802 10.1074C7.56866 10.4259 7.91296 10.9361 8.2993 11.488C9.04301 12.5394 9.45301 13.0409 9.52929 12.9925C9.59603 12.951 11.9702 10.9588 14.802 8.57226C17.6338 6.18575 20.0461 4.18316 20.1606 4.13128C20.2845 4.0794 20.561 4.0379 20.7803 4.0379C21.0091 4.0379 21.3047 4.12091 21.4478 4.22467C21.5908 4.31805 22.7826 5.9056 24.0889 7.75255C26.0721 10.523 26.4821 11.1559 26.4821 11.4361C26.4916 11.6125 26.4154 11.8719 26.32 11.986C26.2247 12.1105 25.2044 13.0029 24.0507 13.9782C22.897 14.9432 21.8387 15.794 21.6861 15.8563C21.5145 15.9289 21.3429 15.9393 21.1617 15.8667C21.0091 15.8148 20.6754 15.4516 20.3512 14.9847C20.2856 14.8902 20.2209 14.7993 20.1594 14.715C19.8981 14.3568 19.5448 14.3315 19.2009 14.6114C19.0718 14.7164 18.9276 14.8362 18.778 14.964C18.2822 15.379 17.7959 15.7837 17.6815 15.8874C17.5638 15.9806 17.5395 16.1501 17.626 16.2729C18.6307 17.6989 19.1539 18.3732 19.4264 18.6994C19.722 19.0418 20.1606 19.4153 20.4275 19.5606C20.685 19.6955 21.1617 19.8615 21.4764 19.9134C21.8673 19.986 22.2296 19.9756 22.6205 19.903C22.9352 19.8407 23.4024 19.6747 23.6693 19.5294C23.9268 19.3842 25.2617 18.3154 26.6251 17.1637C28.4653 15.5969 29.1804 14.9224 29.3997 14.5489C29.5714 14.2791 29.7811 13.7707 29.867 13.4283C29.9814 12.9925 30.0195 12.5878 29.9909 12.0794C29.9623 11.6125 29.8669 11.1455 29.7144 10.7824C29.5714 10.44 28.2174 8.44775 26.3295 5.81222C24.6038 3.3842 23.021 1.2571 22.8112 1.07033C22.6015 0.883558 22.1915 0.61378 21.9054 0.468515C21.6194 0.323249 21.1426 0.157231 20.8566 0.0949741Z" fill="white"/>
          <path d="M9.51022 0.47889C9.00487 0.219487 8.74743 0.146855 8.12767 0.126103C7.67 0.105351 7.21234 0.157231 6.9835 0.229863C6.77374 0.312872 6.44955 0.458139 6.26839 0.5619C6.08723 0.665661 4.81911 1.6929 3.45563 2.84465C2.09216 3.99639 0.890782 5.07551 0.776364 5.24153C0.661947 5.40755 0.490321 5.72921 0.385438 5.95748C0.271021 6.18576 0.137534 6.65268 0.0707907 6.99509C-0.0150223 7.44127 -0.0245558 7.79405 0.0517223 8.24023C0.0993962 8.58264 0.223347 9.07032 0.32823 9.32972C0.433112 9.58912 1.8824 11.7059 3.54145 14.0509C5.21003 16.3959 6.7642 18.5126 7.0121 18.7616C7.26001 19.0106 7.75582 19.3738 8.12767 19.5709C8.65209 19.8407 8.9572 19.9341 9.55789 19.986C10.006 20.0171 10.54 19.9964 10.8451 19.9237C11.1311 19.8615 11.5983 19.6747 11.8653 19.5191C12.1418 19.3634 14.7257 17.2571 17.6052 14.8291C20.4943 12.401 22.8494 10.357 22.8494 10.2947C22.8589 10.2221 22.3536 9.45423 21.7338 8.60339C21.4117 8.14881 21.1108 7.73759 20.8915 7.45214C20.6737 7.16862 20.3983 7.15354 20.1216 7.38003C19.3039 8.04956 17.3858 9.65415 15.1834 11.5087C11.5411 14.58 9.79626 15.9912 9.57696 16.0327C9.41487 16.0638 9.11929 16.0431 8.93813 15.9808C8.75697 15.9186 8.53767 15.8044 8.45185 15.7318C8.36604 15.6592 7.27908 14.1857 6.03956 12.4426C4.7905 10.6994 3.70354 9.14295 3.62726 8.96655C3.50331 8.71753 3.49377 8.59301 3.57959 8.34399C3.65587 8.11571 4.3233 7.49315 5.98235 6.09237C7.79396 4.54633 8.3279 4.14166 8.55674 4.14166C8.70929 4.14166 8.91906 4.18316 9.00487 4.23504C9.10022 4.28692 9.41487 4.66047 9.70091 5.06514C9.98695 5.48018 10.2825 5.79146 10.3397 5.78109C10.4065 5.76033 10.9118 5.37642 11.4553 4.91987C11.7575 4.67041 12.0283 4.42714 12.2134 4.24762C12.3954 4.0712 12.4181 3.84719 12.2814 3.63385C12.1117 3.3692 11.8416 2.97785 11.5411 2.56449C11.0358 1.85891 10.5114 1.18447 10.3683 1.04958C10.2349 0.914687 9.85347 0.66566 9.51022 0.47889Z" fill="white"/>
          <path d="M9.51022 0.47889C9.00487 0.219487 8.74743 0.146855 8.12767 0.126103C7.67 0.105351 7.21234 0.157231 6.9835 0.229863C6.77374 0.312872 6.44955 0.458139 6.26839 0.5619C6.08723 0.665661 4.81911 1.6929 3.45563 2.84465C2.09216 3.99639 0.890782 5.07551 0.776364 5.24153C0.661947 5.40755 0.490321 5.72921 0.385438 5.95748C0.271021 6.18576 0.137534 6.65268 0.0707907 6.99509C-0.0150223 7.44127 -0.0245558 7.79405 0.0517223 8.24023C0.0993962 8.58264 0.223347 9.07032 0.32823 9.32972C0.433112 9.58912 1.8824 11.7059 3.54145 14.0509C5.21003 16.3959 6.7642 18.5126 7.0121 18.7616C7.26001 19.0106 7.75582 19.3738 8.12767 19.5709C8.65209 19.8407 8.9572 19.9341 9.55789 19.986C10.006 20.0171 10.54 19.9964 10.8451 19.9237C11.1311 19.8615 11.5983 19.6747 11.8653 19.5191C12.1418 19.3634 14.7257 17.2571 17.6052 14.8291C20.4943 12.401 22.8494 10.357 22.8494 10.2947C22.8589 10.2221 22.3536 9.45423 21.7338 8.60339C21.4117 8.14881 21.1108 7.73759 20.8915 7.45214C20.6737 7.16862 20.3983 7.15354 20.1216 7.38003C19.3039 8.04956 17.3858 9.65415 15.1834 11.5087C11.5411 14.58 9.79626 15.9912 9.57696 16.0327C9.41487 16.0638 9.11929 16.0431 8.93813 15.9808C8.75697 15.9186 8.53767 15.8044 8.45185 15.7318C8.36604 15.6592 7.27908 14.1857 6.03956 12.4426C4.7905 10.6994 3.70354 9.14295 3.62726 8.96655C3.50331 8.71753 3.49377 8.59301 3.57959 8.34399C3.65587 8.11571 4.3233 7.49315 5.98235 6.09237C7.79396 4.54633 8.3279 4.14166 8.55674 4.14166C8.70929 4.14166 8.91906 4.18316 9.00487 4.23504C9.10022 4.28692 9.41487 4.66047 9.70091 5.06514C9.98695 5.48018 10.2825 5.79146 10.3397 5.78109C10.4065 5.76033 10.9118 5.37642 11.4553 4.91987C11.7575 4.67041 12.0283 4.42714 12.2134 4.24762C12.3954 4.0712 12.4181 3.84719 12.2814 3.63385C12.1117 3.3692 11.8416 2.97785 11.5411 2.56449C11.0358 1.85891 10.5114 1.18447 10.3683 1.04958C10.2349 0.914687 9.85347 0.66566 9.51022 0.47889Z" fill="white"/>
        </svg>
      `;
      messageWrapper.appendChild(iconSvg);
    }

    contentDiv.innerHTML = this.markdownToHtml(message);
    messageDiv.appendChild(contentDiv);
    messageWrapper.appendChild(messageDiv);
    this.messageContainer.appendChild(messageWrapper);
    this.scrollToBottom();
  }

  markdownToHtml(markdown) {
    const escapeHtml = (str) =>
      str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    let html = escapeHtml(markdown);

    // Headers
    html = html.replace(/^###### (.*)$/gm, '<h6 class="h6">$1</h6>');
    html = html.replace(/^##### (.*)$/gm, '<h6 class="h6">$1</h6>');
    html = html.replace(/^#### (.*)$/gm, '<h6 class="h6">$1</h6>');
    html = html.replace(/^### (.*)$/gm, '<h6 class="h6">$1</h6>');
    html = html.replace(/^## (.*)$/gm, '<h6 class="h5">$1</h6>');
    html = html.replace(/^# (.*)$/gm, '<h6 class="h4">$1</h6>');

    // Bold and Italic
    html = html.replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>");
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");

    // Inline Code
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

    // Lists
    let inList = false;
    html = html
      .split("\n")
      .map((line) => {
        if (line.match(/^\s*[-*+]\s/)) {
          if (!inList) {
            inList = true;
            return "<ul>\n<li>" + line.replace(/^\s*[-*+]\s/, "") + "</li>";
          }
          return "<li>" + line.replace(/^\s*[-*+]\s/, "") + "</li>";
        } else if (line.match(/^\s*\d+\.\s/)) {
          if (!inList) {
            inList = true;
            return "<ol>\n<li>" + line.replace(/^\s*\d+\.\s/, "") + "</li>";
          }
          return "<li>" + line.replace(/^\s*\d+\.\s/, "") + "</li>";
        } else if (inList && line.trim() === "") {
          inList = false;
          return "</ul>\n";
        } else {
          return line;
        }
      })
      .join("\n");

    if (inList) {
      html += "\n</ul>";
    }

    // Links
    html = html.replace(
      /\[(.*?)\]\((.*?)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    // Split content into paragraphs
    const paragraphs = html.split(/\n{2,}/);
    html = paragraphs
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

    return html;
  }

  addCarousel(carouselData) {
    if (!this.messageContainer || !carouselData?.cards) return;

    const carouselElement = document.createElement("div");
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
      button.addEventListener("click", async () => {
        const cardIndex = Math.floor(
          index / carouselData.cards[0].buttons.length
        );
        const buttonIndex = index % carouselData.cards[0].buttons.length;
        const buttonData = carouselData.cards[cardIndex].buttons[buttonIndex];
        try {
          // Remove the carousel element
          carouselElement.remove();

          // Save button click as a message
          this.conversationHistory.push({
            type: "user",
            message: buttonData.name,
          });
          this.saveConversationToStorage();

          const response = await this.core.handleButtonClick(buttonData);
          await this.handleAgentResponse(response);
        } catch (error) {
          console.error("Error handling carousel button click:", error);
        }
      });
    });

    const messageContainer = this.element.querySelector("#messageContainer");
    if (messageContainer) {
      messageContainer.appendChild(carouselElement);
      this.scrollToBottom();
    } else {
      console.error("Message container not found when adding carousel");
    }
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

    this.leftButton.addEventListener("click", () => this.move("left"));
    this.rightButton.addEventListener("click", () => this.move("right"));

    this.mediaQuery.addListener(this.handleMediaQueryChange.bind(this));
  }

  handleMediaQueryChange(e) {
    this.isDesktop = e.matches;
    this.currentIndex = 0;
    this.updatePosition();
    this.updateVisibility();
  }

  addItem(content) {
    const item = document.createElement("div");
    item.className = "carousel__item";
    item.innerHTML = content;
    this.container.appendChild(item);
    this.items.push(item);
    this.updateVisibility();
  }

  move(direction) {
    const itemsPerSlide = this.isDesktop ? 2 : 1;
    if (direction === "left") {
      this.currentIndex = Math.max(0, this.currentIndex - itemsPerSlide);
    } else {
      this.currentIndex = Math.min(
        this.items.length - itemsPerSlide,
        this.currentIndex + itemsPerSlide
      );
    }
    this.updatePosition();
    this.updateVisibility();
  }

  updatePosition() {
    const itemsPerSlide = this.isDesktop ? 2 : 1;
    const offset = -(this.currentIndex / itemsPerSlide) * 100;
    this.container.style.transform = `translateX(${offset}%)`;
  }

  updateVisibility() {
    const itemsPerSlide = this.isDesktop ? 2 : 1;
    this.leftButton.style.display = this.currentIndex === 0 ? "none" : "flex";
    this.rightButton.style.display =
      this.currentIndex >= this.items.length - itemsPerSlide ? "none" : "flex";
  }
}
