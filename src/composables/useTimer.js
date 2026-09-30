import { ref, computed, onScopeDispose, getCurrentScope } from 'vue'

/**
 * 番茄计时器状态机 composable
 *
 * 阶段流转：
 *   idle ──startFocus──▶ focus ──自然走完──▶ break ──自然走完──▶ idle
 *     │                   └──reset(作废)──┘    ├─reset──────▶ idle
 *     └──startBreak───────────────────────────▶ break（手动休息）
 *                                            └─reset/skip──▶ idle
 *
 * 计时精度：不依赖"每秒累加"，而是记录结束时间戳 endAt，
 * 每次 tick 用 Date.now() 反推剩余秒数，规避标签页后台 setInterval 节流导致的偏差。
 */

/** 空闲阶段 */
export const PHASE_IDLE = 'idle'
/** 专注阶段 */
export const PHASE_FOCUS = 'focus'
/** 休息阶段 */
export const PHASE_BREAK = 'break'

/**
 * 创建计时器
 * @param {object} options
 * @param {() => ({focus: number, break: number})} options.getDurations
 *        返回当前专注/休息总秒数的函数（每次启动新阶段时读取，可实时响应设置变化）
 * @param {(taskId: string, focusSeconds: number) => void} [options.onFocusComplete]
 *        专注倒计时自然走完时触发（用于累计任务统计）；中途 reset 不触发
 * @param {() => void} [options.onBreakComplete]
 *        休息倒计时自然走完时触发；reset / skipBreak 不触发
 * @param {boolean} [options.autoTick=true]
 *        是否自动启动 setInterval 循环，单元测试中传 false 改为手动 tick
 */
