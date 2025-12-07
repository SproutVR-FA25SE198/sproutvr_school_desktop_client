export interface ElectronAPI {
  // Teacher room state stream listeners
  onTeacherUpdate: (callback: (data: any) => void) => () => void;
  onTeacherError: (callback: (error: string) => void) => () => void;
  onTeacherEnd: (callback: () => void) => () => void;

  // VR device stream listeners
  onVRIncoming: (callback: (data: any) => void) => () => void;
  onVRError: (callback: (error: string) => void) => () => void;
  onVREnd: (callback: () => void) => () => void;

  // Send VR data
  sendVRData: (payload: any) => void;

  // Stream control - NEW
  startRoomStream: (vr_learning_session_id: string) => Promise<any>;
  stopRoomStream: () => Promise<any>;

  // Teacher actions (unary calls)
  createRoom: (teacher_id: string, vr_lesson_id: string, class_name: string) => Promise<any>;

  activateRoom: (req: {
    vr_learning_session_id: string;
    vr_lesson_id: string;
    room_duration_in_minutes: any;
    assigned_device_serials: Array<{
      vr_device_serial_number: string;
      student_name: string;
    }>;
  }) => Promise<any>;

  cancelRoom: (vr_learning_session_id: string) => Promise<any>;

  sendNotification: (vr_learning_session_id: string, notification: { text: string; severity: string }) => Promise<any>;

  getRoomState: (vr_learning_session_id: string) => Promise<any>;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

export {};
