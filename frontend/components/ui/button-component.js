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
          --button-background: var(--button-background-primary) /
            var(--button-background-opacity, 1);
          --button-text-color: var(--button-text-primary);
          --button-outline-color: white;
          -webkit-appearance: none;
          appearance: none;
          border-color: white;
          border-radius: 8px;
          border-width: 1px;
          background-color: rgb(var(--button-background));
          color: rgb(var(--button-text-color));
          text-align: center;
          font-size: var(--text-h6);
          letter-spacing: var(--text-letter-spacing);
          padding-block-start: var(--spacing-2-5);
          padding-block-end: var(--spacing-2-5);
          padding-inline-start: var(--spacing-5);
          padding-inline-end: var(--spacing-5);
          font-weight: bold;
          line-height: 1.6;
          transition: background-color 0.15s ease-in-out, color 0.15s ease-in-out,
            box-shadow 0.15s ease-in-out;
          display: inline-block;
          position: relative;
        }

        .button:hover {
          background-color: #35AE87;
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
