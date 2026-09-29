import { describe, it, expect, beforeEach } from 'vitest'
import {
  useSettings,
  normalize,
  DEFAULT_SETTINGS,
  SOUND_OPTIONS
} from '../src/composables/useSettings.js'

// 设置模块测试（模块级单例，beforeEach 恢复默认并清存储）
describe('composables/useSettings', () => {
  const { settings, updateSetting, resetSettings } = useSettings()

  beforeEach(() => {
    window.localStorage.clear()
    resetSettings()
  })

  it('默认设置为经典 25/5 番茄钟', () => {
    expect(settings.focusMinutes).toBe(25)
    expect(settings.breakMinutes).toBe(5)
    expect(settings.soundType).toBe('beep')
    expect(settings.soundEnabled).toBe(true)
    expect(settings.notificationEnabled).toBe(true)
  })

  it('修改时长会被钳制到允许范围内', () => {
    updateSetting('focusMinutes', 0)
    expect(settings.focusMinutes).toBe(1)
    updateSetting('focusMinutes', 999)
    expect(settings.focusMinutes).toBe(120)
    updateSetting('breakMinutes', -5)
    expect(settings.breakMinutes).toBe(1)
    updateSetting('breakMinutes', 100)
    expect(settings.breakMinutes).toBe(60)
  })

  it('非法输入回退边界值', () => {
    updateSetting('focusMinutes', 'abc')
    expect(settings.focusMinutes).toBe(1)
  })

  it('音量限制在 0~1', () => {
    updateSetting('volume', 2)
    expect(settings.volume).toBe(1)
    updateSetting('volume', -1)
    expect(settings.volume).toBe(0)
  })

  it('修改后自动持久化到 localStorage', async () => {
    updateSetting('focusMinutes', 30)
    // 等待 Vue watch 刷新后写入
    await Promise.resolve()
    await Promise.resolve()
    const raw = JSON.parse(window.localStorage.getItem('fqt:settings-v1'))
    expect(raw.focusMinutes).toBe(30)
  })

  it('resetSettings 恢复全部默认值', () => {
    updateSetting('focusMinutes', 45)
    updateSetting('soundEnabled', false)
    resetSettings()
    expect(settings.focusMinutes).toBe(DEFAULT_SETTINGS.focusMinutes)
    expect(settings.soundEnabled).toBe(true)
  })

  it('normalize 丢弃非法音色与错误类型', () => {
    const result = normalize({
      focusMinutes: 999,
      soundType: 'not-exist',
      soundEnabled: 'yes',
      volume: 5
    })
    expect(result.focusMinutes).toBe(120)
    expect(result.soundType).toBe(DEFAULT_SETTINGS.soundType)
    expect(result.soundEnabled).toBe(true)
    expect(result.volume).toBe(DEFAULT_SETTINGS.volume)
  })

  it('normalize 接受全部合法音色', () => {
    for (const opt of SOUND_OPTIONS) {
      expect(normalize({ soundType: opt.value }).soundType).toBe(opt.value)
    }
  })
})
