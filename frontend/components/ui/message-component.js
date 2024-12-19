// /assets/scripts/chatbot/components/message-component.js

import { parseMarkdown } from "../../utils/markdown-util.js";

export class MessageComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.content = ""; // Initialize empty content
    this.animationFrameId = null; // To track the current animation frame
    this.defaultAnimationSpeed = 15; // milliseconds per character (quicker)
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
      this.appendContentStreamed(newContent);
    }
  }

  /**
   * Update the entire message content and re-render with markdown
   * @param {string} newContent - The new content to set
   */
  updateContent(newContent) {
    this.content = newContent;
    const messageContent = this.shadowRoot.querySelector(".message__content");
    if (messageContent) {
      // Directly set the parsed markdown without re-rendering
      messageContent.innerHTML = parseMarkdown(newContent);
    }
  }

  /**
   * Append content for streamed messages without re-parsing the entire content
   * @param {string} newContent - The new content to append
   */
  appendContentStreamed(newContent) {
    const messageContent = this.shadowRoot.querySelector(".message__content");
    if (!messageContent) return;

    // Parse the new content chunk
    const parsedHTML = parseMarkdown(newContent);

    // Create a temporary container to extract the parsed elements
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = parsedHTML;

    // Append each child from the parsed HTML to the message content
    Array.from(tempDiv.childNodes).forEach((node) => {
      messageContent.appendChild(node.cloneNode(true));
    });

    this.scrollToBottom();
  }

  /**
   * Renders the message with markdown support and initializes animation
   * @param {string} sender - The sender of the message ('user' or 'assistant')
   * @param {string} content - The raw markdown content
   */
  render(sender, content) {
    const isAssistant = sender === "assistant";
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
        }
        p {
          margin-top: var(--spacing-1);
          margin-bottom: var(--spacing-1);
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
          <div class="message__content"></div>
        </div>
      </div>
    `;

    if (isAssistant && this.shouldAnimate) {
      this.animateContent(content);
    } else if (isAssistant && !this.shouldAnimate) {
      this.updateContentStreamed(content);
    } else {
      this.updateContent(content);
    }
  }

  /**
   * Animates the message content by revealing it character by character
   * Uses requestAnimationFrame for better performance
   * @param {string} content - The raw markdown content to animate
   */
  animateContent(content) {
    const sender = this.getAttribute("sender");
    const isAssistant = sender === "assistant";

    if (!isAssistant) return; // Only animate assistant messages

    const messageContent = this.shadowRoot.querySelector(".message__content");
    if (!messageContent) return;

    // Parse markdown once to avoid double parsing
    const parsedHTML = parseMarkdown(content);

    // Clear existing content
    messageContent.innerHTML = "";

    // Create a temporary container to traverse the HTML elements
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = parsedHTML;

    // Initialize animation queue
    const nodes = Array.from(tempDiv.childNodes);

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
    const blockLevelElements = new Set([
      "p",
      "div",
      "h1",
      "h2",
      "h3",
      "ul",
      "ol",
      "li",
      "blockquote",
      "pre",
      "h4",
      "h5",
      "h6",
    ]);

    for (const node of nodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        // Skip empty or whitespace-only text nodes
        if (node.textContent.trim() === "") continue;
        await this.animateTextNode(container, node.textContent);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName.toLowerCase();
        const isBlock = blockLevelElements.has(tagName);

        const element = document.createElement(tagName);

        // Copy attributes
        Array.from(node.attributes).forEach((attr) => {
          element.setAttribute(attr.name, attr.value);
        });

        container.appendChild(element);

        if (isBlock) {
          // Animate child nodes without wrapping in spans
          await this.animateNodesSequentially(element, node.childNodes);
        } else {
          // For inline elements, animate child nodes
          await this.animateNodesSequentially(element, node.childNodes);
        }
      }
    }
  }

  /**
   * Animates a text node by revealing it character by character using requestAnimationFrame
   * @param {HTMLElement} container - The container to append the text
   * @param {string} text - The text content to animate
   * @returns {Promise} - Resolves when animation is complete
   */
  animateTextNode(container, text) {
    return new Promise((resolve) => {
      let index = 0;
      const span = document.createElement("span");
      container.appendChild(span);

      let lastTime = performance.now();

      const animate = (currentTime) => {
        const deltaTime = currentTime - lastTime;
        if (deltaTime >= this.currentAnimationSpeed) {
          span.textContent += text[index];
          index++;
          this.scrollToBottom();
          lastTime = currentTime;
        }
        if (index < text.length) {
          this.animationFrameId = requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };

      this.animationFrameId = requestAnimationFrame(animate);
    });
  }

  /**
   * Update the message content for streamed messages without re-parsing the entire content
   * @param {string} newContent - The new content to set
   */
  updateContentStreamed(newContent) {
    const messageContent = this.shadowRoot.querySelector(".message__content");
    if (!messageContent) return;

    // Parse the new content chunk
    const parsedHTML = parseMarkdown(newContent);

    // Create a temporary container to extract the parsed elements
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = parsedHTML;

    // Append each child from the parsed HTML to the message content
    Array.from(tempDiv.childNodes).forEach((node) => {
      messageContent.appendChild(node.cloneNode(true));
    });

    this.scrollToBottom();
  }

  /**
   * Scroll the message container to the bottom
   * @private
   */
  scrollToBottom() {
    this.parentElement.scrollTop = this.parentElement.scrollHeight;
  }

  /**
   * Clean up any ongoing animations when the component is disconnected
   */
  disconnectedCallback() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
