import { createRoom } from '@/core/ipc/grpc';
import { useState } from 'react';

export function CreateRoomButton() {
  const [loading, setLoading] = useState(false);

  const teacherId = '0199f4b1-8487-4352-8a2a-320a00e40e58';
  const vrLessonId = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';

  async function handleClick() {
    setLoading(true);

    try {
      const response = await createRoom(teacherId, vrLessonId, 'Class 10A1');
      console.log('Room created:', response);

      alert('Room created: ' + response.vr_learning_session_id);
    } catch (err) {
      console.error('CreateRoom error', err);
    }

    setLoading(false);
  }

  return (
    <button onClick={handleClick} disabled={loading}>
      {loading ? 'Creating...' : 'Create Room'}
    </button>
  );
}
