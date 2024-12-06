//chatbot-api.js

export class ApiClient {
  constructor(config) {
    this.apiEndpoint = config.apiEndpoint; // Gadget endpoint that proxies Voiceflow streaming
    this.userID = this.generateUserID(config.userIDPrefix || "chatbot");
    this.completionEvents = config.completionEvents || false;
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

  async streamInteract(action, extraConfig = {}) {
    const url = this.apiEndpoint;

    // If action is already in the correct format (has an action property), use it directly
    const payload = action.action
      ? action
      : {
          userID: this.userID,
          action: action,
          config: {
            ...extraConfig,
          },
        };

    console.log(
      "Sending streaming interact request to gadget endpoint:",
      payload
    );

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
      credentials: "include",
      cache: "no-store",
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Stream request failed:", response.status, errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, details: ${errorText}`
      );
    }

    if (!response.body) {
      throw new Error("Response has no body");
    }

    return response;
  }

  async launch(startBlock, productDetails) {
    const action = {
      type: "launch",
      payload: {
        startBlock: startBlock,
        powerStationDetails: productDetails,
      },
    };
    return this.streamInteract(action);
  }

  async sendUserMessage(message) {
    const action = {
      type: "text",
      payload: message,
    };
    return this.streamInteract(action);
  }

  async sendEvent(eventName, data = {}) {
    const action = {
      type: "event",
      payload: {
        event: {
          name: eventName,
          ...data,
        },
      },
    };
    return this.streamInteract(action);
  }
}
