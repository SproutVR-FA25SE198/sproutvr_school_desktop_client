'use client';
import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { TaskMenu } from './task-menu';
import { DeviceCarousel } from './device-carousel';
import type { VRLearningSession } from '../services/session.type';
import type { VrLessonRetrieve } from '@/common/types/vr-lesson.type';

interface SessionMonitoringDashboardProps {
  session: VRLearningSession;
  vrLessonDetails: VrLessonRetrieve;
}

export function SessionMonitoringDashboard({ session, vrLessonDetails }: SessionMonitoringDashboardProps) {
  const [isTaskMenuCollapsed, setIsTaskMenuCollapsed] = useState(false);
  const { class_name, room_code, teacher, vrlesson, devices } = session;

  // Debug log
  console.log('SessionMonitoringDashboard - room_code:', room_code);
  console.log('SessionMonitoringDashboard - session:', session);

  return (
    <div className='flex flex-col min-h-screen bg-neutral-50'>
      {/* Header */}
      <header className='border-b bg-white px-8 py-4 flex justify-between items-center'>
        <div className='flex items-center gap-6'>
          <div className='flex items-center gap-3'>
            {/* Room Code - Blue pill */}
            <div className='flex h-12 px-4 items-center justify-center rounded-full bg-[#0f2c5b] text-white font-bold text-base tracking-wide'>
              {room_code || 'N/A'}
            </div>
            {/* Class Name */}
            <div>
              <p className='text-xs text-neutral-500 uppercase tracking-wide'>Lớp</p>
              <p className='text-base font-semibold text-neutral-900'>{class_name}</p>
            </div>
          </div>
          <div className='h-8 w-px bg-neutral-200' />
          <div>
            <p className='text-xs text-neutral-500 uppercase tracking-wide'>Giáo viên</p>
            <p className='text-sm font-medium text-neutral-900'>{teacher.teacher_name}</p>
          </div>
          <div>
            <p className='text-xs text-neutral-500 uppercase tracking-wide'>Bài học</p>
            <p className='text-sm font-medium text-neutral-900'>{vrlesson.name}</p>
          </div>
        </div>
        <div>
          <p className='text-xs text-neutral-500 uppercase tracking-wide'>Thiết bị đang hoạt động</p>
          <p className='text-2xl font-bold text-[#29ae62]'>{devices.filter((d) => d.status === 'Connected').length}</p>
        </div>
      </header>

      {/* Main */}
      <main className='flex flex-1 overflow-hidden'>
        <aside
          className={`border-r bg-white transition-all duration-300 ${
            isTaskMenuCollapsed ? 'w-0 overflow-hidden' : 'w-72'
          }`}
        >
          <div className='border-b p-4'>
            <h3 className='text-sm font-semibold text-neutral-900 uppercase tracking-wide'>Tasks Overview</h3>
          </div>
          <TaskMenu tasks={devices[0]?.tasks || []} />
        </aside>

        <button
          onClick={() => setIsTaskMenuCollapsed((prev) => !prev)}
          className='w-8 border-r bg-white flex justify-center items-center hover:bg-neutral-50'
        >
          <ChevronLeft
            size={18}
            className={`text-neutral-600 transition-transform duration-300 ${isTaskMenuCollapsed ? 'rotate-180' : ''}`}
          />
        </button>

        <section className='flex-1 overflow-hidden p-6'>
          <DeviceCarousel isTaskMenuCollapsed={isTaskMenuCollapsed} devices={devices} />
        </section>
      </main>
    </div>
  );
}
