import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
const railway = 'https://hera-backend-production-4a66.up.railway.app';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { target: railway, changeOrigin: true },
      '/socket.io': {
        target: railway,
        changeOrigin: true,
        ws: true,
        configure: (proxy) => {
          proxy.on('proxyReqWs', (proxyReq) => {
            proxyReq.setHeader('origin', 'http://localhost:5173');
          });
        },
      },
    },
  },
})
