// section-chatbot.js

import { ChatbotCore } from "./chatbot-core-file.js";

class SectionChatbot extends HTMLElement {
  constructor() {
    super();
    this.chatInitialized = false;
    this.core = null;
    this.messageContainer = null;
    this.typingIndicator = null;
    this.applicationsGrid = null;
  }

  connectedCallback() {
    this.initialize();
  }

  initialize() {
    console.log("SectionChatbot initializing");
    this.initializeElements();
    this.setupEventListeners();
    this.loadSavedDevices();
    this.setupViewMoreButton();
  }

  initializeElements() {
    console.log("SectionChatbot initializeElements called");
    this.messageContainer = this.querySelector("#messageContainer");
    this.typingIndicator = this.querySelector(".chat-typing");
    this.applicationsGrid = this.querySelector(".applications-grid");

    if (!this.messageContainer || !this.typingIndicator) {
      console.error("Required DOM elements not found");
    }
  }

  setupEventListeners() {
    if (this.eventListenersAttached) return;

    console.log("SectionChatbot setupEventListeners called");
    const form = this.querySelector("#chatForm");
    const input = this.querySelector("#userInput");

    if (!form || !input) {
      console.error("Chat form or input not found");
      return;
    }

    // Initialize chat when user focuses on the input
    input.addEventListener("focus", async () => {
      console.log("Input focused, initializing chat if needed");
      await this.initializeChatIfNeeded();
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const message = input.value.trim();
      if (message) {
        console.log("Form submitted with message:", message);
        input.value = ""; // Clear the input field immediately
        await this.initializeChatIfNeeded(); // Ensure chat is initialized
        await this.handleUserMessage(message);
      }
    });

    this.eventListenersAttached = true;
  }

  async initializeChatIfNeeded() {
    if (!this.chatInitialized) {
      console.log("Initializing section chatbot");
      const config = {
        proxyEndpoint:
          "https://chatbottings--development.gadget.app/voiceflowAPI/voiceflow-streaming", // Update to Gadget's streaming endpoint
        userIDPrefix: "sectionChatbot",
      };
      this.core = new ChatbotCore(config);
      this.core.setDOMElements(
        this.messageContainer,
        this.typingIndicator,
        this
      );
      this.core.on("message", this.handleMessage.bind(this));
      this.core.on("typing", this.handleTyping.bind(this));
      this.core.on("updateMessage", this.handleUpdateMessage.bind(this));
      await this.sendLaunch();
      this.chatInitialized = true;
    }
  }

  async handleUserMessage(message) {
    this.core.addMessage("user", message);
    this.core.conversationHistory.push({ type: "user", message: message });
    this.core.saveConversationToStorage();
    this.core.showTypingIndicator();
    try {
      await this.core.sendMessage(message);
    } catch (error) {
      console.error("Error in send message:", error);
    } finally {
      this.core.hideTypingIndicator();
      this.core.scrollToBottom();
    }
  }

  async handleAgentResponse(response) {
    // Not needed as ChatbotCore emits events handled via callbacks
  }

  handleMessage({ sender, content }) {
    this.core.addMessage(sender, content);
  }

  handleTyping(isTyping) {
    if (isTyping) {
      this.core.showTypingIndicator();
    } else {
      this.core.hideTypingIndicator();
    }
  }

  handleUpdateMessage(content) {
    this.core.updateLatestMessage(content);
  }

  handleDeviceAnswer(deviceAnswer) {
    console.log("Handling device answer:", deviceAnswer);
    let devices = Array.isArray(deviceAnswer)
      ? deviceAnswer
      : deviceAnswer.devices;

    if (!Array.isArray(devices)) {
      console.error("Invalid devices data:", devices);
      return;
    }

    devices.forEach((device) => {
      console.log("Processing device:", device);
      const { name, estimatedRuntime } = device;
      this.saveDeviceEstimate({ name, estimatedRuntime });
      const card = this.createDeviceCard(device);
      this.insertCard(card);
    });

    try {
      this.updateDevicesView();
    } catch (error) {
      console.error("Error in updateDevicesView:", error);
    }
  }

