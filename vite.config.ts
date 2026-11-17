import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { mockCheckoutPlugin } from "./vite-plugins/mockCheckout";

export default defineConfig({
  plugins: [react(), mockCheckoutPlugin()],
  test: {
    environment: "jsdom",
    globals: true,
  },
});
