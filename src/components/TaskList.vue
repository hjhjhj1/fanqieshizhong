<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTasks } from '../composables/useTasks.js'
import { formatDurationHuman } from '../utils/time.js'

/**
 * 任务列表模块
 * - 顶部：任务名输入框 + 添加按钮（支持回车提交）
 * - 列表：点击整行选中任务；右侧圆点按钮删除任务
 * - 每条任务展示：名称、完成番茄轮次 🍅、累计专注时长
 * - 计时进行中通过 disabled 锁定选择与删除，避免统计归属错乱
 */

const { t } = useI18n()

const props = defineProps({
  /** 计时进行中为 true，锁定列表交互 */
  disabled: { type: Boolean, default: false }
})

const {
  tasks,
  selectedId,
  totalTomatoCount,
  addTask,
  removeTask,
  selectTask
} = useTasks()

/** 新任务输入框文本 */
const newName = ref('')
/** 表单错误提示（空名称等） */
const errorMsg = ref('')

/** 是否为空列表（用于展示空状态引导） */
const isEmpty = computed(() => tasks.value.length === 0)

/**
 * 提交新任务：点击按钮或回车均会触发
 */
function handleAdd() {
  errorMsg.value = ''
  const result = addTask(newName.value)
  if (result.ok) {
    newName.value = ''
  } else {
    errorMsg.value = result.error
  }
}

/**
 * 删除任务（阻止冒泡，避免误触选中）
 * @param {string} id 任务 ID
 */
function handleRemove(id) {
  removeTask(id)
}

/**
 * 选中任务行
 * @param {string} id 任务 ID
 */
function handleSelect(id) {
  if (props.disabled) return
  // 再次点击已选中的任务：取消选择
  selectTask(selectedId.value === id ? null : id)
}
</script>

<template>
  <section class="card flex h-full flex-col p-5 sm:p-6" aria-labelledby="tasks-title">
    <header class="mb-4 flex items-center justify-between">
      <h2 id="tasks-title" class="text-lg font-semibold text-tomato-700">
        {{ t('tasks.title') }}
      </h2>
      <span
        class="rounded-full bg-tomato-50 px-3 py-1 text-xs font-medium text-tomato-600"
      >
        {{ t('tasks.totalRounds', { count: totalTomatoCount }) }}
      </span>
    </header>

    <!-- 新增任务表单 -->
    <form
      class="mb-2 flex items-stretch gap-2"
      @submit.prevent="handleAdd"
    >
      <input
        v-model="newName"
        class="input"
        type="text"
        maxlength="50"
        :placeholder="t('tasks.placeholder')"
        :disabled="disabled"
        :aria-label="t('tasks.inputLabel')"
      />
      <button
        class="btn-primary shrink-0"
        type="submit"
        :disabled="disabled"
      >
        {{ t('tasks.add') }}
      </button>
    </form>
    <p
      v-if="errorMsg"
      class="mb-2 text-xs text-tomato-600"
      role="alert"
    >
      {{ errorMsg }}
    </p>

    <!-- 任务列表 -->
    <ul class="-mx-1 flex-1 space-y-2 overflow-y-auto pr-1" role="list">
      <li v-for="task in tasks" :key="task.id">
        <div
          class="group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 transition"
          :class="[
            selectedId === task.id
              ? 'bg-tomato-50 ring-2 ring-tomato-400'
              : 'ring-1 ring-black/5 hover:bg-tomato-50/60',
            disabled ? 'cursor-not-allowed opacity-70' : ''
          ]"
          role="button"
          tabindex="0"
          :aria-pressed="selectedId === task.id"
          @click="handleSelect(task.id)"
          @keydown.enter.prevent="handleSelect(task.id)"
          @keydown.space.prevent="handleSelect(task.id)"
        >
          <!-- 选中态圆点 -->
          <span
            class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition"
            :class="
              selectedId === task.id
                ? 'border-tomato-500 bg-tomato-500'
                : 'border-black/20 bg-white'
            "
            aria-hidden="true"
          >
            <span
              v-if="selectedId === task.id"
              class="h-1.5 w-1.5 rounded-full bg-white"
            />
          </span>

          <!-- 任务名称与统计 -->
          <span class="min-w-0 flex-1">
            <span class="block truncate text-[15px] font-medium text-gray-800">
              {{ task.name }}
            </span>
            <span class="mt-0.5 block text-xs text-gray-400">
              {{ t('tasks.stats', { count: task.tomatoCount, duration: formatDurationHuman(task.totalFocusSeconds) }) }}
            </span>
          </span>

          <!-- 删除按钮：× 图标，尺寸加大便于点击 -->
          <button
            type="button"
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg text-black/30 transition hover:bg-tomato-50 hover:text-tomato-600 disabled:cursor-not-allowed disabled:opacity-40"
            :disabled="disabled"
            :aria-label="t('tasks.deleteLabel', { name: task.name })"
            :title="t('tasks.deleteTitle')"
            @click.stop="handleRemove(task.id)"
          >
            ✕
          </button>
        </div>
      </li>
    </ul>

    <!-- 空状态 -->
    <div
      v-if="isEmpty"
      class="mt-2 rounded-xl border border-dashed border-black/10 bg-black/[0.02] px-4 py-8 text-center"
    >
      <p class="text-sm text-gray-400">{{ t('tasks.emptyTitle') }}</p>
      <p class="mt-1 text-xs text-gray-400">{{ t('tasks.emptyHint') }}</p>
    </div>
  </section>
</template>
