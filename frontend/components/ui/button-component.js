// /assets/scripts/chatbot/components/button-component.js

export class ButtonComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._eventBus = null; // Will be set via setter
  }

  set eventBus(bus) {
    this._eventBus = bus;
  }

  connectedCallback() {
    const label = this.getAttribute("label");
    const payload = this.getAttribute("payload");
    this.render(label, payload);
  }

  /**
   * Renders the button with embedded styles.
   * @param {string} label - The button label
   * @param {string} payload - The button payload in JSON string format
   */
  render(label, payload) {
    this.shadowRoot.innerHTML = `
      <style>
        .button-container {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: var(--spacing-4);
        }

        .button {
          padding: var(--spacing-3);
          background-color: #FFFFFF;
          border: none;
          border-radius: var(--rounded);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          transition: background-color 0.3s ease;
        }

        .button:hover {
          background-color: #f0f0f0;
        }
      </style>
      <div class="button-container">
        <button class="button" data-button-data='${payload}' aria-label="${label}">${label}</button>
      </div>
    `;

    this.shadowRoot.querySelector(".button").addEventListener("click", () => {
      if (!this._eventBus) {
        console.error("No eventBus assigned to ButtonComponent");
        return;
      }

      try {
        const parsedPayload = JSON.parse(payload);
        this._eventBus.emit("buttonClicked", parsedPayload);
      } catch (error) {
        console.error("Error parsing button payload:", error);
      }
    });
  }
}
