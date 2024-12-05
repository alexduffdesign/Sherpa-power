export class TraceHandler {
  constructor(ui, history, onSpecialTrace) {
    this.ui = ui;
    this.history = history;
    this.onSpecialTrace = onSpecialTrace || (async () => {});

    this.completionBuffer = "";
  }

  async handleTrace(event) {
    if (!event.type) {
      console.error("Received event with no type:", event);
      return;
    }

    switch (event.type) {
      case "text":
        this.ui.addMessage("assistant", event.payload.message);
        this.history.updateHistory({
          type: "assistant",
          message: event.payload.message,
        });
        break;

      case "choice":
        this.ui.addButtons(event.payload.buttons);
        this.history.updateHistory({
          type: "choice",
          buttons: event.payload.buttons,
        });
        break;

      case "carousel":
        this.ui.addCarousel(event.payload);
        this.history.updateHistory({ type: "carousel", data: event.payload });
        break;

      case "visual":
        if (event.payload.visualType === "image") {
          this.ui.addVisualImage(event.payload);
          this.history.updateHistory({ type: "visual", data: event.payload });
        }
        break;

      case "waiting_text":
        this.ui.showTypingIndicator(event.payload);
        break;

      case "RedirectToProduct":
        const productHandle = event.payload?.body?.productHandle;
        if (productHandle) {
          await this.onSpecialTrace({
            type: "RedirectToProduct",
            productHandle,
          });
        }
        break;

      case "completion":
        // Streaming LLM responses
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
        // End of turn
        break;

      default:
        console.log("Unknown trace type:", event.type);
        break;
    }

    this.ui.scrollToBottom();
  }
}
