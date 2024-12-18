// /assets/scripts/chatbot/components/message-component.js

import { parseMarkdown } from "../../utils/markdown-util.js";

export class MessageComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.content = ""; // Initialize empty content
    this.displayedContent = ""; // Content currently displayed
    this.animationInterval = null;
    this.animationSpeed = 30; // milliseconds per character
  }

  connectedCallback() {
    const sender = this.getAttribute("sender");
    const initialContent = this.getAttribute("content") || "";
    this.content = initialContent;
    this.render(sender, this.content);
  }

  /**
   * Append new content to the message and animate it
   * @param {string} newContent - The new content to append
   */
  appendContent(newContent) {
    this.content += newContent;
    this.animateContent();
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

    if (isAssistant) {
      this.animateContent();
    }
  }

  /**
   * Animates the message content by revealing it character by character
   */
  animateContent() {
    const sender = this.getAttribute("sender");
    const isAssistant = sender === "assistant";

    if (!isAssistant) return; // Only animate assistant messages

    const messageContent = this.shadowRoot.querySelector(".message__content");
    if (!messageContent) return;

    const fullContent = this.content;
    this.displayedContent = "";

    // Clear any existing animation
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }

    // Clear the content for animation
    messageContent.innerHTML = "";

    // Use the marked parser to parse the full content into HTML
    const parsedHTML = parseMarkdown(fullContent);

    // Create a temporary container to traverse the HTML elements
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = parsedHTML;

    // Initialize animation queue
    const nodes = Array.from(tempDiv.childNodes);
    this.animateNodes(messageContent, nodes);
  }

  /**
   * Recursively animates HTML nodes
   * @param {HTMLElement} container - The container to append animated nodes
   * @param {NodeList} nodes - The list of nodes to animate
   */
  animateNodes(container, nodes) {
    nodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        this.animateTextNode(container, node.textContent);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = document.createElement(node.tagName.toLowerCase());

        // Copy attributes
        Array.from(node.attributes).forEach((attr) => {
          element.setAttribute(attr.name, attr.value);
        });

        container.appendChild(element);
        this.animateNodes(element, node.childNodes);
      }
    });
  }

  /**
   * Animates a text node by revealing it character by character
   * @param {HTMLElement} container - The container to append the text
   * @param {string} text - The text content to animate
   */
  animateTextNode(container, text) {
    let index = 0;
    const span = document.createElement("span");
    container.appendChild(span);

    this.animationInterval = setInterval(() => {
      if (index < text.length) {
        span.textContent += text[index];
        index++;
        this.scrollToBottom();
      } else {
        clearInterval(this.animationInterval);
        this.animationInterval = null;
      }
    }, this.animationSpeed);
  }

  /**
   * Scroll the message container to the bottom
   * @private
   */
  scrollToBottom() {
    this.parentElement.scrollTop = this.parentElement.scrollHeight;
  }
}
