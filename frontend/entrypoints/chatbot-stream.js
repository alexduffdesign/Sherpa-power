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

    // Cancel any existing stream
    this.closeCurrentStream();

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
            console.log("Processing remaining buffer:", jsonBuffer);
            try {
              const events = JSON.parse(
                `[${jsonBuffer.replace(/}\s*{/g, "},{")}]`
              );
              for (const event of events) {
                await traceHandler.handleTrace(event);
              }
            } catch (e) {
              console.error("Error processing final buffer:", e);
            }
          }
          console.log("Stream complete");
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.trim() === "") continue;

          if (line.startsWith("data: ")) {
            const jsonStr = line.slice(6);

            // Check if this is a complete JSON object
            try {
              const event = JSON.parse(jsonStr);
              console.log("Parsed stream event:", event);
              await traceHandler.handleTrace(event);
            } catch (e) {
              // If parsing fails, add to buffer
              jsonBuffer += (jsonBuffer ? "," : "") + jsonStr;

              // Try to parse accumulated buffer
              try {
                const events = JSON.parse(`[${jsonBuffer}]`);
                for (const event of events) {
                  await traceHandler.handleTrace(event);
                }
                jsonBuffer = ""; // Reset buffer after successful parse
              } catch (bufferError) {
                // Continue accumulating if we can't parse yet
                console.log("Accumulating buffer:", jsonBuffer);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Stream processing error:", error);
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
