import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // 已有React插件，不用改

export default defineConfig({
  plugins: [react()], // 必须保留，否则React项目无法正常运行
  server: {
    proxy: {
      // 匹配所有/api开头的请求，转发到后端
      '/api': {
        target: 'http://8.148.72.91:8080', // 你的后端地址
        changeOrigin: true, // 开启跨域转发（关键）
        rewrite: (path) => path.replace(/^\/api/, '/api') // 路径不变，直接转发
      }
    }
  }
});