/**
 * Sprachpaket: Deutsch (de)
 */
export default {
  app: {
    title: 'Pomodoro-Fokus-Timer',
    subtitle:
      'Multi-Task-Pomodoro · Fokusstatistik pro Aufgabe · Daten bleiben auf diesem Gerät',
    settings: '⚙ Einstellungen',
    settingsAriaLabel: 'Einstellungen öffnen',
    language: 'Sprache',
    defaultTitle: 'Pomodoro-Fokus-Timer - Online-Pomodoro',
    footerPomodoro:
      'Pomodoro-Technik: {focus} Minuten fokussieren, dann {break} Minuten pausieren. Jede abgeschlossene Fokusrunde zählt eine Tomate 🍅 zur Aufgabe.',
    footerStorage:
      'Alle Aufgaben und Einstellungen werden lokal im Browser gespeichert (localStorage). Keine Registrierung, kein Netzwerk – offline nutzbar.',
    noscript:
      'Der Pomodoro-Fokus-Timer benötigt JavaScript. Bitte in den Browsereinstellungen aktivieren und die Seite neu laden.'
  },
  timer: {
    srTitle: 'Pomodoro-Timer',
    focusTab: '🍅 Fokus',
    breakTab: '☕ Pause',
    modeLabel: 'Timer-Modus',
    phase: {
      focusing: 'Fokus läuft',
      paused: 'Pausiert',
      breaking: 'Pause läuft',
      breakPaused: 'Pause unterbrochen',
      focusReady: 'Bereit zum Fokussieren',
      breakReady: 'Bereit für eine Pause'
    },
    remaining: 'Noch {time}',
    unnamedTask: 'Unbenannte Aufgabe',
    breakHint: 'Entspann dich und trink ein Glas Wasser',
    idleBreakHint: 'Du kannst jederzeit eine Pause starten',
    selectTaskHint: 'Wähle rechts eine Aufgabe aus',
    startFocus: '▶ Fokus starten',
    startBreak: '▶ Pause starten',
    pause: '⏸ Pausieren',
    resumeFocus: '▶ Fokus fortsetzen',
    resumeBreak: '▶ Pause fortsetzen',
    resetVoid: '↺ Zurücksetzen (Runde verworfen)',
    reset: '↺ Zurücksetzen',
    skipBreak: '⏹ Pause vorzeitig beenden'
  },
  tasks: {
    title: 'Aufgabenliste',
    totalRounds: 'Gesamt 🍅 {count} Runden',
    placeholder: 'Aufgabe eingeben, z. B. 30 Seiten lesen',
    inputLabel: 'Name der neuen Aufgabe',
    add: 'Hinzufügen',
    stats: '🍅 {count} Runden · Fokus {duration}',
    deleteLabel: 'Aufgabe {name} löschen',
    deleteTitle: 'Aufgabe löschen',
    emptyTitle: 'Noch keine Aufgaben',
    emptyHint:
      'Füge oben eine Aufgabe hinzu und starte deinen ersten Pomodoro 🍅',
    errorEmpty: 'Aufgabenname darf nicht leer sein',
    errorTooLong: 'Aufgabenname darf höchstens {max} Zeichen lang sein'
  },
  settings: {
    title: 'Einstellungen',
    close: 'Einstellungen schließen',
    durationLegend: 'Dauer',
    focusMinutes: 'Fokusdauer (Min.)',
    breakMinutes: 'Pausendauer (Min.)',
    rangeHint: 'Bereich {min}–{max} Min.',
    soundLegend: 'Hinweiston',
    soundToggle: 'Ton am Ende jeder Phase abspielen',
    soundType: 'Tontyp',
    preview: '🔊 Anhören',
    volume: 'Lautstärke',
    notifyLegend: 'Desktop-Benachrichtigungen',
    notifyToggle: 'Desktop-Benachrichtigungen aktivieren',
    requestPermission: 'Berechtigung anfordern',
    sendTest: 'Testbenachrichtigung senden',
    resetDefaults: 'Auf Standard zurücksetzen',
    done: 'Fertig',
    permission: {
      granted:
        'Erlaubt: Bei Fokus- oder Pausenende erscheint eine Desktop-Benachrichtigung',
      denied:
        'Benachrichtigungen wurden vom Browser blockiert. Bitte in den Website-Einstellungen manuell aktivieren',
      unsupported:
        'Dieser Browser unterstützt keine Desktop-Benachrichtigungen',
      defaultHint:
        'Noch nicht erlaubt: Aktivieren, um im Hintergrund-Tab erinnert zu werden'
    }
  },
  sounds: {
    beep: 'Klassischer Piepton',
    chime: 'Klarer Glockenton',
    bell: 'Sanfte Glocke',
    digital: 'Digitale Tonleiter'
  },
  notify: {
    focusDoneTitle: 'Fokus abgeschlossen 🎉',
    focusDoneBody:
      'Fokusrunde abgeschlossen. Gönn dir {minutes} Minuten Pause',
    breakDoneTitle: 'Pause vorbei ☕',
    breakDoneBody: 'Ausgeruht? Zurück zur nächsten Fokusrunde',
    testTitle: 'Pomodoro-Fokus-Timer',
    testBody:
      'Benachrichtigungen aktiviert – wir erinnern dich hier, wenn der Fokus endet 🍅'
  },
  time: {
    hm: '{h} Std. {m} Min.',
    h: '{h} Std.',
    m: '{m} Min.',
    s: '{s} Sek.'
  }
}
