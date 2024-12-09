// /assets/scripts/chatbot/ui/carousel-component.js

/**
 * CarouselComponent
 * Displays a carousel of items with images, titles, descriptions, and action buttons.
 */
class CarouselComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["items"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    const items = JSON.parse(this.getAttribute("items")) || [];

    const style = `
        <style>
          .carousel {
            display: flex;
            overflow-x: auto;
            scroll-behavior: smooth;
          }
          .carousel-item {
            flex: 0 0 auto;
            width: 200px;
            margin-right: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 10px;
            background-color: #f9f9f9;
          }
          .carousel-item img {
            width: 100%;
            height: auto;
            border-radius: 5px;
          }
          .carousel-item .title {
            font-weight: bold;
            margin: 10px 0 5px 0;
          }
          .carousel-item .description {
            font-size: 14px;
            margin-bottom: 10px;
          }
          .carousel-item button {
            padding: 5px 10px;
            border: none;
            border-radius: 3px;
            background-color: #28a745;
            color: #ffffff;
            cursor: pointer;
            font-size: 12px;
          }
          .carousel-item button:hover {
            background-color: #218838;
          }
        </style>
      `;

    const itemsHtml = items
      .map(
        (item) => `
        <div class="carousel-item">
          <img src="${item.imageUrl}" alt="${item.title}" />
          <div class="title">${item.title}</div>
          <div class="description">${item.description}</div>
          <button type="button" data-payload='${JSON.stringify(item.action)}'>${
          item.buttonLabel
        }</button>
        </div>
      `
      )
      .join("");

    const template = `
        ${style}
        <div class="carousel">
          ${itemsHtml}
        </div>
      `;

    this.shadowRoot.innerHTML = template;

    // Set up event delegation for button clicks within the carousel
    this.shadowRoot
      .querySelector(".carousel")
      .addEventListener("click", (e) => {
        if (e.target.tagName.toLowerCase() === "button") {
          const payload = JSON.parse(e.target.getAttribute("data-payload"));
          this.dispatchEvent(
            new CustomEvent("carouselButtonClicked", { detail: payload })
          );
        }
      });
  }
}

customElements.define("carousel-component", CarouselComponent);
