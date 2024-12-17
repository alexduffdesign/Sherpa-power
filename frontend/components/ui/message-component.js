// /assets/scripts/chatbot/components/message-component.js

export class MessageComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const sender = this.getAttribute("sender");
    const content = this.getAttribute("content");
    this.render(sender, content);
  }

  render(sender, content) {
    const isAssistant = sender === "assistant";
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
      </style>
      <div class="message-wrapper message-wrapper--${sender}">
        ${isAssistant ? `<div class="assistant-icon">🚀</div>` : ""}
        <div class="message message--${sender}">
          <div class="message__content">${this.markdownToHtml(content)}</div>
        </div>
      </div>
    `;
  }

  markdownToHtml(markdown) {
    if (!markdown) return "";
    return markdown.replace(/\n/g, "<br>");
  }
}
