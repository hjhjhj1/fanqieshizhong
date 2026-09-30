/**
 * Pacote de idioma: Português (pt)
 */
export default {
  app: {
    title: 'Cronômetro Pomodoro',
    subtitle:
      'Pomodoro multitarefa · Estatísticas por tarefa · Dados salvos apenas neste dispositivo',
    settings: '⚙ Configurações',
    settingsAriaLabel: 'Abrir configurações',
    language: 'Idioma',
    defaultTitle: 'Cronômetro Pomodoro - Pomodoro online',
    footerPomodoro:
      'Técnica Pomodoro: foque por {focus} minutos e descanse {break} minutos. Cada rodada de foco concluída adiciona um tomate 🍅 à tarefa.',
    footerStorage:
      'Todas as tarefas e configurações ficam salvas localmente no navegador (localStorage). Sem cadastro, sem internet: funciona offline.',
    noscript:
      'O Cronômetro Pomodoro precisa de JavaScript. Ative-o nas configurações do navegador e recarregue a página.'
  },
  timer: {
    srTitle: 'Cronômetro Pomodoro',
    focusTab: '🍅 Foco',
    breakTab: '☕ Pausa',
    modeLabel: 'Modo do cronômetro',
    phase: {
      focusing: 'Focando',
      paused: 'Pausado',
      breaking: 'Em pausa',
      breakPaused: 'Pausa interrompida',
      focusReady: 'Pronto para focar',
      breakReady: 'Pronto para descansar'
    },
    remaining: 'Restam {time}',
    unnamedTask: 'Tarefa sem nome',
    breakHint: 'Relaxe e beba um pouco de água',
    idleBreakHint: 'Você pode iniciar uma pausa a qualquer momento',
    selectTaskHint: 'Selecione uma tarefa à direita',
    startFocus: '▶ Iniciar foco',
    startBreak: '▶ Iniciar pausa',
    pause: '⏸ Pausar',
    resumeFocus: '▶ Continuar foco',
    resumeBreak: '▶ Continuar pausa',
    resetVoid: '↺ Reiniciar (rodada anulada)',
    resetVoidHint: 'Rodada anulada',
    reset: '↺ Reiniciar',
    complete: 'Concluir e Salvar',
    skipBreak: '⏹ Encerrar pausa mais cedo',
    stopRinging: '⏹ Parar som'
  },
  tasks: {
    title: 'Lista de tarefas',
    totalRounds: 'Total 🍅 {count} rodadas',
    placeholder: 'Digite uma tarefa, ex.: Ler 30 páginas',
    inputLabel: 'Nome da nova tarefa',
    add: 'Adicionar',
    stats: '🍅 {count} rodadas · Foco {duration}',
    deleteLabel: 'Excluir tarefa {name}',
    deleteTitle: 'Excluir tarefa',
    emptyTitle: 'Ainda não há tarefas',
    emptyHint: 'Adicione uma tarefa acima e comece seu primeiro Pomodoro 🍅',
    errorEmpty: 'O nome da tarefa não pode estar vazio',
    errorTooLong: 'O nome não pode ter mais de {max} caracteres'
  },
  settings: {
    title: 'Configurações',
    close: 'Fechar configurações',
    durationLegend: 'Durações',
    focusMinutes: 'Duração do foco (min)',
    breakMinutes: 'Duração da pausa (min)',
    rangeHint: 'Intervalo {min}–{max} min',
    soundLegend: 'Som de alerta',
    soundToggle: 'Tocar som ao fim de cada fase',
    soundType: 'Tipo de som',
    preview: '🔊 Ouvir',
    volume: 'Volume',
    notifyLegend: 'Notificações de desktop',
    notifyToggle: 'Ativar notificações de desktop',
    requestPermission: 'Solicitar permissão',
    sendTest: 'Enviar notificação de teste',
    resetDefaults: 'Restaurar padrões',
    done: 'Concluir',
    permission: {
      granted: 'Permitido: uma notificação aparecerá ao fim do foco ou da pausa',
      denied:
        'O navegador bloqueou as notificações. Ative-as manualmente nas configurações do site',
      unsupported: 'Este navegador não suporta notificações de desktop',
      defaultHint:
        'Ainda não permitido: ative para ser lembrado com a aba em segundo plano'
    }
  },
  sounds: {
    beep: 'Bipe clássico',
    chime: 'Sino cristalino',
    bell: 'Sino suave',
    digital: 'Escala digital'
  },
  notify: {
    focusDoneTitle: 'Foco concluído 🎉',
    focusDoneBody: 'Rodada de foco concluída. Descanse {minutes} minutos',
    breakDoneTitle: 'Fim da pausa ☕',
    breakDoneBody: 'Descansou? Volte para mais uma rodada de foco',
    testTitle: 'Cronômetro Pomodoro',
    testBody:
      'Notificações ativadas: avisaremos aqui quando o foco terminar 🍅'
  },
  time: {
    hm: '{h} h {m} min',
    h: '{h} h',
    m: '{m} min',
    s: '{s} s'
  },
  stats: {
    title: 'Estatísticas de foco',
    totalFocus: '{minutes} min de foco',
    rangeLabel: 'Período',
    last7Days: 'Últimos 7 dias',
    last30Days: 'Últimos 30 dias',
    minutes: 'min',
    empty: 'Sem registros ainda. Complete um pomodoro para ver sua tendência 📊',
    chartAriaLabel: 'Gráfico de barras de duração do foco'
  }
}
