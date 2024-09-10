import { ChatbotCore } from "./chatbot-core-file.js";

console.log("SectionChatbot module loading");

class SectionChatbot extends HTMLElement {
  constructor() {
    super();
    console.log("SectionChatbot constructor called");
    this.core = null;
    this.eventListenersAttached = false;
  }

  connectedCallback() {
    console.log("SectionChatbot connected to the DOM");
    this.initialize();
  }

  initialize() {
    console.log("SectionChatbot initializing");
    const config = {
      apiEndpoint: "https://chatbottings--development.gadget.app/voiceflow",
    };
    this.core = new ChatbotCore(config);
    console.log("ChatbotCore instance created:", this.core);

    this.initializeElements();
    this.setupEventListeners();
    this.initializeChat();
  }

  initializeElements() {
    console.log("SectionChatbot initializeElements called");
    const messageContainer = this.querySelector("#messageContainer");
    const typingIndicator = this.querySelector(".chat-typing");
    const applicationsGrid = document.querySelector(".applications-grid");

    if (!messageContainer || !typingIndicator) {
      console.error("Required DOM elements not found");
      return;
    }

    this.core.setDOMElements(messageContainer, typingIndicator, this);
    this.applicationsGrid = applicationsGrid;
    console.log("DOM elements set in ChatbotCore:", this.core);
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

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const message = input.value.trim();
      if (message) {
        console.log("Form submitted with message:", message);
        input.value = ""; // Clear the input field immediately
        await this.handleUserMessage(message);
      }
    });

    this.addEventListener("click", async (e) => {
      if (e.target.matches(".button-container button")) {
        const buttonData = JSON.parse(e.target.dataset.buttonData);
        try {
          const response = await this.core.handleButtonClick(buttonData);
          await this.handleAgentResponse(response);
        } catch (error) {
          console.error("Error handling button click:", error);
        }
      }
    });

    this.eventListenersAttached = true;
  }

  async handleUserMessage(message) {
    this.core.addMessage("user", message);

    this.core.showTypingIndicator();
    try {
      const response = await this.core.sendMessage(message);
      console.log("Response from sendMessage:", response);
      await this.handleAgentResponse(response);
    } catch (error) {
      console.error("Error in send message:", error);
    } finally {
      this.core.hideTypingIndicator();
      this.core.scrollToBottom();
    }
  }

  async handleAgentResponse(response) {
    console.log("Handling agent response:", response);
    for (const trace of response) {
      if (trace.type === "text") {
        this.core.addMessage("assistant", trace.payload.message);
      } else if (trace.type === "choice") {
        this.core.addButtons(trace.payload.buttons);
      } else if (trace.type === "device_answer") {
        this.handleDeviceAnswer(trace.payload);
      } else {
        console.log("Unknown trace type:", trace.type);
      }
    }
    this.core.scrollToBottom();
  }

  handleDeviceAnswer(payload) {
    console.log("Handling device answer:", payload);
    let devices = Array.isArray(payload) ? payload : payload.devices;

    if (!Array.isArray(devices)) {
      console.error("Invalid devices data:", devices);
      return;
    }

    devices.forEach((device) => {
      console.log("Processing device:", device);
      const { name, estimatedRuntime, powerConsumption } = device;
      this.saveDeviceEstimate({ name, estimatedRuntime, powerConsumption });
      const card = this.createDeviceCard(device);
      this.insertCard(card);
    });

    this.updateDevicesView();
  }

  createDeviceCard(device) {
    const card = document.createElement("div");
    card.className = "application-card chatbot-card";
    card.innerHTML = `
      <div class="application-card__image">
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="50" height="50" rx="25" fill="#DB9BFB"/>
          <path d="M35.2941 18.5294H14.7059C13.7647 18.5294 13 19.2941 13 20.2353V32.7647C13 33.7059 13.7647 34.4706 14.7059 34.4706H35.2941C36.2353 34.4706 37 33.7059 37 32.7647V20.2353C37 19.2941 36.2353 18.5294 35.2941 18.5294ZM35.2941 32.7647H14.7059V20.2353H35.2941V32.7647ZM34.4412 15.5882L36.1471 13.8824C36.4412 13.5882 36.4412 13.1471 36.1471 12.8529C35.8529 12.5588 35.4118 12.5588 35.1176 12.8529L33.4118 14.5588C31.9412 13.5882 30.1765 13 28.2647 13H21.7353C19.8235 13 18.0588 13.5882 16.5882 14.5588L14.8824 12.8529C14.5882 12.5588 14.1471 12.5588 13.8529 12.8529C13.5588 13.1471 13.5588 13.5882 13.8529 13.8824L15.5588 15.5882C13.7941 17.3529 12.7059 19.7059 12.7059 22.2941V23.1471H37.2941V22.2941C37.2941 19.7059 36.2059 17.3529 34.4412 15.5882ZM20.8824 20.2353H18.3235V17.6765H20.8824V20.2353ZM31.6765 20.2353H29.1176V17.6765H31.6765V20.2353Z" fill="white"/>
        </svg>
      </div>
      <div class="application-card__content">
        <div class="application-card__title">${device.name}</div>
        <div class="application-card__runtime">
          ${device.estimatedRuntime.value} ${device.estimatedRuntime.unit}
        </div>
      </div>
    `;
    return card;
  }

  insertCard(card) {
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

  updateDevicesView() {
    const allCards = this.applicationsGrid.querySelectorAll(
      ".application-card.chatbot-card"
    );
    const viewMoreButton = this.querySelector(".view-more-button");
    const devicesPerPage = 3;

    if (allCards.length > devicesPerPage) {
      viewMoreButton.style.display = "block";
      allCards.forEach((card, index) => {
        card.style.display = index < devicesPerPage ? "flex" : "none";
      });
    } else {
      viewMoreButton.style.display = "none";
    }
  }

  async initializeChat() {
    console.log("Initializing chat");
    await this.sendLaunch();
    console.log("Chat initialized");
  }

  async sendLaunch() {
    console.log("Sending launch request");
    this.core.showTypingIndicator();
    try {
      const response = await this.core.sendLaunch();
      await this.handleAgentResponse(response);
    } catch (error) {
      console.error("Error in send launch:", error);
    } finally {
      this.core.hideTypingIndicator();
    }
  }
}

customElements.define("section-chatbot", SectionChatbot);

console.log("SectionChatbot module loaded");
