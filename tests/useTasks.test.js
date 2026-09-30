import { describe, it, expect, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { useTasks } from '../src/composables/useTasks.js'

// 任务列表模块测试（模块级单例，beforeEach 清空）
describe('composables/useTasks', () => {
  const {
    tasks,
    selectedId,
    selectedTask,
    addTask,
    removeTask,
    selectTask,
    addFocusRecord,
    clearTasks
  } = useTasks()

  beforeEach(() => {
    window.localStorage.clear()
    clearTasks()
  })

  it('初始为空列表、无选中任务', () => {
    expect(tasks.value).toEqual([])
    expect(selectedId.value).toBeNull()
    expect(selectedTask.value).toBeNull()
  })

  it('addTask 创建结构完整的任务', () => {
    const result = addTask('学习 Vue')
    expect(result.ok).toBe(true)
    expect(tasks.value).toHaveLength(1)
    const task = tasks.value[0]
    expect(task).toMatchObject({
      name: '学习 Vue',
      totalFocusSeconds: 0,
      tomatoCount: 0
    })
    expect(typeof task.id).toBe('string')
    expect(task.id.length).toBeGreaterThan(0)
    expect(typeof task.createAt).toBe('number')
  })

  it('空名称 / 纯空白名称被拒绝', () => {
    expect(addTask('').ok).toBe(false)
    expect(addTask('   ').ok).toBe(false)
    expect(tasks.value).toHaveLength(0)
  })

  it('名称两侧空白会被裁剪', () => {
    addTask('  阅读  ')
    expect(tasks.value[0].name).toBe('阅读')
  })

  it('超长名称被拒绝', () => {
    const result = addTask('x'.repeat(51))
    expect(result.ok).toBe(false)
  })

  it('selectTask 选中合法任务，非法 ID 被忽略', () => {
    addTask('A')
    const realId = tasks.value[0].id
    selectTask(realId)
    expect(selectedId.value).toBe(realId)
    expect(selectedTask.value.id).toBe(realId)
    selectTask('not-exist')
    expect(selectedId.value).toBe(realId)
    selectTask(null)
    expect(selectedId.value).toBeNull()
  })

  it('删除选中任务后自动取消选中', () => {
    addTask('A')
    const id = tasks.value[0].id
    selectTask(id)
    removeTask(id)
    expect(tasks.value).toHaveLength(0)
    expect(selectedId.value).toBeNull()
  })

  it('addFocusRecord 累加番茄轮次与专注时长', () => {
    addTask('写作')
    const id = tasks.value[0].id
    addFocusRecord(id, 1500)
    addFocusRecord(id, 1500)
    expect(tasks.value[0].tomatoCount).toBe(2)
    expect(tasks.value[0].totalFocusSeconds).toBe(3000)
  })

  it('addFocusRecord countTomato=false 时只累加时长不计数番茄', () => {
    addTask('阅读')
    const id = tasks.value[0].id
    // 提前完成：不计数番茄，只记录时长
    addFocusRecord(id, 600, false)
    expect(tasks.value[0].tomatoCount).toBe(0)
    expect(tasks.value[0].totalFocusSeconds).toBe(600)

    // 正常完成：计数番茄
    addFocusRecord(id, 1500, true)
    expect(tasks.value[0].tomatoCount).toBe(1)
    expect(tasks.value[0].totalFocusSeconds).toBe(2100)
  })

  it('对不存在的任务记录专注时静默忽略', () => {
    expect(() => addFocusRecord('ghost', 100)).not.toThrow()
  })

  it('任务变化后自动持久化到 localStorage', async () => {
    addTask('持久化任务')
    await nextTick()
    const raw = JSON.parse(window.localStorage.getItem('fqt:tasks-v1'))
    expect(raw).toHaveLength(1)
    expect(raw[0].name).toBe('持久化任务')
  })
})
