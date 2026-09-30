import { createI18n } from 'vue-i18n'
import { loadStorage, saveStorage } from '../utils/storage.js'
import zhCN from '../locales/zh-CN.js'
import zhTW from '../locales/zh-TW.js'
import ja from '../locales/ja.js'
import ko from '../locales/ko.js'
import en from '../locales/en.js'
import es from '../locales/es.js'
import pt from '../locales/pt.js'
import fr from '../locales/fr.js'
import de from '../locales/de.js'
import ru from '../locales/ru.js'
import vi from '../locales/vi.js'

/**
 * 国际化核心模块（vue-i18n Composition 模式）
 * - 支持 11 种语言，语言包为普通 JS 对象（runtime-only，无需编译插件）
 * - 首次访问按浏览器语言自动检测，未匹配时回退英文
 * - 用户手动切换后持久化到 localStorage（fqt:locale），并同步 <html lang>
 */

/** 支持的语言清单（name 为该语言的原生名称，用于切换器展示） */
export const SUPPORTED_LOCALES = Object.freeze([
  { code: 'zh-CN', name: '简体中文' },
  { code: 'zh-TW', name: '繁體中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'pt', name: 'Português' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ru', name: 'Русский' },
  { code: 'vi', name: 'Tiếng Việt' }
])

/** localStorage 存储键（实际物理键带 fqt: 前缀，见 utils/storage.js） */
const STORAGE_KEY = 'locale'

/** 未匹配到浏览器语言时的回退语言 */
export const FALLBACK_LOCALE = 'en'

/**
 * 将浏览器语言标签（如 zh-Hans-CN / en-US）映射为支持的语言代码
 * @param {string} tag 浏览器语言标签
 * @returns {string|null} 命中的语言代码，未命中返回 null
 */
function matchLocale(tag) {
  const norm = String(tag || '').toLowerCase()
  if (!norm) return null
  // 中文需细分：繁体地区/文字 → zh-TW，其余 → zh-CN
  if (norm.startsWith('zh')) {
    return /^zh-(tw|hk|mo|hant)/.test(norm) ? 'zh-TW' : 'zh-CN'
  }
  // 其它语言按主前缀匹配（en-US → en、pt-BR → pt …）
  const prefix = norm.split('-')[0]
  return SUPPORTED_LOCALES.some((l) => l.code === prefix) ? prefix : null
}

/**
 * 检测初始语言：用户手动选择（本地存储）优先，其次浏览器语言，最后回退英文
 * @returns {string} 语言代码
 */
export function detectLocale() {
  const saved = loadStorage(STORAGE_KEY)
  if (saved && SUPPORTED_LOCALES.some((l) => l.code === saved)) return saved
  const nav =
    (typeof navigator !== 'undefined' &&
      (navigator.language || (navigator.languages && navigator.languages[0]))) ||
    ''
  return matchLocale(nav) || FALLBACK_LOCALE
}

/** vue-i18n 实例（legacy: false 即 Composition 模式） */
export const i18n = createI18n({
  legacy: false,
  locale: detectLocale(),
  fallbackLocale: FALLBACK_LOCALE,
  messages: {
    'zh-CN': zhCN,
    'zh-TW': zhTW,
    ja,
    ko,
    en,
    es,
    pt,
    fr,
    de,
    ru,
    vi
  }
})

/** 当前语言（WritableComputedRef，可直接读写 .value） */
export const locale = i18n.global.locale

/**
 * 切换语言：更新响应式 locale、持久化、同步 <html lang>
 * @param {string} code 目标语言代码（非法值忽略）
 */
export function setLocale(code) {
  if (!SUPPORTED_LOCALES.some((l) => l.code === code)) return
  locale.value = code
  saveStorage(STORAGE_KEY, code)
  if (typeof document !== 'undefined') {
    document.documentElement.lang = code
  }
}

/**
 * 模块级翻译函数：供非组件 JS 模块（composable / 工具函数）使用
 * 内部读取响应式 locale，因此在渲染上下文中调用时同样具备响应性
 */
export function t(...args) {
  return i18n.global.t(...args)
}

// 模块初始化时同步一次 <html lang>（覆盖 index.html 的静态 zh-CN）
if (typeof document !== 'undefined') {
  document.documentElement.lang = locale.value
}
