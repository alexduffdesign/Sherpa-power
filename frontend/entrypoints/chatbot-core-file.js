// chatbot-core.js
console.log("Recent changes check : 3");

export class ChatbotCore {
  constructor(config) {
    console.log("ChatbotCore constructor called with config:", config);
    this.apiEndpoint = config.apiEndpoint;
    this.userIDPrefix = config.userIDPrefix || "chatbot";
    this.userID = this.loadUserID();
    this.messageContainer = null;
    this.typingIndicator = null;
    this.drawerBody = null;
    this.defaultTypingText = "Sherpa Guide Is Typing...";

    // Bind methods
    this.sendMessage = this.sendMessage.bind(this);
    this.gadgetInteract = this.gadgetInteract.bind(this);
    this.addMessage = this.addMessage.bind(this);

    console.log("ChatbotCore instance created:", this);
  }

  loadUserID() {
    const key = `${this.userIDPrefix}UserID`;
    let userID = localStorage.getItem(key);
    if (!userID) {
      userID = `${this.userIDPrefix}_${Math.floor(
        Math.random() * 1000000000000000
      )}`;
      localStorage.setItem(key, userID);
    }
    console.log(`${this.userIDPrefix} userID loaded:`, userID);
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
      // Preserve the incoming payload while ensuring type is "launch"
      const launchPayload = {
        userAction: {
          type: "launch",
          payload: payload.userAction?.payload || {},
        },
      };

      const res = await this.gadgetInteract(launchPayload);
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
      ...payload,
    };

    console.log("Formatted payload:", fullPayload);

    // Check for waiting_text in the initial payload
    if (payload.userAction?.payload?.waiting_text) {
      this.showTypingIndicator(payload.userAction.payload.waiting_text);
    } else {
      this.showTypingIndicator();
    }

