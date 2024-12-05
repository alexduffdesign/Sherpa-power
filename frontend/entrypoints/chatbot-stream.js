export class StreamHandler {
    constructor() {
        this.currentStream = null;
    }

    async handleStream(response, traceHandler) {
        if (!response.body) {
            throw new Error("No response body available");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop() || "";

                for (const line of lines) {
                    if (line.trim() === "") continue;
                    if (line.startsWith("data: ")) {
                        const jsonStr = line.slice(6);
                        try {
                            const event = JSON.parse(jsonStr);
                            await traceHandler.handleTrace(event);
                        } catch (e) {
                            console.error("Error parsing stream data:", e);
                        }
                    }
                }
            }

            // Handle any remaining data
            if (buffer) {
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
            console.error("Error reading stream:", error);
            throw error;
        }
    }

    closeCurrentStream() {
        if (this.currentStream) {
            this.currentStream.cancel();
            this.currentStream = null;
        }
    }
}
