'use client';

import { useLocation, useParams } from 'react-router-dom';
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
  const location = useLocation();
  const params = useParams();
  const sessionId = params.id;
  
  // Get room code and other data from location state or sessionStorage (fallback)
  const locationState = location.state as { 
    roomCode?: string
    sessionId?: string
    className?: string
    vrLessonId?: string
  } | null;
  
  // const session = useSelector((state: RootState) => state.monitoring.session);
  const isLoading = useSelector((state: RootState) => state.monitoring.isLoading);

  // Use sessionId from params or state
  const stateSessionId = locationState?.sessionId
  const activeSessionId = sessionId || stateSessionId || 'a1b2c3d4-e5f6-7890-1234-567890abcdef';
  
  // Try to get from location state first, then from sessionStorage
  const getSessionData = () => {
    if (locationState?.roomCode) {
      return locationState
    }
    // Fallback to sessionStorage
    try {
      const stored = sessionStorage.getItem(`session_${activeSessionId}`)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (e) {
      console.error('Error reading sessionStorage:', e)
    }
    return null
  }
  
  const sessionData = getSessionData()
  const roomCode = locationState?.roomCode || sessionData?.roomCode
  const className = locationState?.className || sessionData?.className
  const { data: vrLessons, isLoading: tasksLoading } = useGetVrLessonById(activeSessionId);

  // useEffect(() => {
  //   // Start the stream on page mount
  //   const stopStream = subscribeToSessionStream(dispatch, activeSessionId);
  //   return () => stopStream(); // Gracefully close connection
  // }, [dispatch, activeSessionId]);
  
  // Update mock session with data from state if available
  // Priority: location state > mock data
  const session = {
    ...MOCK_VR_LEARNING_SESSION,
    vr_learning_session_id: activeSessionId,
    ...(roomCode && { room_code: roomCode }),
    ...(className && { class_name: className }),
  };

  // Debug log
  console.log('MonitoringPage - location.state:', locationState);
  console.log('MonitoringPage - sessionData:', sessionData);
  console.log('MonitoringPage - roomCode:', roomCode);
  console.log('MonitoringPage - session.room_code:', session.room_code);

  if (isLoading) {
    return <Loading isLoading />;
  }

  return <SessionMonitoringDashboard session={session} vrLessonDetails={vrLessons || ({} as VrLessonRetrieve)} />;
}
