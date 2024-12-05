import { ApiClient } from './chatbot-api';
import { UIManager } from './chatbot-ui';
import { StreamHandler } from './chatbot-stream';
import { TraceHandler } from './chatbot-trace';

export class ChatbotBase {
    constructor(config) {
        console.log("ChatbotBase constructor called with config:", config);
        
        // Initialize core components
        this.api = new ApiClient(config);
        this.ui = new UIManager();
        this.stream = new StreamHandler();
        this.traceHandler = new TraceHandler(this.ui);
        
        // Set up trace handling
        this.traceHandler.onSpecialTrace = this.handleSpecialTrace.bind(this);
        
        // Bind methods
        this.sendMessage = this.sendMessage.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
    }

    setDOMElements(messageContainer, typingIndicator, drawerBody) {
        this.ui.setDOMElements(messageContainer, typingIndicator, drawerBody);
    }

    async sendMessage(message) {
        console.log("Sending message:", message);
        
        try {
            // Close any existing stream
            this.stream.closeCurrentStream();
            
            // Start new stream
            const response = await this.api.streamInteract(message);
            await this.stream.handleStream(response, this.traceHandler);
            
            return { success: true };
        } catch (error) {
            console.error("Error in send message:", error);
            throw error;
        }
    }

    async handleButtonClick(buttonData) {
        console.log("Handling button click:", buttonData);
        this.ui.removeButtons();
        return await this.sendMessage(buttonData.name);
    }

    // Override this method in child classes to handle special traces
    async handleSpecialTrace(trace) {
        console.log("Base handler received special trace:", trace);
    }
}
