import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // You can change this to your desired port
    open: true, // Opens the browser automatically
  },
});
