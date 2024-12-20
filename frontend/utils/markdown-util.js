// /assets/scripts/chatbot/utils/markdown-util.js

// /assets/scripts/chatbot/utils/markdown-util.js
import { marked } from "marked";

export function parseMarkdown(markdown) {
  return marked.parse(markdown);
}
