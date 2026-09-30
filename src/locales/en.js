/**
 * Locale: English (en)
 */
export default {
  app: {
    title: 'Pomodoro Focus Timer',
    subtitle:
      'Multi-task Pomodoro · Per-task focus stats · Data stays on this device',
    settings: '⚙ Settings',
    settingsAriaLabel: 'Open settings',
    language: 'Language',
    defaultTitle: 'Pomodoro Focus Timer - Online Pomodoro',
    footerPomodoro:
      'Pomodoro Technique: focus for {focus} minutes, then break for {break} minutes. Each completed focus round adds a tomato 🍅 to the task.',
    footerStorage:
      'All tasks and settings are stored locally in your browser (localStorage). No sign-up, no network required — works offline.',
    noscript:
      'Pomodoro Focus Timer requires JavaScript. Please enable it in your browser settings and refresh the page.'
  },
  timer: {
    srTitle: 'Pomodoro timer',
    focusTab: '🍅 Focus',
    breakTab: '☕ Break',
    modeLabel: 'Timer mode',
    phase: {
      focusing: 'Focusing',
      paused: 'Paused',
      breaking: 'On break',
      breakPaused: 'Break paused',
      focusReady: 'Ready to focus',
      breakReady: 'Ready for a break'
    },
    remaining: '{time} remaining',
    unnamedTask: 'Unnamed task',
    breakHint: 'Relax and grab some water',
    idleBreakHint: 'Start a break anytime',
    selectTaskHint: 'Select a task on the right',
    startFocus: '▶ Start Focus',
    startBreak: '▶ Start Break',
    pause: '⏸ Pause',
    resumeFocus: '▶ Resume Focus',
    resumeBreak: '▶ Resume Break',
    resetVoid: '↺ Reset (round voided)',
    reset: '↺ Reset',
    skipBreak: '⏹ End Break Early',
    stopRinging: 'Stop Ringing'
  },
  tasks: {
    title: 'Tasks',
    totalRounds: 'Total 🍅 {count} rounds',
    placeholder: 'Enter a task, e.g. Read 30 pages',
    inputLabel: 'New task name',
    add: 'Add',
    stats: '🍅 {count} rounds · Focused {duration}',
    deleteLabel: 'Delete task {name}',
    deleteTitle: 'Delete task',
    emptyTitle: 'No tasks yet',
    emptyHint: 'Add a task above to start your first Pomodoro 🍅',
    errorEmpty: 'Task name cannot be empty',
    errorTooLong: 'Task name cannot exceed {max} characters'
  },
  settings: {
    title: 'Settings',
    close: 'Close settings',
    durationLegend: 'Durations',
    focusMinutes: 'Focus duration (min)',
    breakMinutes: 'Break duration (min)',
    rangeHint: 'Range {min}–{max} min',
    soundLegend: 'Alert Sound',
    soundToggle: 'Play a sound when a phase ends',
    soundType: 'Sound type',
    preview: '🔊 Preview',
    volume: 'Volume',
    notifyLegend: 'Desktop Notifications',
    notifyToggle: 'Enable desktop notifications',
    requestPermission: 'Request permission',
    sendTest: 'Send test notification',
    resetDefaults: 'Reset to defaults',
    done: 'Done',
    permission: {
      granted:
        'Granted — a desktop notification will appear when focus or break ends',
      denied:
        'Notifications are blocked. Click the 🔒 icon in the address bar, open "Site settings", set "Notifications" to "Allow", then refresh the page',
      unsupported: 'This browser does not support desktop notifications',
      defaultHint:
        'Not granted yet. Click the button to request; if no prompt appears, click the 🔒 icon in the address bar and allow notifications in "Site settings"'
    }
  },
  sounds: {
    beep: 'Classic Beep',
    chime: 'Clear Chime',
    bell: 'Mellow Bell',
    digital: 'Digital Scale'
  },
  notify: {
    focusDoneTitle: 'Focus Complete 🎉',
    focusDoneBody: 'Focus round complete. Take a {minutes}-minute break',
    breakDoneTitle: 'Break Over ☕',
    breakDoneBody: 'Rested? Come back for another focus round',
    testTitle: 'Pomodoro Focus Timer',
    testBody: "Notifications are on — we'll remind you here when focus ends 🍅"
  },
  time: {
    hm: '{h}h {m}min',
    h: '{h}h',
    m: '{m}min',
    s: '{s}s'
  },
  stats: {
    title: 'Focus Stats',
    totalFocus: '{minutes} min focused',
    rangeLabel: 'Time range',
    last7Days: 'Last 7 days',
    last30Days: 'Last 30 days',
    minutes: 'min',
    empty: 'No focus records yet. Complete a Pomodoro to see your trend here 📊',
    chartAriaLabel: 'Focus duration bar chart'
  }
}
