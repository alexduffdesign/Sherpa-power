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

  // Clean up markdown headers that might have been split across chunks
  const cleanedText = text.replace(/([^\n])(#+ )/g, "$1\n$2");

  // Parse the cleaned markdown
  return marked.parse(cleanedText);
}
