import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  useTimer,
  PHASE_IDLE,
  PHASE_FOCUS,
  PHASE_BREAK
} from '../src/composables/useTimer.js'

// 计时器状态机测试
// 使用假时间 + autoTick:false，手动调 tick 精确驱动状态流转
describe('composables/useTimer', () => {
  let timer
  let onFocusComplete
  let onBreakComplete

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'))
    onFocusComplete = vi.fn()
    onBreakComplete = vi.fn()
    timer = useTimer({
      // 专注 5 秒、休息 3 秒，便于断言
      getDurations: () => ({ focus: 5, break: 3 }),
      onFocusComplete,
      onBreakComplete,
      autoTick: false
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('初始为空闲状态', () => {
    expect(timer.phase.value).toBe(PHASE_IDLE)
    expect(timer.running.value).toBe(false)
    expect(timer.remaining.value).toBe(0)
    expect(timer.progress.value).toBe(0)
  })

  it('没有任务 ID 时 startFocus 被忽略', () => {
    timer.startFocus(null)
    expect(timer.phase.value).toBe(PHASE_IDLE)
  })

  it('startFocus 进入专注并以设定时长倒计时', () => {
    timer.startFocus('task-1')
    expect(timer.phase.value).toBe(PHASE_FOCUS)
    expect(timer.running.value).toBe(true)
    expect(timer.remaining.value).toBe(5)
    expect(timer.activeTaskId.value).toBe('task-1')
  })

  it('startBreak 手动进入休息，不关联任务', () => {
    timer.startBreak()
    expect(timer.phase.value).toBe(PHASE_BREAK)
    expect(timer.running.value).toBe(true)
    expect(timer.remaining.value).toBe(3)
    expect(timer.activeTaskId.value).toBeNull()
  })

  it('startBreak 在非空闲态调用无效', () => {
    timer.startFocus('task-1')
    timer.startBreak()
    expect(timer.phase.value).toBe(PHASE_FOCUS)
  })

  it('手动休息走完触发 onBreakComplete 但不触发 onFocusComplete', () => {
    timer.startBreak()
    vi.advanceTimersByTime(3000)
    timer.tick()
    expect(onBreakComplete).toHaveBeenCalledTimes(1)
    expect(onFocusComplete).not.toHaveBeenCalled()
    expect(timer.phase.value).toBe(PHASE_IDLE)
  })

  it('tick 随时间扣减剩余秒数并更新进度', () => {
    timer.startFocus('task-1')
    vi.advanceTimersByTime(2000)
    timer.tick()
    expect(timer.remaining.value).toBe(3)
    expect(timer.progress.value).toBeCloseTo(0.4, 5)
  })

  it('暂停后时间流逝不扣减，继续后保留原剩余', () => {
    timer.startFocus('task-1')
    vi.advanceTimersByTime(2000)
    timer.tick()
    expect(timer.remaining.value).toBe(3)

    timer.pause()
    expect(timer.running.value).toBe(false)
    // 暂停期间无论过多久，剩余不变
    vi.advanceTimersByTime(100000)
    timer.tick()
    expect(timer.remaining.value).toBe(3)

    timer.resume()
    expect(timer.running.value).toBe(true)
    expect(timer.remaining.value).toBe(3)
  })

  it('专注自然走完：记录统计并自动进入休息', () => {
    timer.startFocus('task-1')
    vi.advanceTimersByTime(5000)
    timer.tick()

    expect(onFocusComplete).toHaveBeenCalledTimes(1)
    // 自然完成：第三个参数 false 表示计数番茄
    expect(onFocusComplete).toHaveBeenCalledWith('task-1', 5, false)
    expect(timer.phase.value).toBe(PHASE_BREAK)
    expect(timer.running.value).toBe(true)
    expect(timer.remaining.value).toBe(3)
    expect(onBreakComplete).not.toHaveBeenCalled()
  })

  it('休息自然走完：触发回调并回到空闲', () => {
    timer.startFocus('task-1')
    vi.advanceTimersByTime(5000)
    timer.tick() // focus -> break
    vi.advanceTimersByTime(3000)
    timer.tick() // break -> idle

    expect(onBreakComplete).toHaveBeenCalledTimes(1)
    expect(timer.phase.value).toBe(PHASE_IDLE)
    expect(timer.running.value).toBe(false)
    expect(timer.remaining.value).toBe(0)
    expect(timer.activeTaskId.value).toBeNull()
  })

  it('专注中途 reset：回到空闲且不计入统计、不响铃', () => {
    timer.startFocus('task-1')
    vi.advanceTimersByTime(2000)
    timer.tick()
    timer.reset()

    expect(timer.phase.value).toBe(PHASE_IDLE)
    expect(timer.remaining.value).toBe(0)
    expect(onFocusComplete).not.toHaveBeenCalled()
    expect(onBreakComplete).not.toHaveBeenCalled()
  })

  it('空闲态 reset 是安全的空操作', () => {
    expect(() => timer.reset()).not.toThrow()
    expect(timer.phase.value).toBe(PHASE_IDLE)
  })

  it('skipBreak 提前结束休息且不触发完成回调', () => {
    timer.startFocus('task-1')
    vi.advanceTimersByTime(5000)
    timer.tick() // -> break
    expect(timer.phase.value).toBe(PHASE_BREAK)

    timer.skipBreak()
    expect(timer.phase.value).toBe(PHASE_IDLE)
    expect(onBreakComplete).not.toHaveBeenCalled()
  })

  it('非休息阶段调用 skipBreak 无效', () => {
    timer.startFocus('task-1')
    timer.skipBreak()
    expect(timer.phase.value).toBe(PHASE_FOCUS)
  })

  it('complete 提前完成专注：按实际已专注时长记录并进入休息', () => {
    timer.startFocus('task-1')
    // 推进 2 秒，剩余 3 秒
    vi.advanceTimersByTime(2000)
    timer.tick()

    timer.complete()

    // 回调应收到实际已专注时长 2 秒，且 isEarly=true
    expect(onFocusComplete).toHaveBeenCalledTimes(1)
    expect(onFocusComplete).toHaveBeenCalledWith('task-1', 2, true)
    // 自动进入休息
    expect(timer.phase.value).toBe(PHASE_BREAK)
    expect(timer.running.value).toBe(true)
    expect(timer.remaining.value).toBe(3)
  })

  it('complete 在专注暂停时也能记录已专注时长', () => {
    timer.startFocus('task-1')
    vi.advanceTimersByTime(2000)
    timer.tick()
    timer.pause() // 暂停后 remaining 冻结为 3

    timer.complete()

    expect(onFocusComplete).toHaveBeenCalledWith('task-1', 2, true)
    expect(timer.phase.value).toBe(PHASE_BREAK)
  })

  it('complete 已专注时长为 0 时不触发统计回调', () => {
    timer.startFocus('task-1') // 刚启动，已专注 0 秒
    timer.complete()

    expect(onFocusComplete).not.toHaveBeenCalled()
    // 仍进入休息
    expect(timer.phase.value).toBe(PHASE_BREAK)
  })

  it('非专注阶段调用 complete 无效', () => {
    timer.startBreak() // 休息阶段
    timer.complete()
    expect(timer.phase.value).toBe(PHASE_BREAK)
    expect(onFocusComplete).not.toHaveBeenCalled()
  })

  it('空闲态 resume 无效', () => {
    timer.resume()
    expect(timer.running.value).toBe(false)
  })

  it('进度被钳制在 0~1 之间', () => {
    timer.startFocus('task-1')
    expect(timer.progress.value).toBe(0)
    vi.advanceTimersByTime(5000)
    timer.tick()
    // 刚进入休息，进度按新阶段重新计算为 0
    expect(timer.progress.value).toBe(0)
  })
})
