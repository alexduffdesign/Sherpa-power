// chatbot-section.js

import { ChatbotBase } from "./chatbot-base.js";

class SectionChatbot extends HTMLElement {
  constructor() {
    super();
    console.log("SectionChatbot constructor called");

    // Create a config for ChatbotBase
    const config = {
      apiEndpoint:
        "https://chatbottings--development.gadget.app/voiceflowAPI/voiceflow-streaming",
      userIDPrefix: "sectionChatbot",
      isSection: true,
    };

    // Instantiate the chatbot logic
    this.chatbotBase = new ChatbotBase(config);
    console.log("ChatbotBase created with config:", config);

    // Set element reference
    this.chatbotBase.element = this;
    console.log("Element reference set on ChatbotBase");

    // Initialize state
    this.chatInitialized = false;
    this.eventListenersAttached = false;
    this.savedDevices = new Map();
    this.initialized = false;

    // Create observer for template content
    this.observer = new MutationObserver((mutations) => {
      if (this.querySelector(".chatbot-container") && !this.initialized) {
        console.log("Template content detected, initializing");
        this.observer.disconnect();
        this.initialize();
      }
    });
  }

  connectedCallback() {
    console.log("SectionChatbot connected, starting observer");
    // Start observing for template content
    this.observer.observe(this, { childList: true, subtree: true });

    // Check if template is already present
    if (this.querySelector(".chatbot-container")) {
      console.log("Template already present, initializing immediately");
      this.observer.disconnect();
      this.initialize();
    }
  }

  initialize() {
    if (this.initialized) {
      console.log("SectionChatbot already initialized");
      return;
    }
    console.log("SectionChatbot initializing");

    this.initializeElements();
    if (!this.validateElements()) {
      console.error("Required elements not found after template rendering");
      return;
    }

    this.setupEventListeners();
    this.loadSavedDevices();
    this.setupViewMoreButton();
    this.chatbotBase.setDOMElements(
      this.messageContainer,
      this.typingIndicator,
      this.chatMessages // Correctly reference chatMessages
    );
    this.chatbotBase.initializeChatIfNeeded();
    this.initialized = true;
  }

  initializeElements() {
    console.log("SectionChatbot initializeElements called");

    // Find elements within the chatbot template structure
    this.messageContainer = this.querySelector(".message-container");
    this.typingIndicator = this.querySelector(".chat-typing");
    this.chatForm = this.querySelector("#chatForm");
    this.userInput = this.querySelector("#userInput");
    this.chatMessages = this.querySelector(".chat-messages"); // Correctly select within section
    this.applicationsGrid = this.querySelector(".applications-grid"); // Ensure correct scope

    // Log DOM structure for debugging
    console.log("Section chatbot DOM structure:", {
      innerHTML: this.innerHTML,
      outerHTML: this.outerHTML,
    });

    // Log all found elements for debugging
    console.log("Section chatbot elements found:", {
      messageContainer: this.messageContainer,
      typingIndicator: this.typingIndicator,
      chatForm: this.chatForm,
      userInput: this.userInput,
      chatMessages: this.chatMessages,
      applicationsGrid: this.applicationsGrid,
    });
  }

  validateElements() {
    const requiredElements = {
      messageContainer: this.messageContainer,
      typingIndicator: this.typingIndicator,
      chatForm: this.chatForm,
      userInput: this.userInput,
      chatMessages: this.chatMessages,
    };

    const missingElements = Object.entries(requiredElements)
      .filter(([, el]) => !el)
      .map(([name]) => name);

    if (missingElements.length > 0) {
      console.error("Missing required elements:", missingElements);
      return false;
    }

    console.log("All required elements found");
    return true;
  }

