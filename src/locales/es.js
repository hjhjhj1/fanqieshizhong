/**
 * Paquete de idioma: Español (es)
 */
export default {
  app: {
    title: 'Temporizador Pomodoro',
    subtitle:
      'Pomodoro multitarea · Estadísticas por tarea · Los datos solo se guardan en este dispositivo',
    settings: '⚙ Ajustes',
    settingsAriaLabel: 'Abrir ajustes',
    language: 'Idioma',
    defaultTitle: 'Temporizador Pomodoro - Pomodoro en línea',
    footerPomodoro:
      'Técnica Pomodoro: concéntrate {focus} minutos y descansa {break} minutos. Cada ronda de enfoque completada añade un tomate 🍅 a la tarea.',
    footerStorage:
      'Todas las tareas y ajustes se guardan localmente en el navegador (localStorage). Sin registro ni conexión: funciona sin internet.',
    noscript:
      'El Temporizador Pomodoro necesita JavaScript. Actívalo en la configuración del navegador y recarga la página.'
  },
  timer: {
    srTitle: 'Temporizador Pomodoro',
    focusTab: '🍅 Enfoque',
    breakTab: '☕ Descanso',
    modeLabel: 'Modo del temporizador',
    phase: {
      focusing: 'Enfocando',
      paused: 'En pausa',
      breaking: 'Descansando',
      breakPaused: 'Descanso en pausa',
      focusReady: 'Listo para enfocar',
      breakReady: 'Listo para descansar'
    },
    remaining: 'Quedan {time}',
    unnamedTask: 'Tarea sin nombre',
    breakHint: 'Relájate y toma un poco de agua',
    idleBreakHint: 'Puedes iniciar un descanso cuando quieras',
    selectTaskHint: 'Selecciona una tarea a la derecha',
    startFocus: '▶ Iniciar enfoque',
    startBreak: '▶ Iniciar descanso',
    pause: '⏸ Pausar',
    resumeFocus: '▶ Continuar enfoque',
    resumeBreak: '▶ Continuar descanso',
    resetVoid: '↺ Reiniciar (ronda anulada)',
    reset: '↺ Reiniciar',
    skipBreak: '⏹ Terminar descanso antes'
  },
  tasks: {
    title: 'Lista de tareas',
    totalRounds: 'Total 🍅 {count} rondas',
    placeholder: 'Escribe una tarea, p. ej.: Leer 30 páginas',
    inputLabel: 'Nombre de la nueva tarea',
    add: 'Añadir',
    stats: '🍅 {count} rondas · Enfoque {duration}',
    deleteLabel: 'Eliminar tarea {name}',
    deleteTitle: 'Eliminar tarea',
    emptyTitle: 'Aún no hay tareas',
    emptyHint: 'Añade una tarea arriba y empieza tu primer Pomodoro 🍅',
    errorEmpty: 'El nombre de la tarea no puede estar vacío',
    errorTooLong: 'El nombre no puede superar los {max} caracteres'
  },
  settings: {
    title: 'Ajustes',
    close: 'Cerrar ajustes',
    durationLegend: 'Duraciones',
    focusMinutes: 'Duración del enfoque (min)',
    breakMinutes: 'Duración del descanso (min)',
    rangeHint: 'Rango {min}–{max} min',
    soundLegend: 'Sonido de aviso',
    soundToggle: 'Reproducir sonido al terminar cada fase',
    soundType: 'Tipo de sonido',
    preview: '🔊 Escuchar',
    volume: 'Volumen',
    notifyLegend: 'Notificaciones de escritorio',
    notifyToggle: 'Activar notificaciones de escritorio',
    requestPermission: 'Solicitar permiso',
    sendTest: 'Enviar notificación de prueba',
    resetDefaults: 'Restaurar valores predeterminados',
    done: 'Listo',
    permission: {
      granted:
        'Concedido: aparecerá una notificación al terminar el enfoque o el descanso',
      denied:
        'El navegador ha bloqueado las notificaciones. Actívalas manualmente en la configuración del sitio',
      unsupported: 'Este navegador no admite notificaciones de escritorio',
      defaultHint:
        'Aún sin permiso: actívalo para recibir avisos con la pestaña en segundo plano'
    }
  },
  sounds: {
    beep: 'Bip clásico',
    chime: 'Campanilla nítida',
    bell: 'Campana serena',
    digital: 'Escala digital'
  },
  notify: {
    focusDoneTitle: 'Enfoque completado 🎉',
    focusDoneBody: 'Ronda de enfoque completada. Descansa {minutes} minutos',
    breakDoneTitle: 'Fin del descanso ☕',
    breakDoneBody: '¿Descansaste? Vuelve para otra ronda de enfoque',
    testTitle: 'Temporizador Pomodoro',
    testBody:
      'Notificaciones activadas: te avisaremos aquí cuando termine el enfoque 🍅'
  },
  time: {
    hm: '{h} h {m} min',
    h: '{h} h',
    m: '{m} min',
    s: '{s} s'
  }
}
