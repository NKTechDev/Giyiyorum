import fs from 'fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Exposes Vite to external network (important for Docker or VPS)
    port: 3000,        // You can change this to any available port
    

  },
});
