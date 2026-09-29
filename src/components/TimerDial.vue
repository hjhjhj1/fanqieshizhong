<script setup>
import { computed } from 'vue'
import { formatClock } from '../utils/time.js'
import { PHASE_IDLE, PHASE_FOCUS, PHASE_BREAK } from '../composables/useTimer.js'

/**
 * 计时表盘模块
 * - SVG 圆环倒计时：进度随剩余时间平滑消减
 * - 中央展示阶段标签、mm:ss 时钟、关联任务名
 * - 底部按阶段/运行状态渲染不同控制按钮
 */

const props = defineProps({
  /** 当前阶段 */
  phase: { type: String, required: true },
  /** 是否运行中（暂停态为 false） */
  running: { type: Boolean, default: false },
  /** 剩余秒数 */
  remaining: { type: Number, default: 0 },
  /** 进度 0~1 */
  progress: { type: Number, default: 0 },
  /** 空闲态表盘上预览的默认总时长（秒） */
  idleSeconds: { type: Number, default: 25 * 60 },
  /** 当前关联任务名称 */
  taskName: { type: String, default: '' }
})

const emit = defineEmits(['start', 'pause', 'resume', 'reset', 'skip'])

/* ---- SVG 圆环几何参数 ---- */
const RADIUS = 86
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

/** 圆环描边偏移：进度越大，可见弧长越短 */
const dashOffset = computed(
  () => CIRCUMFERENCE * (1 - Math.min(1, Math.max(0, props.progress)))
)

/** 表盘中央显示的秒数（空闲态展示默认专注时长） */
const displaySeconds = computed(() =>
  props.phase === PHASE_IDLE ? props.idleSeconds : props.remaining
)

/** 阶段中文标签 */
const phaseLabel = computed(() => {
  switch (props.phase) {
    case PHASE_FOCUS:
      return props.running ? '专注中' : '已暂停'
    case PHASE_BREAK:
      return props.running ? '休息中' : '休息已暂停'
    default:
      return '准备开始'
  }
})

/** 圆环与按钮主题色：专注番茄红、休息叶绿 */
const theme = computed(() =>
  props.phase === PHASE_BREAK
    ? {
        ring: 'stroke-leaf-500',
        track: 'stroke-leaf-400/15',
        text: 'text-leaf-600',
        mainBtn: 'btn-leaf'
      }
    : {
        ring: 'stroke-tomato-500',
        track: 'stroke-tomato-400/15',
        text: 'text-tomato-600',
        mainBtn: 'btn-primary'
      }
)

/** 是否允许开始专注（空闲态且已选择任务，由父组件控制） */
const canStart = computed(() => props.phase === PHASE_IDLE && !!props.taskName)
</script>

<template>
  <section class="card flex flex-col items-center px-6 py-8 sm:px-10" aria-labelledby="timer-title">
    <h2 id="timer-title" class="sr-only">番茄计时器</h2>

    <!-- 阶段标签 -->
    <p class="text-sm font-medium tracking-wide" :class="theme.text">
      {{ phaseLabel }}
    </p>

    <!-- SVG 圆环倒计时 -->
    <div class="relative my-5 h-60 w-60">
      <svg class="h-full w-full -rotate-90" viewBox="0 0 200 200" aria-hidden="true">
        <!-- 背景轨道 -->
        <circle
          cx="100"
          cy="100"
          :r="RADIUS"
          fill="none"
          stroke-width="10"
          class="transition-colors"
          :class="theme.track"
        />
        <!-- 进度弧：linecap 圆角 + dashoffset 过渡 -->
        <circle
          cx="100"
          cy="100"
          :r="RADIUS"
          fill="none"
          stroke-width="10"
          stroke-linecap="round"
          :stroke-dasharray="CIRCUMFERENCE"
          :stroke-dashoffset="dashOffset"
          class="transition-[stroke-dashoffset] duration-300 ease-linear"
          :class="theme.ring"
        />
      </svg>

      <!-- 中央时钟与任务信息 -->
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <p
          class="text-5xl font-semibold tabular-nums tracking-tight text-gray-800"
          aria-live="polite"
          :aria-label="`剩余 ${formatClock(displaySeconds)}`"
        >
          {{ formatClock(displaySeconds) }}
        </p>
        <p class="mt-2 max-w-[12rem] truncate text-sm text-gray-400">
          <template v-if="phase === 'focus'">🎯 {{ taskName || '未命名任务' }}</template>
          <template v-else-if="phase === 'break'">放松一下，喝口水吧</template>
          <template v-else>{{ taskName ? '🎯 ' + taskName : '请在右侧选择一条任务' }}</template>
        </p>
      </div>
    </div>

    <!-- 控制按钮区：随阶段与运行状态切换 -->
    <div class="flex flex-wrap items-center justify-center gap-3">
      <!-- 空闲：开始专注 -->
      <button
        v-if="phase === 'idle'"
        type="button"
        class="btn-primary px-8 py-3 text-base"
        :disabled="!canStart"
        @click="emit('start')"
      >
        ▶ 开始专注
      </button>

      <!-- 专注进行中：暂停 / 重置 -->
      <template v-else-if="phase === 'focus' && running">
        <button type="button" class="btn-ghost px-6 py-3" @click="emit('pause')">
          ⏸ 暂停
        </button>
        <button type="button" class="btn-ghost px-6 py-3" @click="emit('reset')">
          ↺ 重置（本轮作废）
        </button>
      </template>

      <!-- 专注暂停：继续 / 重置 -->
      <template v-else-if="phase === 'focus' && !running">
        <button type="button" class="btn-primary px-8 py-3 text-base" @click="emit('resume')">
          ▶ 继续专注
        </button>
        <button type="button" class="btn-ghost px-6 py-3" @click="emit('reset')">
          ↺ 重置（本轮作废）
        </button>
      </template>

      <!-- 休息进行中：暂停 / 提前结束 -->
      <template v-else-if="phase === 'break' && running">
        <button type="button" class="btn-ghost px-6 py-3" @click="emit('pause')">
          ⏸ 暂停
        </button>
        <button type="button" class="btn-ghost px-6 py-3" @click="emit('skip')">
          ⏹ 提前结束休息
        </button>
      </template>

      <!-- 休息暂停：继续 / 重置 / 提前结束 -->
      <template v-else-if="phase === 'break' && !running">
        <button type="button" class="btn-leaf px-8 py-3 text-base" @click="emit('resume')">
          ▶ 继续休息
        </button>
        <button type="button" class="btn-ghost px-6 py-3" @click="emit('reset')">
          ↺ 重置
        </button>
        <button type="button" class="btn-ghost px-6 py-3" @click="emit('skip')">
          ⏹ 提前结束休息
        </button>
      </template>
    </div>
  </section>
</template>
