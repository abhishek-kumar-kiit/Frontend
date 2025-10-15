 import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist", // 👈 Vercel expects this by default
  },
  server: {
    port: 5173,
  },
});
