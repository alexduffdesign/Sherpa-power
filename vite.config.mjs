import { defineConfig } from "vite";
import shopify from "vite-plugin-shopify";

export default defineConfig({
  plugins: [shopify()],
  build: {
    emptyOutDir: false, // Prevent Vite from clearing the assets directory
  },
  optimizeDeps: {
    exclude: ["assets/theme.css"], // Exclude the main theme CSS from Vite processing
  },
});
