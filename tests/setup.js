import { config } from '@vue/test-utils'
import { i18n } from '../src/i18n/index.js'

/**
 * Vitest 全局设置
 * 1. 强制简体中文 locale：既有测试大量断言中文文案，jsdom 默认浏览器语言为 en-US，
 *    若不固定语言，自动检测会回退英文导致断言失败
 * 2. 全局注册 i18n 插件：组件测试直接 mount 组件（不经过 main.js），
 *    注册后组件内 useI18n() 才能正常工作
 */

i18n.global.locale.value = 'zh-CN'
config.global.plugins = [i18n]
