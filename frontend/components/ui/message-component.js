// /assets/scripts/chatbot/components/message-component.js

import { parseMarkdown } from "../../utils/markdown-util.js";

export class MessageComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.content = "";
    this.buffer = "";
    this.debounceTimer = null;
    this.debounceInterval = 200; // milliseconds - adjust as needed
  }

  connectedCallback() {
    const sender = this.getAttribute("sender");
    this.render(sender, this.content);
  }

  /**
   * Appends new content to the buffer and triggers the debounced formatting.
   * @param {string} newContent - The new content to append
   */
  appendContent(newContent) {
    this.buffer += newContent;
    this.triggerDebouncedFormat();
  }

  /**
   * Clears any existing debounce timer and sets a new one.
   */
  triggerDebouncedFormat() {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(
      this.formatAndDisplay.bind(this),
      this.debounceInterval
    );
  }

  /**
   * Formats the current buffer content using Markdown and updates the display.
   */
  formatAndDisplay() {
    const messageContent = this.shadowRoot.querySelector(".message__content");
    if (messageContent) {
      messageContent.innerHTML = parseMarkdown(this.buffer);
    }
  }

  /**
   * Updates the entire message content and re-renders with markdown
   * @param {string} content - The new content to set
   */
  updateContent(newContent) {
    this.content = newContent;
    const messageContent = this.shadowRoot.querySelector(".message__content");
    if (messageContent) {
      messageContent.innerHTML = parseMarkdown(newContent);
    }
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
    this.updateContentDisplay(this.content);
  }

  /**
   * Updates the message content display. For debouncing, we initially show plain text.
   * @param {string} text - The text content to display
   */
  updateContentDisplay(text) {
    const messageContent = this.shadowRoot.querySelector(".message__content");
    if (messageContent) {
      messageContent.textContent = this.buffer; // Display the raw buffer content
    }
  }

  /**
   * Clean up the debounce timer when the component is disconnected.
   */
  disconnectedCallback() {
    clearTimeout(this.debounceTimer);
  }
}
