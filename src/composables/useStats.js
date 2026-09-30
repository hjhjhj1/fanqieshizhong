import { ref, watch } from 'vue'
import { loadStorage, saveStorage } from '../utils/storage.js'

/** localStorage 存储键 */
const STORAGE_KEY = 'stats-v1'

/**
 * 每日统计记录结构
 * @typedef {Object} DailyStat
 * @property {number} focusSeconds 当日累计专注秒数
 * @property {number} tomatoCount 当日完成番茄轮次
 */

/**
 * 获取今天的日期键（本地时区，YYYY-MM-DD）
 * @returns {string} 形如 "2026-10-01"
 */
function todayKey() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * 把日期偏移 N 天，返回日期键
 * @param {string} dateKey 起始日期键
 * @param {number} offset 偏移天数（正数往后，负数往前）
 * @returns {string} 新日期键
 */
function shiftDateKey(dateKey, offset) {
  const [y, m, d] = dateKey.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  date.setDate(date.getDate() + offset)
  const yy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yy}-${mm}-${dd}`
}

/**
 * 校验并修复持久化的统计数据，丢弃字段非法的脏数据
 * @param {any} saved 本地读取的原始数据
 * @returns {Record<string, DailyStat>} 日期键 -> 当日统计
 */
function normalizeStats(saved) {
  if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return {}
  const result = {}
  for (const key of Object.keys(saved)) {
    const item = saved[key]
    if (
      item &&
      typeof item === 'object' &&
      Number.isFinite(item.focusSeconds) &&
      Number.isFinite(item.tomatoCount)
    ) {
      result[key] = {
        focusSeconds: Math.max(0, Math.floor(item.focusSeconds)),
        tomatoCount: Math.max(0, Math.floor(item.tomatoCount))
      }
    }
  }
  return result
}

// ---- 模块级单例状态 ----

/** 每日统计记录：日期键 -> { focusSeconds, tomatoCount } */
const dailyRecords = ref(normalizeStats(loadStorage(STORAGE_KEY, {})))

// 统计数据变化后自动持久化
watch(
  dailyRecords,
  (val) => {
    saveStorage(STORAGE_KEY, val)
  },
  { deep: true }
)

/**
 * 专注统计 composable（全局单例）
 * 按"天"记录累计专注时长与番茄轮次，供图表展示历史趋势。
 */
export function useStats() {
  /**
   * 记录一轮已完成的专注到"今天"
   * 仅在专注倒计时正常走完时调用
   * @param {number} seconds 本轮专注秒数
   */
  function addFocusRecord(seconds) {
    const key = todayKey()
    if (!dailyRecords.value[key]) {
      dailyRecords.value[key] = { focusSeconds: 0, tomatoCount: 0 }
    }
    dailyRecords.value[key].focusSeconds += Math.max(0, Math.floor(seconds))
    dailyRecords.value[key].tomatoCount += 1
  }

  /**
   * 获取最近 N 天的统计序列（含今天），没有记录的日期补 0
   * 用于图表按时间顺序渲染
   * @param {number} days 天数（如 7 或 30）
   * @returns {Array<{dateKey: string, focusSeconds: number, tomatoCount: number}>}
   */
  function getRecentDays(days) {
    const count = Math.max(1, Math.floor(days))
    const today = todayKey()
    const list = []
    for (let i = count - 1; i >= 0; i--) {
      const key = shiftDateKey(today, -i)
      const record = dailyRecords.value[key]
      list.push({
        dateKey: key,
        focusSeconds: record ? record.focusSeconds : 0,
        tomatoCount: record ? record.tomatoCount : 0
      })
    }
    return list
  }

  /** 清空全部统计记录（设置危险操作，保留能力） */
  function clearStats() {
    dailyRecords.value = {}
  }

  return {
    dailyRecords,
    addFocusRecord,
    getRecentDays,
    clearStats
  }
}
