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
  let cleanedText = text
    // Fix headers that don't start on a new line
    .replace(/([^\n])(#+ )/g, "$1\n$2")
    // Fix lists that don't start on a new line
    .replace(/([^\n])([-*+] )/g, "$1\n$2")
    // Fix numbered lists that don't start on a new line
    .replace(/([^\n])(\d+\. )/g, "$1\n$2")
    // Ensure proper spacing around headers
    .replace(/(#+) /g, "\n$1 ")
    // Remove duplicate newlines
    .replace(/\n\s*\n/g, "\n\n")
    .trim();

  // Parse the cleaned markdown
  return marked.parse(cleanedText);
}
