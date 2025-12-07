import { BrowserWindow, ipcMain } from 'electron';
import { streamTeacherRoomState, getRoomState } from '../grpc/sessionClient.js';
import { createRoom, activateRoom, cancelRoom, sendNotification } from '../grpc/teacherActionsClient.js';

let activeRoomStream: any = null;
let isWindowDestroyed = false;
let isStreamCancelling = false;

export function registerGrpcEvents(win: BrowserWindow) {
  console.log('[GRPC] Registering gRPC events...');

  // Track window destruction state
  isWindowDestroyed = false;
  isStreamCancelling = false;

  /* ---------------------------------------------
     Stream Control
  --------------------------------------------- */
  ipcMain.handle('grpc:start_room_stream', async (_, { vr_learning_session_id }) => {
    try {
      console.log('[GRPC] Starting room stream:', vr_learning_session_id);
      startRoomStream(win, vr_learning_session_id);
      return { success: true, vr_learning_session_id };
    } catch (error: any) {
      console.error('[GRPC] Start room stream error:', error);
      throw error;
    }
  });

  ipcMain.handle('grpc:stop_room_stream', async () => {
    try {
      console.log('[GRPC] Stopping room stream');
      stopRoomStream();
      return { success: true };
    } catch (error: any) {
      console.error('[GRPC] Stop room stream error:', error);
      throw error;
    }
  });

  /* ---------------------------------------------
     Teacher Actions (unary calls)
  --------------------------------------------- */
  ipcMain.handle('grpc:create_room', async (_, { teacher_id, vr_lesson_id, class_name }) => {
    try {
      console.log('[GRPC] Creating room:', { teacher_id, vr_lesson_id, class_name });
      const response = await createRoom(teacher_id, vr_lesson_id, class_name);
      console.log('[GRPC] Room created:', response);
      return response;
    } catch (error: any) {
      console.error('[GRPC] Create room error:', error);
      throw error;
    }
  });

  ipcMain.handle('grpc:activate_room', async (_, req) => {
    try {
      console.log('[GRPC] Activating room:', req);
      const response = await activateRoom(req);
      console.log('[GRPC] Room activated:', response);
      return response;
    } catch (error: any) {
      console.error('[GRPC] Activate room error:', error);
      throw error;
    }
  });

  ipcMain.handle('grpc:cancel_room', async (_, { vr_learning_session_id }) => {
    try {
      console.log('[GRPC] Cancelling room:', vr_learning_session_id);
      const response = await cancelRoom(vr_learning_session_id);
      console.log('[GRPC] Room cancelled:', response);
      return response;
    } catch (error: any) {
      console.error('[GRPC] Cancel room error:', error);
      throw error;
    }
  });

  ipcMain.handle('grpc:send_notification', async (_, { vr_learning_session_id, notification }) => {
    try {
      console.log('[GRPC] Sending notification:', { vr_learning_session_id, notification });
      const response = await sendNotification(vr_learning_session_id, notification);
      console.log('[GRPC] Notification sent:', response);
      return response;
    } catch (error: any) {
      console.error('[GRPC] Send notification error:', error);
      throw error;
    }
  });

  ipcMain.handle('grpc:get_room_state', async (_, { vr_learning_session_id }) => {
    try {
      console.log('[GRPC] Getting room state:', vr_learning_session_id);
      const response = await getRoomState(vr_learning_session_id);
      console.log('[GRPC] Room state received:', response);
      return response;
    } catch (error: any) {
      console.error('[GRPC] Get room state error:', error);
      throw error;
    }
  });

  /* ---------------------------------------------
     Cleanup on window close
  --------------------------------------------- */
  win.on('close', () => {
    console.log('[GRPC] Window closing, cleaning up gRPC streams...');
    isWindowDestroyed = true;
    stopRoomStream();
  });

  win.on('closed', () => {
    console.log('[GRPC] Window closed');
    isWindowDestroyed = true;
  });
}

/* ---------------------------------------------
   Helper: Safely send to renderer
--------------------------------------------- */
function safeSend(win: BrowserWindow, channel: string, data: any) {
  try {
    if (!isWindowDestroyed && win && !win.isDestroyed() && win.webContents && !win.webContents.isDestroyed()) {
      win.webContents.send(channel, data);
    }
  } catch (error) {
    console.warn('[GRPC] Could not send to renderer (window may be destroyed):', error);
  }
}

