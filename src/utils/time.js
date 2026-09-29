/**
 * 时间格式化工具函数
 */

/**
 * 将秒数格式化为倒计时时钟文本 mm:ss（超过 1 小时则 hh:mm:ss）
 * @param {number} totalSeconds 总秒数（自动向下取整，负数按 0 处理）
 * @returns {string} 形如 "24:59" 或 "1:05:00"
 */
export function formatClock(totalSeconds) {
  const seconds = Math.max(0, Math.floor(totalSeconds))
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60

  // 两位补零
  const pad = (n) => String(n).padStart(2, '0')

  // 不足 1 小时只显示 分:秒
  if (h <= 0) return `${pad(m)}:${pad(s)}`
  return `${h}:${pad(m)}:${pad(s)}`
}

/**
 * 将累计秒数格式化为人类可读的时长文本，用于任务统计
 * @param {number} totalSeconds 累计专注秒数
 * @returns {string} 形如 "25分钟"、"1小时20分钟"、"45秒"
 */
export function formatDurationHuman(totalSeconds) {
  const seconds = Math.max(0, Math.floor(totalSeconds))
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60

  if (h > 0) return m > 0 ? `${h}小时${m}分钟` : `${h}小时`
  if (m > 0) return `${m}分钟`
  return `${s}秒`
}
