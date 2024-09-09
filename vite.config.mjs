import { defineConfig } from "vite";
import shopify from "vite-plugin-shopify";
import { resolve } from "path";

export default defineConfig({
  plugins: [shopify()],
  build: {
    emptyOutDir: false,
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
        entryFileNames: "vite-[name].js",
        format: "es",
      },
    },
    minify: false, // This can help with debugging
  },
  optimizeDeps: {
    exclude: ["assets/theme.css"],
  },
});
