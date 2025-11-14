export interface VRLearningSession {
  vr_learning_session_id: string;
  class_name: string;
  room_code: string;
  duration_in_seconds: number;
  status: string;
  teacher: TeacherInfo;
  vrlesson: VRLessonInfo;
  devices: VRDevice[];
}

export interface TeacherInfo {
  teacher_id: string;
  teacher_name: string;
}

export interface VRLessonInfo {
  vr_lesson_id: string;
  name: string;
  description: string;
  preset_json_relative_file_path: string;
}

export interface VRDevice {
  vr_device_serial_number: string;
  student_name: string;
  status: 'Connected' | 'Disconnected' | string;
  tasks: VRTask[];
}

export interface VRTask {
  vr_task_id: string;
  question_name?: string; // optional, only for quiz-type tasks
  is_completed: boolean;
  is_correct: boolean;
  completion_time_at_vietnam: string;
  status: 'Uncompleted' | 'Completed' | string;
}
