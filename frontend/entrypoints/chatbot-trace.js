export class TraceHandler {
  constructor(ui, history, onSpecialTrace) {
    this.ui = ui;
    this.history = history;
    this.onSpecialTrace = onSpecialTrace || (async () => {});
    this.completionBuffer = "";
    this.lastMessageContainer = null;
    this.pendingMessages = [];
    this.processingTrace = false;
  }

  async handleTrace(event) {
    if (this.processingTrace) {
      console.log("Already processing a trace, queueing:", event);
      this.pendingMessages.push(event);
      return;
    }

    this.processingTrace = true;
    try {
      console.log("Handling trace event:", event.type, event);

      if (!event.type) {
        console.error("Received event with no type:", event);
        return;
      }

      if (!this.ui) {
        console.error("UI manager not available");
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
          if (!event.payload) {
            console.error("Invalid text payload:", event.payload);
            return;
          }
          console.log("Processing text event:", event);

          // Hide typing indicator before adding message
          this.ui.hideTypingIndicator();

          try {
            // Handle different message formats
            if (typeof event.payload === "string") {
              this.lastMessageContainer = this.ui.addMessage(
                "assistant",
                event.payload
              );
            } else if (event.payload.slate) {
              // Extract text from slate format
              const text = event.payload.slate.content
                .map((block) =>
                  block.children.map((child) => child.text).join("")
                )
                .join("\n");

              this.lastMessageContainer = this.ui.addMessage("assistant", text);

              if (this.history) {
                this.history.updateHistory({
                  type: "assistant",
                  message: text,
                });
              }
            } else if (event.payload.message) {
              this.lastMessageContainer = this.ui.addMessage(
                "assistant",
                event.payload.message
              );

              if (this.history) {
                this.history.updateHistory({
                  type: "assistant",
                  message: event.payload.message,
                });
              }
            } else {
              console.error("Unsupported text payload format:", event.payload);
            }
          } catch (error) {
            console.error("Error processing text event:", error);
          }
          break;

        case "waiting_text":
          console.log("Showing typing indicator:", event.payload);
          this.ui.showTypingIndicator(event.payload);
          break;

        case "choice":
          if (!Array.isArray(event.payload?.buttons)) {
            console.error("Invalid choice payload:", event.payload);
            return;
          }
          // Hide typing indicator before adding buttons
          this.ui.hideTypingIndicator();

          console.log("Adding choice buttons:", event.payload.buttons);
          this.ui.addButtons(event.payload.buttons);
          if (this.history) {
            this.history.updateHistory({
              type: "choice",
              buttons: event.payload.buttons,
            });
          }
          break;

        case "carousel":
          // Hide typing indicator before adding carousel
          this.ui.hideTypingIndicator();

          console.log("Adding carousel:", event.payload);
          this.ui.addCarousel(event.payload);
          if (this.history) {
            this.history.updateHistory({
              type: "carousel",
              cards: event.payload.cards,
            });
          }
          break;

        case "visual":
          if (event.payload?.visualType === "image") {
            // Hide typing indicator before adding image
            this.ui.hideTypingIndicator();

            console.log("Adding visual image:", event.payload);
            this.ui.addVisualImage(event.payload);
            if (this.history) {
              this.history.updateHistory({
                type: "visual",
                data: event.payload,
              });
            }
          }
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
          if (!event.payload?.state) {
            console.error("Invalid completion payload:", event.payload);
            return;
          }

          if (event.payload.state === "start") {
            this.completionBuffer = "";
            this.ui.showTypingIndicator();
          } else if (event.payload.state === "content") {
            this.completionBuffer += event.payload.content || "";
            // Update the message in real-time as we receive content
            if (this.lastMessageContainer) {
              this.ui.updateMessage(
                this.lastMessageContainer,
                this.completionBuffer
              );
            } else {
              this.lastMessageContainer = this.ui.addMessage(
                "assistant",
                this.completionBuffer
              );
            }
          } else if (event.payload.state === "end") {
            this.ui.hideTypingIndicator();
            if (this.history) {
              this.history.updateHistory({
                type: "assistant",
                message: this.completionBuffer,
              });
            }
          }
          break;

        case "end":
          console.log("Stream ended");
          this.ui.hideTypingIndicator();
          break;
      }
    } catch (error) {
      console.error("Error handling trace:", error);
      this.ui.hideTypingIndicator();
    } finally {
      this.processingTrace = false;
      // Process any pending messages
      if (this.pendingMessages.length > 0) {
        const nextEvent = this.pendingMessages.shift();
        await this.handleTrace(nextEvent);
      }
    }
  }

  restoreHistory() {
    const history = this.history.getHistory();
    if (history.length === 0) return;

    // Restore all messages first
    history.forEach((entry) => {
      if (entry.type === "assistant" || entry.type === "user") {
        this.ui.addMessage(entry.type, entry.message);
      }
    });

    // Get the last entry
    const lastEntry = history[history.length - 1];

    // If the last entry was a choice or carousel from assistant, show it
    if (lastEntry.type === "choice") {
      this.ui.addButtons(lastEntry.buttons);
    } else if (lastEntry.type === "carousel") {
      this.ui.addCarousel(lastEntry);
    }

    this.ui.scrollToBottom();
  }
}
