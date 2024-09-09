import { defineConfig } from "vite";
import shopify from "vite-plugin-shopify";
import { resolve } from "path";

export default defineConfig({
  plugins: [shopify()],
  build: {
    emptyOutDir: false, // Prevent Vite from clearing the assets directory
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
      },
      output: {
        dir: "assets",
        entryFileNames: "vite-[name].js",
        chunkFileNames: "vite-[name]-[hash].js",
        assetFileNames: "vite-[name]-[hash][extname]",
      },
    },
  },
  optimizeDeps: {
    exclude: ["assets/theme.css"], // Exclude the main theme CSS from Vite processing
  },
});
