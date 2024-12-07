// chatbot-core-file.js

import EventEmitter from "eventemitter3";

export class ChatbotCore extends EventEmitter {
  constructor(config) {
    super();
    console.log("ChatbotCore constructor called with config:", config);
    this.apiEndpoint = config.proxyEndpoint; // URL to Gadget's streaming endpoint
    this.environment = config.environment || "development";
    this.userIDPrefix = config.userIDPrefix || "chatbot";
    this.userID = this.loadUserID();
    this.messageContainer = null;
    this.typingIndicator = null;
    this.drawerBody = null;
    this.defaultTypingText = "Sherpa Guide Is Typing...";
    this.conversationHistory = [];
    this.eventListenersAttached = false;
    this.useStreaming = true; // Enable streaming by default

    // Bind methods
    this.sendMessage = this.sendMessage.bind(this);
    this.handleStreaming = this.handleStreaming.bind(this);
    this.gadgetInteract = this.gadgetInteract.bind(this);
    this.addMessage = this.addMessage.bind(this);
    this.updateLatestMessage = this.updateLatestMessage.bind(this);
    this.parseSSE = this.parseSSE.bind(this);
    this.handleTrace = this.handleTrace.bind(this);

    console.log("ChatbotCore instance created:", this);
  }

  loadUserID() {
    // Generate or retrieve a unique user ID
    let userID = localStorage.getItem("chatbotUserID");
    if (!userID) {
      userID = `user_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("chatbotUserID", userID);
    }
    return userID;
  }

  setDOMElements(messageContainer, typingIndicator, drawerBody) {
    this.messageContainer = messageContainer;
    this.typingIndicator = typingIndicator;
    this.drawerBody = drawerBody;

    // Setup event listeners once DOM elements are set
    this.setupEventListeners();
  }

  setupEventListeners() {
    if (this.eventListenersAttached) return;

    // Handle button clicks within messages
    this.messageContainer.addEventListener("click", async (e) => {
      const buttonElement = e.target.closest(".button");
      if (buttonElement) {
        const buttonData = JSON.parse(buttonElement.dataset.buttonData);
        await this.handleButtonClick(buttonData);
      }
    });

    this.eventListenersAttached = true;
  }

  addMessage(sender, content) {
    if (!this.messageContainer) {
      console.error("Message container not set");
      return;
    }

    const messageWrapper = document.createElement("div");
    messageWrapper.classList.add(
      "message-wrapper",
      `message-wrapper--${sender}`
    );

    // Optionally add an icon for the assistant
    if (sender === "assistant") {
      const iconSvg = document.createElement("div");
      iconSvg.classList.add("assistant-icon");
      iconSvg.innerHTML = `🚀`; // 🚀 Emoji as a placeholder for SVG
      messageWrapper.appendChild(iconSvg);
    }

    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", `message--${sender}`);
    messageDiv.innerHTML = `<div class="message__content">${this.markdownToHtml(
      content
    )}</div>`;

    messageWrapper.appendChild(messageDiv);
    this.messageContainer.appendChild(messageWrapper);
    this.scrollToBottom();
  }

  updateLatestMessage(content) {
    const lastAssistantMessage = this.messageContainer.querySelector(
      ".message-wrapper--assistant:last-child .message__content"
    );
    if (lastAssistantMessage) {
      lastAssistantMessage.innerHTML += this.markdownToHtml(content);
    } else {
      // If no previous message, add a new one
      this.addMessage("assistant", content);
    }
  }

  scrollToBottom() {
    if (this.messageContainer) {
      this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
    }
  }

  showTypingIndicator(text = this.defaultTypingText) {
    if (this.typingIndicator) {
      this.typingIndicator.innerText = text;
      this.typingIndicator.style.display = "block";
      this.scrollToBottom();
    }
  }

  hideTypingIndicator() {
    if (this.typingIndicator) {
      this.typingIndicator.style.display = "none";
    }
  }

  markdownToHtml(markdown) {
    // Escape HTML to prevent XSS
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
    html = html.replace(/^## (.*)$/gm, '<h5 class="h5">$1</h5>');
    html = html.replace(/^# (.*)$/gm, '<h4 class="h4">$1</h4>');

    // Bold and Italic
    html = html.replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>"); // Bold Italic
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"); // Bold
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>"); // Italic

    // Inline Code
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

    // Images
    html = html.replace(
      /!\[(.*?)\]\((.*?)\)/g,
      '<img src="$2" alt="$1" class="markdown-image">'
    );

    // Links
    html = html.replace(
      /\[(.*?)\]\((.*?)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );

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

    // Horizontal Rule
    html = html.replace(/^---$/gm, "<hr>");

    // Blockquotes
    html = html.replace(/^>\s(.*)$/gm, "<blockquote>$1</blockquote>");

    // Remove excessive asterisks (more than 3)
    html = html.replace(/\*{4,}/g, "");

    // Split content into paragraphs
    const paragraphs = html.split(/\n{2,}/);

    // Wrap each paragraph with <p> tags, handling special cases
    html = paragraphs
      .map((para) => {
        // Don't wrap headers, lists, blockquotes, horizontal rules, or images in <p> tags
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

  async sendMessage(message) {
    console.log("sendMessage called with:", message);
    this.addMessage("user", message);
    this.conversationHistory.push({ type: "user", message });
    this.saveConversationToStorage();

    try {
      await this.handleStreaming({
        action: {
          type: "text",
          payload: message,
        },
        config: {
          completion_events: true,
        },
      });
    } catch (error) {
      console.error("Error sending message:", error);
      this.addMessage(
        "assistant",
        "Sorry, something went wrong. Please try again."
      );
    }
  }

  async sendLaunch() {
    console.log("Sending chatbot launch request");

    try {
      await this.handleStreaming({
        action: {
          type: "launch",
        },
        config: {
          completion_events: true,
        },
      });
    } catch (error) {
      console.error("Error during launch:", error);
      this.addMessage(
        "assistant",
        "Failed to initialize the chatbot. Please try again later."
      );
    }
  }

  async handleStreaming(payload) {
    console.log("Handling streaming interaction with payload:", payload);

    try {
      const response = await fetch(this.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: this.userID,
          action: payload.action,
          config: payload.config,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Gadget Streaming API error:", errorText);
        throw new Error(
          `Gadget Streaming API error: ${response.status} - ${errorText}`
        );
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let boundary = buffer.indexOf("\n\n");
        while (boundary !== -1) {
          const eventStr = buffer.substring(0, boundary);
          buffer = buffer.substring(boundary + 2);
          this.parseSSE(eventStr);
          boundary = buffer.indexOf("\n\n");
        }
      }
    } catch (streamError) {
      console.error("Error during stream processing:", streamError);
      this.addMessage(
        "assistant",
        "An error occurred while processing your request."
      );
      this.hideTypingIndicator();
    }
  }

  parseSSE(eventStr) {
    const lines = eventStr.split("\n");
    let eventType = null;
    let data = null;

    lines.forEach((line) => {
      if (line.startsWith("event:")) {
        eventType = line.replace("event:", "").trim();
      } else if (line.startsWith("data:")) {
        data = line.replace("data:", "").trim();
      }
    });

    if (eventType === "trace" && data) {
      try {
        const trace = JSON.parse(data);
        this.handleTrace(trace);
      } catch (error) {
        console.error("Error parsing trace data:", error);
      }
    } else if (eventType === "end") {
      console.log("Stream ended");
      this.hideTypingIndicator();
    }
  }

  handleTrace(trace) {
    console.log("Handling trace:", trace);
    if (trace.type === "text") {
      this.addMessage("assistant", trace.payload.message);
      this.conversationHistory.push({
        type: "assistant",
        message: trace.payload.message,
      });
    } else if (trace.type === "completion") {
      if (trace.payload.state === "start") {
        this.showTypingIndicator("Sherpa Guide is typing...");
      } else if (trace.payload.state === "content") {
        this.updateLatestMessage(trace.payload.content);
        // Append to the last assistant message
        const lastMessage =
          this.conversationHistory[this.conversationHistory.length - 1];
        if (lastMessage && lastMessage.type === "assistant") {
          lastMessage.message += trace.payload.content;
        }
      } else if (trace.payload.state === "end") {
        this.hideTypingIndicator();
      }
    } else if (trace.type === "choice") {
      this.addButtons(trace.payload.buttons);
      this.conversationHistory.push({
        type: "choice",
        buttons: trace.payload.buttons,
      });
    } else if (trace.type === "carousel") {
      this.addCarousel(trace.payload);
      this.conversationHistory.push({ type: "carousel", data: trace.payload });
    } else if (
      trace.type === "visual" &&
      trace.payload.visualType === "image"
    ) {
      this.addVisualImage(trace.payload);
      this.conversationHistory.push({ type: "visual", data: trace.payload });
    } else if (trace.type === "error") {
      this.addMessage(
        "assistant",
        "An error occurred: " + trace.payload.message
      );
    } else {
      console.log("Unknown trace type:", trace.type);
    }
    this.saveConversationToStorage();
  }

  addButtons(buttons) {
    console.log("Adding buttons:", buttons);
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    buttons.forEach((button) => {
      const buttonElement = document.createElement("button");
      buttonElement.classList.add("button");
      buttonElement.textContent = button.name;
      buttonElement.dataset.buttonData = JSON.stringify(button);
      buttonContainer.appendChild(buttonElement);
    });

    if (this.messageContainer) {
      this.messageContainer.appendChild(buttonContainer);
      this.scrollToBottom();
    } else {
      console.error("Message container not found when adding buttons");
    }

    this.conversationHistory.push({ type: "buttons", buttons });
    this.saveConversationToStorage();
  }

  removeButtons() {
    const buttonContainers =
      this.messageContainer.querySelectorAll(".button-container");
    buttonContainers.forEach((container) => container.remove());
  }

  async handleButtonClick(button) {
    console.log("Button clicked:", button);
    this.removeButtons();
    this.addMessage("user", button.name);
    this.conversationHistory.push({ type: "user", message: button.name });
    this.saveConversationToStorage();

    this.showTypingIndicator();
    try {
      await this.handleStreaming({
        action: {
          type: "button_click",
          payload: button.request,
        },
        config: {
          completion_events: true,
        },
      });
    } catch (error) {
      console.error("Error handling button click:", error);
      this.addMessage(
        "assistant",
        "Sorry, something went wrong. Please try again."
      );
    }
  }

  addVisualImage(payload) {
    console.log("Adding visual image:", payload);
    if (!this.messageContainer) {
      console.error("Message container not set");
      return;
    }

    const imageWrapper = document.createElement("div");
    imageWrapper.classList.add("message-wrapper", "message-wrapper--assistant");

    const imageElement = document.createElement("img");
    imageElement.src = payload.image;
    imageElement.alt = "Visual content";
    imageElement.classList.add("chat-image");

    // Set dimensions if available
    if (payload.dimensions) {
      imageElement.width = payload.dimensions.width;
      imageElement.height = payload.dimensions.height;
    }

    // Add loading and error handling
    imageElement.loading = "lazy";
    imageElement.onerror = () => {
      console.error("Failed to load image:", payload.image);
      imageElement.alt = "Failed to load image";
    };

    imageWrapper.appendChild(imageElement);
    this.messageContainer.appendChild(imageWrapper);
    this.scrollToBottom();
  }

  addCarousel(carouselData) {
    console.log("Adding carousel:", carouselData);
    const carouselElement = document.createElement("div");
    carouselElement.className = "carousel";
    carouselElement.innerHTML = `
      <div class="carousel__container">
        <!-- Carousel items will be dynamically added here -->
      </div>
      <button class="carousel__button carousel__button--left" aria-label="Previous slide">
        🚀 <!-- Left Arrow SVG Placeholder -->
      </button>
      <button class="carousel__button carousel__button--right" aria-label="Next slide">
        🚀 <!-- Right Arrow SVG Placeholder -->
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
          this.addMessage("user", buttonData.name);
          this.conversationHistory.push({
            type: "user",
            message: buttonData.name,
          });
          this.saveConversationToStorage();

          await this.handleButtonClick(buttonData);
        } catch (error) {
          console.error("Error handling carousel button click:", error);
        }
      });
    });

    if (this.messageContainer) {
      this.messageContainer.appendChild(carouselElement);
      this.scrollToBottom();
    } else {
      console.error("Message container not found when adding carousel");
    }
  }

  // Additional helper methods can be added here
}

// Carousel Class
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
