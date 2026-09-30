import { createApp } from 'vue'
import App from './App.vue'
import { i18n } from './i18n/index.js'
import './style.css'

// 应用入口：挂载根组件（纯静态 SPA，无路由、无后端）
// 注册 i18n 使组件内可通过 useI18n() 访问翻译
createApp(App).use(i18n).mount('#app')
