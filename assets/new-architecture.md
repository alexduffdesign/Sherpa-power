# Chatbot Architecture Implementation Plan

1. Core Files Structure

├── baseChatbot/
│ ├── base-chatbot.js # Base communication layer
│ └── base-chatbot-ui.js # Base UI functionality
├── mainChatbot/
│ ├── chatbot-main.js # Main chatbot implementation
│ └── chatbot-main-ui.js # Main chatbot UI implementation
├── sectionChatbot/
│ ├── chatbot-section.js # Section chatbot implementation
│ └── chatbot-section-ui.js # Section chatbot UI implementation
└── utils/
├── event-bus.js # Event management
├── event-constants.js # Event type definitions
└── user-id-generator.js # User ID management

2. Core Implementation
   chatbot-core.js
   javascriptCopyclass ChatbotCore {
   constructor(config) {
   this.type = config.type; // 'main' or 'section'
   this.endpoint = config.endpoint;
   this.userID = config.userID;
   this.eventBus = config.eventBus;
   this.abortController = null;
   }

// Core methods
async sendLaunch(interactPayload = {}) // Launch chatbot
async sendMessage(message) // Send user message
async sendAction(actionPayload) // Send action to API
async handleSSEResponse(response) // Handle streaming response
processTrace(trace) // Process Voiceflow traces
}
chatbot-ui.js
javascriptCopyclass ChatbotUI {
constructor(config) {
this.container = config.container;
this.eventBus = config.eventBus;
this.type = config.type;

    // Initialize UI elements
    this.messageContainer = this.container.querySelector('.message-container');
    this.form = this.container.querySelector('.chat-form');
    this.input = this.container.querySelector('.chat-input');
    this.typingIndicator = this.container.querySelector('.chat-typing');

}

// Core UI methods
addMessage(sender, content, metadata) // Add chat message
addButtons(buttons) // Add interactive buttons
addCarousel(items) // Add carousel component
showTypingIndicator() // Show typing animation
hideTypingIndicator() // Hide typing animation
displayError(message) // Show error message
scrollToBottom() // Scroll chat to bottom
}

3.  Main Chatbot Implementation
    main-chatbot.js
    javascriptCopyclass MainChatbot {
    constructor(container) {
    this.eventBus = new EventEmitter();

        // Initialize core
        this.core = new ChatbotCore({
          type: 'main',
          endpoint: ENDPOINTS.MAIN,
          userID: this.getUserID(),
          eventBus: this.eventBus
        });

        // Initialize UI
        this.ui = new MainChatbotUI({
          container,
          eventBus: this.eventBus,
          type: 'main'
        });

        this.historyKey = 'mainChatbotHistory';
        this.launchKey = 'chatHasLaunched';
        this.setupEventListeners();
        this.loadHistory();

    }

// History management
saveToHistory(sender, message, metadata)
loadHistory()
clearHistory()

// Launch management
hasLaunched()
setLaunched()
launch()
}
main-chatbot-ui.js
javascriptCopyclass MainChatbotUI extends ChatbotUI {
constructor(config) {
super(config);
this.setupMainFooter();
this.setupMainEventListeners();
}

// Main-specific UI methods
setupMainFooter() // Setup footer with clear/minimize
addMainMenuButton() // Add menu button
handleMainMenuClick() // Handle menu interactions
restoreInteractiveElements() // Restore buttons/carousels
}

4.  Section Chatbot Implementation
    section-chatbot.js
    javascriptCopyclass SectionChatbot {
    constructor(container, productDetails) {
    this.eventBus = new EventEmitter();

        // Initialize core
        this.core = new ChatbotCore({
          type: 'section',
          endpoint: ENDPOINTS.SECTION,
          userID: this.getUserID(),
          eventBus: this.eventBus
        });

        // Initialize UI
        this.ui = new SectionChatbotUI({
          container,
          eventBus: this.eventBus,
          type: 'section',
          productDetails
        });

        this.validateProductDetails();
        this.setupEventListeners();

    }

// Product-specific methods
validateProductDetails() // Validate product info
handleDeviceAnswer(trace) // Handle device answers
launch() // Launch with product context
}
section-chatbot-ui.js
javascriptCopyclass SectionChatbotUI extends ChatbotUI {
constructor(config) {
super(config);
this.productDetails = config.productDetails;
this.setupProductContext();
}

// Section-specific UI methods
setupProductContext() // Initialize product UI
updateDeviceAnswers(data) // Update device grid
handleProductSpecificTraces() // Handle product traces
}

5.  Initialization Code
    For Main Chatbot:
    javascriptCopydocument.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('main-chatbot-container');
    if (container) {
    const mainChatbot = new MainChatbot(container);
    // Handle drawer launch
    const drawer = document.querySelector('custom-drawer');
    if (drawer) {
    drawer.addEventListener('dialog:after-show', () => {
    if (!mainChatbot.hasLaunched()) {
    mainChatbot.launch();
    }
    });
    }
    }
    });

