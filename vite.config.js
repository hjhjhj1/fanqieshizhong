import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// Vite 配置：Vue3 SFC + Tailwind v4，同时内嵌 Vitest 测试配置
// 产物为纯静态资源，可直接部署 Cloudflare Pages（输出目录 dist）
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  test: {
    // 组件测试依赖 DOM 环境
    environment: 'jsdom',
    globals: true,
    include: ['tests/**/*.test.js']
  }
})
