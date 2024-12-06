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
            jsonBuffer += jsonStr;

            try {
              const event = JSON.parse(jsonBuffer);
              console.log("Parsed stream event:", event);
              await traceHandler.handleTrace(event);
              jsonBuffer = ""; // Reset buffer after successful parse
            } catch (e) {
              if (e instanceof SyntaxError) {
                // Might be incomplete JSON, continue buffering
                console.log("Incomplete JSON, buffering...");
                continue;
              }
              console.error("Error parsing stream data:", e, line);
              jsonBuffer = ""; // Reset on error
            }
          }
        }
      }

      // Handle any remaining data in buffer
      if (buffer) {
        console.log("Processing remaining buffer:", buffer);
        const lines = buffer.split("\n");
        for (const line of lines) {
          if (line.trim() === "" || !line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6);
          try {
            const event = JSON.parse(jsonStr);
            await traceHandler.handleTrace(event);
          } catch (e) {
            console.error("Error parsing remaining stream data:", e);
          }
        }
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Stream was aborted");
      } else {
        console.error("Error reading stream:", error);
        throw error;
      }
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
