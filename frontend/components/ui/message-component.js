// /assets/scripts/chatbot/components/message-component.js

import { parseMarkdown } from "../../utils/markdown-util.js";

export class MessageComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.content = ""; // Initialize empty content
    this.displayedContent = ""; // Content currently displayed
    this.animationInterval = null;
    this.defaultAnimationSpeed = 30; // milliseconds per character
    this.currentAnimationSpeed = this.defaultAnimationSpeed;
    this.shouldAnimate = true;
  }

  connectedCallback() {
    const sender = this.getAttribute("sender");
    const initialContent = this.getAttribute("content") || "";
    this.content = initialContent;

    // Determine if animation should occur
    const animateAttr = this.getAttribute("data-animate");
    this.shouldAnimate = animateAttr !== "false"; // default to true

    // Determine animation speed
    const animationSpeedAttr = this.getAttribute("data-animation-speed");
    if (animationSpeedAttr) {
      const speed = parseInt(animationSpeedAttr, 10);
      if (!isNaN(speed)) {
        this.currentAnimationSpeed = speed;
      }
    } else {
      this.currentAnimationSpeed = this.defaultAnimationSpeed;
    }

    this.render(sender, this.content);
  }

  /**
   * Append new content to the message and animate it
   * @param {string} newContent - The new content to append
   */
  appendContent(newContent) {
    this.content += newContent;
    if (this.shouldAnimate) {
      this.animateContent(newContent);
    } else {
      this.updateContent(this.content);
    }
  }

  /**
   * Update the entire message content and re-render with markdown
   * @param {string} newContent - The new content to set
   */
  updateContent(newContent) {
    this.content = newContent;
    const sender = this.getAttribute("sender");
    this.render(sender, this.content);
  }

  /**
   * Renders the message with markdown support and initializes animation
   * @param {string} sender - The sender of the message ('user' or 'assistant')
   * @param {string} content - The message content with HTML from markdown
   */
  render(sender, content) {
    const isAssistant = sender === "assistant";
    this.displayedContent = "";
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
        }
        .message-wrapper {
          display: flex;
          align-items: flex-end;
          width: 100%;
          margin-bottom: var(--spacing-6);
          gap: var(--spacing-2);
        }

        .message-wrapper--assistant {
          justify-content: flex-start;
        }

        .message-wrapper--user {
          justify-content: flex-end;
        }

        .assistant-icon {
          width: 30px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: var(--spacing-2);
        }

        .message {
          display: flex;
          max-width: 80%;
          padding: var(--spacing-4);
          border-radius: 20px;
          word-wrap: break-word;
          background-color: ${
            isAssistant ? "#FFFFFF" : "rgba(255, 255, 255, 0.1)"
          };
          color: ${isAssistant ? "#231F25" : "#FFFFFF"};
          border: ${isAssistant ? "none" : "1px solid #FFFFFF"};
          overflow: hidden;
          white-space: pre-wrap;
          font-family: inherit;
        }

        .message--assistant {
          background-color: #FFFFFF;
          color: #231F25 !important;
          border-bottom-left-radius: 4px;
        }

        .message--user {
          background-color: rgba(255, 255, 255, 0.1);
          border: 1px solid #FFFFFF;
          color: white;
        }

        .message__content {
          display: flex;
          flex-direction: column;
          gap: 1em;
          flex-grow: 1;
          font-family: inherit;
        }

        /* Markdown styling */
        .message__content h1, .message__content h2, .message__content h3 {
          margin: 0.5em 0;
        }

        .message__content a {
          color: #0066cc;
          text-decoration: none;
        }

        .message__content a:hover {
          text-decoration: underline;
        }

        .message__content strong {
          font-weight: bold;
        }

        .message__content em {
          font-style: italic;
        }

        /* Add more markdown styles as needed */
      </style>
      <div class="message-wrapper message-wrapper--${sender}">
        ${isAssistant ? `<div class="assistant-icon">🤖</div>` : ""}
        <div class="message message--${sender}">
          <div class="message__content">${content}</div>
        </div>
      </div>
    `;

    if (isAssistant && this.shouldAnimate) {
      this.animateContent();
    }
  }

  /**
   * Animates the message content by revealing it character by character
   * @param {string} [newContent] - Optional new content to animate
   */
  animateContent(newContent) {
    const sender = this.getAttribute("sender");
    const isAssistant = sender === "assistant";

    if (!isAssistant) return; // Only animate assistant messages

    const messageContent = this.shadowRoot.querySelector(".message__content");
    if (!messageContent) return;

    // If newContent is provided, we need to append it; otherwise, animate the full content
    let contentToAnimate = newContent || this.content;

    if (!newContent) {
      // For initial render
      contentToAnimate = this.content;
    }

    // Use the parseMarkdown to parse the full content
    const parsedHTML = parseMarkdown(contentToAnimate);

    // Create a temporary container to traverse the HTML elements
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = parsedHTML;

    // Initialize animation queue
    const nodes = Array.from(tempDiv.childNodes);

    // Clear existing content if animating entire message
    if (!newContent) {
      messageContent.innerHTML = "";
    }

    this.animateNodesSequentially(messageContent, nodes).then(() => {
      // Animation complete
    });
  }

  /**
   * Recursively animates HTML nodes one after another
   * @param {HTMLElement} container - The container to append animated nodes
   * @param {NodeList} nodes - The list of nodes to animate
   * @returns {Promise} - Resolves when all nodes are animated
   */
  async animateNodesSequentially(container, nodes) {
    for (const node of nodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        await this.animateTextNode(container, node.textContent);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = document.createElement(node.tagName.toLowerCase());

        // Copy attributes
        Array.from(node.attributes).forEach((attr) => {
          element.setAttribute(attr.name, attr.value);
        });

        container.appendChild(element);
        await this.animateNodesSequentially(element, node.childNodes);
      }
    }
  }

  /**
   * Animates a text node by revealing it character by character
   * @param {HTMLElement} container - The container to append the text
   * @param {string} text - The text content to animate
   * @returns {Promise} - Resolves when animation is complete
   */
  animateTextNode(container, text) {
    return new Promise((resolve) => {
      let index = 0;
      const span = document.createElement("span");
      container.appendChild(span);

      const animateInterval = setInterval(() => {
        if (index < text.length) {
          span.textContent += text[index];
          index++;
          this.scrollToBottom();
        } else {
          clearInterval(animateInterval);
          resolve();
        }
      }, this.currentAnimationSpeed);
    });
  }

  /**
   * Scroll the message container to the bottom
   * @private
   */
  scrollToBottom() {
    this.parentElement.scrollTop = this.parentElement.scrollHeight;
  }
}
