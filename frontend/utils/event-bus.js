// /assets/scripts/chatbot/utils/event-bus.js

import EventEmitter from "eventemitter3";
import {
  BASE_EVENTS,
  MAIN_CHATBOT,
  SECTION_CHATBOT,
} from "./event-constants.js";

/**
 * EventBus Class
 * Extends EventEmitter to provide a centralized event hub with helper methods
 * for common chatbot event patterns.
 */
class EventBus extends EventEmitter {
  /**
   * Emit a typing event for a specific chatbot
   * @param {string} prefix - The chatbot prefix ('mainChatbot' or 'sectionChatbot')
   * @param {boolean} isTyping - Whether the chatbot is typing
   */
  emitTyping(prefix, isTyping) {
    this.emit(`${prefix}:${BASE_EVENTS.TYPING}`, { isTyping });
  }

  /**
   * Emit an error event for a specific chatbot
   * @param {string} prefix - The chatbot prefix
   * @param {string} message - The error message
   */
  emitError(prefix, message) {
    this.emit(`${prefix}:${BASE_EVENTS.ERROR}`, { message });
  }

  /**
   * Emit an end event for a specific chatbot
   * @param {string} prefix - The chatbot prefix
   */
  emitEnd(prefix) {
    this.emit(`${prefix}:${BASE_EVENTS.END}`, {});
  }

  /**
   * Get the event name with prefix
   * @param {string} prefix - The chatbot prefix
   * @param {string} eventName - The base event name
   * @returns {string} The prefixed event name
   */
  getEventName(prefix, eventName) {
    return `${prefix}:${eventName}`;
  }
}

/**
 * Singleton instance of EventBus
 */
const eventBus = new EventBus();

export default eventBus;
