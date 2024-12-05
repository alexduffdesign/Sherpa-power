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

        const messageElement = document.createElement("div");
        messageElement.className = `message ${role}-message`;
        messageElement.textContent = message;
        this.messageContainer.appendChild(messageElement);
        this.scrollToBottom();
    }

    addCarousel(payload) {
        if (!this.messageContainer || !payload?.data) return;

        const carouselContainer = document.createElement("div");
        carouselContainer.className = "carousel-container";
        
        payload.data.forEach((item, index) => {
            const card = document.createElement("div");
            card.className = "carousel-card";
            
            if (item.image) {
                const img = document.createElement("img");
                img.src = item.image;
                img.alt = item.title || `Carousel item ${index + 1}`;
                card.appendChild(img);
            }

            if (item.title) {
                const title = document.createElement("h3");
                title.textContent = item.title;
                card.appendChild(title);
            }

            if (item.description) {
                const desc = document.createElement("p");
                desc.textContent = item.description;
                card.appendChild(desc);
            }

            carouselContainer.appendChild(card);
        });

        this.messageContainer.appendChild(carouselContainer);
        this.scrollToBottom();
    }

    addVisualImage(payload) {
        if (!this.messageContainer || !payload?.image) return;

        const imageContainer = document.createElement("div");
        imageContainer.className = "visual-image-container";

        const img = document.createElement("img");
        img.src = payload.image;
        img.alt = payload.alt || "Visual response";
        img.className = "visual-image";

        imageContainer.appendChild(img);
        this.messageContainer.appendChild(imageContainer);
        this.scrollToBottom();
    }

    addButtons(buttons) {
        if (!this.messageContainer || !buttons?.length) return;

        const buttonsContainer = document.createElement("div");
        buttonsContainer.className = "buttons-container";

        buttons.forEach(button => {
            const buttonElement = document.createElement("button");
            buttonElement.className = "chat-button";
            buttonElement.textContent = button.name;
            buttonElement.dataset.buttonData = JSON.stringify(button);
            buttonsContainer.appendChild(buttonElement);
        });

        this.messageContainer.appendChild(buttonsContainer);
        this.scrollToBottom();
    }

    removeButtons() {
        if (!this.messageContainer) return;
        
        const buttonsContainers = this.messageContainer.querySelectorAll(".buttons-container");
        buttonsContainers.forEach(container => container.remove());
    }

    showTypingIndicator(text = "Sherpa Guide Is Typing...") {
        if (this.typingIndicator) {
            this.typingIndicator.textContent = text;
            this.typingIndicator.style.display = "block";
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
