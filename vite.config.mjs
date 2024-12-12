import { defineConfig } from "vite";
import shopify from "vite-plugin-shopify";
import { resolve } from "path";
import cleanup from "@by-association-only/vite-plugin-shopify-clean";

export default defineConfig({
  plugins: [
    cleanup(),
    shopify({
      snippetFile: "vite-tag.liquid",
      additionalEntrypoints: [
        "./frontend/baseChatbot/chatbot-main.js",
        "./frontend/baseChatbot/base-chatbot.js",
        "./frontend/baseChatbot/base-chatbot-ui.js",
        "./frontend/mainChatbot/chatbot-main.js",
        "./frontend/mainChatbot/chatbot-main-ui.js",
        "./frontend/sectionChatbot/chatbot-section.js",
        "./frontend/sectionChatbot/chatbot-section-ui.js",
        "./frontend/components/ui/chatbot-components.js",
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
          vendor: ["eventemitter3"],
          chatbot: [
            "./frontend/baseChatbot/chatbot-main.js",
            "./frontend/baseChatbot/base-chatbot.js",
            "./frontend/baseChatbot/base-chatbot-ui.js",
            "./frontend/mainChatbot/chatbot-main.js",
            "./frontend/mainChatbot/chatbot-main-ui.js",
            "./frontend/sectionChatbot/chatbot-section.js",
            "./frontend/sectionChatbot/chatbot-section-ui.js",
            "./frontend/components/ui/chatbot-components.js",
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
  optimizeDeps: {
    include: ["eventemitter3"],
  },
});
