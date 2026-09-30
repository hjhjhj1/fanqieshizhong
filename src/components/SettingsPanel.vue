<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  useSettings,
  SOUND_OPTIONS,
  DURATION_LIMITS
} from '../composables/useSettings.js'
import { useSound } from '../composables/useSound.js'
import { useNotification } from '../composables/useNotification.js'

/**
 * 设置面板模块（模态弹窗）
 * - 自定义专注 / 休息时长
 * - 提示音开关、音色选择、音量、试听
 * - 桌面通知开关、申请权限、发送测试通知
 * - 恢复默认设置
 */

const { t } = useI18n()

const props = defineProps({
  /** 弹窗是否打开（v-model:open） */
  open: { type: Boolean, default: false }
})
const emit = defineEmits(['update:open'])

const { settings, updateSetting, resetSettings } = useSettings()
const { play, unlock } = useSound()
const {
  supported: notificationSupported,
  permission,
  requestPermission,
  test: testNotification
} = useNotification()

/** 开关组件可复用样式类 */
const switchTrack = (on) =>
  [
    'relative h-6 w-11 shrink-0 rounded-full transition-colors',
    on ? 'bg-tomato-500' : 'bg-black/15'
  ].join(' ')

/**
 * 关闭弹窗
 */
function close() {
  emit('update:open', false)
}

/**
 * 试听当前所选提示音（用户手势内，同时解锁音频）
 */
function handlePreview() {
  unlock()
  play(settings.soundType, settings.volume)
}

/**
 * 切换通知开关：打开时顺带申请权限，被拒绝则回滚开关
 */
async function handleToggleNotification() {
  const next = !settings.notificationEnabled
  updateSetting('notificationEnabled', next)
  if (next && permission.value !== 'granted') {
    const result = await requestPermission()
    if (result !== 'granted') {
      // 用户拒绝或环境不支持：回滚开关，避免"开着却收不到"
      updateSetting('notificationEnabled', false)
    }
  }
}

/**
 * 点击"申请权限"按钮
 */
async function handleRequestPermission() {
  await requestPermission()
}

/**
 * 发送测试通知
 */
async function handleTestNotification() {
  await testNotification()
}

/**
 * 恢复默认设置
 */
function handleReset() {
  resetSettings()
}

