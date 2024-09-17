import { ChatbotCore } from "./chatbot-core-file.js";

console.log("SectionChatbot module loading");

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
    this.applicationsGrid = document.querySelector(".applications-grid");

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
        await this.initializeChatIfNeeded(); // Ensure chat is initialized (in case focus event didn't trigger)
        await this.handleUserMessage(message);
      }
    });

    // Add button click event listener
    this.messageContainer.addEventListener("click", async (e) => {
      const buttonElement = e.target.closest(".button");
      if (buttonElement) {
        const buttonData = JSON.parse(buttonElement.dataset.buttonData);
        console.log("Button clicked:", buttonData);
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

  async initializeChatIfNeeded() {
    if (!this.chatInitialized) {
      console.log("Initializing section chatbot");
      const config = {
        apiEndpoint: "https://chatbottings--development.gadget.app/voiceflow",
        userIDPrefix: "sectionChatbot",
      };
      this.core = new ChatbotCore(config);
      this.core.setDOMElements(
        this.messageContainer,
        this.typingIndicator,
        this
      );
      await this.sendLaunch();
      this.chatInitialized = true;
    }
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

  handleDeviceAnswer(deviceAnswer) {
    console.log(
      "Handling device answer:",
      JSON.stringify(deviceAnswer, null, 2)
    );
    let devices = Array.isArray(deviceAnswer)
      ? deviceAnswer
      : deviceAnswer.devices;

    if (!Array.isArray(devices)) {
      console.error("Invalid devices data:", devices);
      return;
    }

    devices.forEach((device) => {
      console.log("Processing device:", JSON.stringify(device, null, 2));
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
    const card = document.createElement("div");
    card.className = "application-card chatbot-card";
    card.innerHTML = `
      <div class="application-card__image">
        <svg width="80" height="81" viewBox="0 0 80 81" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M80 40.5C80 62.5914 62.0914 80.5 40 80.5C17.9086 80.5 0 62.5914 0 40.5C0 18.4086 17.9086 0.5 40 0.5C62.0914 0.5 80 18.4086 80 40.5Z" fill="#71527E" fill-opacity="0.52"/>
          <path d="M51.3227 21.1852C50.7697 21.0638 50.0139 20.9829 49.6637 21.0031C49.3134 21.0233 48.6498 21.1043 48.189 21.2054C47.7281 21.3066 46.8617 21.6506 46.2534 21.9743C45.5714 22.3183 41.221 25.8996 35.0088 31.2007C30.2093 35.2865 26.1721 38.8045 25.1425 39.7908C24.9611 39.9646 24.9288 40.1827 25.0561 40.3993C25.3842 40.9575 26.1573 42.1222 27.0453 43.4015C28.4832 45.4518 29.2758 46.4298 29.4233 46.3353C29.5523 46.2544 34.1424 42.3696 39.6172 37.7159C45.0921 33.0622 49.7559 29.1572 49.9771 29.056C50.2167 28.9548 50.7513 28.8739 51.1753 28.8739C51.6177 28.8739 52.1891 29.0358 52.4656 29.2381C52.7422 29.4202 55.0464 32.5159 57.5718 36.1175C61.4061 41.5198 62.1987 42.754 62.1987 43.3003C62.2172 43.6443 62.0697 44.1501 61.8854 44.3727C61.701 44.6155 59.7286 46.3556 57.4981 48.2575C55.2676 50.1392 53.2214 51.7984 52.9265 51.9198C52.5947 52.0614 52.2629 52.0816 51.9126 51.94C51.6177 51.8388 50.9725 51.1307 50.3457 50.2202C50.0748 49.8269 49.8122 49.4654 49.601 49.194C49.3266 48.8411 48.9566 48.8243 48.6059 49.1016C48.2661 49.3701 47.8006 49.7524 47.3042 50.1797C46.3456 50.989 45.4055 51.7781 45.1843 51.9805C44.9561 52.1626 44.909 52.4917 45.0762 52.7311C47.0191 55.5125 48.0309 56.8277 48.5577 57.4637C49.1291 58.1314 49.9771 58.8598 50.4932 59.1431C50.9909 59.4061 51.9126 59.7299 52.5209 59.8311C53.2767 59.9727 53.9772 59.9524 54.733 59.8108C55.3413 59.6894 56.2446 59.3657 56.7607 59.0824C57.2585 58.7991 59.8392 56.7151 62.4752 54.4692C66.033 51.4139 67.4155 50.0988 67.8395 49.3704C68.1713 48.8443 68.5769 47.8529 68.7428 47.1852C68.964 46.3353 69.0377 45.5462 68.9824 44.5548C68.9271 43.6443 68.7428 42.7338 68.4478 42.0256C68.1713 41.3579 65.5537 37.4731 61.9038 32.3338C58.5673 27.5992 55.5072 23.4513 55.1017 23.0871C54.6961 22.7229 53.9035 22.1969 53.3505 21.9136C52.7975 21.6303 51.8758 21.3066 51.3227 21.1852Z" fill="white"/>
          <path d="M29.3864 21.9338C28.4094 21.428 27.9117 21.2864 26.7135 21.2459C25.8287 21.2054 24.9438 21.3066 24.5014 21.4482C24.0959 21.6101 23.4691 21.8934 23.1189 22.0957C22.7686 22.298 20.3169 24.3011 17.6809 26.5471C15.0448 28.793 12.7222 30.8972 12.501 31.221C12.2798 31.5447 11.948 32.172 11.7452 32.6171C11.524 33.0622 11.2659 33.9727 11.1369 34.6404C10.971 35.5105 10.9525 36.1984 11.1 37.0684C11.1922 37.7361 11.4318 38.6871 11.6346 39.193C11.8373 39.6988 14.6393 43.8264 17.8468 48.3992C21.0727 52.9719 24.0775 57.0995 24.5567 57.5851C25.036 58.0707 25.9946 58.7789 26.7135 59.1633C27.7274 59.6894 28.3173 59.8715 29.4786 59.9727C30.345 60.0334 31.3773 59.9929 31.9672 59.8513C32.5202 59.7299 33.4234 59.3657 33.9396 59.0622C34.4742 58.7587 39.4697 54.6513 45.0368 49.9167C50.6223 45.182 55.1754 41.1961 55.1754 41.0747C55.1939 40.933 54.2169 39.4358 53.0187 37.7766C52.2263 36.6487 51.5004 35.6577 51.0813 35.1346C50.8558 34.8532 50.5694 34.8446 50.2899 35.0724C49.013 36.1128 45.0128 39.4857 40.3546 43.442C33.3128 49.4311 29.9394 52.1828 29.5154 52.2637C29.2021 52.3244 28.6306 52.284 28.2804 52.1626C27.9301 52.0412 27.5062 51.8186 27.3403 51.677C27.1743 51.5353 25.0729 48.6622 22.6765 45.263C20.2616 41.8638 18.1602 38.8287 18.0127 38.4848C17.7731 37.9992 17.7546 37.7564 17.9205 37.2708C18.068 36.8256 19.3584 35.6116 22.5659 32.8801C26.0683 29.8653 27.1006 29.0762 27.543 29.0762C27.838 29.0762 28.2435 29.1572 28.4094 29.2583C28.5938 29.3595 29.2021 30.0879 29.7551 30.877C30.3081 31.6863 30.8796 32.2934 30.9902 32.2731C31.1192 32.2327 32.0962 31.484 33.1469 30.5937C33.8911 29.9741 34.5371 29.374 34.8672 29.0255C35.04 28.8431 35.0631 28.6119 34.9351 28.3957C34.6491 27.9128 34.0251 26.989 33.3128 26.0008C32.3358 24.6249 31.322 23.3097 31.0455 23.0467C30.7874 22.7836 30.05 22.298 29.3864 21.9338Z" fill="white"/>
          </svg>
      </div>
      <div class="application-card__content">
        <div class="application-card__title">${device.name}</div>
        <div class="application-card__runtime">
          ${device.estimatedRuntime}
        </div>
      </div>
    `;
    return card;
  }

  insertCard(card) {
    this.applicationsGrid = document.querySelector(".applications-grid");
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
    this.viewMoreButton = document.querySelector(".view-more-button");
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
    this.applicationsGrid = document.querySelector(".applications-grid");
    if (!this.applicationsGrid) {
      console.error("Applications grid not found");
      return;
    }

    console.log("Applications grid found:", this.applicationsGrid);

    const allCards = this.applicationsGrid.querySelectorAll(
      ".application-card.chatbot-card"
    );
    console.log("Number of cards found:", allCards.length);

    this.viewMoreButton = document.querySelector(".view-more-button");
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

  async initializeChat() {
    console.log("Initializing chat");
    await this.sendLaunch();
    console.log("Chat initialized");
  }

  async sendLaunch() {
    console.log("Sending section chatbot launch request");

    // Prepare the product details
    const productTitle = this.getAttribute("product-title");
    const productCapacity = this.getAttribute("product-capacity");
    const productDetails = `Power Station: ${productTitle}, Capacity: ${productCapacity}`;

    const interactPayload = {
      userAction: {
        type: "launch",
        payload: {
          startBlock: "shopifySection",
          powerStationDetails: productDetails,
        },
      },
    };

    try {
      const response = await this.core.sendLaunch(interactPayload);
      await this.handleAgentResponse(response);
    } catch (error) {
      console.error("Error in section chatbot send launch:", error);
    }
  }

  loadSavedDevices() {
    const key = `${this.getAttribute("product-title")}_devices`;
    const savedDevices = JSON.parse(localStorage.getItem(key) || "[]");
    savedDevices.forEach((device) => {
      const card = this.createDeviceCard(device);
      this.insertCard(card);
    });
    this.updateDevicesView();
  }
}

customElements.define("section-chatbot", SectionChatbot);

console.log("SectionChatbot module loaded");
