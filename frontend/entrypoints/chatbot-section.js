import { ChatbotCore } from "./chatbot-core-file.js";

class SectionChatbot extends ChatbotCore {
  constructor() {
    // Ensure super() is called before accessing 'this'
    const config = {
      apiEndpoint: "https://chatbottings--development.gadget.app/voiceflow",
      chatFormId: "chatForm",
      userInputId: "userInput",
      chatMessagesId: "chatMessages",
      messageContainerId: "messageContainer",
      typingIndicatorSelector: ".chat-typing",
    };

    super(config); // Call super first, passing the config object
    this.userID = `section_${Math.floor(Math.random() * 1000000000000000)}`; // Now it's safe to access 'this'
  }

  connectedCallback() {
    console.log("SectionChatbot connected to the DOM");

    // Perform additional setup after the element is attached to the DOM
    this.init(); // Initialize form interaction
  }

  initialize(config) {
    console.log("Initializing SectionChatbot with config:", config);
    this.productTitle = config.productTitle;
    this.productCapacity = config.productCapacity;
    this.productDetails = `Power Station: ${this.productTitle}, Wattage: ${this.productCapacity}`;
    this.setupEventListeners();
    this.loadSavedDevices();
  }

  setupEventListeners() {
    if (this.viewMoreButton) {
      this.viewMoreButton.addEventListener("click", () =>
        this.toggleDevicesView()
      );
    }
  }

  toggleDevicesView() {
    this.isExpanded = !this.isExpanded;
    this.updateDevicesView();
  }

  updateDevicesView() {
    const allCards = this.applicationsGrid.querySelectorAll(
      ".application-card.chatbot-card"
    );
    if (allCards.length > this.devicesPerPage) {
      this.viewMoreButton.style.display = "block";
      this.viewMoreButton.textContent = this.isExpanded
        ? "View Less"
        : "View More";

      allCards.forEach((card, index) => {
        card.style.display =
          index < this.devicesPerPage || this.isExpanded ? "flex" : "none";
      });
    } else {
      this.viewMoreButton.style.display = "none";
    }
  }

  async sendMessage(message) {
    try {
      const res = await this.gadgetInteract({
        userAction: {
          type: "text",
          payload: message,
        },
      });
      this.hideTypingIndicator();
      this.handleAgentResponse(res);
    } catch (error) {
      console.error("Error sending message:", error);
      this.hideTypingIndicator();
    }
  }

  async sendLaunch() {
    this.showTypingIndicator();
    const interactPayload = {
      userAction: {
        type: "launch",
        payload: {
          startBlock: "shopifySection",
          powerStationDetails: this.productDetails,
        },
      },
    };

    try {
      const res = await this.gadgetInteract(interactPayload);
      console.log("Launch response:", res);
      this.hideTypingIndicator();
      this.handleAgentResponse(res);
    } catch (error) {
      console.error("Error launching conversation:", error);
      this.hideTypingIndicator();
    }
  }

  handleDeviceAnswer(payload) {
    console.log("Raw device answer payload:", payload);

    let deviceData;

    if (typeof payload === "string") {
      try {
        deviceData = JSON.parse(payload);
      } catch (error) {
        console.error("Failed to parse payload string:", error);
        return;
      }
    } else if (typeof payload === "object" && payload !== null) {
      deviceData = payload;
    } else {
      console.error("Invalid payload type:", typeof payload);
      return;
    }

    console.log("Processed device data:", deviceData);

    let devices = Array.isArray(deviceData) ? deviceData : deviceData.devices;

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
        <svg>...</svg>
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
    const key = `${this.productTitle}_devices`;
    let devices = JSON.parse(localStorage.getItem(key) || "[]");

    const existingIndex = devices.findIndex((d) => d.name === device.name);
    if (existingIndex !== -1) {
      devices.splice(existingIndex, 1);
    }
    devices.unshift(device);

    localStorage.setItem(key, JSON.stringify(devices));
  }

  loadSavedDevices() {
    const key = `${this.productTitle}_devices`;
    const devices = JSON.parse(localStorage.getItem(key) || "[]");

    devices.forEach((device) => {
      const card = this.createDeviceCard(device);
      this.insertCard(card);
    });

    this.updateDevicesView();
  }

  async handleAgentResponse(response) {
    await super.handleAgentResponse(response);
    for (const trace of response) {
      if (trace.type === "device_answer") {
        this.handleDeviceAnswer(trace.payload);
      }
    }
  }
}

// Ensure DOM is fully loaded before initializing the SectionChatbot
document.addEventListener("DOMContentLoaded", () => {
  const sectionChatbot = document.querySelector(".section-chatbot");
  console.log("this is the section chatbot", sectionChatbot);
  if (sectionChatbot) {
    const productTitle = sectionChatbot.getAttribute("product-title");
    const productCapacity = sectionChatbot.getAttribute("product-capacity");

    const config = {
      apiEndpoint: "https://chatbottings--development.gadget.app/voiceflow", // Set a valid API endpoint
      chatFormId: "chatForm",
      userInputId: "userInput",
      chatMessagesId: "chatMessages",
      messageContainerId: "messageContainer",
      typingIndicatorSelector: ".chat-typing",
      productTitle: productTitle,
      productCapacity: productCapacity,
    };

    sectionChatbot.initialize(config);
  } else {
    console.error("section-chatbot element not found");
  }
});

customElements.define("section-chatbot", SectionChatbot);