  formatRuntime(runtime) {
    const totalHours = parseFloat(runtime.value);
    if (totalHours >= 1) {
      const wholeHours = Math.floor(totalHours);
      const remainingMinutes = Math.round((totalHours - wholeHours) * 60);

      const hourText = `${wholeHours} ${wholeHours === 1 ? "hour" : "hours"}`;
      if (remainingMinutes === 0) {
        return hourText;
      }
      return `${hourText} ${remainingMinutes} minutes`;
    } else {
      const minutes = Math.round(totalHours * 60);
      return `${minutes} minutes`;
    }
  }

  createDeviceCard(device) {
    const formattedRuntime = this.formatRuntime(device.estimatedRuntime);
    const card = document.createElement("div");
    card.className = "application-card chatbot-card";
    card.innerHTML = `
      <div class="application-card__image">
        🚀 <!-- SVG Placeholder -->
      </div>
      <div class="application-card__content">
        <div class="application-card__title">${device.name}</div>
        <div class="application-card__runtime">
          ${formattedRuntime}
        </div>
      </div>
    `;
    return card;
  }

  insertCard(card) {
    this.applicationsGrid = this.querySelector(".applications-grid");
    if (!this.applicationsGrid) {
      console.error("Applications grid not found when inserting card");
      return;
    }

    const firstChatbotCard = this.applicationsGrid.querySelector(
      ".application-card.chatbot-card"
    );
    if (firstChatbotCard) {
      this.applicationsGrid.insertBefore(card, firstChatbotCard);
    } else {
      this.applicationsGrid.appendChild(card);
    }
  }

  saveDeviceEstimate(device) {
    const key = `${this.getAttribute("product-title")}_devices`;
    let devices = JSON.parse(localStorage.getItem(key) || "[]");

    const existingIndex = devices.findIndex((d) => d.name === device.name);
    if (existingIndex !== -1) {
      devices.splice(existingIndex, 1);
    }
    devices.unshift(device);

    localStorage.setItem(key, JSON.stringify(devices));
  }

  setupViewMoreButton() {
    this.viewMoreButton = this.querySelector(".view-more-button");
    if (this.viewMoreButton) {
      this.viewMoreButton.addEventListener("click", () =>
        this.toggleDevicesView()
      );
    } else {
      console.warn("View more button not found");
    }
  }

  toggleDevicesView() {
    const allCards = this.applicationsGrid.querySelectorAll(
      ".application-card.chatbot-card"
    );
    const hiddenCards = Array.from(allCards).filter(
      (card) => card.style.display === "none"
    );

    if (hiddenCards.length > 0) {
      // Show all cards
      hiddenCards.forEach((card) => (card.style.display = "flex"));
      this.viewMoreButton.textContent = "Hide";
    } else {
      // Hide cards beyond the first two
      Array.from(allCards)
        .slice(2)
        .forEach((card) => (card.style.display = "none"));
      this.viewMoreButton.textContent = "View More";
    }
  }

  updateDevicesView() {
    console.log("Updating devices view");
    this.applicationsGrid = this.querySelector(".applications-grid");
    if (!this.applicationsGrid) {
      console.error("Applications grid not found");
      return;
    }

    console.log("Applications grid found:", this.applicationsGrid);

    const allCards = this.applicationsGrid.querySelectorAll(
      ".application-card.chatbot-card"
    );
    console.log("Number of cards found:", allCards.length);

    this.viewMoreButton = this.querySelector(".view-more-button");
    const devicesPerPage = 2;

    if (allCards.length > devicesPerPage) {
      if (this.viewMoreButton) {
        this.viewMoreButton.style.display = "block";
        this.viewMoreButton.textContent = "View More";
        console.log("View more button displayed");
      } else {
        console.warn("View more button not found");
      }
      allCards.forEach((card, index) => {
        card.style.display = index < devicesPerPage ? "flex" : "none";
      });
    } else {
      if (this.viewMoreButton) {
        this.viewMoreButton.style.display = "none";
        console.log("View more button hidden");
      } else {
        console.warn("View more button not found");
      }
    }
  }

  // Additional methods can be implemented as needed
}

customElements.define("section-chatbot", SectionChatbot);
console.log("SectionChatbot module loaded");
