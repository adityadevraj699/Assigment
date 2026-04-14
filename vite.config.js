import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
   base: '/',   
  build: {
    outDir: 'dist'
  },
  define: {
    global: "window",    
  },
  
  server: {
    proxy: {
      '/api': {
        target: 'https://api.imdbapi.dev', 
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});