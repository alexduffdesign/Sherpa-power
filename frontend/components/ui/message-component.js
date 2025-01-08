// /assets/scripts/chatbot/components/message-component.js

import { parseMarkdown } from "../../utils/markdown-util.js";
import { animateHTMLContent } from "../../utils/animation-util.js";
import { StreamingMarkdownParser } from "../../utils/streaming-markdown-parser.js";

export class MessageComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.isStreaming = false;
    this.animationFrameId = null; // For character-by-character animation
    this.defaultAnimationSpeed = 5; // ms per character
    this.currentAnimationSpeed = this.defaultAnimationSpeed;
    this.streamingParser = null;
  }

  connectedCallback() {
    const sender = this.getAttribute("sender");
    const content = this.getAttribute("content") || "";
    this.isStreaming = this.hasAttribute("streaming");
    const animate = this.getAttribute("data-animate") !== "false";
    this.currentAnimationSpeed = parseInt(
      this.getAttribute("data-animation-speed") || this.defaultAnimationSpeed,
      5
    );

    this.render(sender, content);

    const messageContent = this.shadowRoot.querySelector(".message__content");
    if (!messageContent) return;

    if (!this.isStreaming && content) {
      // Check if content is already HTML (from history)
      const isHTML = /<[a-z][\s\S]*>/i.test(content);

      if (isHTML) {
        // Content is HTML, insert directly
        if (animate) {
          animateHTMLContent(
            messageContent,
            content,
            this.currentAnimationSpeed
          );
        } else {
          messageContent.innerHTML = content;
        }
      } else {
        // Content is markdown, parse it
        this.streamingParser = new StreamingMarkdownParser((htmlSegment) => {
          if (!this.tempContent) this.tempContent = "";
          this.tempContent += htmlSegment;
        });

        this.streamingParser.appendText(content);
        this.streamingParser.end();

        if (animate) {
          animateHTMLContent(
            messageContent,
            this.tempContent,
            this.currentAnimationSpeed
          );
        } else {
          messageContent.innerHTML = this.tempContent;
        }
      }

      this.scrollToBottom();
    } else if (this.isStreaming) {
      this.streamingParser = new StreamingMarkdownParser((htmlSegment) => {
        this.appendHTMLContent(htmlSegment);
      });
      this.streamingParser.appendText(content);
    }
  }

  /**
   * Append new content for streamed messages.
   * @param {string} newChunk - The new chunk of content.
   */
  appendContent(newChunk) {
    console.log("appendContent:", newChunk);
    if (this.streamingParser) {
      this.streamingParser.appendText(newChunk);
    } else {
      // Fallback to simple markdown parsing if parser isn't initialized
      const html = parseMarkdown(newChunk);
      this.appendHTMLContent(html);
    }
  }

  /**
   * Append HTML content directly to the message.
   * @param {string} htmlSegment - The HTML segment to append.
   */
  appendHTMLContent(htmlSegment) {
    const messageContent = this.shadowRoot.querySelector(".message__content");
    if (messageContent) {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlSegment;
      // Append child nodes to messageContent
      while (tempDiv.firstChild) {
        messageContent.appendChild(tempDiv.firstChild);
      }
      this.scrollToBottom();
    }
  }

  /**
   * Finalizes the content of a streamed message by parsing remaining markdown and updating the UI.
   */
  finalizeContentAndAnimate() {
    console.log("finalizeContentAndAnimate called");
    if (this.streamingParser) {
      this.streamingParser.end();
      this.streamingParser = null;
    }
  }

  render(sender, content) {
    const isAssistant = sender === "assistant";
    this.shadowRoot.innerHTML = `
      <style>
        h1, h2, h3, h4, h5, h6 {
          font-family: var(--heading-font-family);
          font-weight: var(--heading-font-weight);
        }
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
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2em;
          line-height: 1;
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
          font-family: inherit;
          position: relative;
          opacity: 1;
          transition: opacity 0.3s ease-in-out;
          white-space: pre-wrap; /* Preserve newlines and spaces */
        }

        .message.fade-out {
          opacity: 0;
        }

        .message__content.fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
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
          grid-gap: 0.2rem;
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
          line-height: 1.4;
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

        .message__content ul li:first-child,
        .message__content ol li:first-child {
          margin-top: 0;
        }

        .message__content ul li:last-child,
        .message__content ol li:last-child {
          margin-bottom: 0;
        }

        .message__content p + ul,
        .message__content p + ol {
          margin-top: 0.25em;
        }

        .message__content ul + p,
        .message__content ol + p {
          margin-top: 0.25em;
        }
      </style>
      <div class="message-wrapper message-wrapper--${sender}">
        ${
          isAssistant
            ? `<img class="assistant-icon" src="https://cdn.shopify.com/s/files/1/0641/4290/1439/files/sherpa-icon.svg?v=1736167714">`
            : ""
        }
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
    if (this.streamingParser) {
      this.streamingParser.end();
      this.streamingParser = null;
    }
  }
}
