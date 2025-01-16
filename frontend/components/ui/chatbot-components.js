// frontend/components/ui/chatbot-components.js
import { ButtonComponent } from "./button-component.js";
import { MessageComponent } from "./message-component.js";
import { CarouselComponent } from "./carousel-component.js";

// Register custom components
customElements.define("button-component", ButtonComponent);
customElements.define("message-component", MessageComponent);
customElements.define("carousel-component", CarouselComponent);
console.log("MessageComponent defined");
console.log("ButtonComponent defined");
console.log("CarouselComponent defined");
