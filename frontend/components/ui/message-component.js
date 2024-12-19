import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";
import DOMPurify from "dompurify"; // Ensure DOMPurify is installed

export class MessageComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.content = ""; // Complete accumulated content
    this.buffer = ""; // Buffer for accumulating streamed chunks
    this.shouldAnimate = true;
  }

  connectedCallback() {
    const sender = this.getAttribute("sender");
    const initialContent = this.getAttribute("content") || "";
    this.content = initialContent;

    this.render(sender, this.content);
  }

  /**
   * Append new content to the buffer and process complete blocks
   * @param {string} newContent - The new content chunk
   */
  appendContent(newContent) {
    this.buffer += newContent;

    let completeBlock;
    while ((completeBlock = this.extractCompleteBlock(this.buffer)) !== null) {
      const { block, remaining } = completeBlock;

      this.content += block;
      this.buffer = remaining;

      if (this.shouldAnimate) {
        this.animateContent(block);
      } else {
        this.appendContentStreamed(block);
      }
    }
  }

  /**
   * Extracts a complete Markdown block from the buffer based on newlines
   * @param {string} buffer - The current buffer
   * @returns {Object|null} - Contains the complete block and remaining buffer
   */
  extractCompleteBlock(buffer) {
    const delimiter = "\n\n"; // Double newline indicates a complete Markdown block
    const delimiterIndex = buffer.indexOf(delimiter);

    if (delimiterIndex !== -1) {
      const block = buffer.slice(0, delimiterIndex + delimiter.length);
      const remaining = buffer.slice(delimiterIndex + delimiter.length);
      return { block, remaining };
    }

    return null; // No complete block found
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

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = sanitizedHTML;

    Array.from(tempDiv.childNodes).forEach((node) => {
      messageContent.appendChild(node.cloneNode(true));
    });

    this.scrollToBottom();
  }

  /**
   * Animates the message content by revealing it character by character
   * @param {string} content - The raw markdown content to animate
   */
  async animateContent(content) {
    const messageContent = this.shadowRoot.querySelector(".message__content");
    if (!messageContent) return;

    const parsedHTML = await remark().use(gfm).use(html).process(content);
    const sanitizedHTML = DOMPurify.sanitize(parsedHTML.toString());

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = sanitizedHTML;

    const nodes = Array.from(tempDiv.childNodes);
    this.animateNodesSequentially(messageContent, nodes);
  }

  /**
   * Recursively animates HTML nodes one after another
   * @param {HTMLElement} container - The container to append animated nodes
   * @param {NodeList} nodes - The list of nodes to animate
   */
  async animateNodesSequentially(container, nodes) {
    for (const node of nodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent.trim() !== "") {
          await this.animateTextNode(container, node.textContent);
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = document.createElement(node.tagName.toLowerCase());
        Array.from(node.attributes).forEach((attr) => {
          element.setAttribute(attr.name, attr.value);
        });
        container.appendChild(element);
        await this.animateNodesSequentially(
          element,
          Array.from(node.childNodes)
        );
      }
    }
  }

  /**
   * Animates a text node character by character
   * @param {HTMLElement} container - The container to append the text
   * @param {string} text - The text content to animate
   * @returns {Promise<void>}
   */
  animateTextNode(container, text) {
    return new Promise((resolve) => {
      let index = 0;
      const span = document.createElement("span");
      container.appendChild(span);

      const animate = () => {
        span.textContent += text[index];
        index++;
        this.scrollToBottom();

        if (index < text.length) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };

      requestAnimationFrame(animate);
    });
  }

  /**
   * Scroll the message container to the bottom
   */
  scrollToBottom() {
    this.parentElement.scrollTop = this.parentElement.scrollHeight;
  }

  render(sender, content) {
    const isAssistant = sender === "assistant";
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
        }
        .message__content {
          font-family: inherit;
          white-space: pre-wrap;
        }
      </style>
      <div class="message__content"></div>
    `;

    if (isAssistant && this.shouldAnimate) {
      this.animateContent(content);
    } else {
      this.appendContentStreamed(content);
    }
  }
}
