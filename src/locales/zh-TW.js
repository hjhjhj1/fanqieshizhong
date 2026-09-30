/**
 * 语言包：繁體中文（zh-TW）
 */
export default {
  app: {
    title: '番茄專注計時器',
    subtitle: '多任務番茄鐘 · 按任務統計專注時長 · 資料僅儲存在本機',
    settings: '⚙ 設定',
    settingsAriaLabel: '開啟設定',
    language: '介面語言',
    defaultTitle: '番茄專注計時器 - 線上番茄鐘',
    footerPomodoro:
      '番茄工作法：專注 {focus} 分鐘後休息 {break} 分鐘，每完成一輪專注自動為任務累計一個番茄 🍅',
    footerStorage:
      '所有任務與設定均儲存在瀏覽器本機（localStorage），無需註冊、無需連網，可離線使用。',
    noscript:
      '番茄專注計時器需要啟用 JavaScript 才能執行，請在瀏覽器設定中開啟後重新整理頁面。'
  },
  timer: {
    srTitle: '番茄計時器',
    focusTab: '🍅 專注',
    breakTab: '☕ 休息',
    modeLabel: '計時模式',
    phase: {
      focusing: '專注中',
      paused: '已暫停',
      breaking: '休息中',
      breakPaused: '休息已暫停',
      focusReady: '專注準備',
      breakReady: '休息準備'
    },
    remaining: '剩餘 {time}',
    unnamedTask: '未命名任務',
    breakHint: '放鬆一下，喝口水吧',
    idleBreakHint: '隨時可以開始休息',
    selectTaskHint: '請在右側選擇一項任務',
    startFocus: '▶ 開始專注',
    startBreak: '▶ 開始休息',
    pause: '⏸ 暫停',
    resumeFocus: '▶ 繼續專注',
    resumeBreak: '▶ 繼續休息',
    resetVoid: '↺ 重置（本輪作廢）',
    reset: '↺ 重置',
    skipBreak: '⏹ 提前結束休息'
  },
  tasks: {
    title: '任務列表',
    totalRounds: '共 🍅 {count} 輪',
    placeholder: '輸入任務名稱，如：閱讀 30 頁',
    inputLabel: '新任務名稱',
    add: '新增',
    stats: '🍅 {count} 輪 · 專注 {duration}',
    deleteLabel: '刪除任務 {name}',
    deleteTitle: '刪除任務',
    emptyTitle: '還沒有任務',
    emptyHint: '在上方輸入一項任務，開始你的第一個番茄鐘 🍅',
    errorEmpty: '任務名稱不能為空',
    errorTooLong: '任務名稱不能超過 {max} 個字元'
  },
  settings: {
    title: '設定',
    close: '關閉設定',
    durationLegend: '計時時長',
    focusMinutes: '專注時長（分鐘）',
    breakMinutes: '休息時長（分鐘）',
    rangeHint: '範圍 {min}~{max} 分鐘',
    soundLegend: '提示音',
    soundToggle: '階段結束時播放提示音',
    soundType: '提示音類型',
    preview: '🔊 試聽',
    volume: '音量',
    notifyLegend: '桌面通知',
    notifyToggle: '開啟桌面通知提醒',
    requestPermission: '申請通知權限',
    sendTest: '傳送測試通知',
    resetDefaults: '恢復預設設定',
    done: '完成',
    permission: {
      granted: '已授權，專注與休息結束時將彈出桌面通知',
      denied: '通知權限已被瀏覽器拒絕，請在瀏覽器網站設定中手動開啟',
      unsupported: '目前瀏覽器不支援桌面通知',
      defaultHint: '尚未授權，開啟後可在分頁背景時收到提醒'
    }
  },
  sounds: {
    beep: '經典蜂鳴',
    chime: '清脆風鈴',
    bell: '悠揚鐘聲',
    digital: '電子音階'
  },
  notify: {
    focusDoneTitle: '專注完成 🎉',
    focusDoneBody: '本輪專注已完成，休息 {minutes} 分鐘吧',
    breakDoneTitle: '休息結束 ☕',
    breakDoneBody: '休息好了嗎？回來開始新一輪專注吧',
    testTitle: '番茄專注計時器',
    testBody: '通知已開啟，專注結束時會在這裡提醒你 🍅'
  },
  time: {
    hm: '{h}小時{m}分鐘',
    h: '{h}小時',
    m: '{m}分鐘',
    s: '{s}秒'
  }
}
