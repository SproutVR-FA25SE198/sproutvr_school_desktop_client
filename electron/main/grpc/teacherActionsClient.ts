import { credentials, Metadata } from '@grpc/grpc-js';
import { LearningSession } from './loader.js';
import { getRuntimeConfig } from '../config.js';

// Lazy-initialized client - created on first use after config is loaded
let _teacherSessionActionClient: any = null;

/**
 * Get the TeacherSessionActionClient instance (lazy initialization).
 * This ensures the client is only created after loadConfig() has been called.
 */
function getTeacherSessionActionClient() {
  if (!_teacherSessionActionClient) {
    const config = getRuntimeConfig();
    const GRPC_SERVER_URL = config.GRPC_SERVER_URL;

    console.log('[GRPC] Initializing TeacherSessionActionClient on:', GRPC_SERVER_URL);

    if (!GRPC_SERVER_URL) {
      throw new Error('GRPC_SERVER_URL is not configured. Check your .env file.');
    }

    _teacherSessionActionClient = new LearningSession.TeacherSessionManagement(
      GRPC_SERVER_URL,
      credentials.createInsecure(),
    );
  }
  return _teacherSessionActionClient;
}

// Utility to wrap unary calls with proper error handling and logging
function unaryCall(method: string, request: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const client = getTeacherSessionActionClient();
    const metadata = new Metadata();
    const deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + 30); // 30 second timeout

    console.log(`[GRPC] Calling ${method} with:`, JSON.stringify(request, null, 2));

    client[method](request, metadata, { deadline }, (err: any, response: any) => {
      if (err) {
        console.error(`[GRPC] ${method} error:`, {
          code: err.code,
          message: err.message,
          details: err.details,
        });
        reject(err);
      } else {
        console.log(`[GRPC] ${method} response:`, JSON.stringify(response, null, 2));
        resolve(response);
      }
    });
  });
}

export const createRoom = (teacher_id: string, vr_lesson_id: string, class_name: string) =>
  unaryCall('CreateRoom', { teacher_id, vr_lesson_id, class_name });

export const activateRoom = (req: {
  vr_learning_session_id: string;
  vr_lesson_id: string;
  room_duration_in_minutes: number;
  assigned_device_serials: Array<{ vr_device_serial_number: string; student_name: string }>;
}) => unaryCall('ActivateRoom', req);

export const cancelRoom = (vr_learning_session_id: string) => unaryCall('CancelRoom', { vr_learning_session_id });

export const sendNotification = (vr_learning_session_id: string, notification: { text: string; severity: string }) =>
  unaryCall('SendNotification', { vr_learning_session_id, notification });
