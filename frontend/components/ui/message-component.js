// /assets/scripts/chatbot/components/message-component.js

import { parseMarkdown } from "../../utils/markdown-util.js";

export class MessageComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.isStreaming = false;
    this.rawChunks = []; // Store chunks with Markdown for streaming
    this.interimText = ""; // Store cleaned text for interim display during streaming
    this.animationFrameId = null; // For character-by-character animation
    this.defaultAnimationSpeed = 15;
    this.currentAnimationSpeed = this.defaultAnimationSpeed;
  }

  connectedCallback() {
    const sender = this.getAttribute("sender");
    const content = this.getAttribute("content") || "";
    this.isStreaming = this.hasAttribute("streaming"); // Check if the 'streaming' attribute is present
    this.render(sender, content);

    if (!this.isStreaming && content) {
      this.animateNonStreamedContent(content);
    }
  }

  /**
   * Append new content for streamed messages.
   * @param {string} newChunk - The new chunk of content.
   */
  appendContent(newChunk) {
    console.log("appendContent:", newChunk);
    this.isStreaming = true;
    this.rawChunks.push(newChunk);
    this.interimText += newChunk; // Keep newlines and whitespace for interim display
    this.updateInterimDisplay();
  }

  /**
   * Removes basic markdown syntax for interim display.
   * @param {string} text - The text to clean.
   * @returns {string} - The cleaned text.
   */
  cleanMarkdown(text) {
    return text
      .replace(/^(#+)\s/gm, "") // Remove headings
      .replace(/(\*\*|__)(.*?)\1/g, "$2") // Remove bold
      .replace(/(\*|_)(.*?)\1/g, "$2") // Remove italics
      .replace(/^([-+*])\s/gm, "") // Remove list markers
      .replace(/`([^`]*)`/g, "$1") // Remove inline code
      .trim();
  }

  /**
   * Updates the displayed message content with the cleaned interim text for streaming.
   */
  updateInterimDisplay() {
    const messageContent = this.shadowRoot.querySelector(".message__content");
    if (messageContent) {
      messageContent.textContent = this.cleanMarkdown(this.interimText); // Clean just before display
    }
  }

  /**
   * Finalizes the content of a streamed message by parsing markdown and animating the transition.
   */
  finalizeContentAndAnimate() {
    console.log("finalizeContentAndAnimate called");
    const messageContent = this.shadowRoot.querySelector(".message__content");
    if (messageContent) {
      const fullMarkdown = this.rawChunks.join("");
      console.log("Full Markdown:", fullMarkdown);
      const finalHTML = parseMarkdown(fullMarkdown);
      console.log("Final HTML:", finalHTML);

      // Animate the transition
      this.animateBlockTransition(messageContent, finalHTML);
    }
  }

  /**
   * Animates the transition from interim text to final HTML content for streamed messages.
   * @param {HTMLElement} element - The element containing the text.
   * @param {string} finalHTML - The final HTML content to display.
   */
  animateBlockTransition(element, finalHTML) {
    element.classList.add("fade-out");
    element.addEventListener(
      "transitionend",
      () => {
        element.innerHTML = finalHTML;
        element.classList.remove("fade-out");
        element.classList.add("fade-in");
      },
      { once: true }
    );
  }

  /**
   * Animates the message content for non-streamed messages by revealing it character by character.
   * @param {string} content - The raw markdown content to animate.
   */
  animateNonStreamedContent(content) {
    const messageContent = this.shadowRoot.querySelector(".message__content");
    if (!messageContent) return;

    const parsedHTML = parseMarkdown(content);
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = parsedHTML;

    this.animateNodesSequentially(messageContent, tempDiv.childNodes);
  }

  /**
   * Recursively animates HTML nodes one after another for non-streamed messages.
   * @param {HTMLElement} container - The container to append animated nodes.
   * @param {NodeList} nodes - The list of nodes to animate.
   * @returns {Promise<void>} - Resolves when all nodes are animated.
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
        if (node.textContent.trim() === "") continue;
        await this.animateTextNode(container, node.textContent);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName.toLowerCase();
        const isBlock = blockLevelElements.has(tagName);
        const element = document.createElement(tagName);

        Array.from(node.attributes).forEach((attr) => {
          element.setAttribute(attr.name, attr.value);
        });

        container.appendChild(element);

        await this.animateNodesSequentially(element, node.childNodes);
      }
    }
  }

  /**
   * Animates a text node by revealing it character by character using requestAnimationFrame.
   * @param {HTMLElement} container - The container to append the text.
   * @param {string} text - The text content to animate.
   * @returns {Promise<void>} - Resolves when animation is complete.
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
          align-items: flex-start;
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
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: var(--spacing-2);
          font-size: 1.2em;
          line-height: 1;
        }

        .message {
          display: inline-block;
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
          font-family: inherit;
          position: relative;
          opacity: 1;
          transition: opacity 0.3s ease-in-out;
          white-space: pre-wrap; /* Preserve newlines and spaces */
        }

        .message.fade-out {
          opacity: 0;
        }

        .message.fade-in {
          opacity: 1;
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
          font-family: inherit;
          word-break: break-word;
        }

        /* Markdown styling */
        .message__content h1,
        .message__content h2,
        .message__content h3,
        .message__content h4,
        .message__content h5,
        .message__content h6 {
          margin: 1em 0 0.5em 0;
          line-height: 1.2;
        }

        .message__content h1:first-child,
        .message__content h2:first-child,
        .message__content h3:first-child,
        .message__content h4:first-child,
        .message__content h5:first-child,
        .message__content h6:first-child {
          margin-top: 0;
        }

        .message__content h1 { font-size: 1.6em; }
        .message__content h2 { font-size: 1.4em; }
        .message__content h3 { font-size: 1.2em; }
        .message__content h4 { font-size: 1.1em; }
        .message__content h5 { font-size: 1em; }
        .message__content h6 { font-size: 0.9em; }

        .message__content a {
          color: #0066cc;
          text-decoration: none;
        }

        .message__content a:hover {
          text-decoration: underline;
        }

        .message__content p {
          margin: 0.5em 0;
          line-height: 1.4;
        }

        .message__content ul,
        .message__content ol {
          margin: 0.5em 0;
          padding-left: 2em;
        }

        .message__content li {
          margin: 0.25em 0;
        }

        .message__content code {
          background-color: rgba(0, 0, 0, 0.05);
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-family: monospace;
        }

        .message__content pre {
          background-color: rgba(0, 0, 0, 0.05);
          padding: 1em;
          border-radius: 4px;
          overflow-x: auto;
          margin: 0.5em 0;
        }

        .message__content pre code {
          background-color: transparent;
          padding: 0;
          border-radius: 0;
        }

        .message__content blockquote {
          margin: 0.5em 0;
          padding-left: 1em;
          border-left: 4px solid rgba(0, 0, 0, 0.1);
          color: rgba(0, 0, 0, 0.7);
        }

        .message__content img {
          max-width: 100%;
          height: auto;
        }

        .message__content table {
          border-collapse: collapse;
          margin: 0.5em 0;
          width: 100%;
        }

        .message__content th,
        .message__content td {
          border: 1px solid rgba(0, 0, 0, 0.1);
          padding: 0.4em 0.8em;
          text-align: left;
        }

        .message__content th {
          background-color: rgba(0, 0, 0, 0.05);
        }
      </style>
      <div class="message-wrapper message-wrapper--${sender}">
        ${isAssistant ? `<div class="assistant-icon">🤖</div>` : ""}
        <div class="message message--${sender}">
          <div class="message__content"></div>
        </div>
      </div>
    `;
  }

  /**
   * Scroll the message container to the bottom.
   * @private
   */
  scrollToBottom() {
    if (this.parentElement) {
      this.parentElement.scrollTop = this.parentElement.scrollHeight;
    }
  }

  /**
   * Clean up any ongoing animations when the component is disconnected.
   */
  disconnectedCallback() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
