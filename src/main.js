import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

// 应用入口：挂载根组件（纯静态 SPA，无路由、无后端）
createApp(App).mount('#app')