    const response = await fetch(this.apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        versionID: "development",
      },
      body: JSON.stringify(fullPayload),
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(`Gadget API error: ${response.status} - ${errorText}`);
    }

    // For 204 responses, return an empty response object
    if (response.status === 204) {
      console.log("Received 204 No Content response");
      return { traces: [] };
    }

    const data = await response.json();
    console.log("Response data:", data);

    // Check for waiting_text in the response traces
    if (data.traces) {
      const waitingTrace = data.traces.find(
        (trace) => trace.type === "waiting_text" && trace.payload
      );
      if (waitingTrace) {
        this.showTypingIndicator(waitingTrace.payload);
      }
    }

    return data;
  }

  showTypingIndicator(customText = null) {
    console.log("Showing typing indicator");
    if (this.typingIndicator) {
      this.typingIndicator.style.display = "flex";
      this.typingIndicator.classList.add("active");
      const typingText = this.typingIndicator.querySelector("p");
      if (typingText) {
        if (customText) {
          typingText.textContent = customText;
        } else {
          typingText.textContent = this.defaultTypingText;
        }
      }
      this.scrollToBottom();
    }
  }

  hideTypingIndicator() {
    console.log("Hiding typing indicator");
    if (this.typingIndicator) {
      this.typingIndicator.style.display = "none";
      this.typingIndicator.classList.remove("active");
      const typingText = this.typingIndicator.querySelector("p");
      if (typingText) {
        typingText.textContent = this.defaultTypingText;
      }
    }
  }

  addMessage(sender, content) {
    console.log(`Adding message from ${sender}: ${content}`);
    if (this.messageContainer) {
      const messageWrapper = document.createElement("div");
      messageWrapper.classList.add(
        "message-wrapper",
        `message-wrapper--${sender}`
      );

      if (sender === "assistant") {
        const iconSvg = document.createElement("svg");
        iconSvg.classList.add("message-icon");
        iconSvg.innerHTML = `
        <svg class="message-icon" width="30" height="20" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.8566 0.0949741C20.5706 0.0327174 20.1796 -0.00878708 19.9985 0.00158904C19.8173 0.0119652 19.4741 0.0534703 19.2357 0.105351C18.9973 0.157232 18.5492 0.333624 18.2345 0.499642C17.8817 0.676036 15.6315 2.51261 12.4183 5.23115C10.1121 7.17766 8.14608 8.8729 7.4516 9.50931C7.26478 9.68051 7.23297 9.89295 7.36802 10.1074C7.56866 10.4259 7.91296 10.9361 8.2993 11.488C9.04301 12.5394 9.45301 13.0409 9.52929 12.9925C9.59603 12.951 11.9702 10.9588 14.802 8.57226C17.6338 6.18575 20.0461 4.18316 20.1606 4.13128C20.2845 4.0794 20.561 4.0379 20.7803 4.0379C21.0091 4.0379 21.3047 4.12091 21.4478 4.22467C21.5908 4.31805 22.7826 5.9056 24.0889 7.75255C26.0721 10.523 26.4821 11.1559 26.4821 11.4361C26.4916 11.6125 26.4154 11.8719 26.32 11.986C26.2247 12.1105 25.2044 13.0029 24.0507 13.9782C22.897 14.9432 21.8387 15.794 21.6861 15.8563C21.5145 15.9289 21.3429 15.9393 21.1617 15.8667C21.0091 15.8148 20.6754 15.4516 20.3512 14.9847C20.2856 14.8902 20.2209 14.7993 20.1594 14.715C19.8981 14.3568 19.5448 14.3315 19.2009 14.6114C19.0718 14.7164 18.9276 14.8362 18.778 14.964C18.2822 15.379 17.7959 15.7837 17.6815 15.8874C17.5638 15.9806 17.5395 16.1501 17.626 16.2729C18.6307 17.6989 19.1539 18.3732 19.4264 18.6994C19.722 19.0418 20.1606 19.4153 20.4275 19.5606C20.685 19.6955 21.1617 19.8615 21.4764 19.9134C21.8673 19.986 22.2296 19.9756 22.6205 19.903C22.9352 19.8407 23.4024 19.6747 23.6693 19.5294C23.9268 19.3842 25.2617 18.3154 26.6251 17.1637C28.4653 15.5969 29.1804 14.9224 29.3997 14.5489C29.5714 14.2791 29.7811 13.7707 29.867 13.4283C29.9814 12.9925 30.0195 12.5878 29.9909 12.0794C29.9623 11.6125 29.8669 11.1455 29.7144 10.7824C29.5714 10.44 28.2174 8.44775 26.3295 5.81222C24.6038 3.3842 23.021 1.2571 22.8112 1.07033C22.6015 0.883558 22.1915 0.61378 21.9054 0.468515C21.6194 0.323249 21.1426 0.157231 20.8566 0.0949741Z" fill="white"/>
            <path d="M9.51022 0.47889C9.00487 0.219487 8.74743 0.146855 8.12767 0.126103C7.67 0.105351 7.21234 0.157231 6.9835 0.229863C6.77374 0.312872 6.44955 0.458139 6.26839 0.5619C6.08723 0.665661 4.81911 1.6929 3.45563 2.84465C2.09216 3.99639 0.890782 5.07551 0.776364 5.24153C0.661947 5.40755 0.490321 5.72921 0.385438 5.95748C0.271021 6.18576 0.137534 6.65268 0.0707907 6.99509C-0.0150223 7.44127 -0.0245558 7.79405 0.0517223 8.24023C0.0993962 8.58264 0.223347 9.07032 0.32823 9.32972C0.433112 9.58912 1.8824 11.7059 3.54145 14.0509C5.21003 16.3959 6.7642 18.5126 7.0121 18.7616C7.26001 19.0106 7.75582 19.3738 8.12767 19.5709C8.65209 19.8407 8.9572 19.9341 9.55789 19.986C10.006 20.0171 10.54 19.9964 10.8451 19.9237C11.1311 19.8615 11.5983 19.6747 11.8653 19.5191C12.1418 19.3634 14.7257 17.2571 17.6052 14.8291C20.4943 12.401 22.8494 10.357 22.8494 10.2947C22.8589 10.2221 22.3536 9.45423 21.7338 8.60339C21.4117 8.14881 21.1108 7.73759 20.8915 7.45214C20.6737 7.16862 20.3983 7.15354 20.1216 7.38003C19.3039 8.04956 17.3858 9.65415 15.1834 11.5087C11.5411 14.58 9.79626 15.9912 9.57696 16.0327C9.41487 16.0638 9.11929 16.0431 8.93813 15.9808C8.75697 15.9186 8.53767 15.8044 8.45185 15.7318C8.36604 15.6592 7.27908 14.1857 6.03956 12.4426C4.7905 10.6994 3.70354 9.14295 3.62726 8.96655C3.50331 8.71753 3.49377 8.59301 3.57959 8.34399C3.65587 8.11571 4.3233 7.49315 5.98235 6.09237C7.79396 4.54633 8.3279 4.14166 8.55674 4.14166C8.70929 4.14166 8.91906 4.18316 9.00487 4.23504C9.10022 4.28692 9.41487 4.66047 9.70091 5.06514C9.98695 5.48018 10.2825 5.79146 10.3397 5.78109C10.4065 5.76033 10.9118 5.37642 11.4553 4.91987C11.7575 4.67041 12.0283 4.42714 12.2134 4.24762C12.3954 4.0712 12.4181 3.84719 12.2814 3.63385C12.1117 3.3692 11.8416 2.97785 11.5411 2.56449C11.0358 1.85891 10.5114 1.18447 10.3683 1.04958C10.2349 0.914687 9.85347 0.66566 9.51022 0.47889Z" fill="white"/>
          </svg>
        `;
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
  }

  // chatbot-core.js (Refactored markdownToHtml)

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
    html = html.replace(/^## (.*)$/gm, '<h6 class="h5">$1</h6>');
    html = html.replace(/^# (.*)$/gm, '<h6 class="h4">$1</h6>');

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
