'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/common/store';
// import { subscribeToSessionStream } from '../services/monitoring-grpc.service';
import { SessionMonitoringDashboard } from '../components/monitoring-dashboard';
import useGetVrLessonById from '@/common/hooks/useGetVrLessonById';
import type { VrLessonRetrieve } from '@/common/types/vr-lesson.type';
import Loading from '@/common/components/loading';
import { MOCK_VR_LEARNING_SESSION } from '../services/mock-data';

export const metadata = {
  title: 'Learning Session Monitoring - V2',
  description: 'Monitor VR learning sessions in real-time',
};

export default function MonitoringPage() {
  const dispatch = useDispatch<AppDispatch>();
  // const session = useSelector((state: RootState) => state.monitoring.session);
  const isLoading = useSelector((state: RootState) => state.monitoring.isLoading);

  const { data: vrLessons, isLoading: tasksLoading } = useGetVrLessonById('a1b2c3d4-e5f6-7890-1234-567890abcdef');

  // useEffect(() => {
  //   // Start the stream on page mount
  //   const stopStream = subscribeToSessionStream(dispatch, 'a1b2c3d4-e5f6-7890-1234-567890abcdef');
  //   return () => stopStream(); // Gracefully close connection
  // }, [dispatch]);
  const session = MOCK_VR_LEARNING_SESSION;

  if (isLoading) {
    return <Loading isLoading />;
  }

  return <SessionMonitoringDashboard session={session} vrLessonDetails={vrLessons || ({} as VrLessonRetrieve)} />;
}
