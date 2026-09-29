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

  it('空闲态默认显示专注模式与专注时长', () => {
    const wrapper = mount(TimerDial, {
      props: {
        phase: PHASE_IDLE,
        running: false,
        remaining: 0,
        progress: 0,
        focusSeconds: 1500,
        breakSeconds: 300,
        taskName: ''
      }
    })
    expect(wrapper.text()).toContain('25:00')
    expect(wrapper.text()).toContain('专注准备')
    // 默认专注模式下开始按钮存在
    expect(findButtonByText(wrapper, '开始专注')).toBeTruthy()
  })

  it('切换到休息模式后显示休息时长与开始休息按钮', async () => {
    const wrapper = mount(TimerDial, {
      props: {
        phase: PHASE_IDLE,
        focusSeconds: 1500,
        breakSeconds: 300,
        taskName: ''
      }
    })
    // 点击"休息" tab
    const breakTab = wrapper.findAll('[role="tab"]').find((b) => b.text().includes('休息'))
    expect(breakTab).toBeTruthy()
    await breakTab.trigger('click')

    expect(wrapper.text()).toContain('05:00')
    expect(wrapper.text()).toContain('休息准备')
    expect(findButtonByText(wrapper, '开始休息')).toBeTruthy()
    // 专注按钮不再显示
    expect(findButtonByText(wrapper, '开始专注')).toBeFalsy()
  })

  it('未选择任务时开始专注按钮禁用', () => {
    const wrapper = mount(TimerDial, {
      props: { phase: PHASE_IDLE, focusSeconds: 1500, breakSeconds: 300, taskName: '' }
    })
    const btn = findButtonByText(wrapper, '开始专注')
    expect(btn).toBeTruthy()
    expect(btn.attributes('disabled')).toBeDefined()
  })

  it('选中任务后点击开始专注触发 start 事件', async () => {
    const wrapper = mount(TimerDial, {
      props: { phase: PHASE_IDLE, focusSeconds: 1500, breakSeconds: 300, taskName: '背单词' }
    })
    const btn = findButtonByText(wrapper, '开始专注')
    expect(btn.attributes('disabled')).toBeUndefined()
    await btn.trigger('click')
    expect(wrapper.emitted('start')).toHaveLength(1)
  })

  it('休息模式点击开始休息触发 start-break 事件', async () => {
    const wrapper = mount(TimerDial, {
      props: { phase: PHASE_IDLE, focusSeconds: 1500, breakSeconds: 300, taskName: '' }
    })
    // 切换到休息 tab
    const breakTab = wrapper.findAll('[role="tab"]').find((b) => b.text().includes('休息'))
    await breakTab.trigger('click')

    const btn = findButtonByText(wrapper, '开始休息')
    expect(btn.attributes('disabled')).toBeUndefined()
    await btn.trigger('click')
    expect(wrapper.emitted('start-break')).toHaveLength(1)
  })

  it('专注进行中显示暂停与重置按钮并触发对应事件', async () => {
    const wrapper = mount(TimerDial, {
      props: {
        phase: PHASE_FOCUS,
        running: true,
        remaining: 120,
        progress: 0.6,
        focusSeconds: 1500,
        breakSeconds: 300,
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
        focusSeconds: 1500,
        breakSeconds: 300,
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
        focusSeconds: 1500,
        breakSeconds: 300,
        taskName: '阅读'
      }
    })
    const btn = findButtonByText(wrapper, '继续专注')
    expect(btn).toBeTruthy()
    await btn.trigger('click')
    expect(wrapper.emitted('resume')).toHaveLength(1)
  })

  it('空闲休息模式圆环使用绿色主题', async () => {
    const wrapper = mount(TimerDial, {
      props: { phase: PHASE_IDLE, focusSeconds: 1500, breakSeconds: 300, taskName: '' }
    })
    // 切换到休息 tab 并等待响应式更新
    const breakTab = wrapper.findAll('[role="tab"]').find((b) => b.text().includes('休息'))
    await breakTab.trigger('click')
    // 第二个 circle 是进度弧，应有 leaf 色系 class
    const circles = wrapper.findAll('svg circle')
    expect(circles.length).toBeGreaterThanOrEqual(2)
    expect(circles[1].classes().some((c) => c.includes('leaf'))).toBe(true)
  })
})
