import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  // Teacher room state stream
  onTeacherUpdate: (cb: (data: any) => void) => {
    const handler = (_: IpcRendererEvent, data: any) => cb(data);
    ipcRenderer.on('grpc:teacher_room_update', handler);
    return () => ipcRenderer.removeListener('grpc:teacher_room_update', handler);
  },

  onTeacherError: (cb: (error: string) => void) => {
    const handler = (_: IpcRendererEvent, error: string) => cb(error);
    ipcRenderer.on('grpc:teacher_room_error', handler);
    return () => ipcRenderer.removeListener('grpc:teacher_room_error', handler);
  },

  onTeacherEnd: (cb: () => void) => {
    const handler = () => cb();
    ipcRenderer.on('grpc:teacher_room_end', handler);
    return () => ipcRenderer.removeListener('grpc:teacher_room_end', handler);
  },

  // VR device stream
  onVRIncoming: (cb: (data: any) => void) => {
    const handler = (_: IpcRendererEvent, data: any) => cb(data);
    ipcRenderer.on('grpc:vr_incoming', handler);
    return () => ipcRenderer.removeListener('grpc:vr_incoming', handler);
  },

  onVRError: (cb: (error: string) => void) => {
    const handler = (_: IpcRendererEvent, error: string) => cb(error);
    ipcRenderer.on('grpc:vr_error', handler);
    return () => ipcRenderer.removeListener('grpc:vr_error', handler);
  },

  onVREnd: (cb: () => void) => {
    const handler = () => cb();
    ipcRenderer.on('grpc:vr_end', handler);
    return () => ipcRenderer.removeListener('grpc:vr_end', handler);
  },

  // Send VR data to server
  sendVRData: (payload: any) => {
    console.log('📤 Sending VR data:', payload);
    ipcRenderer.send('grpc:vr_send', payload);
  },

  // Teacher actions (unary calls)
  createRoom: (teacher_id: string, vr_lesson_id: string, class_name: string) =>
    ipcRenderer.invoke('grpc:create_room', { teacher_id, vr_lesson_id, class_name }),

  activateRoom: (req: any) => ipcRenderer.invoke('grpc:activate_room', req),

  cancelRoom: (vr_learning_session_id: string) => ipcRenderer.invoke('grpc:cancel_room', { vr_learning_session_id }),

  sendNotification: (vr_learning_session_id: string, notification: any) =>
    ipcRenderer.invoke('grpc:send_notification', { vr_learning_session_id, notification }),

  // Get initial room state
  getRoomState: (vr_learning_session_id: string) =>
    ipcRenderer.invoke('grpc:get_room_state', { vr_learning_session_id }),
});
