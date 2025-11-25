'use client';

import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createRoom } from '@/core/ipc/grpc';
import { useDispatch } from 'react-redux';
import { setSessionId } from '@/features/learning-sessions/store/sessionSlice';
import { useAppSelector } from '@/common/store/hooks';

export interface CreateSessionPayload {
  vrLessonId: string;
  classroomNumber: string;
  classroomLetter: string;
}

export function useCreateLearningSession() {
  const dispatch = useDispatch();
  const { user } = useAppSelector((state) => state.auth);
  console.log('user in hook', user);
  const teacherId = user?.userId || '';

  const [error, setError] = useState<string | null>(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: CreateSessionPayload) => {
      const className = `${payload.classroomNumber}${
        payload.classroomLetter ? ' ' + payload.classroomLetter : ''
      }`.trim();

      return await createRoom(teacherId, payload.vrLessonId, className);
    },
    onSuccess: (response) => {
      dispatch(setSessionId(response.vr_learning_session_id));
      setError(null);
    },
    onError: (err: any) => {
      console.error('Create room error:', err);
      setError(err?.message || 'Unknown error');
    },
  });

  const createSession = useCallback(
    async (payload: CreateSessionPayload) => {
      await mutateAsync(payload);
    },
    [mutateAsync],
  );

  return {
    createSession,
    isCreating: isPending,
    error,
  };
}
