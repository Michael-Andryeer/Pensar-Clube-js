import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api-hinova': {
        target: 'https://api.hinova.com.br',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api-hinova/, ''),
        secure: false,
      },
    },
  },
});