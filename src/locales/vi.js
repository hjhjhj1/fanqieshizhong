/**
 * Gói ngôn ngữ: Tiếng Việt (vi)
 */
export default {
  app: {
    title: 'Đồng hồ Pomodoro tập trung',
    subtitle:
      'Pomodoro đa nhiệm · Thống kê theo tác vụ · Dữ liệu chỉ lưu trên máy này',
    settings: '⚙ Cài đặt',
    settingsAriaLabel: 'Mở cài đặt',
    language: 'Ngôn ngữ',
    defaultTitle: 'Đồng hồ Pomodoro tập trung - Pomodoro trực tuyến',
    footerPomodoro:
      'Phương pháp Pomodoro: tập trung {focus} phút rồi nghỉ {break} phút. Mỗi vòng tập trung hoàn thành sẽ cộng một cà chua 🍅 cho tác vụ.',
    footerStorage:
      'Mọi tác vụ và cài đặt đều được lưu cục bộ trong trình duyệt (localStorage). Không cần đăng ký, không cần mạng — dùng offline được.',
    noscript:
      'Đồng hồ Pomodoro tập trung cần bật JavaScript. Hãy bật trong cài đặt trình duyệt rồi tải lại trang.'
  },
  timer: {
    srTitle: 'Đồng hồ Pomodoro',
    focusTab: '🍅 Tập trung',
    breakTab: '☕ Nghỉ',
    modeLabel: 'Chế độ đếm giờ',
    phase: {
      focusing: 'Đang tập trung',
      paused: 'Đã tạm dừng',
      breaking: 'Đang nghỉ',
      breakPaused: 'Nghỉ đã tạm dừng',
      focusReady: 'Sẵn sàng tập trung',
      breakReady: 'Sẵn sàng nghỉ'
    },
    remaining: 'Còn lại {time}',
    unnamedTask: 'Tác vụ chưa đặt tên',
    breakHint: 'Thư giãn, uống chút nước nhé',
    idleBreakHint: 'Có thể bắt đầu nghỉ bất cứ lúc nào',
    selectTaskHint: 'Hãy chọn một tác vụ ở bên phải',
    startFocus: '▶ Bắt đầu tập trung',
    startBreak: '▶ Bắt đầu nghỉ',
    pause: '⏸ Tạm dừng',
    resumeFocus: '▶ Tiếp tục tập trung',
    resumeBreak: '▶ Tiếp tục nghỉ',
    resetVoid: '↺ Đặt lại (vòng này hủy)',
    reset: '↺ Đặt lại',
    complete: 'Hoàn thành và Lưu',
    skipBreak: '⏹ Kết thúc nghỉ sớm',
    stopRinging: '⏹ Dừng chuông'
  },
  tasks: {
    title: 'Danh sách tác vụ',
    totalRounds: 'Tổng 🍅 {count} vòng',
    placeholder: 'Nhập tên tác vụ, ví dụ: Đọc 30 trang',
    inputLabel: 'Tên tác vụ mới',
    add: 'Thêm',
    stats: '🍅 {count} vòng · Tập trung {duration}',
    deleteLabel: 'Xóa tác vụ {name}',
    deleteTitle: 'Xóa tác vụ',
    emptyTitle: 'Chưa có tác vụ nào',
    emptyHint: 'Nhập một tác vụ ở trên để bắt đầu Pomodoro đầu tiên 🍅',
    errorEmpty: 'Tên tác vụ không được để trống',
    errorTooLong: 'Tên tác vụ không được vượt quá {max} ký tự'
  },
  settings: {
    title: 'Cài đặt',
    close: 'Đóng cài đặt',
    durationLegend: 'Thời lượng',
    focusMinutes: 'Thời lượng tập trung (phút)',
    breakMinutes: 'Thời lượng nghỉ (phút)',
    rangeHint: 'Khoảng {min}–{max} phút',
    soundLegend: 'Âm báo',
    soundToggle: 'Phát âm báo khi kết thúc mỗi giai đoạn',
    soundType: 'Loại âm báo',
    preview: '🔊 Nghe thử',
    volume: 'Âm lượng',
    notifyLegend: 'Thông báo màn hình',
    notifyToggle: 'Bật thông báo màn hình',
    requestPermission: 'Xin quyền thông báo',
    sendTest: 'Gửi thông báo thử',
    resetDefaults: 'Khôi phục mặc định',
    done: 'Xong',
    permission: {
      granted: 'Đã cấp quyền: sẽ hiện thông báo khi kết thúc tập trung hoặc nghỉ',
      denied:
        'Trình duyệt đã chặn thông báo. Hãy bật thủ công trong cài đặt trang web',
      unsupported: 'Trình duyệt này không hỗ trợ thông báo màn hình',
      defaultHint: 'Chưa cấp quyền: bật để nhận nhắc nhở khi tab ở nền'
    }
  },
  sounds: {
    beep: 'Tiếng bíp kinh điển',
    chime: 'Chuông gió trong',
    bell: 'Chuông trầm',
    digital: 'Âm giai điện tử'
  },
  notify: {
    focusDoneTitle: 'Hoàn thành tập trung 🎉',
    focusDoneBody: 'Vòng tập trung đã xong. Nghỉ {minutes} phút nhé',
    breakDoneTitle: 'Hết giờ nghỉ ☕',
    breakDoneBody: 'Nghỉ ngơi đủ chưa? Quay lại vòng tập trung mới thôi',
    testTitle: 'Đồng hồ Pomodoro tập trung',
    testBody:
      'Đã bật thông báo — chúng tôi sẽ nhắc bạn tại đây khi hết giờ tập trung 🍅'
  },
  time: {
    hm: '{h} giờ {m} phút',
    h: '{h} giờ',
    m: '{m} phút',
    s: '{s} giây'
  },
  stats: {
    title: 'Thống kê tập trung',
    totalFocus: '{minutes} phút tập trung',
    rangeLabel: 'Kỳ hạn',
    last7Days: '7 ngày gần đây',
    last30Days: '30 ngày gần đây',
    minutes: 'phút',
    empty: 'Chưa có ghi chú. Hoàn thành một pomodoro để xem xu hướng 📊',
    chartAriaLabel: 'Biểu đồ cột thời gian tập trung'
  }
}
