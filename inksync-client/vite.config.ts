import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // or a specific IP address like '192.168.1.100'
    port: 3333, // your desired port number
  },
});
