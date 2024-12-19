export function debugMarkdownContent(content) {
  console.log("--- Markdown Chunk Debug ---");
  console.log("Content:", JSON.stringify(content));
  console.log("Length:", content.length);
  console.log(
    "Split lines:",
    content.split("\n").map((line) => JSON.stringify(line))
  );
  console.log("------------------------");
}
