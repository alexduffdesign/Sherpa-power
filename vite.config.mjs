import { defineConfig } from "vite";
import shopify from "vite-plugin-shopify";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    shopify({
      emptyOutDir: false,
      snippetFile: "vite-tag.liquid",
      additionalEntrypoints: [
        "frontend/entrypoints/chatbot-core-file.js",
        "frontend/entrypoints/chatbot-main.js",
      ],
    }),
  ],
  build: {
    sourcemap: true,
    emptyOutDir: false,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "frontend"),
    },
  },
});
