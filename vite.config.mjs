import { defineConfig } from "vite";
import shopify from "vite-plugin-shopify";
import { resolve } from "path";

export default defineConfig({
  plugins: [shopify()],
  build: {
    outDir: "assets",
    emptyOutDir: false, // Don't empty the assets directory
    rollupOptions: {
      input: {
        "chatbot-core": resolve(
          __dirname,
          "frontend/entrypoints/chatbot-core-file.js"
        ),
        "chatbot-main": resolve(
          __dirname,
          "frontend/entrypoints/chatbot-main.js"
        ),
        "chatbot-drawer": resolve(
          __dirname,
          "frontend/entrypoints/chatbot-drawer.js"
        ),
      },
      output: {
        entryFileNames: "vite-[name].js",
        chunkFileNames: "vite-[name].js",
        assetFileNames: "vite-[name].[ext]",
      },
    },
  },
  server: {
    hmr: {
      protocol: "ws",
      host: "localhost",
    },
  },
});
