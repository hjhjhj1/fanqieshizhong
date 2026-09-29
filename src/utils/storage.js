/**
 * localStorage 安全封装
 * - 统一 key 前缀，避免与站点其他脚本冲突
 * - JSON 序列化 / 反序列化
 * - 读取异常（脏数据、隐私模式禁用存储）时回退默认值，保证应用可用
 */

/** 所有存储 key 的统一前缀 */
const KEY_PREFIX = 'fqt:' // fqt = FanQie Timer

/**
 * 读取并解析本地存储
 * @param {string} key 业务键名（无需带前缀）
 * @param {*} fallback 解析失败或不存在时返回的默认值
 * @returns {*} 解析后的数据，或 fallback
 */
export function loadStorage(key, fallback = null) {
  try {
    const raw = window.localStorage.getItem(KEY_PREFIX + key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch (err) {
    // 脏数据或存储被禁用：打印警告并返回默认值
    console.warn(`[storage] 读取 "${key}" 失败，使用默认值`, err)
    return fallback
  }
}

/**
 * 将数据序列化写入本地存储
 * @param {string} key 业务键名（无需带前缀）
 * @param {*} value 任意可被 JSON 序列化的数据
 * @returns {boolean} 是否写入成功
 */
export function saveStorage(key, value) {
  try {
    window.localStorage.setItem(KEY_PREFIX + key, JSON.stringify(value))
    return true
  } catch (err) {
    // 常见原因：隐私模式、存储已满
    console.warn(`[storage] 写入 "${key}" 失败`, err)
    return false
  }
}

/**
 * 移除某个本地存储项
 * @param {string} key 业务键名（无需带前缀）
 */
export function removeStorage(key) {
  try {
    window.localStorage.removeItem(KEY_PREFIX + key)
  } catch (err) {
    console.warn(`[storage] 删除 "${key}" 失败`, err)
  }
}
