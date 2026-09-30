<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatClock } from '../utils/time.js'
import { PHASE_IDLE, PHASE_FOCUS, PHASE_BREAK } from '../composables/useTimer.js'

/**
 * 计时表盘模块
 * - SVG 圆环倒计时：进度随剩余时间平滑消减
 * - 中央展示阶段标签、mm:ss 时钟、关联任务名
 * - 空闲态可通过 tab 切换"专注/休息"模式，决定预览时长与启动哪种计时
 * - 底部按阶段/运行状态渲染不同控制按钮
 */

const { t } = useI18n()

const props = defineProps({
  /** 当前阶段 */
  phase: { type: String, required: true },
  /** 是否运行中（暂停态为 false） */
  running: { type: Boolean, default: false },
  /** 剩余秒数 */
  remaining: { type: Number, default: 0 },
  /** 进度 0~1 */
  progress: { type: Number, default: 0 },
  /** 空闲态预览的专注总时长（秒） */
  focusSeconds: { type: Number, default: 25 * 60 },
  /** 空闲态预览的休息总时长（秒） */
  breakSeconds: { type: Number, default: 5 * 60 },
  /** 当前关联任务名称 */
  taskName: { type: String, default: '' }
})

const emit = defineEmits(['start', 'start-break', 'pause', 'resume', 'reset', 'skip', 'complete'])

/**
 * 空闲态模式切换：'focus' 或 'break'
 * 决定表盘预览时长与"开始"按钮启动哪种计时
 */
const idleMode = ref('focus')

// 进入非空闲态时不需要管 idleMode；回到空闲态时保持上次选择即可

/* ---- SVG 圆环几何参数 ---- */
const RADIUS = 86
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

/** 圆环描边偏移：进度越大，可见弧长越短 */
const dashOffset = computed(
  () => CIRCUMFERENCE * (1 - Math.min(1, Math.max(0, props.progress)))
)

/** 空闲态预览的秒数：根据 idleMode 决定显示专注还是休息的时长 */
const idlePreviewSeconds = computed(() =>
  idleMode.value === 'break' ? props.breakSeconds : props.focusSeconds
)

/** 表盘中央显示的秒数（空闲态展示当前模式预览时长） */
const displaySeconds = computed(() =>
  props.phase === PHASE_IDLE ? idlePreviewSeconds.value : props.remaining
)

/** 阶段标签（随语言切换） */
const phaseLabel = computed(() => {
  switch (props.phase) {
    case PHASE_FOCUS:
      return props.running ? t('timer.phase.focusing') : t('timer.phase.paused')
    case PHASE_BREAK:
      return props.running
        ? t('timer.phase.breaking')
        : t('timer.phase.breakPaused')
    default:
      return idleMode.value === 'break'
        ? t('timer.phase.breakReady')
        : t('timer.phase.focusReady')
  }
})

/**
 * 圆环与按钮主题色：
 * - 专注阶段 / 空闲专注模式 → 番茄红
 * - 休息阶段 / 空闲休息模式 → 叶绿
 */
const isBreakTheme = computed(
  () => props.phase === PHASE_BREAK || (props.phase === PHASE_IDLE && idleMode.value === 'break')
)

