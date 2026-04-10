import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      // 允许访问项目根目录，以及 public 和 node_modules
      allow: [
        path.resolve(__dirname, '.'), // 项目根目录
        path.resolve(__dirname, 'public'),
        path.resolve(__dirname, 'node_modules')
      ]
    }
  }
});