// /assets/scripts/chatbot/components/message-component.js

import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";
import DOMPurify from "dompurify"; // Ensure you install DOMPurify via npm or include it in your project

export class MessageComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.content = ""; // Initialize empty content
    this.animationFrameId = null; // To track the current animation frame
    this.defaultAnimationSpeed = 5; // milliseconds per character (quicker)
    this.currentAnimationSpeed = this.defaultAnimationSpeed;
    this.shouldAnimate = true;

    this.buffer = ""; // Buffer to accumulate incoming chunks
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
   * Append new content to the message and handle markdown formatting
   * @param {string} newContent - The new content to append
   */
  appendContent(newContent) {
    this.buffer += newContent;

    // Process all complete blocks in the buffer
    let completeBlock = this.extractCompleteBlock(this.buffer);
    while (completeBlock) {
      const { block, remaining } = completeBlock;
      this.content += block;
      this.buffer = remaining;

      if (this.shouldAnimate) {
        this.animateContent(block);
      } else {
        this.appendContentStreamed(block);
      }

      completeBlock = this.extractCompleteBlock(this.buffer);
    }
    // If no complete block is found, do not parse yet
  }

  /**
   * Extracts a complete Markdown block from the buffer
   * @param {string} buffer - The current buffer
   * @returns {Object|null} - Contains the complete block and remaining buffer or null
   */
  extractCompleteBlock(buffer) {
    // Define Markdown block delimiters
    const markdownBlockDelimiters = [
      /^#{1,6}\s/, // Headers
      /^[-*+]\s/, // Unordered Lists
      /^\d+\.\s/, // Ordered Lists
      /^```/, // Code Blocks
      /^> /, // Blockquotes
      /^\n{2,}/, // Double Line Breaks
    ];

    // Split buffer into lines for analysis
    const lines = buffer.split("\n");
    let completeBlock = [];
    let remainingLines = [];
    let foundComplete = false;
    let inCodeBlock = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();

      // Handle code blocks
      if (trimmedLine.startsWith("```")) {
        inCodeBlock = !inCodeBlock;
        completeBlock.push(line);

        if (!inCodeBlock) {
          foundComplete = true;
          remainingLines = lines.slice(i + 1);
          break;
        }
        continue;
      }

      // If inside a code block, continue without checking other delimiters
      if (inCodeBlock) {
        completeBlock.push(line);
        continue;
      }

      // Check for other Markdown block delimiters
      const isDelimiter = markdownBlockDelimiters.some((regex) =>
        regex.test(line)
      );
      if (isDelimiter && completeBlock.length > 0) {
        foundComplete = true;
        remainingLines = lines.slice(i);
        break;
      }

      completeBlock.push(line);

      // Detect double line breaks indicating end of a paragraph or block
      if (trimmedLine === "" && completeBlock.length > 0) {
        foundComplete = true;
        remainingLines = lines.slice(i + 1);
        break;
      }
    }

    if (foundComplete) {
      return {
        block: completeBlock.join("\n"),
        remaining: remainingLines.join("\n"),
      };
    }

    return null;
  }

  /**
   * Append content for streamed messages with markdown support
   * @param {string} newContent - The new content to append
   */
  async appendContentStreamed(newContent) {
    const messageContent = this.shadowRoot.querySelector(".message__content");
    if (!messageContent) return;

    // Parse the new content chunk using remark
    const parsedHTML = await remark().use(gfm).use(html).process(newContent);
    const sanitizedHTML = DOMPurify.sanitize(parsedHTML.toString());

    // Create a temporary container to extract the parsed elements
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = sanitizedHTML;

    // Append each child from the parsed HTML to the message content
    Array.from(tempDiv.childNodes).forEach((node) => {
      messageContent.appendChild(node.cloneNode(true));
    });

    this.scrollToBottom();
  }

  /**
   * Update the entire message content and re-render with markdown
   * @param {string} newContent - The new content to set
   */
  async updateContent(newContent) {
    this.content = newContent;
    const messageContent = this.shadowRoot.querySelector(".message__content");
    if (messageContent) {
      // Parse the new content using remark
      const parsedHTML = await remark().use(gfm).use(html).process(newContent);
      const sanitizedHTML = DOMPurify.sanitize(parsedHTML.toString());

      // Directly set the parsed and sanitized HTML
      messageContent.innerHTML = sanitizedHTML;
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
   * @param {string} content - The raw markdown content to animate
   */
  async animateContent(content) {
    const messageContent = this.shadowRoot.querySelector(".message__content");
    if (!messageContent) return;

    // Parse markdown using remark
    const parsedHTML = await remark().use(gfm).use(html).process(content);
    const sanitizedHTML = DOMPurify.sanitize(parsedHTML.toString());

    // Create a temporary container to traverse the HTML elements
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = sanitizedHTML;

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
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "blockquote",
      "pre",
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
   * Update the entire message content and re-render with markdown
   * @param {string} newContent - The new content to set
   */
  async updateContentStreamed(newContent) {
    const messageContent = this.shadowRoot.querySelector(".message__content");
    if (!messageContent) return;

    // Parse the new content chunk using remark
    const parsedHTML = await remark().use(gfm).use(html).process(newContent);
    const sanitizedHTML = DOMPurify.sanitize(parsedHTML.toString());

    // Create a temporary container to extract the parsed elements
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = sanitizedHTML;

    // Merge with existing content if needed
    const lastChild = messageContent.lastChild;
    if (lastChild) {
      const lastTag = lastChild.tagName?.toLowerCase();
      const firstNewChild = tempDiv.firstChild;
      const firstNewTag = firstNewChild?.tagName?.toLowerCase();

      // If both are the same type of header or paragraph, merge them
      if (
        lastTag === firstNewTag &&
        (lastTag?.startsWith("h") || lastTag === "p")
      ) {
        lastChild.innerHTML += " " + firstNewChild.innerHTML;
        tempDiv.removeChild(firstNewChild);
      }
      // Handle list merging
      else if (
        (lastTag === "ul" && firstNewTag === "ul") ||
        (lastTag === "ol" && firstNewTag === "ol")
      ) {
        while (firstNewChild.firstChild) {
          lastChild.appendChild(firstNewChild.firstChild);
        }
        tempDiv.removeChild(firstNewChild);
      }
    }

    // Append remaining new content
    while (tempDiv.firstChild) {
      messageContent.appendChild(tempDiv.firstChild);
    }

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
