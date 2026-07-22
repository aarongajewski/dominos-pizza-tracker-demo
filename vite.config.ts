import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Boring and reliable: default Vite dev server on port 5173, opens the app.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
});
