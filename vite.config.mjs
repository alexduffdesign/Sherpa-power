import { defineConfig } from "vite";
import shopify from "vite-plugin-shopify";
import { resolve } from "path";

export default defineConfig({
  plugins: [shopify()],
  build: {
    emptyOutDir: false, // Prevent Vite from clearing the assets directory
    rollupOptions: {
      input: {
        "vite-vendor": resolve(__dirname, "src/js/vendor.js"),
        "vite-theme": resolve(__dirname, "src/js/theme.js"),
        "vite-sections": resolve(__dirname, "src/js/sections.js"),
        "vite-chatbot-core": resolve(__dirname, "src/js/chatbot-core-file.js"),
        "vite-chatbot-main": resolve(__dirname, "src/js/chatbot-main.js"),
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
