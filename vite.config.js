import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import VueSetupExtend from 'vite-plugin-vue-setup-extend';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VueSetupExtend(),
  ],
  // base: './',
  server: {
    host: '0.0.0.0',
    port: 11111,
    proxy: {
      // 选项写法
      '/api': {
        target: "http://47.97.96.59:8081",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },  
  resolve: {

    alias: {
      // 设置路径 这里resolve和join可自行选用
      '~': path.resolve(__dirname, './'),
      // 设置别名
      '@': path.resolve(__dirname, './src')
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
})
