import { store } from '@/common/store';
import {
  teacherRoomUpdated,
  vrStreamUpdated,
  grpcError,
  grpcDisconnected,
} from '@/features/learning-sessions/store/monitoringSlice';

export function initGrpcListeners() {
  console.log('🔧 Initializing gRPC listeners...');

  // Teacher room state updates
  window.electron.onTeacherUpdate((data) => {
    console.log('📥 Teacher room update received:', data);
    store.dispatch(teacherRoomUpdated(data));
  });

  window.electron.onTeacherError((error) => {
    console.error('❌ Teacher room error:', error);
    store.dispatch(grpcError(error));
  });

  window.electron.onTeacherEnd(() => {
    console.log('🔌 Teacher room stream ended');
    store.dispatch(grpcDisconnected());
  });

  // VR device streams
  window.electron.onVRIncoming((data) => {
    console.log('📥 VR data received:', data);
    store.dispatch(vrStreamUpdated(data));
  });

  window.electron.onVRError((error) => {
    console.error('❌ VR stream error:', error);
    store.dispatch(grpcError(error));
  });

  window.electron.onVREnd(() => {
    console.log('🔌 VR stream ended');
  });
}

// Helper functions for teacher actions
export async function createRoom(teacher_id: string, vr_lesson_id: string, class_name: string) {
  return window.electron.createRoom(teacher_id, vr_lesson_id, class_name);
}

export async function activateRoom(
  vr_learning_session_id: string,
  vr_lesson_id: string,
  start_time_at_utc: any,
  assigned_device_serials: Array<{ vr_device_serial_number: string; student_name: string }>,
) {
  return window.electron.activateRoom({
    vr_learning_session_id,
    vr_lesson_id,
    start_time_at_utc,
    assigned_device_serials,
  });
}

export async function cancelRoom(vr_learning_session_id: string) {
  return window.electron.cancelRoom(vr_learning_session_id);
}

export async function sendNotification(
  vr_learning_session_id: string,
  notification: { text: string; severity: number },
) {
  return window.electron.sendNotification(vr_learning_session_id, notification);
}

export function sendVRData(payload: any) {
  window.electron.sendVRData(payload);
}
