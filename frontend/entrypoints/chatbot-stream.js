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

    // Cancel any existing stream

    // Create new abort controller for this stream
    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    try {
      this.currentReader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let jsonBuffer = "";

      while (!signal.aborted) {
        const { done, value } = await this.currentReader.read();

        if (done) {
          // Process any remaining buffer
          if (jsonBuffer) {
            console.log("[Stream] Processing final buffer:", jsonBuffer);
            try {
              const events = JSON.parse(
                `[${jsonBuffer.replace(/}\s*{/g, "},{")}]`
              );
              console.log("[Stream] Parsed final events:", events);
              for (const event of events) {
                await traceHandler.handleTrace(event);
              }
            } catch (e) {
              console.error("[Stream] Error processing final buffer:", e);
            }
          }
          console.log("[Stream] Stream complete");
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        console.log("[Stream] Received chunk:", chunk);
        buffer += chunk;

        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.trim() === "") continue;

          if (line.startsWith("data: ")) {
            const jsonStr = line.slice(6);
            console.log("[Stream] Processing line:", jsonStr);

            try {
              const event = JSON.parse(jsonStr);
              console.log("[Stream] Successfully parsed single event:", event);
              await traceHandler.handleTrace(event);
            } catch (e) {
              console.log(
                "[Stream] Failed to parse as single event, buffering"
              );
              jsonBuffer += (jsonBuffer ? "," : "") + jsonStr;

              try {
                const events = JSON.parse(`[${jsonBuffer}]`);
                console.log(
                  "[Stream] Successfully parsed buffered events:",
                  events
                );
                for (const event of events) {
                  await traceHandler.handleTrace(event);
                }
                jsonBuffer = ""; // Reset buffer after successful parse
              } catch (bufferError) {
                console.log("[Stream] Still accumulating buffer:", jsonBuffer);
              }
            }
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