/* ---------------------------------------------
   Helper: Check if error is a cancellation error
--------------------------------------------- */
function isCancellationError(err: any): boolean {
  if (!err) return false;

  // gRPC cancellation error codes
  const code = err.code;
  const message = err.message || '';

  return (
    code === 1 || // CANCELLED
    code === 'CANCELLED' ||
    message.includes('CANCELLED') ||
    message.includes('Cancelled on client') ||
    message.includes('cancelled')
  );
}

/* ---------------------------------------------
   Helper: Start room state stream
--------------------------------------------- */
function startRoomStream(win: BrowserWindow, vr_learning_session_id: string) {
  // Stop existing stream if any
  stopRoomStream();

  console.log('[GRPC] Starting room state stream for:', vr_learning_session_id);
  isStreamCancelling = false;

  try {
    activeRoomStream = streamTeacherRoomState(vr_learning_session_id);

    activeRoomStream.on('data', (chunk: any) => {
      if (isWindowDestroyed || isStreamCancelling) return;

      console.log('[GRPC] Room state update:', JSON.stringify(chunk, null, 2));

      // Parse the update based on the payload type
      const update = parseTeacherRoomUpdate(chunk);
      safeSend(win, 'grpc:teacher_room_update', update);
    });

    activeRoomStream.on('error', (err: any) => {
      // Ignore cancellation errors - they're expected when we stop the stream
      if (isStreamCancelling || isWindowDestroyed || isCancellationError(err)) {
        console.log('[INFO] Stream cancelled (expected)');
        return;
      }

      console.error('[GRPC] Room state stream error:', err);
      safeSend(win, 'grpc:teacher_room_error', err?.message ?? 'Unknown gRPC error');
    });

    activeRoomStream.on('end', () => {
      console.log('[GRPC] Room state stream ended');
      if (!isWindowDestroyed && !isStreamCancelling) {
        safeSend(win, 'grpc:teacher_room_end', null);
      }
      activeRoomStream = null;
    });

    activeRoomStream.on('status', (status: any) => {
      // Ignore cancelled status
      if (status?.code === 1 || isStreamCancelling) {
        console.log('[INFO] Stream status: cancelled');
        return;
      }
      console.log('[GRPC] Stream status:', status);
    });
  } catch (error: any) {
    if (isCancellationError(error)) {
      console.log('[INFO] Stream start cancelled (expected)');
      return;
    }

    console.error('[GRPC] Failed to start room stream:', error);
    if (!isWindowDestroyed) {
      safeSend(win, 'grpc:teacher_room_error', error?.message ?? 'Failed to start stream');
    }
  }
}

/* ---------------------------------------------
   Helper: Stop room state stream
--------------------------------------------- */
function stopRoomStream() {
  if (activeRoomStream) {
    console.log('[GRPC] Stopping room state stream...');
    isStreamCancelling = true;

    try {
      // Remove all listeners first to prevent callbacks during cancellation
      activeRoomStream.removeAllListeners('data');
      activeRoomStream.removeAllListeners('error');
      activeRoomStream.removeAllListeners('end');
      activeRoomStream.removeAllListeners('status');

      // Use destroy() if available, otherwise cancel()
      if (typeof activeRoomStream.destroy === 'function') {
        activeRoomStream.destroy();
      } else if (typeof activeRoomStream.cancel === 'function') {
        activeRoomStream.cancel();
      }
    } catch (error: any) {
      // Ignore cancellation errors during cleanup
      if (!isCancellationError(error)) {
        console.warn('[GRPC] Error stopping stream:', error);
      }
    }
    activeRoomStream = null;
  }
}

/* ---------------------------------------------
   Helper: Parse teacher room update based on payload type
--------------------------------------------- */
function parseTeacherRoomUpdate(chunk: any) {
  const { vr_learning_session_id } = chunk;

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

  console.warn('[GRPC] Unknown payload type:', chunk);
  return chunk;
}

// Export for use in main process
export { startRoomStream, stopRoomStream };