For Section Chatbot:
javascriptCopydocument.addEventListener('DOMContentLoaded', () => {
const container = document.getElementById('section-chatbot-container');
if (container) {
const productDetails = {
title: container.getAttribute('product-title'),
capacity: container.getAttribute('product-capacity'),
acOutputContinuousPower: container.getAttribute('product-ac_output_continuous_power'),
acOutputPeakPower: container.getAttribute('product-ac_output_peak_power'),
dcOutputPower: container.getAttribute('product-dc_output_power')
};

    const sectionChatbot = new SectionChatbot(container, productDetails);

    // Launch on first input focus
    const input = container.querySelector('.chat-input');
    if (input) {
      input.addEventListener('focus', () => {
        if (!sectionChatbot.isLaunched) {
          sectionChatbot.launch();
        }
      });
    }

}
});

6. Event Bus Implementation
   event-bus.js
   javascriptCopyimport EventEmitter from 'eventemitter3';

const eventBus = new EventEmitter();
export default eventBus;

7. Template Updates
chatbot-template.liquid
liquidCopy<div class="chatbot-container">
  <div class="message-container"></div>
  <div class="chat-typing">
    <span class="typing-indicator"></span>
    <span class="typing-text"></span>
  </div>
  <form class="chat-form">
    <input type="text" class="chat-input" placeholder="Type your message...">
    <button type="submit">Send</button>
  </form>
</div>

# Implementation Notes:

## First Day - Core Setup:

CopyStart with base-chatbot.js:

1. Remove all Web Component and Shadow DOM code
2. Create ChatbotCore class with:
   - Constructor taking config object (type, endpoint, userID)
   - API communication methods (sendLaunch, sendMessage, sendAction)
   - SSE handling
   - Event system setup
   - Trace processing
3. Ensure all API communication goes through Gadget middleware
4. Set up error handling

Then base-chatbot-ui.js:

1. Create ChatbotUI base class
2. Remove Shadow DOM references
3. Implement core UI methods:
   - addMessage() using message-component
   - addButtons() using button-component
   - addCarousel() using carousel-component
4. Set up basic event listeners
5. Keep all component usage for rendering

## Second Day - Main Chatbot:

CopyUpdate chatbot-main.js:

1. Remove Web Component inheritance
2. Create MainChatbot class that:
   - Instantiates ChatbotCore
   - Instantiates MainChatbotUI
   - Manages history in localStorage
   - Handles launch behavior
   - Sets up event listeners

Update chatbot-main-ui.js:

1. Create MainChatbotUI class extending ChatbotUI
2. Implement:
   - History restoration
   - Main menu functionality
3. Use existing components for all rendering
4. Add drawer-specific features

## Third Day - Section Chatbot:

CopyUpdate chatbot-section.js:

1. Remove Web Component inheritance
2. Create SectionChatbot class that:
   - Instantiates ChatbotCore
   - Instantiates SectionChatbotUI
   - Handles product context and start block
   - Manages device answers
   - Sets up event listeners

Update chatbot-section-ui.js:

1. Create SectionChatbotUI class extending ChatbotUI
2. Implement:
   - Product-specific UI elements
   - Device answer grid
   - Focus launch behavior
3. Use existing components for rendering

## Fourth Day - Integration:

CopyUpdate initialization code:

1. Update chatbot-drawer.liquid:

   - Remove Web Component references
   - Update initialization for MainChatbot
   - Keep drawer functionality

2. Update application.liquid:

   - Remove Web Component references
   - Update initialization for SectionChatbot
   - Maintain product attributes

3. No changes needed to:
   - message-component.js
   - button-component.js
   - carousel-component.js
     These stay as Web Components
     Key Points for Implementation:

Component Usage:

javascriptCopy// Keep using components like this:
const message = document.createElement('message-component');
message.setAttribute('sender', sender);
message.setAttribute('content', content);
messageContainer.appendChild(message);

Event Handling:

javascriptCopy// Use EventEmitter3
const eventBus = new EventEmitter();
eventBus.on('userMessage', (message) => {
// Handle message
});

State Management:

javascriptCopy// Main chatbot history
localStorage.setItem(this.historyKey, JSON.stringify(history));
localStorage.getItem(this.historyKey);

// Section chatbot product context
this.productDetails = {
title: container.getAttribute('product-title'),
// other details...
};

Initialization:

javascriptCopy// Main chatbot
const mainContainer = document.getElementById('main-chatbot-container');
const mainChatbot = new MainChatbot(mainContainer);

// Section chatbot
const sectionContainer = document.getElementById('section-chatbot-container');
const sectionChatbot = new SectionChatbot(sectionContainer, productDetails);
Testing Steps:

Core Functionality:

Test API communication
Verify event handling
Check component rendering
Validate error handling

Main Chatbot:

Test history management
Verify drawer integration
Check launch behavior
Test menu functionality

Section Chatbot:

Test product context
Verify device answers
Check focus behavior
Validate grid updates

Remember:

Keep all existing component functionality
Maintain event-driven architecture
Ensure proper error handling
Document all changes
Test thoroughly after each phase
