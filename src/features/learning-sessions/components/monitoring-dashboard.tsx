'use client';
import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { TaskMenu } from './task-menu';
import { DeviceCarousel } from './device-carousel';


import type { VrLessonRetrieve } from '@/common/types/vr-lesson.type';

import { CancelRoomButton } from './cancel-room-button';
import { SendNotification } from './send-notification';
import CountdownTimer from './countdown-timer';
import type { RootState } from '@/common/store';
import { useSelector } from 'react-redux';
import type { VRLearningSessionMonitor } from '../types/session-monitoring.type';

interface SessionMonitoringDashboardProps {
  session: VRLearningSessionMonitor;
  vrLessonDetails: VrLessonRetrieve;
}

export function SessionMonitoringDashboard({ session, vrLessonDetails }: SessionMonitoringDashboardProps) {
  const [isTaskMenuCollapsed, setIsTaskMenuCollapsed] = useState(false);

  const { class_name, room_code, teacher, vrlesson, devices } = session;
  const { endTimeUtc, startTimeUtc } = useSelector((state: RootState) => state.session);

  return (
    <div className='flex flex-col min-h-screen bg-neutral-50'>
      {/* Header */}
      <header className='border-b bg-white px-8 py-4 flex justify-between items-center'>
        <div className='flex items-center gap-6'>
          {/* Room Code */}
          <div className='flex items-center gap-3'>
            <div className='flex h-12 px-4 items-center justify-center rounded-full bg-[#0f2c5b] text-white font-bold text-base tracking-wide'>
              {room_code || 'N/A'}
            </div>

            <div>
              <p className='text-xs text-neutral-500 uppercase tracking-wide'>Lớp</p>
              <p className='text-base font-semibold text-neutral-900'>{class_name || 'N/A'}</p>
            </div>
          </div>

          <div className='h-8 w-px bg-neutral-200' />

          <div>
            <p className='text-xs text-neutral-500 uppercase tracking-wide'>Giáo viên</p>
            <p className='text-sm font-medium text-neutral-900'>{teacher?.teacher_name || 'N/A'}</p>
          </div>

          <div>
            <p className='text-xs text-neutral-500 uppercase tracking-wide'>Bài học</p>
            <p className='text-sm font-medium text-neutral-900'>{vrlesson?.name || 'N/A'}</p>
          </div>
        </div>

        <div className='flex items-center gap-4'>
          <SendNotification vrLessonId={session.vr_learning_session_id} />
          <CancelRoomButton vrLearningSessionId={session.vr_learning_session_id} />
        </div>
      </header>

      {/* Main Content */}
      <main className='flex flex-1 overflow-hidden'>
        {/* Task Menu */}
        <aside
          className={`border-r bg-white transition-all duration-300 ${
            isTaskMenuCollapsed ? 'w-0 overflow-hidden' : 'w-72'
          }`}
        >
          <CountdownTimer
            startUtc={startTimeUtc || ''}
            endUtc={endTimeUtc || ''}
            className='flex flex-col items-center my-6'
            text='Thời gian phòng học còn lại'
          />

          <div className='border-y p-4'>
            <h3 className='text-sm font-semibold text-neutral-900 uppercase tracking-wide'>Danh sách nhiệm vụ </h3>
          </div>

          <TaskMenu taskArr={vrLessonDetails.tasks || []} />
        </aside>

        {/* Collapse Button */}
        <button
          onClick={() => setIsTaskMenuCollapsed((prev) => !prev)}
          className='w-8 border-r bg-white flex justify-center items-center hover:bg-neutral-50'
        >
          <ChevronLeft
            size={18}
            className={`text-neutral-600 transition-transform duration-300 ${isTaskMenuCollapsed ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Device Carousel */}
        <section className='flex-1 overflow-hidden p-6'>
          <DeviceCarousel isTaskMenuCollapsed={isTaskMenuCollapsed} devices={devices || []} />
        </section>
      </main>
    </div>
  );
}
