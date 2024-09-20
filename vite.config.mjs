import { defineConfig } from "vite";
import shopify from "vite-plugin-shopify";
import { resolve } from "path";

import cleanup from "@by-association-only/vite-plugin-shopify-clean"; // Import the cleanup plugin

export default defineConfig({
  plugins: [
    cleanup(),
    shopify({
      snippetFile: "vite-tag.liquid",
      additionalEntrypoints: [
        "frontend/entrypoints/chatbot-core-file.js",
        "frontend/entrypoints/chatbot-main.js",
        "frontend/entrypoints/chatbot-drawer.js",
        "frontend/entrypoints/chatbot-section.js",
        "frontend/entrypoints/theme.js",
      ],
    }),
  ],
  build: {
    sourcemap: true,
    emptyOutDir: false,
    rollupOptions: {
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "frontend"),
    },
  },
});
