import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  // ✅ production build
  base: "/",
  build: {
    outDir: "dist",
  },


  server: {
    proxy: {
      "/api": {
        target: "https://api.imdbapi.dev", 
        changeOrigin: true,
        secure: true, 
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});