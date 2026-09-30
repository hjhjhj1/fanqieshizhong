/**
 * 提示音 composable
 * 使用 Web Audio API 实时合成提示音，无需任何外部音频文件（纯静态部署友好）。
 * 提供 4 种音色：beep 蜂鸣 / chime 风铃 / bell 钟声 / digital 电子音阶。
 *
 * 浏览器自动播放策略：AudioContext 必须在用户手势后创建或 resume，
 * 因此暴露 unlock()，在页面首次点击/按键时调用。
 */

/** 懒加载的 AudioContext 实例（全应用复用） */
let audioCtx = null

/**
 * 获取（必要时创建）AudioContext
 * @returns {AudioContext|null} 不支持 Web Audio 时返回 null
 */
function getContext() {
  if (audioCtx) return audioCtx
  const Ctor =
    typeof window !== 'undefined' &&
    (window.AudioContext || window.webkitAudioContext)
  if (!Ctor) return null
  audioCtx = new Ctor()
  return audioCtx
}

/**
 * 播放单个音符
 * @param {AudioContext} ctx 音频上下文
 * @param {object} note 音符描述
 * @param {number} note.freq 频率（Hz）
 * @param {number} note.start 相对当前的开始时间（秒）
 * @param {number} note.duration 持续时长（秒）
 * @param {OscillatorType} note.type 波形
 * @param {number} note.gain 峰值音量 0~1
 * @param {number} masterVolume 全局音量 0~1
 */
function playNote(ctx, { freq, start, duration, type, gain }, masterVolume) {
  // osc -> gain -> destination 的经典链路
  const osc = ctx.createOscillator()
  const env = ctx.createGain()

  osc.type = type
  osc.frequency.value = freq

  const t0 = ctx.currentTime + start
  // ADSR 简化包络：快速起音 + 指数衰减，避免爆音
  env.gain.setValueAtTime(0.0001, t0)
  env.gain.exponentialRampToValueAtTime(gain * masterVolume, t0 + 0.02)
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)

  osc.connect(env)
  env.connect(ctx.destination)
  osc.start(t0)
  osc.stop(t0 + duration + 0.05)
}

/**
 * 各音效的"乐谱"定义：由若干音符组成
 * 频率参考：C5=523.25 E5=659.25 G5=783.99 A5=880 C6=1046.5 E6=1318.5
 */
const SOUND_SCORES = {
  // 经典蜂鸣：三声急促的 880Hz 方波提示
  beep: [
    { freq: 880, start: 0.0, duration: 0.16, type: 'sine', gain: 0.5 },
    { freq: 880, start: 0.22, duration: 0.16, type: 'sine', gain: 0.5 },
    { freq: 880, start: 0.44, duration: 0.3, type: 'sine', gain: 0.5 }
  ],
  // 清脆风铃：高音双音叠加，柔和正弦
  chime: [
    { freq: 1318.5, start: 0.0, duration: 0.7, type: 'sine', gain: 0.4 },
    { freq: 1046.5, start: 0.0, duration: 0.8, type: 'sine', gain: 0.32 },
    { freq: 1567.98, start: 0.08, duration: 0.6, type: 'sine', gain: 0.22 }
  ],
  // 悠扬钟声：低频基音 + 五度泛音，长衰减
  bell: [
    { freq: 523.25, start: 0.0, duration: 1.4, type: 'triangle', gain: 0.5 },
    { freq: 783.99, start: 0.0, duration: 1.2, type: 'sine', gain: 0.25 },
    { freq: 1567.98, start: 0.0, duration: 1.0, type: 'sine', gain: 0.15 }
  ],
  // 电子音阶：C 大调上行四个音，听感"完成"
  digital: [
    { freq: 523.25, start: 0.0, duration: 0.14, type: 'square', gain: 0.22 },
    { freq: 659.25, start: 0.14, duration: 0.14, type: 'square', gain: 0.22 },
    { freq: 783.99, start: 0.28, duration: 0.14, type: 'square', gain: 0.22 },
    { freq: 1046.5, start: 0.42, duration: 0.3, type: 'square', gain: 0.22 }
  ]
}

/**
 * 提示音 composable
 */
export function useSound() {
  /**
   * 解锁音频上下文（用户首次交互时调用）
   * 移动端 / Chrome 自动播放策略要求 resume 必须在手势中触发
   */
  function unlock() {
    const ctx = getContext()
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {
        /* 忽略 resume 失败，播放时会再尝试 */
      })
    }
  }

  /**
   * 播放指定类型的提示音（单次）
   * @param {string} type 音色 key，见 SOUND_SCORES
   * @param {number} [volume=0.8] 音量 0~1
   * @returns {boolean} 是否成功发起播放（环境不支持或静音时为 false）
   */
  function play(type, volume = 0.8) {
    if (volume <= 0) return false
    const score = SOUND_SCORES[type] || SOUND_SCORES.beep
    const ctx = getContext()
    if (!ctx) return false

    // 若上下文被挂起，尝试恢复后再播
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
    }

    score.forEach((note) => playNote(ctx, note, volume))
    return true
  }

  /**
   * 循环播放提示音，直到调用返回的 stop 函数或达到最大时长。
   * 用于阶段结束后的持续响铃，用户可手动停止。
   * @param {string} type 音色 key
   * @param {number} [volume=0.8] 音量 0~1
   * @param {number} [maxDurationMs=60000] 最长响铃毫秒数，默认 60 秒
   * @returns {() => void} stop 停止响铃的函数（幂等）
   */
  function playLoop(type, volume = 0.8, maxDurationMs = 60000) {
    if (volume <= 0) return () => {}
    const score = SOUND_SCORES[type] || SOUND_SCORES.beep
    const ctx = getContext()
    if (!ctx) return () => {}

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
    }

    // 计算一轮乐谱的总时长（取所有音符中最晚结束的时间）
    const roundDuration = score.reduce(
      (max, n) => Math.max(max, n.start + n.duration),
      0
    )
    // 每轮之间留 0.3 秒间隔，避免首尾粘连；最短 0.6 秒一轮
    const roundSec = Math.max(0.6, roundDuration + 0.3)

    let stopped = false
    const endAt = Date.now() + maxDurationMs
    let timeoutId = null

    /** 调度一轮播放并安排下一轮 */
    function scheduleRound() {
      if (stopped || Date.now() >= endAt) {
        stopped = true
        return
      }
      score.forEach((note) => playNote(ctx, note, volume))
      timeoutId = setTimeout(scheduleRound, roundSec * 1000)
    }

    scheduleRound()

    /** 停止循环响铃（幂等） */
    return function stop() {
      if (stopped) return
      stopped = true
      if (timeoutId !== null) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
    }
  }

  return { unlock, play, playLoop }
}
