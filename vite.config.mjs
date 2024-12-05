import { defineConfig } from "vite";
import shopify from "vite-plugin-shopify";
import { resolve } from "path";

import cleanup from "@by-association-only/vite-plugin-shopify-clean"; // Import the cleanup plugin

export default defineConfig({
  plugins: [
    cleanup(),
    shopify({
      entrypointsDir: "frontend/entrypoints",
      sourceCodeDir: "frontend",
      snippetFile: "vite-tag.liquid",
      additionalEntrypoints: [
        "frontend/entrypoints/chatbot-core-file.js",
        "frontend/entrypoints/chatbot-drawer.js",
        "frontend/entrypoints/chatbot-section.js",
        "frontend/entrypoints/theme.js",
        "frontend/entrypoints/chatbot-ui.js",
        "frontend/entrypoints/chatbot-stream.js",
        "frontend/entrypoints/chatbot-trace.js",
        "frontend/entrypoints/chatbot-history.js",
        "frontend/entrypoints/chatbot-base.js",
        "frontend/entrypoints/chatbot-api.js",
        "frontend/entrypoints/chatbot-main.js",
      ],
      versionNumbers: true,
    }),
  ],
  build: {
    sourcemap: true,
    emptyOutDir: false,
    rollupOptions: {
      output: {
        entryFileNames: `[name].[hash].js`,
        chunkFileNames: `[name].[hash].js`,
        assetFileNames: `[name].[hash].[ext]`,
        manualChunks: {
          chatbot: [
            "./frontend/entrypoints/chatbot-core-file.js",
            "./frontend/entrypoints/chatbot-base.js",
            "./frontend/entrypoints/chatbot-api.js",
            "./frontend/entrypoints/chatbot-ui.js",
            "./frontend/entrypoints/chatbot-stream.js",
            "./frontend/entrypoints/chatbot-trace.js",
            "./frontend/entrypoints/chatbot-history.js",
            "./frontend/entrypoints/chatbot-main.js",
          ],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "frontend"),
    },
  },
});
