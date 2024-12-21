// /assets/scripts/chatbot/utils/streaming-markdown-parser.js

export class StreamingMarkdownParser {
  constructor(onStableSegment) {
    this.buffer = "";
    this.onStableSegment = onStableSegment;
    this.state = "NORMAL";
    this.currentLine = "";
    this.listType = null; // 'ul' or 'ol'
    this.listItems = [];
    console.log("StreamingMarkdownParser initialized"); // ADDED LOG
  }

  appendText(text) {
    console.log("StreamingMarkdownParser appendText:", text); // ADDED LOG
    this.buffer += text;
    this.processBuffer();
  }

  processBuffer(isEnd = false) {
    while (this.buffer.length > 0) {
      const char = this.buffer[0];
      this.buffer = this.buffer.slice(1);
      this.currentLine += char;

      if (char === "\n") {
        const line = this.currentLine.trim();
        this.currentLine = "";
        this.handleLine(line);
      }
    }
    if (isEnd && this.currentLine.trim() !== "") {
      const line = this.currentLine.trim();
      this.currentLine = "";
      this.handleLine(line);
    } else if (!isEnd && this.currentLine.trim() !== "") {
      this.handleLine(this.currentLine.trim());
      this.currentLine = "";
    }
  }

  handleLine(line) {
    console.log("StreamingMarkdownParser handleLine:", line); // ADDED LOG
    if (line.startsWith("#")) {
      const match = line.match(/^(#{1,6})\s+(.*)$/);
      if (match) {
        const level = match[1].length;
        const content = match[2];
        const html = `<h${level}>${this.parseInlineMarkdown(
          content
        )}</h${level}>`;
        this.onStableSegment(html);
        return;
      }
    }

    if (line.startsWith("- ") || line.startsWith("* ")) {
      if (this.listType !== "ul") {
        this.flushList();
        this.listType = "ul";
      }
      const item = line.slice(2).trim();
      this.listItems.push(`<li>${this.parseInlineMarkdown(item)}</li>`);
      return;
    }

    const orderedListMatch = line.match(/^(\d+)\.\s+(.*)$/);
    if (orderedListMatch) {
      if (this.listType !== "ol") {
        this.flushList();
        this.listType = "ol";
      }
      const item = orderedListMatch[2].trim();
      this.listItems.push(`<li>${this.parseInlineMarkdown(item)}</li>`);
      return;
    }

    if (line === "") {
      this.flush();
      return;
    }

    if (this.listType) {
      this.flushList();
    }

    // Handle paragraphs
    const html = `<p>${this.parseInlineMarkdown(line)}</p>`;
    this.onStableSegment(html);
  }

  flushList() {
    if (this.listItems.length > 0 && this.listType) {
      const html = `<${this.listType}>${this.listItems.join("")}</${
        this.listType
      }>`;
      this.onStableSegment(html);
      this.listItems = [];
      this.listType = null;
    }
  }

  flush() {
    this.flushList();
    if (this.currentLine.trim() !== "") {
      const html = `<p>${this.parseInlineMarkdown(
        this.currentLine.trim()
      )}</p>`;
      this.onStableSegment(html);
      this.currentLine = "";
    }
  }

  parseInlineMarkdown(text) {
    // Handle bold (** or __)
    text = text.replace(/(\*\*|__)(.*?)\1/g, "<strong>$2</strong>");

    // Handle italics (* or _)
    text = text.replace(/(\*|_)(.*?)\1/g, "<em>$2</em>");

    // Handle URLs [text](url)
    text = text.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank">$1</a>'
    );

    return text;
  }
}
