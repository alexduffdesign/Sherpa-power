export class TraceHandler {
  constructor(ui, history, onSpecialTrace) {
    this.ui = ui;
    this.history = history;
    this.onSpecialTrace = onSpecialTrace || (async () => {});
    this.completionBuffer = "";
    this.lastMessageContainer = null;
  }

  async handleTrace(event) {
    console.log("Handling trace event:", event.type, event);
    if (!event.type) {
      console.error("Received event with no type:", event);
      return;
    }

    const knownTypes = [
      "text",
      "choice",
      "carousel",
      "visual",
      "waiting_text",
      "RedirectToProduct",
      "completion",
      "end",
    ];
    if (!knownTypes.includes(event.type)) {
      console.warn("Ignoring unknown trace type:", event.type);
      return;
    }

    switch (event.type) {
      case "text":
        console.log("Adding text message:", event.payload.message);
        this.lastMessageContainer = this.ui.addMessage(
          "assistant",
          event.payload.message
        );
        this.history.updateHistory({
          type: "assistant",
          message: event.payload.message,
        });
        break;

      case "choice":
        console.log("Adding choice buttons:", event.payload.buttons);
        this.ui.addButtons(event.payload.buttons);
        this.history.updateHistory({
          type: "choice",
          buttons: event.payload.buttons,
          responded: false,
        });
        break;

      case "carousel":
        console.log("Adding carousel:", event.payload);
        this.ui.addCarousel(event.payload);
        this.history.updateHistory({
          type: "carousel",
          cards: event.payload.cards,
          responded: false,
        });
        break;

      case "visual":
        if (event.payload.visualType === "image") {
          console.log("Adding visual image:", event.payload);
          this.ui.addVisualImage(event.payload);
          this.history.updateHistory({ type: "visual", data: event.payload });
        }
        break;

      case "waiting_text":
        console.log("Showing typing indicator:", event.payload);
        this.ui.showTypingIndicator(event.payload);
        break;

      case "RedirectToProduct":
        const productHandle = event.payload?.body?.productHandle;
        if (productHandle) {
          console.log("Redirecting to product:", productHandle);
          await this.onSpecialTrace({
            type: "RedirectToProduct",
            productHandle,
          });
        }
        break;

      case "completion":
        console.log("Handling completion state:", event.payload.state);
        if (event.payload.state === "start") {
          this.completionBuffer = "";
        } else if (event.payload.state === "content") {
          this.completionBuffer += event.payload.content;
          this.ui.updateLatestAssistantMessage(this.completionBuffer);
        } else if (event.payload.state === "end") {
          this.history.updateHistory({
            type: "assistant",
            message: this.completionBuffer,
          });
        }
        break;

      case "end":
        console.log("End of trace event");
        this.lastMessageContainer = null; // Reset container reference at end of turn
        break;

      default:
        console.log("Unknown trace type:", event.type);
        break;
    }

    this.ui.scrollToBottom();
  }

  restoreHistory() {
    const history = this.history.getHistory();
    history.forEach((entry) => {
      switch (entry.type) {
        case "assistant":
          this.ui.addMessage("assistant", entry.message);
          break;
        case "user":
          this.ui.addMessage("user", entry.message);
          break;
        case "choice":
          // Only restore unresponded choices
          if (!entry.responded) {
            this.ui.addButtons(entry.buttons);
          }
          break;
        case "carousel":
          // Only restore unresponded carousels
          if (!entry.responded) {
            this.ui.addCarousel(entry);
          }
          break;
      }
    });
  }
}
