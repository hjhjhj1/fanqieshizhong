<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import TaskList from './components/TaskList.vue'
import TimerDial from './components/TimerDial.vue'
import SettingsPanel from './components/SettingsPanel.vue'
import StatsChart from './components/StatsChart.vue'
import { useTasks } from './composables/useTasks.js'
import { useSettings } from './composables/useSettings.js'
import { useStats } from './composables/useStats.js'
import { useTimer, PHASE_IDLE, PHASE_FOCUS, PHASE_BREAK } from './composables/useTimer.js'
import { useSound } from './composables/useSound.js'
import { useNotification } from './composables/useNotification.js'
import { formatClock } from './utils/time.js'
import { SUPPORTED_LOCALES, setLocale } from './i18n/index.js'

/**
 * 根组件：组装任务列表、计时表盘、设置面板三大模块，
 * 并负责"专注/休息自然结束"时的提示音、桌面通知、浏览器标题联动。
 * 头部含语言切换器（11 种语言，切换后即时生效并持久化）。
 */

const { t, locale } = useI18n()
const { tasks, selectedId, selectedTask, addFocusRecord } = useTasks()
const { settings } = useSettings()
const { addFocusRecord: addStatsRecord } = useStats()
const { unlock, play, playLoop } = useSound()
const { notify, permission, requestPermission } = useNotification()

/** 设置弹窗开关 */
const settingsOpen = ref(false)

/** 响铃中标记：阶段结束后持续响铃，用户可手动停止，最长 60 秒自动停止 */
const ringing = ref(false)
/** 当前响铃的停止函数 */
let stopRingFn = null

/**
 * 触发持续响铃（阶段结束时调用）
 * 若 soundEnabled 关闭则不响
 */
function startRinging() {
  if (!settings.soundEnabled) return
  // 先停掉上一次的响铃（理论上不会重叠，防御性处理）
  stopRinging()
  stopRingFn = playLoop(settings.soundType, settings.volume, 60000)
  ringing.value = true
}

/** 停止响铃（用户点击停止按钮，或新计时开始时自动调用） */
function stopRinging() {
  if (stopRingFn) {
    stopRingFn()
    stopRingFn = null
  }
  ringing.value = false
}

/**
 * 发送通知的兜底逻辑：
 * 若通知已开启但权限未授权，先尝试申请（可能因非用户手势被浏览器忽略），
 * 授权成功后再发通知，保证"开了开关就尽量能收到提醒"。
 */
async function notifySafe(title, body) {
  if (!settings.notificationEnabled) return
  if (permission.value !== 'granted') {
    // 非用户手势中申请权限，浏览器可能忽略；但在部分环境仍可成功
    const result = await requestPermission().catch(() => permission.value)
    if (result !== 'granted') return
  }
  notify(title, body)
}

/**
 * favicon 地址（使用动态绑定而非模板静态 src，
 * 避免 SFC 编译器将静态资源地址转换为构建期模块导入）
 */
const faviconUrl = '/favicon.svg'

/** 空闲态浏览器标题（计时结束后恢复，随语言切换） */
const defaultTitle = computed(() => t('app.defaultTitle'))

/**
 * 供计时器读取当前设置的时长（秒）
 * 在每次进入新阶段那一刻取值，因此设置修改不影响已在进行的阶段
 */
function getDurations() {
  return {
    focus: settings.focusMinutes * 60,
    break: settings.breakMinutes * 60
  }
}

/**
 * 专注倒计时自然走完：
 * 1) 任务统计 +1 轮、累计专注时长 2) 持续响铃（可手动停止） 3) 桌面通知
 * @param {string} taskId 完成专注的任务 ID
 * @param {number} seconds 本轮专注秒数
 */
function handleFocusComplete(taskId, seconds) {
  if (taskId) addFocusRecord(taskId, seconds)
  // 同步记录到"今日"统计，供历史图表展示
  addStatsRecord(seconds)
  startRinging()
  notifySafe(
    t('notify.focusDoneTitle'),
    t('notify.focusDoneBody', { minutes: settings.breakMinutes })
  )
}

/**
 * 休息倒计时自然走完：持续响铃 + 通知
 */
function handleBreakComplete() {
  startRinging()
  notifySafe(t('notify.breakDoneTitle'), t('notify.breakDoneBody'))
}

// 创建计时器（自动 tick 模式）
const timer = useTimer({
  getDurations,
  onFocusComplete: handleFocusComplete,
  onBreakComplete: handleBreakComplete
})

/** 计时进行中锁定任务列表（不允许切换 / 删除任务） */
const isLocked = computed(() => timer.phase.value !== PHASE_IDLE)

/** 表盘展示的任务名：计时中以 activeTaskId 对应任务为准，空闲态取选中任务 */
const dialTaskName = computed(() => {
  if (timer.phase.value === PHASE_FOCUS) {
    return (
      tasks.value.find((t) => t.id === timer.activeTaskId.value)?.name || ''
    )
  }
  return selectedTask.value?.name || ''
})

/* ---- 表盘操作事件转发 ---- */

/**
 * 点击"开始专注"
 * 在用户手势内申请通知权限（浏览器要求权限申请必须由用户交互触发）
 */
