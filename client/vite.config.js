import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        secure: false,
      },
    },
  },
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['emailjs', 'fs', 'net', 'tls'], // Exclude emailjs and Node.js modules
    },
  },
  optimizeDeps: {
    exclude: ['emailjs', 'fs', 'net', 'tls'], // Ensure emailjs and Node.js modules are excluded
  },
});