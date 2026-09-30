import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  i18n,
  detectLocale,
  setLocale,
  locale,
  SUPPORTED_LOCALES,
  FALLBACK_LOCALE
} from '../src/i18n/index.js'
import { saveStorage } from '../src/utils/storage.js'
import { formatDurationHuman } from '../src/utils/time.js'

// i18n 模块测试：语言检测、切换持久化、翻译与插值
// 注意：setup.js 已将全局 locale 固定为 zh-CN，本文件的用例按需自行切换
describe('i18n 国际化模块', () => {
  /** 原始浏览器语言，用例结束后恢复 */
  const originalLanguage = window.navigator.language

  beforeEach(() => {
    window.localStorage.clear()
    locale.value = 'zh-CN'
  })

  afterEach(() => {
    // 恢复浏览器语言 mock，避免污染其它用例
    Object.defineProperty(window.navigator, 'language', {
      value: originalLanguage,
      configurable: true
    })
    locale.value = 'zh-CN'
  })

  /** 模拟浏览器语言 */
  function mockNavigatorLanguage(lang) {
    Object.defineProperty(window.navigator, 'language', {
      value: lang,
      configurable: true
    })
  }

  describe('detectLocale 语言检测', () => {
    it('本地存储中的手动选择优先于浏览器语言', () => {
      saveStorage('locale', 'ja')
      mockNavigatorLanguage('de-DE')
      expect(detectLocale()).toBe('ja')
    })

    it('存储值为非法语言代码时忽略，走浏览器检测', () => {
      saveStorage('locale', 'not-a-locale')
      mockNavigatorLanguage('fr-FR')
      expect(detectLocale()).toBe('fr')
    })

    it.each([
      ['zh-CN', 'zh-CN'],
      ['zh-Hans-CN', 'zh-CN'],
      ['zh', 'zh-CN'],
      ['zh-TW', 'zh-TW'],
      ['zh-HK', 'zh-TW'],
      ['zh-Hant-TW', 'zh-TW'],
      ['ja-JP', 'ja'],
      ['ko-KR', 'ko'],
      ['en-US', 'en'],
      ['es-MX', 'es'],
      ['pt-BR', 'pt'],
      ['fr-FR', 'fr'],
      ['de-DE', 'de'],
      ['ru-RU', 'ru'],
      ['vi-VN', 'vi']
    ])('浏览器语言 %s 映射为 %s', (browserLang, expected) => {
      mockNavigatorLanguage(browserLang)
      expect(detectLocale()).toBe(expected)
    })

    it('未支持的语言回退英文', () => {
      mockNavigatorLanguage('it-IT')
      expect(detectLocale()).toBe(FALLBACK_LOCALE)
      expect(FALLBACK_LOCALE).toBe('en')
    })
  })

  describe('setLocale 语言切换', () => {
    it('切换后更新响应式 locale、持久化存储并同步 <html lang>', () => {
      setLocale('en')
      expect(locale.value).toBe('en')
      expect(JSON.parse(window.localStorage.getItem('fqt:locale'))).toBe('en')
      expect(document.documentElement.lang).toBe('en')
    })

    it('非法语言代码被忽略', () => {
      setLocale('xx')
      expect(locale.value).toBe('zh-CN')
    })

    it('支持清单包含全部 11 种语言', () => {
      expect(SUPPORTED_LOCALES.map((l) => l.code)).toEqual([
        'zh-CN',
        'zh-TW',
        'ja',
        'ko',
        'en',
        'es',
        'pt',
        'fr',
        'de',
        'ru',
        'vi'
      ])
    })
  })

  describe('翻译与插值', () => {
    it('切换英文后返回英文文案', () => {
      setLocale('en')
      expect(i18n.global.t('app.title')).toBe('Pomodoro Focus Timer')
    })

    it('插值变量正确替换', () => {
      expect(i18n.global.t('tasks.errorTooLong', { max: 50 })).toBe(
        '任务名称不能超过 50 个字符'
      )
      setLocale('en')
      expect(i18n.global.t('tasks.errorTooLong', { max: 50 })).toBe(
        'Task name cannot exceed 50 characters'
      )
    })

    it('formatDurationHuman 输出随语言切换', () => {
      expect(formatDurationHuman(1500)).toBe('25分钟')
      setLocale('en')
      expect(formatDurationHuman(1500)).toBe('25min')
      setLocale('ja')
      expect(formatDurationHuman(4800)).toBe('1時間20分')
    })

    it('全部语言包键结构一致（以 zh-CN 为基准）', () => {
      /** 展开对象的所有叶子键路径 */
      function flattenKeys(obj, prefix = '') {
        return Object.entries(obj).flatMap(([k, v]) => {
          const path = prefix ? `${prefix}.${k}` : k
          return v && typeof v === 'object' ? flattenKeys(v, path) : [path]
        })
      }
      // Composer 的 messages 是 computed ref，需取 .value
      const base = flattenKeys(i18n.global.messages.value['zh-CN'])
      for (const { code } of SUPPORTED_LOCALES) {
        const keys = flattenKeys(i18n.global.messages.value[code])
        expect(keys.sort(), `语言包 ${code} 键缺失或多出`).toEqual([...base].sort())
      }
    })
  })
})
