import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TimerDial from '../../src/components/TimerDial.vue'
import { PHASE_IDLE, PHASE_FOCUS, PHASE_BREAK } from '../../src/composables/useTimer.js'

// 计时表盘组件测试
describe('components/TimerDial', () => {
  /** 按文本包含关系查找按钮的辅助函数 */
  function findButtonByText(wrapper, keyword) {
    return wrapper
      .findAll('button')
      .find((b) => b.text().includes(keyword))
  }

  it('空闲态显示默认专注时长', () => {
    const wrapper = mount(TimerDial, {
      props: {
        phase: PHASE_IDLE,
        running: false,
        remaining: 0,
        progress: 0,
        idleSeconds: 1500,
        taskName: ''
      }
    })
    expect(wrapper.text()).toContain('25:00')
    expect(wrapper.text()).toContain('准备开始')
  })

  it('未选择任务时开始按钮禁用', () => {
    const wrapper = mount(TimerDial, {
      props: { phase: PHASE_IDLE, idleSeconds: 1500, taskName: '' }
    })
    const btn = findButtonByText(wrapper, '开始专注')
    expect(btn).toBeTruthy()
    expect(btn.attributes('disabled')).toBeDefined()
  })

  it('选中任务后点击开始按钮触发 start 事件', async () => {
    const wrapper = mount(TimerDial, {
      props: { phase: PHASE_IDLE, idleSeconds: 1500, taskName: '背单词' }
    })
    const btn = findButtonByText(wrapper, '开始专注')
    expect(btn.attributes('disabled')).toBeUndefined()
    await btn.trigger('click')
    expect(wrapper.emitted('start')).toHaveLength(1)
  })

  it('专注进行中显示暂停与重置按钮并触发对应事件', async () => {
    const wrapper = mount(TimerDial, {
      props: {
        phase: PHASE_FOCUS,
        running: true,
        remaining: 120,
        progress: 0.6,
        taskName: '写作'
      }
    })
    expect(wrapper.text()).toContain('专注中')
    expect(wrapper.text()).toContain('写作')

    await findButtonByText(wrapper, '暂停').trigger('click')
    await findButtonByText(wrapper, '重置').trigger('click')
    expect(wrapper.emitted('pause')).toHaveLength(1)
    expect(wrapper.emitted('reset')).toHaveLength(1)
  })

  it('休息阶段提供提前结束按钮并触发 skip 事件', async () => {
    const wrapper = mount(TimerDial, {
      props: {
        phase: PHASE_BREAK,
        running: true,
        remaining: 100,
        progress: 0.2,
        taskName: ''
      }
    })
    expect(wrapper.text()).toContain('休息中')
    await findButtonByText(wrapper, '提前结束休息').trigger('click')
    expect(wrapper.emitted('skip')).toHaveLength(1)
  })

  it('暂停态显示继续按钮', async () => {
    const wrapper = mount(TimerDial, {
      props: {
        phase: PHASE_FOCUS,
        running: false,
        remaining: 100,
        progress: 0.3,
        taskName: '阅读'
      }
    })
    const btn = findButtonByText(wrapper, '继续专注')
    expect(btn).toBeTruthy()
    await btn.trigger('click')
    expect(wrapper.emitted('resume')).toHaveLength(1)
  })
})
