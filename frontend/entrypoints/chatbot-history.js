export class HistoryHandler {
  constructor() {
    this.conversationHistory = [];
    this.hasLaunched = localStorage.getItem("chatHasLaunched") === "true";
  }

  updateHistory(entry) {
    console.log("Updating conversation history with:", entry);

    // If this is a user message, mark the last choice as responded
    if (entry.type === "user") {
      const lastChoice = this.findLastChoice();
      if (lastChoice) {
        lastChoice.responded = true;
      }
    }

    this.conversationHistory.push(entry);
    this.saveToStorage();
  }

  findLastChoice() {
    // Find the last choice trace that hasn't been responded to
    for (let i = this.conversationHistory.length - 1; i >= 0; i--) {
      const entry = this.conversationHistory[i];
      if (
        (entry.type === "choice" || entry.type === "carousel") &&
        !entry.responded
      ) {
        return entry;
      }
    }
    return null;
  }

  getUnrespondedChoices() {
    // Get all choice traces that haven't been responded to
    return this.conversationHistory.filter(
      (entry) =>
        (entry.type === "choice" || entry.type === "carousel") &&
        !entry.responded
    );
  }

  saveToStorage() {
    try {
      localStorage.setItem(
        "chatHistory",
        JSON.stringify(this.conversationHistory)
      );
      localStorage.setItem("chatHasLaunched", "true");
    } catch (error) {
      console.error("Error saving conversation to storage:", error);
    }
  }

  loadFromStorage() {
    try {
      const savedHistory = localStorage.getItem("chatHistory");
      if (savedHistory) {
        this.conversationHistory = JSON.parse(savedHistory);
      }
    } catch (error) {
      console.error("Error loading conversation from storage:", error);
      this.conversationHistory = [];
    }
  }

  clearHistory() {
    this.conversationHistory = [];
    localStorage.removeItem("chatHistory");
    localStorage.removeItem("chatHasLaunched");
  }

  getHistory() {
    return this.conversationHistory;
  }

  hasHistory() {
    return this.hasLaunched;
  }
}
