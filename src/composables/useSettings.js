import { reactive, watch } from 'vue'
import { loadStorage, saveStorage } from '../utils/storage.js'

/** localStorage 存储键 */
const STORAGE_KEY = 'settings-v1'

/** 可选提示音清单（实际音色由 useSound 用 Web Audio 合成，无需音频文件） */
export const SOUND_OPTIONS = [
  { value: 'beep', label: '经典蜂鸣' },
  { value: 'chime', label: '清脆风铃' },
  { value: 'bell', label: '悠扬钟声' },
  { value: 'digital', label: '电子音阶' }
]

/** 默认设置：经典番茄工作法 25 分钟专注 + 5 分钟休息 */
export const DEFAULT_SETTINGS = Object.freeze({
  focusMinutes: 25, // 专注时长（分钟）
  breakMinutes: 5, // 休息时长（分钟）
  soundEnabled: true, // 是否播放提示音
  soundType: 'beep', // 提示音类型，取值见 SOUND_OPTIONS
  volume: 0.8, // 音量 0~1
  notificationEnabled: true // 是否开启桌面通知
})

/** 时长允许范围（分钟），用于输入校验 */
export const DURATION_LIMITS = Object.freeze({
  focus: { min: 1, max: 120 },
  break: { min: 1, max: 60 }
})

/**
 * 钳制数值到指定区间
 * @param {number} value 输入值
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @returns {number} 钳制后的整数
 */
function clampInt(value, min, max) {
  const n = Math.floor(Number(value))
  if (Number.isNaN(n)) return min
  return Math.min(max, Math.max(min, n))
}

/**
 * 合并并校验持久化的设置，非法字段回退默认值
 * @param {Partial<typeof DEFAULT_SETTINGS>} saved 本地读取的原始数据
 * @returns {typeof DEFAULT_SETTINGS} 完整合法的设置对象
 */
export function normalize(saved) {
  if (!saved || typeof saved !== 'object') return { ...DEFAULT_SETTINGS }
  return {
    focusMinutes: clampInt(
      saved.focusMinutes,
      DURATION_LIMITS.focus.min,
      DURATION_LIMITS.focus.max
    ),
    breakMinutes: clampInt(
      saved.breakMinutes,
      DURATION_LIMITS.break.min,
      DURATION_LIMITS.break.max
    ),
    soundEnabled:
      typeof saved.soundEnabled === 'boolean'
        ? saved.soundEnabled
        : DEFAULT_SETTINGS.soundEnabled,
    soundType: SOUND_OPTIONS.some((o) => o.value === saved.soundType)
      ? saved.soundType
      : DEFAULT_SETTINGS.soundType,
    volume:
      typeof saved.volume === 'number' &&
      saved.volume >= 0 &&
      saved.volume <= 1
        ? saved.volume
        : DEFAULT_SETTINGS.volume,
    notificationEnabled:
      typeof saved.notificationEnabled === 'boolean'
        ? saved.notificationEnabled
        : DEFAULT_SETTINGS.notificationEnabled
  }
}

/**
 * 设置数据 composable（全局单例：模块级共享同一份状态）
 * @returns {{
 *   settings: typeof DEFAULT_SETTINGS,
 *   updateSetting: (key: string, value: any) => void,
 *   resetSettings: () => void
 * }}
 */
const settings = reactive(normalize(loadStorage(STORAGE_KEY)))

// 任意设置变化后自动持久化（deep: reactive 对象本身即深层响应）
watch(
  settings,
  (val) => {
    saveStorage(STORAGE_KEY, { ...val })
  },
  { deep: true }
)

export function useSettings() {
  /**
   * 更新单个设置项（时长类会做范围校验）
   * @param {string} key 设置字段名
   * @param {*} value 新值
   */
  function updateSetting(key, value) {
    if (key === 'focusMinutes') {
      settings.focusMinutes = clampInt(
        value,
        DURATION_LIMITS.focus.min,
        DURATION_LIMITS.focus.max
      )
    } else if (key === 'breakMinutes') {
      settings.breakMinutes = clampInt(
        value,
        DURATION_LIMITS.break.min,
        DURATION_LIMITS.break.max
      )
    } else if (key === 'volume') {
      const n = Number(value)
      settings.volume = Number.isNaN(n)
        ? DEFAULT_SETTINGS.volume
        : Math.min(1, Math.max(0, n))
    } else if (key in settings) {
      settings[key] = value
    }
  }

  /** 恢复全部默认设置 */
  function resetSettings() {
    Object.assign(settings, DEFAULT_SETTINGS)
  }

  return { settings, updateSetting, resetSettings }
}
