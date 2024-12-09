// /assets/scripts/chatbot/utils/event-bus.js

import EventEmitter from "eventemitter3";

/**
 * EventBus Class
 * Extends the EventEmitter from eventemitter3 to create a centralized event hub.
 */
class EventBus extends EventEmitter {}

/**
 * Singleton instance of EventBus
 * Ensures that all modules import the same EventBus instance.
 */
const eventBus = new EventBus();

export default eventBus;
