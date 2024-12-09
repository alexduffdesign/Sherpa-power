// /assets/scripts/chatbot/ui/message-component.js

/**
 * MessageComponent
 * Displays a message from either the user or the assistant.
 */
class MessageComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["sender", "content"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    const sender = this.getAttribute("sender");
    const content = this.getAttribute("content");

    const style = `
        <style>
          .message {
            padding: 10px;
            margin: 5px 0;
            border-radius: 5px;
            max-width: 80%;
            word-wrap: break-word;
          }
          .user {
            background-color: #dcf8c6;
            align-self: flex-end;
          }
          .assistant {
            background-color: #ffffff;
            align-self: flex-start;
          }
        </style>
      `;

    const messageClass = sender === "user" ? "user" : "assistant";

    const template = `
        ${style}
        <div class="message ${messageClass}">
          ${content}
        </div>
      `;

    this.shadowRoot.innerHTML = template;
  }
}

customElements.define("message-component", MessageComponent);
