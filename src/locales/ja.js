/**
 * 言語パック：日本語（ja）
 */
export default {
  app: {
    title: 'ポモドーロ集中タイマー',
    subtitle:
      'マルチタスクポモドーロ · タスク別集中時間集計 · データは端末にのみ保存',
    settings: '⚙ 設定',
    settingsAriaLabel: '設定を開く',
    language: '言語',
    defaultTitle: 'ポモドーロ集中タイマー - オンラインポモドーロ',
    footerPomodoro:
      'ポモドーロテクニック：{focus} 分集中したら {break} 分休憩。集中ラウンド完了ごとにタスクへトマト 🍅 を 1 つ自動加算',
    footerStorage:
      'すべてのタスクと設定はブラウザのローカル（localStorage）に保存されます。登録不要・オフラインで利用可能。',
    noscript:
      'ポモドーロ集中タイマーの実行には JavaScript が必要です。ブラウザ設定で有効にしてから再読み込みしてください。'
  },
  timer: {
    srTitle: 'ポモドーロタイマー',
    focusTab: '🍅 集中',
    breakTab: '☕ 休憩',
    modeLabel: 'タイマーモード',
    phase: {
      focusing: '集中中',
      paused: '一時停止中',
      breaking: '休憩中',
      breakPaused: '休憩一時停止中',
      focusReady: '集中準備',
      breakReady: '休憩準備'
    },
    remaining: '残り {time}',
    unnamedTask: '無名タスク',
    breakHint: 'リラックスして、お水をどうぞ',
    idleBreakHint: 'いつでも休憩を開始できます',
    selectTaskHint: '右側からタスクを選択してください',
    startFocus: '▶ 集中開始',
    startBreak: '▶ 休憩開始',
    pause: '⏸ 一時停止',
    resumeFocus: '▶ 集中を再開',
    resumeBreak: '▶ 休憩を再開',
    resetVoid: '↺ リセット（このラウンドは無効）',
    reset: '↺ リセット',
    skipBreak: '⏹ 休憩を早めに終了'
  },
  tasks: {
    title: 'タスクリスト',
    totalRounds: '合計 🍅 {count} ラウンド',
    placeholder: 'タスク名を入力（例：30ページ読む）',
    inputLabel: '新しいタスク名',
    add: '追加',
    stats: '🍅 {count} ラウンド · 集中 {duration}',
    deleteLabel: 'タスク {name} を削除',
    deleteTitle: 'タスクを削除',
    emptyTitle: 'タスクはまだありません',
    emptyHint: '上にタスクを入力して、最初のポモドーロを始めましょう 🍅',
    errorEmpty: 'タスク名を入力してください',
    errorTooLong: 'タスク名は {max} 文字以内にしてください'
  },
  settings: {
    title: '設定',
    close: '設定を閉じる',
    durationLegend: 'タイマー時間',
    focusMinutes: '集中時間（分）',
    breakMinutes: '休憩時間（分）',
    rangeHint: '範囲 {min}〜{max} 分',
    soundLegend: '通知音',
    soundToggle: 'フェーズ終了時に通知音を再生',
    soundType: '通知音の種類',
    preview: '🔊 試聴',
    volume: '音量',
    notifyLegend: 'デスクトップ通知',
    notifyToggle: 'デスクトップ通知を有効化',
    requestPermission: '通知権限をリクエスト',
    sendTest: 'テスト通知を送信',
    resetDefaults: 'デフォルトに戻す',
    done: '完了',
    permission: {
      granted: '許可済み：集中・休憩の終了時にデスクトップ通知が表示されます',
      denied:
        '通知権限がブラウザに拒否されました。サイト設定から手動で有効にしてください',
      unsupported: 'このブラウザはデスクトップ通知に対応していません',
      defaultHint: '未許可：有効にするとバックグラウンドでも通知を受け取れます'
    }
  },
  sounds: {
    beep: 'クラシックビープ',
    chime: 'クリアチャイム',
    bell: '悠々ベル',
    digital: 'デジタル音階'
  },
  notify: {
    focusDoneTitle: '集中完了 🎉',
    focusDoneBody: '集中ラウンドが完了しました。{minutes} 分休憩しましょう',
    breakDoneTitle: '休憩終了 ☕',
    breakDoneBody: '休憩は終わりましたか？次の集中を始めましょう',
    testTitle: 'ポモドーロ集中タイマー',
    testBody: '通知が有効になりました。集中終了時にここでお知らせします 🍅'
  },
  time: {
    hm: '{h}時間{m}分',
    h: '{h}時間',
    m: '{m}分',
    s: '{s}秒'
  }
}
