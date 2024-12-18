// /assets/scripts/chatbot/utils/markdown-util.js

import { marked } from "marked";

/**
 * Markdown Parser
 * Converts markdown syntax to HTML using the marked library.
 *
 * @param {string} text - The markdown text to parse.
 * @returns {string} - The HTML string.
 */
export function parseMarkdown(text) {
  if (!text) return "";

  // Sanitize and parse markdown
  return marked.parse(text);
}
