// /assets/scripts/chatbot/components/button-component.js

import eventBus from "../../utils/event-bus.js";

export class ButtonComponent extends HTMLElement {
  constructor() {
    super();
    // Attach Shadow DOM to encapsulate styles
    this.attachShadow({ mode: "open" });
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

        /* Additional styles as needed */
      </style>
      <div class="button-container">
        <button class="button" data-button-data='${payload}' aria-label="${label}">${label}</button>
      </div>
    `;

    // Add event listener to the button
    this.shadowRoot.querySelector(".button").addEventListener("click", () => {
      // Emit event via eventBus
      try {
        const parsedPayload = JSON.parse(payload);
        eventBus.emit("buttonClicked", parsedPayload);
      } catch (error) {
        console.error("Error parsing button payload:", error);
      }
    });
  }
}
