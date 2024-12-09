// /assets/scripts/chatbot/ui/button-component.js

/**
 * ButtonComponent
 * Renders an interactive button with a label and associated payload.
 */
class ButtonComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["label", "payload"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    const label = this.getAttribute("label");

    const style = `
        <style>
          button {
            padding: 10px 20px;
            margin: 5px;
            border: none;
            border-radius: 5px;
            background-color: #007bff;
            color: #ffffff;
            cursor: pointer;
            font-size: 14px;
          }
          button:hover {
            background-color: #0056b3;
          }
        </style>
      `;

    const template = `
        ${style}
        <button type="button">${label}</button>
      `;

    this.shadowRoot.innerHTML = template;
  }
}

customElements.define("button-component", ButtonComponent);
