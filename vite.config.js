import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./", // penting untuk build di Vercel
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
  },
});