async function handleStart() {
  if (!selectedId.value) return
  // 通知开启但未授权时，趁用户点击手势申请权限
  if (
    settings.notificationEnabled &&
    permission.value !== 'granted' &&
    permission.value !== 'denied'
  ) {
    await requestPermission().catch(() => {})
  }
  stopRinging()
  timer.startFocus(selectedId.value)
}

/**
 * 点击"开始休息"（手动休息，不关联任务）
 */
async function handleStartBreak() {
  if (
    settings.notificationEnabled &&
    permission.value !== 'granted' &&
    permission.value !== 'denied'
  ) {
    await requestPermission().catch(() => {})
  }
  stopRinging()
  timer.startBreak()
}

/** 语言切换器变更 */
function handleLocaleChange(event) {
  setLocale(event.target.value)
}

/* ---- 浏览器标签标题随倒计时联动（切到后台也能看到剩余时间） ----
   监听 locale：切换语言后标题文案即时更新 */
watch(
  () => [timer.phase.value, timer.running.value, timer.remaining.value, locale.value],
  ([phase, running, remaining]) => {
    if (phase === PHASE_IDLE) {
      document.title = defaultTitle.value
    } else if (running) {
      const icon = phase === PHASE_FOCUS ? '🍅' : '☕'
      const label =
        phase === PHASE_FOCUS
          ? t('timer.phase.focusing')
          : t('timer.phase.breaking')
      document.title = `${icon} ${formatClock(remaining)} ${label}`
    } else {
      document.title = `⏸ ${formatClock(remaining)} ${t('timer.phase.paused')}`
    }
  }
)

// 挂载后兜底设置一次标题
onMounted(() => {
  document.title = defaultTitle.value
})
</script>

<template>
  <!-- 任意点击 / 按键都尝试解锁 Web Audio（满足浏览器自动播放策略） -->
  <div
    class="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-6 sm:px-6 sm:py-10"
    @click="unlock"
    @keydown="unlock"
  >
    <!-- 站点头部 -->
    <header class="mb-6 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <img :src="faviconUrl" alt="" class="h-10 w-10" />
        <div>
          <h1 class="text-xl font-bold text-tomato-700 sm:text-2xl">
            {{ t('app.title') }}
          </h1>
          <p class="text-xs text-gray-400 sm:text-sm">
            {{ t('app.subtitle') }}
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <!-- 语言切换器：原生 select，展示各语言原生名称 -->
        <select
          :value="locale"
          class="btn-ghost cursor-pointer appearance-none text-sm"
          :aria-label="t('app.language')"
          @change="handleLocaleChange"
        >
          <option
            v-for="l in SUPPORTED_LOCALES"
            :key="l.code"
            :value="l.code"
          >
            {{ l.name }}
          </option>
        </select>
        <button
          type="button"
          class="btn-ghost"
          :aria-label="t('app.settingsAriaLabel')"
          @click.stop="settingsOpen = true"
        >
          {{ t('app.settings') }}
        </button>
      </div>
    </header>

    <!-- 主体：大屏左右两栏，小屏上下堆叠 -->
    <main class="grid flex-1 gap-5 lg:grid-cols-[1.1fr_0.9fr]">
      <div class="flex flex-col gap-3">
        <TimerDial
          :phase="timer.phase.value"
          :running="timer.running.value"
          :remaining="timer.remaining.value"
          :progress="timer.progress.value"
          :focus-seconds="settings.focusMinutes * 60"
          :break-seconds="settings.breakMinutes * 60"
          :task-name="dialTaskName"
          @start="handleStart"
          @start-break="handleStartBreak"
          @pause="timer.pause"
          @resume="timer.resume"
          @reset="timer.reset"
          @skip="timer.skipBreak"
        />
        <!-- 响铃停止按钮：阶段结束后持续响铃 60 秒，用户可手动停止 -->
        <button
          v-if="ringing"
          type="button"
          class="btn-primary w-full animate-pulse py-3 text-base"
          @click="stopRinging"
        >
          🔕 {{ t('timer.stopRinging') }}
        </button>
      </div>
      <TaskList :disabled="isLocked" />
    </main>

    <!-- 专注统计图表：按天展示历史专注时长 -->
    <div class="mt-5">
      <StatsChart />
    </div>

    <!-- 页脚说明（同时承载 SEO 长尾文案） -->
    <footer class="mt-8 text-center text-xs leading-relaxed text-gray-400">
      <p>
        {{
          t('app.footerPomodoro', {
            focus: settings.focusMinutes,
            break: settings.breakMinutes
          })
        }}
      </p>
      <p class="mt-1">
        {{ t('app.footerStorage') }}
      </p>
    </footer>

    <!-- 禁用 JavaScript 时的降级提示（此时 Vue 不会运行，静态双语展示） -->
    <noscript>
      <p style="text-align: center; padding: 16px">
        番茄专注计时器需要启用 JavaScript 才能运行，请在浏览器设置中开启后刷新页面。<br />
        Pomodoro Focus Timer requires JavaScript. Please enable it in your
        browser settings and refresh the page.
      </p>
    </noscript>

    <!-- 设置弹窗 -->
    <SettingsPanel v-model:open="settingsOpen" />
  </div>
</template>
