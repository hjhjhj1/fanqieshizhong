<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStats } from '../composables/useStats.js'

/**
 * 专注统计图表模块
 * - 按"天"展示历史专注时长（柱状图，纯 SVG 实现，无第三方依赖）
 * - 支持切换最近 7 天 / 30 天
 * - 每根柱子上方标注当日番茄轮次，hover 显示具体分钟数
 */

const { t } = useI18n()
const { getRecentDays } = useStats()

/** 当前展示的天数：7 或 30 */
const rangeDays = ref(7)

/** 最近 N 天的统计序列 */
const series = computed(() => getRecentDays(rangeDays.value))

/** 序列中的最大专注秒数（用于计算柱子高度比例） */
const maxSeconds = computed(() =>
  series.value.reduce((max, d) => Math.max(max, d.focusSeconds), 0)
)

/** 总专注分钟数（展示用） */
const totalMinutes = computed(() =>
  Math.round(series.value.reduce((sum, d) => sum + d.focusSeconds, 0) / 60)
)

/** 总番茄轮次 */
const totalTomatoes = computed(() =>
  series.value.reduce((sum, d) => sum + d.tomatoCount, 0)
)

/** 是否完全没有数据 */
const isEmpty = computed(() => totalMinutes.value === 0)

/* ---- SVG 几何参数 ---- */
const CHART_HEIGHT = 140 // 图表区高度（px）
const BAR_GAP = 4 // 柱子间距（px）

/** 柱子宽度：根据天数自适应，保证 7 天和 30 天都能放下 */
const barWidth = computed(() => {
  const count = series.value.length
  // 留出左右边距各 8px
  const totalGap = (count - 1) * BAR_GAP
  return Math.max(4, (600 - 16 - totalGap) / count)
})

/**
 * 格式化日期键为短标签
 * - 7 天模式：M/D（如 10/1）
 * - 30 天模式：只显示每隔几天的标签，避免拥挤
 * @param {string} dateKey YYYY-MM-DD
 * @returns {string}
 */
function dateLabel(dateKey) {
  const [, m, d] = dateKey.split('-')
  return `${Number(m)}/${Number(d)}`
}

/**
 * 某根柱子的高度（px），按最大值比例换算
 * @param {number} seconds
 * @returns {number}
 */
function barHeight(seconds) {
  if (maxSeconds.value <= 0) return 0
  return Math.round((seconds / maxSeconds.value) * CHART_HEIGHT)
}

/** 鼠标 hover 的柱子索引（-1 表示无） */
const hoverIndex = ref(-1)

/** hover 时显示的提示文本 */
const hoverText = computed(() => {
  if (hoverIndex.value < 0) return ''
  const d = series.value[hoverIndex.value]
  if (!d) return ''
  const mins = Math.round(d.focusSeconds / 60)
  return `${dateLabel(d.dateKey)}: ${mins} ${t('stats.minutes')} · 🍅 ${d.tomatoCount}`
})
</script>

<template>
  <section class="card p-5 sm:p-6" aria-labelledby="stats-title">
    <header class="mb-4 flex flex-wrap items-center justify-between gap-3">
      <h2 id="stats-title" class="text-lg font-semibold text-tomato-700">
        {{ t('stats.title') }}
      </h2>
      <!-- 汇总：总分钟 + 总番茄 -->
      <div class="flex items-center gap-4 text-sm text-gray-500">
        <span>
          {{ t('stats.totalFocus', { minutes: totalMinutes }) }}
        </span>
        <span class="rounded-full bg-tomato-50 px-2.5 py-0.5 text-xs text-tomato-600">
          🍅 {{ totalTomatoes }}
        </span>
      </div>
    </header>

    <!-- 天数切换：7 天 / 30 天 -->
    <div class="mb-4 inline-flex rounded-full bg-black/5 p-1" role="tablist" :aria-label="t('stats.rangeLabel')">
      <button
        type="button"
        role="tab"
        :aria-selected="rangeDays === 7"
        class="rounded-full px-4 py-1 text-sm font-medium transition"
        :class="rangeDays === 7 ? 'bg-white text-tomato-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'"
        @click="rangeDays = 7"
      >
        {{ t('stats.last7Days') }}
      </button>
      <button
        type="button"
        role="tab"
        :aria-selected="rangeDays === 30"
        class="rounded-full px-4 py-1 text-sm font-medium transition"
        :class="rangeDays === 30 ? 'bg-white text-tomato-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'"
        @click="rangeDays = 30"
      >
        {{ t('stats.last30Days') }}
      </button>
    </div>

    <!-- 空状态 -->
    <div
      v-if="isEmpty"
      class="rounded-xl border border-dashed border-black/10 bg-black/[0.02] px-4 py-10 text-center"
    >
      <p class="text-sm text-gray-400">{{ t('stats.empty') }}</p>
    </div>

    <!-- 柱状图 -->
    <div v-else class="w-full overflow-x-auto">
      <svg
        :width="barWidth * series.length + (series.length - 1) * BAR_GAP + 16"
        :height="CHART_HEIGHT + 36"
        class="block"
        role="img"
        :aria-label="t('stats.chartAriaLabel')"
      >
        <!-- 基线 -->
        <line
          x1="0"
          :y1="CHART_HEIGHT"
          :x2="barWidth * series.length + (series.length - 1) * BAR_GAP + 16"
          :y2="CHART_HEIGHT"
          stroke="rgba(0,0,0,0.08)"
          stroke-width="1"
        />
        <!-- 每根柱子 -->
        <g v-for="(d, i) in series" :key="d.dateKey">
          <rect
            :x="8 + i * (barWidth + BAR_GAP)"
            :y="CHART_HEIGHT - barHeight(d.focusSeconds)"
            :width="barWidth"
            :height="barHeight(d.focusSeconds)"
            :rx="Math.min(3, barWidth / 2)"
            class="transition-all"
            :class="
              hoverIndex === i
                ? 'fill-tomato-500'
                : d.dateKey === series[series.length - 1].dateKey
                  ? 'fill-tomato-400'
                  : 'fill-tomato-300'
            "
            @mouseenter="hoverIndex = i"
            @mouseleave="hoverIndex = -1"
          />
          <!-- 番茄数标注（仅 7 天模式且柱子够高时显示，避免拥挤） -->
          <text
            v-if="rangeDays === 7 && d.tomatoCount > 0 && barHeight(d.focusSeconds) > 14"
            :x="8 + i * (barWidth + BAR_GAP) + barWidth / 2"
            :y="CHART_HEIGHT - barHeight(d.focusSeconds) - 4"
            text-anchor="middle"
            class="fill-tomato-600 text-[10px] font-medium"
          >
            {{ d.tomatoCount }}
          </text>
          <!-- 日期标签（30 天模式下每隔 3 天显示一个，避免重叠） -->
          <text
            v-if="rangeDays === 7 || i % 3 === 0 || i === series.length - 1"
            :x="8 + i * (barWidth + BAR_GAP) + barWidth / 2"
            :y="CHART_HEIGHT + 16"
            text-anchor="middle"
            class="fill-gray-400 text-[10px]"
          >
            {{ dateLabel(d.dateKey) }}
          </text>
        </g>
      </svg>
    </div>

    <!-- hover 提示 -->
    <p v-if="hoverText" class="mt-2 h-4 text-center text-xs text-tomato-600">
      {{ hoverText }}
    </p>
  </section>
</template>
