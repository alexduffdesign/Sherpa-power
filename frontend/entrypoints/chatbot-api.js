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

    const payload = {
      userID: this.userID,
      action: action,
      config: {
        ...extraConfig,
        // If you need completion events:
        // Add them if your gadget endpoint supports it,
        // for now let's assume it's handled at server level.
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
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
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
