import { BrowserWindow, ipcMain } from 'electron';
import { streamTeacherRoomState, getRoomState } from '../grpc/sessionClient.js';
import { createRoom, activateRoom, cancelRoom, sendNotification } from '../grpc/teacherActionsClient.js';

let activeRoomStream: any = null;

export function registerGrpcEvents(win: BrowserWindow) {
  console.log('🔧 Registering gRPC events...');

  /* ---------------------------------------------
     Teacher Actions (unary calls)
  --------------------------------------------- */
  ipcMain.handle('grpc:create_room', async (_, { teacher_id, vr_lesson_id, class_name }) => {
    try {
      console.log('📤 Creating room:', { teacher_id, vr_lesson_id, class_name });
      const response = await createRoom(teacher_id, vr_lesson_id, class_name);
      console.log('✅ Room created:', response);
      return response;
    } catch (error: any) {
      console.error('❌ Create room error:', error);
      throw error;
    }
  });

  ipcMain.handle('grpc:activate_room', async (_, req) => {
    try {
      console.log('📤 Activating room:', req);
      const response = await activateRoom(req);
      console.log('✅ Room activated:', response);

      // Start streaming after activation
      if (req.vr_learning_session_id) {
        startRoomStream(win, req.vr_learning_session_id);
      }

      return response;
    } catch (error: any) {
      console.error('❌ Activate room error:', error);
      throw error;
    }
  });

  ipcMain.handle('grpc:cancel_room', async (_, { vr_learning_session_id }) => {
    try {
      console.log('📤 Cancelling room:', vr_learning_session_id);
      const response = await cancelRoom(vr_learning_session_id);
      console.log('✅ Room cancelled:', response);

      // Stop streaming
      stopRoomStream();

      return response;
    } catch (error: any) {
      console.error('❌ Cancel room error:', error);
      throw error;
    }
  });

  ipcMain.handle('grpc:send_notification', async (_, { vr_learning_session_id, notification }) => {
    try {
      console.log('📤 Sending notification:', { vr_learning_session_id, notification });
      const response = await sendNotification(vr_learning_session_id, notification);
      console.log('✅ Notification sent:', response);
      return response;
    } catch (error: any) {
      console.error('❌ Send notification error:', error);
      throw error;
    }
  });

  ipcMain.handle('grpc:get_room_state', async (_, { vr_learning_session_id }) => {
    try {
      console.log('📤 Getting room state:', vr_learning_session_id);
      const response = await getRoomState(vr_learning_session_id);
      console.log('✅ Room state received:', response);
      return response;
    } catch (error: any) {
      console.error('❌ Get room state error:', error);
      throw error;
    }
  });

  /* ---------------------------------------------
     Cleanup on window close
  --------------------------------------------- */
  win.on('closed', () => {
    console.log('🧹 Window closed, cleaning up gRPC streams...');
    stopRoomStream();
  });
}

/* ---------------------------------------------
   Helper: Start room state stream
--------------------------------------------- */
function startRoomStream(win: BrowserWindow, vr_learning_session_id: string) {
  // Stop existing stream if any
  stopRoomStream();

  console.log('🔌 Starting room state stream for:', vr_learning_session_id);

  try {
    activeRoomStream = streamTeacherRoomState(vr_learning_session_id);

    activeRoomStream.on('data', (chunk: any) => {
      console.log('📥 Room state update:', JSON.stringify(chunk, null, 2));

      // Parse the update based on the payload type
      const update = parseTeacherRoomUpdate(chunk);
      win.webContents.send('grpc:teacher_room_update', update);
    });

    activeRoomStream.on('error', (err: any) => {
      console.error('❌ Room state stream error:', err);
      win.webContents.send('grpc:teacher_room_error', err?.message ?? 'Unknown gRPC error');
    });

    activeRoomStream.on('end', () => {
      console.log('🔌 Room state stream ended');
      win.webContents.send('grpc:teacher_room_end');
      activeRoomStream = null;
    });

    activeRoomStream.on('status', (status: any) => {
      console.log('📊 Stream status:', status);
    });
  } catch (error: any) {
    console.error('❌ Failed to start room stream:', error);
    win.webContents.send('grpc:teacher_room_error', error?.message ?? 'Failed to start stream');
  }
}

/* ---------------------------------------------
   Helper: Stop room state stream
--------------------------------------------- */
function stopRoomStream() {
  if (activeRoomStream) {
    console.log('⏹️ Stopping room state stream...');
    try {
      activeRoomStream.cancel();
    } catch (error) {
      console.error('❌ Error stopping stream:', error);
    }
    activeRoomStream = null;
  }
}

/* ---------------------------------------------
   Helper: Parse teacher room update based on payload type
--------------------------------------------- */
function parseTeacherRoomUpdate(chunk: any) {
  const { vr_learning_session_id, payload } = chunk;

  if (!payload) {
    console.warn('⚠️ Received update without payload');
    return chunk;
  }

  // Determine which payload type was received
  if (chunk.room_cancelled) {
    return {
      vr_learning_session_id,
      type: 'room_cancelled',
      data: chunk.room_cancelled,
    };
  }

  if (chunk.room_ended) {
    return {
      vr_learning_session_id,
      type: 'room_ended',
      data: chunk.room_ended,
    };
  }

  if (chunk.device_joined) {
    return {
      vr_learning_session_id,
      type: 'device_joined',
      data: chunk.device_joined,
    };
  }

  if (chunk.device_disconnected) {
    return {
      vr_learning_session_id,
      type: 'device_disconnected',
      data: chunk.device_disconnected,
    };
  }

  if (chunk.task_updated) {
    return {
      vr_learning_session_id,
      type: 'task_updated',
      data: chunk.task_updated,
    };
  }

  console.warn('⚠️ Unknown payload type:', chunk);
  return chunk;
}

// Export for use in main process
export { startRoomStream, stopRoomStream };
