// /assets/scripts/chatbot/components/message-component.js

import { parseMarkdown } from "../../utils/markdown-util.js";

export class MessageComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.rawChunks = []; // Store chunks with Markdown
    this.interimText = "";
  }

  connectedCallback() {
    const sender = this.getAttribute("sender");
    this.render(sender);
  }

  /**
   * Append new content, clean it for interim display, and store raw chunk.
   * @param {string} newChunk - The new chunk of content.
   */
  appendContent(newChunk) {
    this.rawChunks.push(newChunk);
    this.interimText += this.cleanMarkdown(newChunk);
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
   * Updates the displayed message content with the cleaned interim text.
   */
  updateInterimDisplay() {
    const messageContent = this.shadowRoot.querySelector(".message__content");
    if (messageContent) {
      messageContent.textContent = this.interimText;
    }
  }

  /**
   * Finalizes the content by parsing markdown and animating the transition.
   */
  finalizeContentAndAnimate() {
    const messageContent = this.shadowRoot.querySelector(".message__content");
    if (messageContent) {
      const fullMarkdown = this.rawChunks.join("");
      const finalHTML = parseMarkdown(fullMarkdown);

      // Store the final HTML temporarily
      this.finalHTMLContent = finalHTML;

      // Animate the transition
      this.animateBlockTransition(messageContent, finalHTML);
    }
  }

  /**
   * Animates the transition from interim text to final HTML content.
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

  render(sender) {
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
          align-items: flex-start; /* Align items to the start */
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
          height: 30px; /* Adjust height to match message */
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: var(--spacing-2);
          font-size: 1.2em;
          line-height: 1; /* Ensure proper vertical alignment */
        }

        .message {
          display: inline-block; /* Change to inline-block */
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
          position: relative; /* For fade effect */
          opacity: 1;
          transition: opacity 0.3s ease-in-out;
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
          word-break: break-word; /* Ensure words break to prevent overflow */
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
}
