/**
 * Generates a unique user ID with the specified prefix.
 * @param {string} prefix - The prefix indicating the chatbot type ('mainChatbot' or 'sectionChatbot').
 * @returns {string} - The generated unique user ID.
 */
export function generateUserId(prefix) {
  const uniquePart =
    Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  return `${prefix}-${uniquePart}`;
}
