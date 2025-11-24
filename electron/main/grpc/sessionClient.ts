import { credentials, Metadata } from '@grpc/grpc-js';
import { LearningSession } from './loader.js';
import dotenv from 'dotenv';

const GRPC_SERVER_URL = dotenv.config().parsed?.VITE_GRPC_SERVER_URL;

console.log('🔧 Initializing SessionRealTimeClient on:', GRPC_SERVER_URL);

export const SessionRealTimeClient = new LearningSession.TeacherSessionRealTimeStateManagement(
  GRPC_SERVER_URL,
  credentials.createInsecure(),
);

/* ------------------------------------------------------
   1. Unary: GetRoomState
------------------------------------------------------ */
export function getRoomState(vr_learning_session_id: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const metadata = new Metadata();
    const deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + 10); // 10 second timeout

    console.log('📤 Getting room state for:', vr_learning_session_id);

    SessionRealTimeClient.GetRoomState(
      { vr_learning_session_id },
      metadata,
      { deadline },
      (err: any, response: any) => {
        if (err) {
          console.error('❌ GetRoomState error:', {
            code: err.code,
            message: err.message,
            details: err.details,
          });
          reject(err);
        } else {
          console.log('✅ GetRoomState response:', JSON.stringify(response, null, 2));
          resolve(response);
        }
      },
    );
  });
}

/* ------------------------------------------------------
   2. Streaming: StreamTeacherRoomState
------------------------------------------------------ */
/**
 * Starts server streaming of teacher room updates
 * @param vr_learning_session_id
 * @returns the stream object (Readable)
 */
export function streamTeacherRoomState(vr_learning_session_id: string) {
  console.log('🔌 Creating room state stream for:', vr_learning_session_id);

  const metadata = new Metadata();

  const stream = SessionRealTimeClient.StreamTeacherRoomState({ vr_learning_session_id }, metadata);

  // Add connection timeout
  const timeout = setTimeout(() => {
    console.warn('⚠️ Stream connection timeout (30s)');
    stream.cancel();
  }, 120 * 30000); // 30 seconds timeout

  // Clear timeout when first data arrives
  stream.on('data', (chunk: any) => {
    clearTimeout(timeout);
    console.log('📥 Stream data received:', JSON.stringify(chunk, null, 2));
  });

  stream.on('error', (err: any) => {
    clearTimeout(timeout);
    console.error('❌ Stream error:', {
      code: err.code,
      message: err.message,
      details: err.details,
    });
  });

  stream.on('end', () => {
    clearTimeout(timeout);
    console.log('🔌 Stream ended gracefully');
  });

  stream.on('status', (status: any) => {
    console.log('📊 Stream status:', status);
  });

  return stream;
}
