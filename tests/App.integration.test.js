import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../src/App.vue'
import { useTasks } from '../src/composables/useTasks.js'
import { useSettings } from '../src/composables/useSettings.js'

// 应用级集成测试：任务录入 → 选中 → 开始专注 → 重置（本轮作废）的完整交互
// jsdom 不提供 Web Audio / Notification，两个模块均已做安全降级
describe('App 集成流程', () => {
  const { clearTasks } = useTasks()
  const { resetSettings } = useSettings()

  beforeEach(() => {
    window.localStorage.clear()
    clearTasks()
    resetSettings()
  })

  /** 按文本包含查找按钮 */
  function findButtonByText(wrapper, keyword) {
    return wrapper
      .findAll('button')
      .find((b) => b.text().includes(keyword))
  }

  /** 录入并选中一条任务的通用步骤 */
  async function addAndSelectTask(wrapper, name) {
    await wrapper.find('input[aria-label="新任务名称"]').setValue(name)
    await wrapper.find('form').trigger('submit')
    await wrapper.find('[role="button"]').trigger('click')
  }

  it('渲染语义化标题，未选任务时开始按钮禁用', () => {
    const wrapper = mount(App)
    expect(wrapper.find('h1').text()).toContain('番茄专注计时器')
    const startBtn = findButtonByText(wrapper, '开始专注')
    expect(startBtn.attributes('disabled')).toBeDefined()
  })

  it('完整闭环：添加任务 → 选中 → 开始专注 → 重置作废不计统计', async () => {
    const wrapper = mount(App)

    // 1. 添加并选中任务
    await addAndSelectTask(wrapper, '复习英语')
    const startBtn = findButtonByText(wrapper, '开始专注')
    expect(startBtn.attributes('disabled')).toBeUndefined()

    // 2. 开始专注
    await startBtn.trigger('click')
    expect(wrapper.text()).toContain('专注中')
    // 计时中任务列表锁定
    expect(
      wrapper.find('input[aria-label="新任务名称"]').attributes('disabled')
    ).toBeDefined()
    // 显示暂停/重置控制
    expect(findButtonByText(wrapper, '暂停')).toBeTruthy()
    expect(findButtonByText(wrapper, '本轮作废')).toBeTruthy()

    // 3. 中途重置：本轮作废
    await findButtonByText(wrapper, '重置').trigger('click')
    expect(wrapper.text()).toContain('准备开始')
    // 任务仍在，番茄轮次仍为 0（未计入统计）
    expect(wrapper.text()).toContain('复习英语')
    expect(wrapper.text()).toMatch(/🍅\s*0\s*轮/)
    // 列表解锁
    expect(
      wrapper.find('input[aria-label="新任务名称"]').attributes('disabled')
    ).toBeUndefined()
  })
})
