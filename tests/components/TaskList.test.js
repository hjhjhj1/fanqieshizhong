import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskList from '../../src/components/TaskList.vue'
import { useTasks } from '../../src/composables/useTasks.js'

// 任务列表组件测试
describe('components/TaskList', () => {
  const { clearTasks } = useTasks()

  beforeEach(() => {
    window.localStorage.clear()
    clearTasks()
  })

  it('空列表展示引导空状态', () => {
    const wrapper = mount(TaskList)
    expect(wrapper.text()).toContain('还没有任务')
  })

  it('输入名称并提交后渲染新任务', async () => {
    const wrapper = mount(TaskList)
    const input = wrapper.find('input[aria-label="新任务名称"]')
    await input.setValue('刷题 20 道')
    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('刷题 20 道')
    expect(wrapper.text()).toContain('0 轮')
    expect(wrapper.text()).not.toContain('还没有任务')
  })

  it('空名称提交显示错误提示', async () => {
    const wrapper = mount(TaskList)
    await wrapper.find('form').trigger('submit')
    expect(wrapper.find('[role="alert"]').text()).toContain('不能为空')
  })

  it('点击任务行切换选中态', async () => {
    const wrapper = mount(TaskList)
    await wrapper.find('input[aria-label="新任务名称"]').setValue('A')
    await wrapper.find('form').trigger('submit')

    const row = wrapper.find('[role="button"]')
    expect(row.attributes('aria-pressed')).toBe('false')
    await row.trigger('click')
    expect(wrapper.find('[role="button"]').attributes('aria-pressed')).toBe('true')
    // 再次点击取消选择
    await wrapper.find('[role="button"]').trigger('click')
    expect(wrapper.find('[role="button"]').attributes('aria-pressed')).toBe('false')
  })

  it('点击删除按钮移除任务', async () => {
    const wrapper = mount(TaskList)
    await wrapper.find('input[aria-label="新任务名称"]').setValue('待删除')
    await wrapper.find('form').trigger('submit')
    expect(wrapper.text()).toContain('待删除')

    await wrapper.find('button[aria-label*="删除任务"]').trigger('click')
    expect(wrapper.text()).not.toContain('待删除')
    expect(wrapper.text()).toContain('还没有任务')
  })

  it('disabled 时输入框、添加按钮与删除按钮均禁用', async () => {
    const wrapper = mount(TaskList, { props: { disabled: true } })
    expect(wrapper.find('input[aria-label="新任务名称"]').attributes('disabled')).toBeDefined()
    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeDefined()
  })
})
