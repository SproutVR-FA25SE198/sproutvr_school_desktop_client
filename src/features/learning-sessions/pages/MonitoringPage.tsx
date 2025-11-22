'use client';

import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { loadRoomState } from '@/core/ipc/grpc';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/common/store';

import { SessionMonitoringDashboard } from '../components/monitoring-dashboard';
import useGetVrLessonById from '@/common/hooks/useGetVrLessonById';
import type { VrLessonRetrieve } from '@/common/types/vr-lesson.type';

import Loading from '@/common/components/loading';
import { applyRoomUpdate, teacherRoomUpdated } from '../store/monitoringSlice';
import type { VRLearningSessionMonitor } from '../types/session-monitoring.type';

export default function MonitoringPage() {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const location = useLocation();
  console.log('Route params:', params);

  // Redux roomState
  const roomState = useSelector((state: RootState) => state.monitoring.roomState);
  const activeSessionId = roomState?.vrlesson.vr_lesson_id || location.state?.vrLessonId || '';

  // Fetch VR lesson details
  const { data: vrLesson, isLoading: lessonLoading } = useGetVrLessonById(activeSessionId);
  console.log('Fetched VR Lesson:', vrLesson);

  // Load initial room state (GetRoomState)
  useEffect(() => {
    if (!params.id) return;
    loadRoomState(params.id); // <-- Loads + dispatch(setRoomState)
  }, [activeSessionId]);

  // Subscribe to real-time streaming updates
  useEffect(() => {
    window.electron.onTeacherUpdate((event) => {
      dispatch(teacherRoomUpdated(event)); // raw log
      dispatch(applyRoomUpdate(event)); // merge into roomState
    });
  }, [dispatch]);

  // Wait for GetRoomState to finish
  if (lessonLoading) {
    return <Loading isLoading />;
  }

  return (
    <SessionMonitoringDashboard
      session={roomState || ({} as VRLearningSessionMonitor)}
      vrLessonDetails={vrLesson || ({} as VrLessonRetrieve)}
    />
  );
}