const theme = computed(() =>
  isBreakTheme.value
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

/** 空闲态是否允许开始专注（需要选中任务） */
const canStartFocus = computed(
  () => props.phase === PHASE_IDLE && idleMode.value === 'focus' && !!props.taskName
)

/** 空闲态开始休息无需任务，始终可用 */
const canStartBreak = computed(() => props.phase === PHASE_IDLE && idleMode.value === 'break')
</script>

<template>
  <section class="card flex flex-col items-center px-6 py-8 sm:px-10" aria-labelledby="timer-title">
    <h2 id="timer-title" class="sr-only">{{ t('timer.srTitle') }}</h2>

    <!-- 空闲态：专注 / 休息 模式切换 -->
    <div
      v-if="phase === 'idle'"
      class="mb-1 inline-flex rounded-full bg-black/5 p-1"
      role="tablist"
      :aria-label="t('timer.modeLabel')"
    >
      <button
        type="button"
        role="tab"
        :aria-selected="idleMode === 'focus'"
        class="rounded-full px-5 py-1.5 text-sm font-medium transition"
        :class="
          idleMode === 'focus'
            ? 'bg-white text-tomato-600 shadow-sm'
            : 'text-gray-400 hover:text-gray-600'
        "
        @click="idleMode = 'focus'"
      >
        {{ t('timer.focusTab') }}
      </button>
      <button
        type="button"
        role="tab"
        :aria-selected="idleMode === 'break'"
        class="rounded-full px-5 py-1.5 text-sm font-medium transition"
        :class="
          idleMode === 'break'
            ? 'bg-white text-leaf-600 shadow-sm'
            : 'text-gray-400 hover:text-gray-600'
        "
        @click="idleMode = 'break'"
      >
        {{ t('timer.breakTab') }}
      </button>
    </div>

    <!-- 阶段标签 -->
    <p class="mb-1 text-sm font-medium tracking-wide" :class="theme.text">
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
          :aria-label="t('timer.remaining', { time: formatClock(displaySeconds) })"
        >
          {{ formatClock(displaySeconds) }}
        </p>
        <p class="mt-2 max-w-[12rem] truncate text-sm text-gray-400">
          <template v-if="phase === 'focus'">🎯 {{ taskName || t('timer.unnamedTask') }}</template>
          <template v-else-if="phase === 'break'">{{ t('timer.breakHint') }}</template>
          <template v-else-if="idleMode === 'break'">{{ t('timer.idleBreakHint') }}</template>
          <template v-else>{{ taskName ? '🎯 ' + taskName : t('timer.selectTaskHint') }}</template>
        </p>
      </div>
    </div>

    <!-- 控制按钮区：随阶段与运行状态切换 -->
    <div class="flex flex-wrap items-center justify-center gap-3">
      <!-- 空闲 + 专注模式：开始专注 -->
      <button
        v-if="phase === 'idle' && idleMode === 'focus'"
        type="button"
        class="btn-primary px-8 py-3 text-base"
        :disabled="!canStartFocus"
        @click="emit('start')"
      >
        {{ t('timer.startFocus') }}
      </button>

      <!-- 空闲 + 休息模式：开始休息 -->
      <button
        v-if="phase === 'idle' && idleMode === 'break'"
        type="button"
        class="btn-leaf px-8 py-3 text-base"
        :disabled="!canStartBreak"
        @click="emit('start-break')"
      >
        {{ t('timer.startBreak') }}
      </button>

      <!-- 专注进行中：暂停 / 完成 / 重置 -->
      <template v-else-if="phase === 'focus' && running">
        <button type="button" class="btn-ghost px-6 py-3" @click="emit('pause')">
          {{ t('timer.pause') }}
        </button>
        <button type="button" class="btn-ghost px-6 py-3" @click="emit('complete')">
          ✅ {{ t('timer.complete') }}
        </button>
        <button type="button" class="btn-ghost px-6 py-3" @click="emit('reset')">
          {{ t('timer.resetVoid') }}
        </button>
      </template>

      <!-- 专注暂停：继续 / 完成 / 重置 -->
      <template v-else-if="phase === 'focus' && !running">
        <button type="button" class="btn-primary px-8 py-3 text-base" @click="emit('resume')">
          {{ t('timer.resumeFocus') }}
        </button>
        <button type="button" class="btn-ghost px-6 py-3" @click="emit('complete')">
          ✅ {{ t('timer.complete') }}
        </button>
        <button type="button" class="btn-ghost px-6 py-3" @click="emit('reset')">
          {{ t('timer.resetVoid') }}
        </button>
      </template>

      <!-- 休息进行中：暂停 / 提前结束 -->
      <template v-else-if="phase === 'break' && running">
        <button type="button" class="btn-ghost px-6 py-3" @click="emit('pause')">
          {{ t('timer.pause') }}
        </button>
        <button type="button" class="btn-ghost px-6 py-3" @click="emit('skip')">
          {{ t('timer.skipBreak') }}
        </button>
      </template>

      <!-- 休息暂停：继续 / 重置 / 提前结束 -->
      <template v-else-if="phase === 'break' && !running">
        <button type="button" class="btn-leaf px-8 py-3 text-base" @click="emit('resume')">
          {{ t('timer.resumeBreak') }}
        </button>
        <button type="button" class="btn-ghost px-6 py-3" @click="emit('reset')">
          {{ t('timer.reset') }}
        </button>
        <button type="button" class="btn-ghost px-6 py-3" @click="emit('skip')">
          {{ t('timer.skipBreak') }}
        </button>
      </template>
    </div>
  </section>
</template>