  setupEventListeners() {
    if (this.eventListenersAttached) return;
    console.log("SectionChatbot setupEventListeners called");

    // Initialize chat when user focuses on the input
    this.userInput.addEventListener("focus", () => {
      console.log("Input focused, initializing chat if needed");
      this.initializeChat();
    });

    // Handle form submission
    this.chatForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const message = this.userInput.value.trim();
      if (message) {
        console.log("Form submitted with message:", message);
        this.userInput.value = ""; // Clear input
        await this.initializeChat();
        await this.handleUserMessage(message);
      }
    });

    // Handle button clicks within messages
    this.messageContainer.addEventListener("click", async (e) => {
      const buttonElement = e.target.closest(".chat-button");
      if (buttonElement && buttonElement.dataset.buttonData) {
        try {
          const buttonData = JSON.parse(buttonElement.dataset.buttonData);
          console.log("Button clicked:", buttonData);
          await this.handleButtonClick(buttonData);
        } catch (error) {
          console.error("Error parsing button data:", error);
        }
      }
    });

    this.eventListenersAttached = true;
  }

  async initializeChat() {
    if (this.chatInitialized) {
      console.log("Chat already initialized");
      return;
    }

    console.log("Initializing section chatbot");
    const productDetails = this.getProductDetails();

    try {
      await this.chatbotBase.sendLaunch("shopifySection", productDetails);
      this.chatInitialized = true;
      console.log("Section chatbot initialized");
    } catch (error) {
      console.error("Error initializing section chatbot:", error);
      this.chatbotBase.ui.addMessage(
        "assistant",
        "I apologize, but I encountered an error initializing the chat. Please try again."
      );
    }
  }

  getProductDetails() {
    const productTitle = this.getAttribute("product-title") || "";
    const productCapacity = this.getAttribute("product-capacity") || "";
    const acOutputContinuousPower =
      parseFloat(this.getAttribute("product-ac_output_continuous_power")) || 0;
    const acOutputPeakPower =
      parseFloat(this.getAttribute("product-ac_output_peak_power")) || 0;
    const dcOutputPower =
      parseFloat(this.getAttribute("product-dc_output_power")) || 0;

    const productDetails = {
      title: productTitle,
      capacity: productCapacity,
      ac_output_continuous_power: acOutputContinuousPower,
      ac_output_peak_power: acOutputPeakPower,
      dc_output_power: dcOutputPower,
    };

    console.log("Product details gathered:", productDetails);
    return JSON.stringify(productDetails);
  }

  async handleUserMessage(message) {
    try {
      await this.chatbotBase.sendMessage(message);
    } catch (error) {
      console.error("Error in handleUserMessage:", error);
      this.chatbotBase.ui.addMessage(
        "assistant",
        "I apologize, but I encountered an error processing your message. Please try again."
      );
    }
  }

  async handleButtonClick(buttonData) {
    try {
      await this.chatbotBase.handleButtonClick(buttonData);
    } catch (error) {
      console.error("Error in handleButtonClick:", error);
      this.chatbotBase.ui.addMessage(
        "assistant",
        "I apologize, but I encountered an error processing your selection. Please try again."
      );
    }
  }

  async handleSpecialTrace(trace) {
    console.log("SectionChatbot handling special trace:", trace);
    await this.chatbotBase.handleSpecialTrace(trace);

    if (trace.type === "device_answer") {
      await this.handleDeviceAnswer(trace.payload);
    }
  }

  async handleDeviceAnswer(deviceAnswer) {
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

  createDeviceCard(device) {
    const formattedRuntime = this.formatRuntime(device.estimatedRuntime);
    const card = document.createElement("div");
    card.className = "application-card chatbot-card";
    card.innerHTML = `
      <div class="appliance-card__circle">
        <img src="${device.icon || ""}" alt="${
      device.name
    }" class="application-card__image">
      </div>
      <div class="application-card__content">
        <p class="application-card__title">${device.name}</p>
        <p class="application-card__runtime">${formattedRuntime}</p>
      </div>
    `;
    return card;
  }

  formatRuntime(hours) {
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      return `${days} day${days > 1 ? "s" : ""}`;
    }
    return `${Math.round(hours * 10) / 10} hours`;
  }

  insertCard(card) {
    if (this.applicationsGrid) {
      this.applicationsGrid.appendChild(card);
    } else {
      console.error("Applications grid not found");
    }
  }

  saveDeviceEstimate(device) {
    this.savedDevices.set(device.name, device);
    this.saveDevicesToStorage();
  }

  loadSavedDevices() {
    try {
      const savedDevicesJson = localStorage.getItem("savedDevices");
      if (savedDevicesJson) {
        const devices = JSON.parse(savedDevicesJson);
        this.savedDevices = new Map(Object.entries(devices));
        this.updateDevicesView();
      }
    } catch (error) {
      console.error("Error loading saved devices:", error);
    }
  }

  saveDevicesToStorage() {
    try {
      const devicesObject = Object.fromEntries(this.savedDevices);
      localStorage.setItem("savedDevices", JSON.stringify(devicesObject));
    } catch (error) {
      console.error("Error saving devices to storage:", error);
    }
  }

  updateDevicesView() {
    if (!this.applicationsGrid) {
      console.error("Applications grid not found");
      return;
    }

    // Clear existing chatbot cards
    const existingCards =
      this.applicationsGrid.querySelectorAll(".chatbot-card");
    existingCards.forEach((card) => card.remove());

    // Add saved devices
    this.savedDevices.forEach((device) => {
      const card = this.createDeviceCard(device);
      this.insertCard(card);
    });
  }

  setupViewMoreButton() {
    const viewMoreButton = this.querySelector(".view-more-button"); // Correctly scoped
    if (viewMoreButton) {
      viewMoreButton.addEventListener("click", () => {
        this.applicationsGrid.classList.toggle("show-all");
        viewMoreButton.textContent = this.applicationsGrid.classList.contains(
          "show-all"
        )
          ? "View Less"
          : "View More";
      });
    }
  }
}

customElements.define("section-chatbot", SectionChatbot);
console.log("SectionChatbot module loaded");
