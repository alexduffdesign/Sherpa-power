// /assets/scripts/chatbot/utils/markdown-util.js

import { marked } from "marked";
import DOMPurify from "dompurify";

export function parseMarkdown(markdown) {
  const html = marked(markdown);
  return DOMPurify.sanitize(html);
}
