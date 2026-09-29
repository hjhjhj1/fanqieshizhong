import { ref, computed, watch } from 'vue'
import { loadStorage, saveStorage } from '../utils/storage.js'

/** localStorage 存储键 */
const STORAGE_KEY = 'tasks-v1'

/** 任务名称最大长度 */
const MAX_NAME_LENGTH = 50

/**
 * 生成唯一 ID：优先使用浏览器原生 randomUUID，旧环境降级为 时间戳+随机串
 * @returns {string} 唯一 ID 字符串
 */
function createId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
}

/**
 * 校验并修复持久化的任务数组，丢弃字段非法的脏数据
 * @param {any} saved 本地读取的原始数据
 * @returns {Array<{id:string,name:string,totalFocusSeconds:number,tomatoCount:number,createAt:number}>}
 */
function normalizeTasks(saved) {
  if (!Array.isArray(saved)) return []
  return saved
    .filter(
      (t) =>
        t &&
        typeof t.id === 'string' &&
        typeof t.name === 'string' &&
        t.name.trim() !== ''
    )
    .map((t) => ({
      id: t.id,
      name: t.name.slice(0, MAX_NAME_LENGTH),
      totalFocusSeconds:
        Number.isFinite(t.totalFocusSeconds) && t.totalFocusSeconds > 0
          ? Math.floor(t.totalFocusSeconds)
          : 0,
      tomatoCount:
        Number.isFinite(t.tomatoCount) && t.tomatoCount > 0
          ? Math.floor(t.tomatoCount)
          : 0,
      createAt:
        Number.isFinite(t.createAt) && t.createAt > 0
          ? t.createAt
          : Date.now()
    }))
}

// ---- 模块级单例状态：整个应用共享同一份任务数据 ----

/** 任务列表 */
const tasks = ref(normalizeTasks(loadStorage(STORAGE_KEY, [])))

/** 当前选中的任务 ID（null 表示未选择） */
const selectedId = ref(null)

// 任务列表变化后自动持久化
watch(
  tasks,
  (val) => {
    saveStorage(STORAGE_KEY, val)
  },
  { deep: true }
)

/**
 * 任务列表 composable（全局单例）
 * @returns 任务状态与操作方法
 */
export function useTasks() {
  /** 当前选中的任务对象（派生状态） */
  const selectedTask = computed(
    () => tasks.value.find((t) => t.id === selectedId.value) || null
  )

  /** 全部任务累计番茄数（用于页头汇总，可选展示） */
  const totalTomatoCount = computed(() =>
    tasks.value.reduce((sum, t) => sum + t.tomatoCount, 0)
  )

  /**
   * 新增任务
   * @param {string} name 任务名称
   * @returns {{ok: boolean, id?: string, error?: string}} 结果对象，便于 UI 提示
   */
  function addTask(name) {
    const trimmed = String(name ?? '').trim()
    if (!trimmed) return { ok: false, error: '任务名称不能为空' }
    if (trimmed.length > MAX_NAME_LENGTH) {
      return { ok: false, error: `任务名称不能超过 ${MAX_NAME_LENGTH} 个字符` }
    }

    const task = {
      id: createId(),
      name: trimmed,
      totalFocusSeconds: 0, // 累计专注时长（秒）
      tomatoCount: 0, // 完成番茄轮次
      createAt: Date.now() // 创建时间戳
    }
    // 新任务追加到列表末尾
    tasks.value.push(task)
    return { ok: true, id: task.id }
  }

  /**
   * 删除任务；若删除的正是选中任务，同步清空选中态
   * @param {string} id 任务 ID
   */
  function removeTask(id) {
    const index = tasks.value.findIndex((t) => t.id === id)
    if (index === -1) return
    tasks.value.splice(index, 1)
    if (selectedId.value === id) selectedId.value = null
  }

  /**
   * 选中某条任务（传 null 可取消选择）
   * @param {string|null} id 任务 ID
   */
  function selectTask(id) {
    if (id === null || tasks.value.some((t) => t.id === id)) {
      selectedId.value = id
    }
  }

  /**
   * 记录一轮已完成的专注：番茄轮次 +1、累计专注时长增加
   * 仅在专注倒计时正常走完时调用（中途重置不计入）
   * @param {string} id 任务 ID
   * @param {number} seconds 本轮专注秒数
   */
  function addFocusRecord(id, seconds) {
    const task = tasks.value.find((t) => t.id === id)
    if (!task) return
    task.tomatoCount += 1
    task.totalFocusSeconds += Math.max(0, Math.floor(seconds))
  }

  /** 清空全部任务（设置面板中的危险操作，目前 UI 暂未开放入口，保留能力） */
  function clearTasks() {
    tasks.value = []
    selectedId.value = null
  }

  return {
    tasks,
    selectedId,
    selectedTask,
    totalTomatoCount,
    addTask,
    removeTask,
    selectTask,
    addFocusRecord,
    clearTasks
  }
}
