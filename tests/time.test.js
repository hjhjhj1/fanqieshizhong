import { describe, it, expect } from 'vitest'
import { formatClock, formatDurationHuman } from '../src/utils/time.js'

// 时间格式化工具测试
describe('utils/time', () => {
  describe('formatClock', () => {
    it('0 秒显示为 00:00', () => {
      expect(formatClock(0)).toBe('00:00')
    })

    it('不足 1 小时显示 mm:ss', () => {
      expect(formatClock(65)).toBe('01:05')
      expect(formatClock(1500)).toBe('25:00')
    })

    it('超过 1 小时显示 h:mm:ss', () => {
      expect(formatClock(3661)).toBe('1:01:01')
    })

    it('负数与小数安全处理', () => {
      expect(formatClock(-10)).toBe('00:00')
      expect(formatClock(59.9)).toBe('00:59')
    })
  })

  describe('formatDurationHuman', () => {
    it('秒级展示', () => {
      expect(formatDurationHuman(0)).toBe('0秒')
      expect(formatDurationHuman(45)).toBe('45秒')
    })

    it('分钟级展示', () => {
      expect(formatDurationHuman(60)).toBe('1分钟')
      expect(formatDurationHuman(1500)).toBe('25分钟')
    })

    it('小时级展示（带分钟/不带分钟）', () => {
      expect(formatDurationHuman(3600)).toBe('1小时')
      expect(formatDurationHuman(4800)).toBe('1小时20分钟')
    })
  })
})
