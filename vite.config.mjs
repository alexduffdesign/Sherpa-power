import shopify from "vite-plugin-shopify";

export default {
  plugins: [shopify()],
  optimizeDeps: {
    exclude: ["assets/theme.css"], // Exclude your main theme CSS
  },
};
