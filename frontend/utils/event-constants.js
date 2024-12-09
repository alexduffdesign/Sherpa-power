// /assets/scripts/chatbot/utils/event-constants.js

/**
 * EVENTS Object
 * Defines all the event names used by the Main Chatbot and Section Chatbot.
 * Namespacing ensures that events are uniquely identified and do not conflict.
 */
export const EVENTS = {
  MAIN_CHATBOT: {
    MESSAGE_RECEIVED: "mainChatbot:messageReceived",
    TYPING: "mainChatbot:typing",
    CHOICE_PRESENTED: "mainChatbot:choicePresented",
    CAROUSEL_PRESENTED: "mainChatbot:carouselPresented",
    ERROR: "mainChatbot:error",
    // Additional events can be added here as needed
  },
  SECTION_CHATBOT: {
    MESSAGE_RECEIVED: "sectionChatbot:messageReceived",
    DEVICE_ANSWER: "sectionChatbot:deviceAnswer",
    CHOICE_PRESENTED: "sectionChatbot:choicePresented",
    CAROUSEL_PRESENTED: "sectionChatbot:carouselPresented",
    ERROR: "sectionChatbot:error",
    // Additional events can be added here as needed
  },
};