/** 权限状态对应的说明文案（随语言切换） */
const permissionHint = computed(() => {
  switch (permission.value) {
    case 'granted':
      return t('settings.permission.granted')
    case 'denied':
      return t('settings.permission.denied')
    case 'unsupported':
      return t('settings.permission.unsupported')
    default:
      return t('settings.permission.defaultHint')
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-0 sm:items-center sm:p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        @click.self="close"
      >
        <div
          class="modal-panel max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white p-6 shadow-2xl sm:rounded-2xl"
        >
          <!-- 标题栏 -->
          <header class="mb-5 flex items-center justify-between">
            <h2 id="settings-title" class="text-lg font-semibold text-gray-800">
              {{ t('settings.title') }}
            </h2>
            <button
              type="button"
              class="rounded-full p-2 text-gray-400 transition hover:bg-black/5 hover:text-gray-600"
              :aria-label="t('settings.close')"
              @click="close"
            >
              ✕
            </button>
          </header>

          <!-- 计时时长 -->
          <fieldset class="mb-6">
            <legend class="mb-3 text-sm font-semibold text-gray-700">{{ t('settings.durationLegend') }}</legend>
            <div class="grid grid-cols-2 gap-4">
              <label class="block">
                <span class="mb-1.5 block text-xs text-gray-500">{{ t('settings.focusMinutes') }}</span>
                <input
                  type="number"
                  class="input tabular-nums"
                  min="1"
                  max="120"
                  :value="settings.focusMinutes"
                  @change="updateSetting('focusMinutes', $event.target.value)"
                />
                <span class="mt-1 block text-[11px] text-gray-400">
                  {{ t('settings.rangeHint', { min: DURATION_LIMITS.focus.min, max: DURATION_LIMITS.focus.max }) }}
                </span>
              </label>
              <label class="block">
                <span class="mb-1.5 block text-xs text-gray-500">{{ t('settings.breakMinutes') }}</span>
                <input
                  type="number"
                  class="input tabular-nums"
                  min="1"
                  max="60"
                  :value="settings.breakMinutes"
                  @change="updateSetting('breakMinutes', $event.target.value)"
                />
                <span class="mt-1 block text-[11px] text-gray-400">
                  {{ t('settings.rangeHint', { min: DURATION_LIMITS.break.min, max: DURATION_LIMITS.break.max }) }}
                </span>
              </label>
            </div>
          </fieldset>

          <!-- 提示音 -->
          <fieldset class="mb-6">
            <legend class="mb-3 text-sm font-semibold text-gray-700">{{ t('settings.soundLegend') }}</legend>

            <!-- 提示音开关 -->
            <div class="mb-3 flex items-center justify-between">
              <span class="text-sm text-gray-600">{{ t('settings.soundToggle') }}</span>
              <button
                type="button"
                role="switch"
                :aria-checked="settings.soundEnabled"
                :class="switchTrack(settings.soundEnabled)"
                @click="updateSetting('soundEnabled', !settings.soundEnabled)"
              >
                <span
                  class="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all"
                  :class="settings.soundEnabled ? 'left-[1.375rem]' : 'left-0.5'"
                />
              </button>
            </div>

            <div
              class="grid grid-cols-[1fr_auto] gap-3"
              :class="settings.soundEnabled ? '' : 'pointer-events-none opacity-40'"
            >
              <label class="block">
                <span class="sr-only">{{ t('settings.soundType') }}</span>
                <select
                  class="input cursor-pointer appearance-none bg-white pr-8"
                  :value="settings.soundType"
                  @change="updateSetting('soundType', $event.target.value)"
                >
                  <option v-for="opt in SOUND_OPTIONS" :key="opt.value" :value="opt.value">
                    {{ t('sounds.' + opt.value) }}
                  </option>
                </select>
              </label>
              <button type="button" class="btn-ghost shrink-0" @click="handlePreview">
                {{ t('settings.preview') }}
              </button>
            </div>

            <!-- 音量 -->
            <label
              class="mt-4 block"
              :class="settings.soundEnabled ? '' : 'pointer-events-none opacity-40'"
            >
              <span class="mb-1.5 flex items-center justify-between text-xs text-gray-500">
                <span>{{ t('settings.volume') }}</span>
                <span class="tabular-nums">{{ Math.round(settings.volume * 100) }}%</span>
              </span>
              <input
                type="range"
                class="w-full accent-tomato-500"
                min="0"
                max="1"
                step="0.1"
                :value="settings.volume"
                @input="updateSetting('volume', $event.target.value)"
              />
            </label>
          </fieldset>

          <!-- 桌面通知 -->
          <fieldset class="mb-6">
            <legend class="mb-3 text-sm font-semibold text-gray-700">{{ t('settings.notifyLegend') }}</legend>

            <div class="mb-2 flex items-center justify-between">
              <span class="text-sm text-gray-600">{{ t('settings.notifyToggle') }}</span>
              <button
                type="button"
                role="switch"
                :aria-checked="settings.notificationEnabled"
                :disabled="!notificationSupported"
                :class="switchTrack(settings.notificationEnabled)"
                @click="handleToggleNotification"
              >
                <span
                  class="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all"
                  :class="settings.notificationEnabled ? 'left-[1.375rem]' : 'left-0.5'"
                />
              </button>
            </div>

            <p class="mb-3 text-xs leading-relaxed text-gray-400">{{ permissionHint }}</p>

            <div class="flex gap-2">
              <!-- 未授权时显示申请按钮 -->
              <button
                v-if="notificationSupported && permission === 'default'"
                type="button"
                class="btn-ghost"
                @click="handleRequestPermission"
              >
                {{ t('settings.requestPermission') }}
              </button>
              <button
                type="button"
                class="btn-ghost"
                :disabled="!notificationSupported || permission !== 'granted'"
                @click="handleTestNotification"
              >
                {{ t('settings.sendTest') }}
              </button>
            </div>
          </fieldset>

          <!-- 底部操作 -->
          <footer class="flex items-center justify-between border-t border-black/5 pt-4">
            <button type="button" class="text-xs text-gray-400 hover:text-tomato-600" @click="handleReset">
              {{ t('settings.resetDefaults') }}
            </button>
            <button type="button" class="btn-primary" @click="close">{{ t('settings.done') }}</button>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
