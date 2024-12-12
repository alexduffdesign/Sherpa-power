// /assets/scripts/chatbot/utils/event-constants.js

/**
 * Event Constants
 * Defines all event names used across the chatbot system.
 * Events are namespaced to prevent conflicts between different components.
 */

/**
 * Base events shared by all chatbot instances
 * @const {Object}
 */
export const BASE_EVENTS = {
  MESSAGE_RECEIVED: "messageReceived",
  TYPING: "typing",
  TYPING_TEXT: "typingText",
  CHOICE_PRESENTED: "choicePresented",
  CAROUSEL_PRESENTED: "carouselPresented",
  ERROR: "error",
  END: "end",
  USER_MESSAGE: "userMessage",
};

/**
 * Main chatbot specific events
 * @const {Object}
 */
export const MAIN_CHATBOT = {
  ...Object.entries(BASE_EVENTS).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: `mainChatbot:${value}`,
    }),
    {}
  ),
  MAIN_MENU_CLICKED: "mainChatbot:mainMenuClicked",
  HISTORY_LOADED: "mainChatbot:historyLoaded",
  BUTTON_CLICK: "mainChatbot:buttonClick",
  CAROUSEL_BUTTON_CLICK: "mainChatbot:carouselButtonClick",
  CLEAR_HISTORY: "mainChatbot:clearHistory",
  MINIMIZE: "mainChatbot:minimize",
};

/**
 * Section chatbot specific events
 * @const {Object}
 */
export const SECTION_CHATBOT = {
  ...Object.entries(BASE_EVENTS).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: `sectionChatbot:${value}`,
    }),
    {}
  ),
  DEVICE_ANSWER: "sectionChatbot:deviceAnswer",
  PRODUCT_CONTEXT_UPDATED: "sectionChatbot:productContextUpdated",
};

/**
 * Combined events object for backward compatibility
 * @deprecated Use specific event constants instead
 */
export const EVENTS = {
  MAIN_CHATBOT,
  SECTION_CHATBOT,
};
