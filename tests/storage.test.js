import { describe, it, expect, beforeEach } from 'vitest'
import { loadStorage, saveStorage, removeStorage } from '../src/utils/storage.js'

// localStorage 安全封装测试
describe('utils/storage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('key 不存在时返回默认值', () => {
    expect(loadStorage('missing', 42)).toBe(42)
    expect(loadStorage('missing')).toBeNull()
  })

  it('写入后可正确读取（带统一前缀）', () => {
    expect(saveStorage('tasks', [{ id: '1' }])).toBe(true)
    // 物理 key 带 fqt: 前缀
    expect(window.localStorage.getItem('fqt:tasks')).toBe(
      JSON.stringify([{ id: '1' }])
    )
    expect(loadStorage('tasks')).toEqual([{ id: '1' }])
  })

  it('支持基础类型与对象', () => {
    saveStorage('num', 25)
    saveStorage('str', 'beep')
    expect(loadStorage('num')).toBe(25)
    expect(loadStorage('str')).toBe('beep')
  })

  it('脏 JSON 数据回退默认值，不抛异常', () => {
    window.localStorage.setItem('fqt:dirty', '{不是合法JSON')
    expect(loadStorage('dirty', [])).toEqual([])
  })

  it('removeStorage 可删除数据', () => {
    saveStorage('a', 1)
    removeStorage('a')
    expect(loadStorage('a', null)).toBeNull()
  })
})
