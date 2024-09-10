// chatbot-core.js
console.log("Recent changes check : 3");

export class ChatbotCore {
  constructor(config) {
    console.log("ChatbotCore constructor called with config:", config);
    this.apiEndpoint = config.apiEndpoint;
    this.userID = this.loadUserID();
    this.messageContainer = null;
    this.typingIndicator = null;
    this.drawerBody = null;

    // Bind methods
    this.sendMessage = this.sendMessage.bind(this);
    this.gadgetInteract = this.gadgetInteract.bind(this);
    this.addMessage = this.addMessage.bind(this);

    console.log("ChatbotCore instance created:", this);
  }

  loadUserID() {
    let userID = localStorage.getItem("chatbotUserID");
    if (!userID) {
      userID = `user_${Math.floor(Math.random() * 1000000000000000)}`;
      localStorage.setItem("chatbotUserID", userID);
    }
    console.log("ChatbotCore userID loaded:", userID);
    return userID;
  }

  setDOMElements(messageContainer, typingIndicator, drawerBody) {
    console.log("setDOMElements called:", {
      messageContainer,
      typingIndicator,
      drawerBody,
    });
    this.messageContainer = messageContainer;
    this.typingIndicator = typingIndicator;
    this.drawerBody = drawerBody;
    console.log("DOM elements set:", this);
  }

  scrollToBottom() {
    if (this.drawerBody) {
      setTimeout(() => {
        this.drawerBody.scrollTop = this.drawerBody.scrollHeight;
      }, 100); // Small delay to ensure content has rendered
    } else {
      console.error("Drawer body element not found for scrolling");
    }
  }

  async sendMessage(message) {
    console.log("sendMessage called with:", message);
    console.log("this in sendMessage:", this);
    try {
      const res = await this.gadgetInteract({
        userAction: {
          type: "text",
          payload: message,
        },
      });
      console.log("gadgetInteract response:", res);
      this.hideTypingIndicator();
      return res;
    } catch (error) {
      console.error("Error sending message:", error);
      this.hideTypingIndicator();
      throw error;
    }
  }

  async sendLaunch(payload = {}) {
    console.log("ChatbotCore sendLaunch called with payload:", payload);
    this.showTypingIndicator();

    try {
      const res = await this.gadgetInteract(payload);
      console.log("Launch response:", res);
      return res;
    } catch (error) {
      console.error("Error launching conversation:", error);
      throw error;
    } finally {
      this.hideTypingIndicator();
    }
  }

  async gadgetInteract(payload) {
    console.log("Sending payload to Gadget:", payload);
    const fullPayload = {
      userID: this.userID,
      userAction: payload.userAction || payload,
    };
    const response = await fetch(this.apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fullPayload),
    });
    if (!response.ok) {
      throw new Error(`Gadget API error: ${response.status}`);
    }
    return await response.json();
  }

  showTypingIndicator() {
    console.log("Showing typing indicator");
    if (this.typingIndicator) {
      this.typingIndicator.style.display = "flex";
      this.typingIndicator.classList.add("active");
      this.scrollToBottom();
    }
  }

  hideTypingIndicator() {
    console.log("Hiding typing indicator");
    if (this.typingIndicator) {
      this.typingIndicator.style.display = "none";
      this.typingIndicator.classList.remove("active");
    }
  }

  addMessage(sender, content) {
    console.log(`Adding message from ${sender}: ${content}`);
    if (this.messageContainer) {
      const messageDiv = document.createElement("div");
      messageDiv.classList.add("message", `message--${sender}`);
      messageDiv.innerHTML = this.markdownToHtml(content);
      this.messageContainer.appendChild(messageDiv);
      this.scrollToBottom();
    }
  }

  markdownToHtml(markdown) {
    return markdown
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
      .replace(/\n/g, "<br>");
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

    this.showTypingIndicator();
    try {
      const response = await this.gadgetInteract({
        userID: this.userID,
        userAction: button.request,
      });
      this.hideTypingIndicator();
      return response; // Return the response instead of handling it here
    } catch (error) {
      console.error("Error handling button click:", error);
      this.hideTypingIndicator();
      throw error;
    }
  }
}

console.log("ChatbotCore module loaded");
