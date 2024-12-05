export class HistoryHandler {
    constructor() {
        this.conversationHistory = [];
        this.hasLaunched = localStorage.getItem("chatHasLaunched") === "true";
    }

    updateHistory(entry) {
        console.log("Updating conversation history with:", entry);
        this.conversationHistory.push(entry);
        this.saveToStorage();
    }

    saveToStorage() {
        try {
            localStorage.setItem("chatHistory", JSON.stringify(this.conversationHistory));
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
    }

    getHistory() {
        return this.conversationHistory;
    }

    hasHistory() {
        return this.hasLaunched;
    }
}
