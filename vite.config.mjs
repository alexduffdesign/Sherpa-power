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
        "frontend/entrypoints/chatbot-main.js",
        "frontend/entrypoints/theme.js",
        "frontend/components/ui/chatbot-components.js",
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
            "./frontend/core/chatbot-core.js",
            "./frontend/ui/chatbot-main-ui.js",
            "./frontend/ui/chatbot-section-ui.js",
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
