/**
 * 언어 팩: 한국어(ko)
 */
export default {
  app: {
    title: '뽀모도로 집중 타이머',
    subtitle:
      '멀티태스크 뽀모도로 · 작업별 집중 시간 통계 · 데이터는 이 기기에만 저장',
    settings: '⚙ 설정',
    settingsAriaLabel: '설정 열기',
    language: '언어',
    defaultTitle: '뽀모도로 집중 타이머 - 온라인 뽀모도로',
    footerPomodoro:
      '뽀모도로 기법: {focus}분 집중 후 {break}분 휴식. 집중 한 라운드를 완료할 때마다 작업에 토마토 🍅 1개가 자동 누적됩니다',
    footerStorage:
      '모든 작업과 설정은 브라우저 로컬(localStorage)에 저장되며, 회원가입 없이 오프라인으로 사용할 수 있습니다.',
    noscript:
      '뽀모도로 집중 타이머를 실행하려면 JavaScript가 필요합니다. 브라우저 설정에서 활성화한 후 새로고침하세요.'
  },
  timer: {
    srTitle: '뽀모도로 타이머',
    focusTab: '🍅 집중',
    breakTab: '☕ 휴식',
    modeLabel: '타이머 모드',
    phase: {
      focusing: '집중 중',
      paused: '일시정지됨',
      breaking: '휴식 중',
      breakPaused: '휴식 일시정지됨',
      focusReady: '집중 준비',
      breakReady: '휴식 준비'
    },
    remaining: '남은 시간 {time}',
    unnamedTask: '이름 없는 작업',
    breakHint: '잠시 쉬며 물 한 잔 하세요',
    idleBreakHint: '언제든 휴식을 시작할 수 있습니다',
    selectTaskHint: '오른쪽에서 작업을 선택하세요',
    startFocus: '▶ 집중 시작',
    startBreak: '▶ 휴식 시작',
    pause: '⏸ 일시정지',
    resumeFocus: '▶ 집중 계속',
    resumeBreak: '▶ 휴식 계속',
    resetVoid: '↺ 초기화(이번 라운드 무효)',
    reset: '↺ 초기화',
    skipBreak: '⏹ 휴식 조기 종료'
  },
  tasks: {
    title: '작업 목록',
    totalRounds: '총 🍅 {count} 라운드',
    placeholder: '작업 이름 입력, 예: 30페이지 읽기',
    inputLabel: '새 작업 이름',
    add: '추가',
    stats: '🍅 {count} 라운드 · 집중 {duration}',
    deleteLabel: '작업 {name} 삭제',
    deleteTitle: '작업 삭제',
    emptyTitle: '아직 작업이 없습니다',
    emptyHint: '위에 작업을 입력하고 첫 뽀모도로를 시작하세요 🍅',
    errorEmpty: '작업 이름을 입력하세요',
    errorTooLong: '작업 이름은 {max}자를 초과할 수 없습니다'
  },
  settings: {
    title: '설정',
    close: '설정 닫기',
    durationLegend: '타이머 시간',
    focusMinutes: '집중 시간(분)',
    breakMinutes: '휴식 시간(분)',
    rangeHint: '범위 {min}~{max}분',
    soundLegend: '알림음',
    soundToggle: '단계 종료 시 알림음 재생',
    soundType: '알림음 종류',
    preview: '🔊 미리 듣기',
    volume: '음량',
    notifyLegend: '데스크톱 알림',
    notifyToggle: '데스크톱 알림 켜기',
    requestPermission: '알림 권한 요청',
    sendTest: '테스트 알림 보내기',
    resetDefaults: '기본값으로 복원',
    done: '완료',
    permission: {
      granted: '허용됨: 집중·휴식 종료 시 데스크톱 알림이 표시됩니다',
      denied:
        '브라우저에서 알림 권한이 거부되었습니다. 사이트 설정에서 수동으로 켜주세요',
      unsupported: '이 브라우저는 데스크톱 알림을 지원하지 않습니다',
      defaultHint:
        '아직 허용되지 않음: 켜면 백그라운드 탭에서도 알림을 받을 수 있습니다'
    }
  },
  sounds: {
    beep: '클래식 비프',
    chime: '맑은 차임',
    bell: '은은한 종소리',
    digital: '전자 음계'
  },
  notify: {
    focusDoneTitle: '집중 완료 🎉',
    focusDoneBody: '이번 집중 라운드가 완료되었습니다. {minutes}분 쉬어가세요',
    breakDoneTitle: '휴식 종료 ☕',
    breakDoneBody: '잘 쉬셨나요? 새로운 집중 라운드를 시작하세요',
    testTitle: '뽀모도로 집중 타이머',
    testBody: '알림이 켜졌습니다. 집중이 끝나면 여기서 알려드립니다 🍅'
  },
  time: {
    hm: '{h}시간 {m}분',
    h: '{h}시간',
    m: '{m}분',
    s: '{s}초'
  }
}
