/**
 * 语言包：简体中文（zh-CN）
 * 注意：文案需与历史版本逐字一致，既有测试断言依赖这些文本
 */
export default {
  app: {
    title: '番茄专注计时器',
    subtitle: '多任务番茄钟 · 按任务统计专注时长 · 数据仅保存在本机',
    settings: '⚙ 设置',
    settingsAriaLabel: '打开设置',
    language: '界面语言',
    defaultTitle: '番茄专注计时器 - 在线番茄钟',
    footerPomodoro:
      '番茄工作法：专注 {focus} 分钟后休息 {break} 分钟，每完成一轮专注自动为任务累计一个番茄 🍅',
    footerStorage:
      '所有任务与设置均保存在浏览器本地（localStorage），无需注册、无需联网，可离线使用。',
    noscript:
      '番茄专注计时器需要启用 JavaScript 才能运行，请在浏览器设置中开启后刷新页面。'
  },
  timer: {
    srTitle: '番茄计时器',
    focusTab: '🍅 专注',
    breakTab: '☕ 休息',
    modeLabel: '计时模式',
    phase: {
      focusing: '专注中',
      paused: '已暂停',
      breaking: '休息中',
      breakPaused: '休息已暂停',
      focusReady: '专注准备',
      breakReady: '休息准备'
    },
    remaining: '剩余 {time}',
    unnamedTask: '未命名任务',
    breakHint: '放松一下，喝口水吧',
    idleBreakHint: '随时可以开始休息',
    selectTaskHint: '请在右侧选择一条任务',
    startFocus: '▶ 开始专注',
    startBreak: '▶ 开始休息',
    pause: '⏸ 暂停',
    resumeFocus: '▶ 继续专注',
    resumeBreak: '▶ 继续休息',
    resetVoid: '↺ 重置（本轮作废）',
    resetVoidHint: '本轮作废',
    reset: '↺ 重置',
    complete: '完成并记录',
    skipBreak: '⏹ 提前结束休息',
    stopRinging: '停止响铃'
  },
  tasks: {
    title: '任务列表',
    totalRounds: '共 🍅 {count} 轮',
    placeholder: '输入任务名称，如：阅读 30 页',
    inputLabel: '新任务名称',
    add: '添加',
    stats: '🍅 {count} 轮 · 专注 {duration}',
    deleteLabel: '删除任务 {name}',
    deleteTitle: '删除任务',
    emptyTitle: '还没有任务',
    emptyHint: '在上方输入一条任务，开始你的第一个番茄钟 🍅',
    errorEmpty: '任务名称不能为空',
    errorTooLong: '任务名称不能超过 {max} 个字符'
  },
  settings: {
    title: '设置',
    close: '关闭设置',
    durationLegend: '计时时长',
    focusMinutes: '专注时长（分钟）',
    breakMinutes: '休息时长（分钟）',
    rangeHint: '范围 {min}~{max} 分钟',
    soundLegend: '提示音',
    soundToggle: '阶段结束时播放提示音',
    soundType: '提示音类型',
    preview: '🔊 试听',
    volume: '音量',
    notifyLegend: '桌面通知',
    notifyToggle: '开启桌面通知提醒',
    requestPermission: '申请通知权限',
    sendTest: '发送测试通知',
    resetDefaults: '恢复默认设置',
    done: '完成',
    permission: {
      granted: '已授权，专注与休息结束时将弹出桌面通知',
      denied: '通知权限已被浏览器拒绝。请点击地址栏左侧的 🔒 图标，在「站点设置」中将「通知」改为「允许」，然后刷新页面',
      unsupported: '当前浏览器不支持桌面通知',
      defaultHint: '尚未授权。点击左侧按钮申请；若浏览器未弹出授权框，请点击地址栏左侧 🔒 图标，在「站点设置」中手动允许通知'
    }
  },
  sounds: {
    beep: '经典蜂鸣',
    chime: '清脆风铃',
    bell: '悠扬钟声',
    digital: '电子音阶'
  },
  notify: {
    focusDoneTitle: '专注完成 🎉',
    focusDoneBody: '本轮专注已完成，休息 {minutes} 分钟吧',
    breakDoneTitle: '休息结束 ☕',
    breakDoneBody: '休息好了吗？回来开始新一轮专注吧',
    testTitle: '番茄专注计时器',
    testBody: '通知已开启，专注结束时会在这里提醒你 🍅'
  },
  time: {
    hm: '{h}小时{m}分钟',
    h: '{h}小时',
    m: '{m}分钟',
    s: '{s}秒'
  },
  stats: {
    title: '专注统计',
    totalFocus: '累计专注 {minutes} 分钟',
    rangeLabel: '统计范围',
    last7Days: '最近 7 天',
    last30Days: '最近 30 天',
    minutes: '分钟',
    empty: '暂无专注记录，完成一轮番茄钟后这里会展示历史趋势 📊',
    chartAriaLabel: '专注时长柱状图'
  }
}
