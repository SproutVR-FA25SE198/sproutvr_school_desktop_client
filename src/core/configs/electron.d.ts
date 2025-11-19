export { };

declare global {
  interface Window {
    electron: {
      showNotification: any;
      // Streams
      onTeacherUpdate: (cb: (data: any) => void) => () => void;
      onTeacherError: (cb: (error: string) => void) => () => void;
      onTeacherEnd: (cb: () => void) => () => void;

      onVRIncoming: (cb: (data: any) => void) => () => void;
      onVRError: (cb: (error: string) => void) => () => void;
      onVREnd: (cb: () => void) => () => void;

      // Sending VR messages
      sendVRData: (payload: any) => void;

      // Unary teacher actions
      createRoom: (teacher_id: string, vr_lesson_id: string, class_name: string) => Promise<any>;
      activateRoom: (req: any) => Promise<any>;
      cancelRoom: (vr_learning_session_id: string) => Promise<any>;
      sendNotification: (vr_learning_session_id: string, notification: any) => Promise<any>;
      getRoomState: (vr_learning_session_id: string) => Promise<any>;
    };
  }
}
