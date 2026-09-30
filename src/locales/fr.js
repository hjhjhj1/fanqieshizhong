/**
 * Pack de langue : Français (fr)
 */
export default {
  app: {
    title: 'Minuteur Pomodoro',
    subtitle:
      'Pomodoro multitâche · Statistiques par tâche · Données conservées sur cet appareil',
    settings: '⚙ Réglages',
    settingsAriaLabel: 'Ouvrir les réglages',
    language: 'Langue',
    defaultTitle: 'Minuteur Pomodoro - Pomodoro en ligne',
    footerPomodoro:
      'Technique Pomodoro : {focus} minutes de concentration puis {break} minutes de pause. Chaque round de concentration terminé ajoute une tomate 🍅 à la tâche.',
    footerStorage:
      'Toutes les tâches et préférences sont enregistrées localement dans le navigateur (localStorage). Sans inscription ni connexion : fonctionne hors ligne.',
    noscript:
      'Le Minuteur Pomodoro nécessite JavaScript. Activez-le dans les réglages du navigateur puis rechargez la page.'
  },
  timer: {
    srTitle: 'Minuteur Pomodoro',
    focusTab: '🍅 Focus',
    breakTab: '☕ Pause',
    modeLabel: 'Mode du minuteur',
    phase: {
      focusing: 'Concentration',
      paused: 'En pause',
      breaking: 'Pause en cours',
      breakPaused: 'Pause interrompue',
      focusReady: 'Prêt à se concentrer',
      breakReady: 'Prêt pour une pause'
    },
    remaining: 'Il reste {time}',
    unnamedTask: 'Tâche sans nom',
    breakHint: "Détendez-vous, buvez un verre d'eau",
    idleBreakHint: 'Vous pouvez démarrer une pause à tout moment',
    selectTaskHint: 'Sélectionnez une tâche à droite',
    startFocus: '▶ Démarrer le focus',
    startBreak: '▶ Démarrer la pause',
    pause: '⏸ Pause',
    resumeFocus: '▶ Reprendre le focus',
    resumeBreak: '▶ Reprendre la pause',
    resetVoid: '↺ Réinitialiser (round annulé)',
    reset: '↺ Réinitialiser',
    skipBreak: '⏹ Terminer la pause plus tôt',
    stopRinging: '⏹ Arrêter la sonnerie'
  },
  tasks: {
    title: 'Liste des tâches',
    totalRounds: 'Total 🍅 {count} rounds',
    placeholder: 'Saisissez une tâche, ex. : Lire 30 pages',
    inputLabel: 'Nom de la nouvelle tâche',
    add: 'Ajouter',
    stats: '🍅 {count} rounds · Focus {duration}',
    deleteLabel: 'Supprimer la tâche {name}',
    deleteTitle: 'Supprimer la tâche',
    emptyTitle: 'Aucune tâche pour le moment',
    emptyHint: 'Ajoutez une tâche ci-dessus pour lancer votre premier Pomodoro 🍅',
    errorEmpty: 'Le nom de la tâche ne peut pas être vide',
    errorTooLong: 'Le nom ne peut pas dépasser {max} caractères'
  },
  settings: {
    title: 'Réglages',
    close: 'Fermer les réglages',
    durationLegend: 'Durées',
    focusMinutes: 'Durée du focus (min)',
    breakMinutes: 'Durée de la pause (min)',
    rangeHint: 'Plage {min}–{max} min',
    soundLegend: "Son d'alerte",
    soundToggle: 'Jouer un son à la fin de chaque phase',
    soundType: 'Type de son',
    preview: '🔊 Écouter',
    volume: 'Volume',
    notifyLegend: 'Notifications de bureau',
    notifyToggle: 'Activer les notifications de bureau',
    requestPermission: "Demander l'autorisation",
    sendTest: 'Envoyer une notification test',
    resetDefaults: 'Restaurer les valeurs par défaut',
    done: 'Terminé',
    permission: {
      granted:
        "Autorisé : une notification s'affichera à la fin du focus ou de la pause",
      denied:
        'Le navigateur a bloqué les notifications. Activez-les manuellement dans les réglages du site',
      unsupported:
        'Ce navigateur ne prend pas en charge les notifications de bureau',
      defaultHint:
        'Pas encore autorisé : activez pour être rappelé même en arrière-plan'
    }
  },
  sounds: {
    beep: 'Bip classique',
    chime: 'Carillon cristallin',
    bell: 'Cloche paisible',
    digital: 'Gamme numérique'
  },
  notify: {
    focusDoneTitle: 'Focus terminé 🎉',
    focusDoneBody:
      'Round de focus terminé. Faites une pause de {minutes} minutes',
    breakDoneTitle: 'Fin de la pause ☕',
    breakDoneBody: 'Bien reposé ? Revenez pour un nouveau round de focus',
    testTitle: 'Minuteur Pomodoro',
    testBody:
      'Notifications activées : nous vous rappellerons ici à la fin du focus 🍅'
  },
  time: {
    hm: '{h} h {m} min',
    h: '{h} h',
    m: '{m} min',
    s: '{s} s'
  },
  stats: {
    title: 'Statistiques de concentration',
    totalFocus: '{minutes} min de concentration',
    rangeLabel: 'Période',
    last7Days: '7 derniers jours',
    last30Days: '30 derniers jours',
    minutes: 'min',
    empty: 'Aucun enregistrement. Complétez un pomodoro pour voir votre tendance 📊',
    chartAriaLabel: 'Graphique en barres de la durée de concentration'
  }
}