export function useTimer({
  getDurations,
  onFocusComplete,
  onBreakComplete,
  autoTick = true
} = {}) {
  /** 当前阶段 */
  const phase = ref(PHASE_IDLE)
  /** 倒计时是否进行中（false 表示暂停） */
  const running = ref(false)
  /** 剩余秒数 */
  const remaining = ref(0)
  /** 当前计时关联的任务 ID（仅专注阶段有意义） */
  const activeTaskId = ref(null)

  /** 当前阶段总秒数快照（用于计算圆环进度） */
  let totalSnapshot = 0
  /** 本轮结束时间戳；暂停时清空 */
  let endAt = 0
  /** setInterval 句柄 */
  let intervalId = null

  /** 进度比例 0~1（已流逝时间占比），驱动 SVG 圆环 */
  const progress = computed(() => {
    if (phase.value === PHASE_IDLE || totalSnapshot <= 0) return 0
    const elapsed = totalSnapshot - remaining.value
    return Math.min(1, Math.max(0, elapsed / totalSnapshot))
  })

  /**
   * 停止自动 tick 循环
   */
  function stopTicking() {
    if (intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  /**
   * 启动自动 tick 循环（每 250ms 校准一次，保证显示顺滑）
   */
  function startTicking() {
    if (!autoTick) return
    stopTicking()
    intervalId = setInterval(tick, 250)
  }

  /**
   * 推进一步倒计时：根据当前时间戳反推剩余秒数
   * 该函数刻意与 DOM API 解耦，方便单元测试直接调用（但完成判定依赖时间戳）
   */
  function tick() {
    if (!running.value) return
    const left = Math.round((endAt - Date.now()) / 1000)
    remaining.value = Math.max(0, left)
    if (left <= 0) completePhase()
  }

  /**
   * 当前阶段自然走完后的流转
   */
  function completePhase() {
    stopTicking()
    running.value = false

    if (phase.value === PHASE_FOCUS) {
      // —— 专注完成：先回调统计（番茄 +1、累计专注时长），再自动进入休息 ——
      // 第三个参数 false 表示非提前完成（完整走完一轮，计数番茄）
      const finishedTaskId = activeTaskId.value
      const focusSeconds = totalSnapshot
      try {
        onFocusComplete?.(finishedTaskId, focusSeconds, false)
      } catch (err) {
        console.error('[timer] onFocusComplete 回调异常', err)
      }

      const durations = getDurations ? getDurations() : { break: 0 }
      totalSnapshot = Math.max(1, Math.floor(durations.break || 0))
      phase.value = PHASE_BREAK
      remaining.value = totalSnapshot
      running.value = true
      endAt = Date.now() + totalSnapshot * 1000
      startTicking()
    } else if (phase.value === PHASE_BREAK) {
      // —— 休息完成：回调提示后回到空闲 ——
      try {
        onBreakComplete?.()
      } catch (err) {
        console.error('[timer] onBreakComplete 回调异常', err)
      }
      phase.value = PHASE_IDLE
      remaining.value = 0
      activeTaskId.value = null
      totalSnapshot = 0
      endAt = 0
    }
  }

  /**
   * 开始专注（仅空闲态可调用）
   * @param {string} taskId 关联任务 ID
   */
  function startFocus(taskId) {
    if (phase.value !== PHASE_IDLE || !taskId) return
    const durations = getDurations ? getDurations() : { focus: 0 }
    totalSnapshot = Math.max(1, Math.floor(durations.focus || 0))

    phase.value = PHASE_FOCUS
    activeTaskId.value = taskId
    remaining.value = totalSnapshot
    running.value = true
    endAt = Date.now() + totalSnapshot * 1000
    startTicking()
  }

  /**
   * 手动开始休息（仅空闲态可调用）
   * 不关联任务、不计统计；休息走完只响铃提示
   */
  function startBreak() {
    if (phase.value !== PHASE_IDLE) return
    const durations = getDurations ? getDurations() : { break: 0 }
    totalSnapshot = Math.max(1, Math.floor(durations.break || 0))

    phase.value = PHASE_BREAK
    activeTaskId.value = null
    remaining.value = totalSnapshot
    running.value = true
    endAt = Date.now() + totalSnapshot * 1000
    startTicking()
  }

  /**
   * 暂停倒计时（保留剩余秒数）
   */
  function pause() {
    if (!running.value) return
    // 暂停瞬间先校准一次剩余时间，然后冻结
    tick()
    running.value = false
    endAt = 0
    stopTicking()
  }

  /**
   * 从暂停中继续
   */
  function resume() {
    if (running.value || phase.value === PHASE_IDLE) return
    if (remaining.value <= 0) return
    running.value = true
    endAt = Date.now() + remaining.value * 1000
    startTicking()
  }

  /**
   * 重置当前阶段回到空闲：
   * - 专注中途重置：本轮作废，不计入任务统计、不响铃
   * - 休息中重置：直接回到空闲，不响铃
   */
  function reset() {
    if (phase.value === PHASE_IDLE) return
    stopTicking()
    phase.value = PHASE_IDLE
    running.value = false
    remaining.value = 0
    activeTaskId.value = null
    totalSnapshot = 0
    endAt = 0
  }

  /**
   * 提前完成当前专注（区别于重置 reset）：
   * - 按实际已专注时长记录统计，但不计数番茄轮次
   * - 然后自动进入休息（与正常完成流转一致）
   * 仅专注阶段（PHASE_FOCUS）可调用，运行中或暂停中均可
   */
  function complete() {
    if (phase.value !== PHASE_FOCUS) return
    stopTicking()
    running.value = false

    // 已专注秒数 = 本轮总时长 - 当前剩余时长
    const elapsedSeconds = Math.max(0, totalSnapshot - remaining.value)
    const finishedTaskId = activeTaskId.value
    if (elapsedSeconds > 0) {
      // 第三个参数 true 表示提前完成：记录时长但不计数番茄
      try {
        onFocusComplete?.(finishedTaskId, elapsedSeconds, true)
      } catch (err) {
        console.error('[timer] onFocusComplete 回调异常', err)
      }
    }

    // 流转到休息（与 completePhase 中专注完成后的逻辑一致）
    const durations = getDurations ? getDurations() : { break: 0 }
    totalSnapshot = Math.max(1, Math.floor(durations.break || 0))
    phase.value = PHASE_BREAK
    remaining.value = totalSnapshot
    running.value = true
    endAt = Date.now() + totalSnapshot * 1000
    startTicking()
  }

  /**
   * 手动提前结束休息（不触发休息完成回调，不响铃）
   */
  function skipBreak() {
    if (phase.value !== PHASE_BREAK) return
    reset()
  }

  /**
   * 页面从后台切回前台时立即校准一次
   * （后台标签页 interval 被节流，可见时补算，避免完成通知迟到太久）
   */
  function handleVisibility() {
    if (document.visibilityState === 'visible') tick()
  }

  // 自动 tick 模式下监听可见性变化
  if (autoTick && typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', handleVisibility)
  }

  /**
   * 清理所有定时器与事件监听
   */
  function dispose() {
    stopTicking()
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }

  // 作用域销毁时自动清理（组件 setup 内调用时生效，单元测试等无作用域场景跳过）
  if (getCurrentScope()) {
    onScopeDispose(dispose)
  }

  return {
    // 状态
    phase,
    running,
    remaining,
    activeTaskId,
    progress,
    // 动作
    startFocus,
    startBreak,
    pause,
    resume,
    reset,
    skipBreak,
    complete,
    // 测试 / 外部校准用
    tick
  }
}
