<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import TaskList from './components/TaskList.vue'
import TimerDial from './components/TimerDial.vue'
import SettingsPanel from './components/SettingsPanel.vue'
import { useTasks } from './composables/useTasks.js'
import { useSettings } from './composables/useSettings.js'
import { useTimer, PHASE_IDLE, PHASE_FOCUS } from './composables/useTimer.js'
import { useSound } from './composables/useSound.js'
import { useNotification } from './composables/useNotification.js'
import { formatClock } from './utils/time.js'

/**
 * 根组件：组装任务列表、计时表盘、设置面板三大模块，
 * 并负责"专注/休息自然结束"时的提示音、桌面通知、浏览器标题联动。
 */

const { tasks, selectedId, selectedTask, addFocusRecord } = useTasks()
const { settings } = useSettings()
const { unlock, play } = useSound()
const { notify } = useNotification()

/** 设置弹窗开关 */
const settingsOpen = ref(false)

/**
 * favicon 地址（使用动态绑定而非模板静态 src，
 * 避免 SFC 编译器将静态资源地址转换为构建期模块导入）
 */
const faviconUrl = '/favicon.svg'

/** 空闲态浏览器标题（计时结束后恢复） */
const DEFAULT_TITLE = '番茄专注计时器 - 在线番茄钟'

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
 * 1) 任务统计 +1 轮、累计专注时长 2) 提示音 3) 桌面通知
 * @param {string} taskId 完成专注的任务 ID
 * @param {number} seconds 本轮专注秒数
 */
function handleFocusComplete(taskId, seconds) {
  if (taskId) addFocusRecord(taskId, seconds)
  if (settings.soundEnabled) play(settings.soundType, settings.volume)
  if (settings.notificationEnabled) {
    notify('专注完成 🎉', `本轮专注已完成，休息 ${settings.breakMinutes} 分钟吧`)
  }
}

/**
 * 休息倒计时自然走完：提示音 + 通知
 */
function handleBreakComplete() {
  if (settings.soundEnabled) play(settings.soundType, settings.volume)
  if (settings.notificationEnabled) {
    notify('休息结束 ☕', '休息好了吗？回来开始新一轮专注吧')
  }
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

/** 点击"开始专注" */
function handleStart() {
  if (selectedId.value) timer.startFocus(selectedId.value)
}

/* ---- 浏览器标签标题随倒计时联动（切到后台也能看到剩余时间） ---- */
watch(
  () => [timer.phase.value, timer.running.value, timer.remaining.value],
  ([phase, running, remaining]) => {
    if (phase === PHASE_IDLE) {
      document.title = DEFAULT_TITLE
    } else if (running) {
      const icon = phase === PHASE_FOCUS ? '🍅' : '☕'
      const label = phase === PHASE_FOCUS ? '专注中' : '休息中'
      document.title = `${icon} ${formatClock(remaining)} ${label}`
    } else {
      document.title = `⏸ ${formatClock(remaining)} 已暂停`
    }
  }
)

// 挂载后兜底设置一次标题
onMounted(() => {
  document.title = DEFAULT_TITLE
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
            番茄专注计时器
          </h1>
          <p class="text-xs text-gray-400 sm:text-sm">
            多任务番茄钟 · 按任务统计专注时长 · 数据仅保存在本机
          </p>
        </div>
      </div>
      <button
        type="button"
        class="btn-ghost"
        aria-label="打开设置"
        @click.stop="settingsOpen = true"
      >
        ⚙ 设置
      </button>
    </header>

    <!-- 主体：大屏左右两栏，小屏上下堆叠 -->
    <main class="grid flex-1 gap-5 lg:grid-cols-[1.1fr_0.9fr]">
      <TimerDial
        :phase="timer.phase.value"
        :running="timer.running.value"
        :remaining="timer.remaining.value"
        :progress="timer.progress.value"
        :idle-seconds="settings.focusMinutes * 60"
        :task-name="dialTaskName"
        @start="handleStart"
        @pause="timer.pause"
        @resume="timer.resume"
        @reset="timer.reset"
        @skip="timer.skipBreak"
      />
      <TaskList :disabled="isLocked" />
    </main>

    <!-- 页脚说明（同时承载 SEO 长尾文案） -->
    <footer class="mt-8 text-center text-xs leading-relaxed text-gray-400">
      <p>
        番茄工作法：专注 {{ settings.focusMinutes }} 分钟后休息
        {{ settings.breakMinutes }} 分钟，每完成一轮专注自动为任务累计一个番茄 🍅
      </p>
      <p class="mt-1">
        所有任务与设置均保存在浏览器本地（localStorage），无需注册、无需联网，可离线使用。
      </p>
    </footer>

    <!-- 禁用 JavaScript 时的降级提示 -->
    <noscript>
      <p style="text-align: center; padding: 16px">
        番茄专注计时器需要启用 JavaScript 才能运行，请在浏览器设置中开启后刷新页面。
      </p>
    </noscript>

    <!-- 设置弹窗 -->
    <SettingsPanel v-model:open="settingsOpen" />
  </div>
</template>
