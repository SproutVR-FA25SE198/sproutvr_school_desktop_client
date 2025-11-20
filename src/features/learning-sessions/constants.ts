/**
 * Learning Sessions Feature Constants
 */

/**
 * Maximum number of VR devices allowed in a single learning session
 */
export const MAX_DEVICES = 5;

/**
 * Teacher instructions for creating and hosting a VR learning session
 */
export const TEACHER_INSTRUCTIONS = [
  {
    step: 1,
    title: 'Chuẩn bị thiết bị VR',
    content:
      'Đảm bảo tất cả thiết bị VR đã được sạc đầy và kết nối internet ổn định. Kiểm tra trạng thái thiết bị trên hệ thống.',
  },
  {
    step: 2,
    title: 'Chọn bài học và lớp',
    content: 'Chọn bài học VR phù hợp với nội dung giảng dạy và điền thông tin lớp học một cách chính xác.',
  },
  {
    step: 3,
    title: 'Phân công thiết bị cho học sinh',
    content:
      'Gán từng thiết bị VR cho học sinh cụ thể. Tối đa 5 thiết bị trong một phiên học. Đảm bảo nhập đúng tên học sinh.',
  },
  {
    step: 4,
    title: 'Kích hoạt phiên học',
    content:
      'Sau khi hoàn tất cấu hình, nhấn "Kích hoạt phiên học VR". Hệ thống sẽ tạo mã phòng và chuyển sang màn hình giám sát.',
  },
  {
    step: 5,
    title: 'Giám sát và hỗ trợ',
    content:
      'Theo dõi tiến độ học sinh qua màn hình giám sát. Bạn có thể gửi thông báo và can thiệp khi cần thiết trong suốt phiên học.',
  },
];

/**
 * Confirmation message for creating VR session
 */
export const CREATE_SESSION_CONFIRMATION = {
  title: 'Bạn đang tạo một phiên học VR',
  message:
    'Bạn đang tiến hành tạo một phiên học VR. Vui lòng đảm bảo rằng bạn đã chuẩn bị đầy đủ thiết bị và thông tin cần thiết trước khi tiếp tục.',
  question: 'Bạn có chắc chắn muốn tạo phiên học VR?',
};

export const CANCEL_SESSION_CONFIRMATION = {
  title: 'Bạn đang kết thúc một phiên học VR',
  question: 'Bạn có chắc chắn muốn kết thúc phiên học VR?',
};
