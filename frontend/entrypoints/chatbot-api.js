export class ApiClient {
  constructor(config) {
    this.apiEndpoint = config.apiEndpoint;
    this.streamingEndpoint =
      "https://chatbottings--development.gadget.app/voiceflowAPI/voiceflow-streaming";
    this.userID = this.generateUserID(config.userIDPrefix || "chatbot");
  }

  generateUserID(prefix) {
    const storedID = localStorage.getItem(`${prefix}_userID`);
    if (storedID) return storedID;

    const newID = `${prefix}_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    localStorage.setItem(`${prefix}_userID`, newID);
    return newID;
  }

  async streamInteract(message) {
    console.log("Streaming interaction with message:", message);
    const url = new URL(this.streamingEndpoint);
    url.searchParams.append("userID", this.userID);

    const payload = {
      action: {
        type: "text",
        payload: message,
      },
      userID: this.userID,
      config: {
        tts: false,
        stripSSML: true,
      },
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      console.error("Error in stream interact:", error);
      throw error;
    }
  }

  async gadgetInteract(message) {
    console.log("Gadget interaction with message:", message);
    try {
      const response = await fetch(this.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          userID: this.userID,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error in gadget interact:", error);
      throw error;
    }
  }
}
