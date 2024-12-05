export class TraceHandler {
    constructor(ui) {
        this.ui = ui;
        this.onSpecialTrace = null;
    }

    async handleTrace(trace) {
        console.log("Handling trace:", trace);

        // Always notify parent of special traces if callback exists
        if (this.onSpecialTrace) {
            await this.onSpecialTrace(trace);
        }

        switch (trace.type) {
            case "text":
                if (trace.payload?.message) {
                    this.ui.addMessage("assistant", trace.payload.message);
                }
                break;

            case "path":
                // Path traces are for flow control, we just log them
                console.log("Path trace received:", trace.payload);
                break;

            case "choice":
                if (trace.payload?.buttons) {
                    this.ui.addButtons(trace.payload.buttons);
                }
                break;

            case "carousel":
                if (trace.payload) {
                    this.ui.addCarousel(trace.payload);
                }
                break;

            case "visual":
                if (trace.payload?.visualType === "image") {
                    this.ui.addVisualImage(trace.payload);
                }
                break;

            case "waiting_text":
                this.ui.showTypingIndicator(trace.payload);
                break;

            case "end":
                console.log("Stream ended");
                this.ui.hideTypingIndicator();
                break;

            default:
                console.log("Unhandled trace type:", trace.type);
        }
    }
}
