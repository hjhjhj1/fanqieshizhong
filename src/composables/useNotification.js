import { ref } from 'vue'
import { t, locale } from '../i18n/index.js'

/**
 * 桌面通知 composable
 * 封装浏览器 Notification API：权限申请、发送通知、发送测试通知。
 * 在不支持 Notification 的环境（如旧浏览器 / jsdom）下所有方法安全降级。
 */

/** 当前浏览器是否支持桌面通知 */
const supported = typeof window !== 'undefined' && 'Notification' in window

/** 通知权限（响应式）：default 未询问 / granted 允许 / denied 拒绝 / unsupported 不支持 */
const permission = ref(supported ? Notification.permission : 'unsupported')

/**
 * 桌面通知 composable
 */
export function useNotification() {
  /**
   * 申请通知权限（必须由用户点击触发）
   * @returns {Promise<string>} 最终权限状态
   */
  async function requestPermission() {
    if (!supported) {
      console.warn('[notification] 当前环境不支持 Notification API')
      permission.value = 'unsupported'
      return permission.value
    }
    console.log('[notification] 调用 requestPermission，当前权限:', Notification.permission)
    // 部分旧版 Safari 使用回调形式，统一包成 Promise
    const result = await Notification.requestPermission()
    console.log('[notification] 权限申请结果:', result)
    permission.value = result
    return result
  }

  /**
   * 发送一条桌面通知
   * @param {string} title 通知标题
   * @param {string} [body] 通知正文
   * @returns {boolean} 是否成功发出
   */
  function notify(title, body = '') {
    if (!supported || permission.value !== 'granted') return false
    try {
      const notification = new Notification(title, {
        body,
        icon: '/favicon.svg',
        // 标签相同的通知会合并替换，避免轮次多了刷屏
        tag: 'fanqie-timer',
        // 通知语言跟随当前界面语言
        lang: locale.value
      })
      // 点击通知聚焦回页面
      notification.onclick = () => {
        window.focus()
        notification.close()
      }
      return true
    } catch (err) {
      // 个别浏览器要求必须通过 ServiceWorker 发通知，失败时静默降级
      console.warn('[notification] 发送失败', err)
      return false
    }
  }

  /**
   * 发送测试通知（设置面板"测试通知"按钮）
   * 若尚未授权会先申请权限
   * @returns {Promise<boolean>} 测试通知是否成功发出
   */
  async function test() {
    if (!supported) return false
    if (permission.value !== 'granted') {
      const result = await requestPermission()
      if (result !== 'granted') return false
    }
    return notify(t('notify.testTitle'), t('notify.testBody'))
  }

  return { supported, permission, requestPermission, notify, test }
}
