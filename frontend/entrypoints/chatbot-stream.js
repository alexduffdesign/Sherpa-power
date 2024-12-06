// chatbot-stream.js

export class StreamHandler {
  constructor() {
    this.currentReader = null;
    this.abortController = null;
  }

  async handleStream(response, traceHandler) {
    if (!response.body) {
      throw new Error("No response body available for streaming");
    }

    console.log("[Stream] Starting new stream processing");
    this.closeCurrentStream();

    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    try {
      this.currentReader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (!signal.aborted) {
        const { done, value } = await this.currentReader.read();

        if (done) {
          console.log("[Stream] Stream complete");
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        console.log("[Stream] Received chunk:", chunk);
        buffer += chunk;

        try {
          // Try to parse the entire buffer as a JSON array
          const events = JSON.parse(buffer);
          console.log("[Stream] Successfully parsed events:", events);

          // If it's an array, process each event
          if (Array.isArray(events)) {
            for (const event of events) {
              await traceHandler.handleTrace(event);
            }
            buffer = ""; // Clear buffer after successful processing
          } else {
            // If it's a single event, process it
            await traceHandler.handleTrace(events);
            buffer = "";
          }
        } catch (e) {
          // If we can't parse it yet, it might be incomplete
          console.log("[Stream] Incomplete JSON, continuing to buffer");

          // Try to find complete JSON objects in the buffer
          if (buffer.includes("][")) {
            const parts = buffer.split("][");
            for (const part of parts) {
              try {
                const cleanPart = part
                  .replace(/^\[?/, "[")
                  .replace(/\]?$/, "]");
                const events = JSON.parse(cleanPart);
                console.log("[Stream] Parsed partial buffer:", events);
                if (Array.isArray(events)) {
                  for (const event of events) {
                    await traceHandler.handleTrace(event);
                  }
                }
              } catch (partError) {
                console.log("[Stream] Could not parse part, skipping");
              }
            }
            buffer = parts[parts.length - 1];
          }
        }
      }
    } catch (error) {
      console.error("[Stream] Fatal stream processing error:", error);
      throw error;
    } finally {
      this.closeCurrentStream();
    }
  }

  closeCurrentStream() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }

    if (this.currentReader) {
      try {
        this.currentReader.cancel();
      } catch (e) {
        console.error("Error cancelling stream reader:", e);
      }
      this.currentReader = null;
    }
  }
}
