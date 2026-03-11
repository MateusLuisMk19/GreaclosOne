import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar bibliotecas grandes em chunks próprios
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react', 'framer-motion'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Aumentar limite de aviso para 1MB
    minify: 'esbuild', // Usar esbuild em vez de terser para evitar problemas
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react', 'react-dom', 'react-router-dom'],
  },
});
