import { Badge } from '@/common/components/ui/badge';
import { Button } from '@/common/components/ui/button';
import { ArrowLeft, Calendar, Clock, Timer, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { VRLearningSession } from '../types/session-manage.type';

interface SessionHeaderProps {
  session: VRLearningSession;
}

export const SessionHeader = ({ session }: SessionHeaderProps) => {
  const navigate = useNavigate();

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className='flex flex-col gap-4'>
      <Button
        variant='ghost'
        className='w-fit pl-0 hover:bg-transparent hover:text-primary text-neutral-500'
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className='mr-2 h-4 w-4' /> Quay lại danh sách
      </Button>

      {/* FIXED: Added constraints to children to prevent wrapping issues */}
      <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 bg-white p-6 rounded-2xl shadow-sm border border-neutral-200'>
        
        {/* LEFT SIDE: Added 'flex-1 min-w-0' so it wraps instead of pushing right side */}
        <div className="flex-1 min-w-0">
          <div className='flex items-center gap-3 mb-3'>
            <Badge
              variant='outline'
              className='text-sm py-0.5 px-3 border-neutral-200 bg-neutral-50 text-neutral-700 rounded-md shrink-0'
            >
              {session.className}
            </Badge>
            <Badge
              className={`${session.status.name === 'Completed' ? 'bg-green-600' : 'bg-blue-600'} hover:bg-opacity-90 shrink-0`}
            >
              {session.status.name === 'Completed' ? 'Đã hoàn thành' : 'Đã hủy'}
            </Badge>
          </div>
          
          {/* Added 'break-words' to handle extremely long words if necessary */}
          <h1 className='text-2xl md:text-3xl font-bold text-neutral-900 mb-2 break-words leading-tight'>
            {session.vrLesson.name}
          </h1>
          
          <p className='text-neutral-500 flex items-center gap-2 text-sm font-medium'>
            <User size={16} className='text-neutral-400 shrink-0' />
            <span className="truncate">
              Giáo viên: <span className='text-neutral-900'>{session.teacher.name}</span>
            </span>
          </p>
        </div>

        {/* RIGHT SIDE (Info Bar): Added 'shrink-0' so it stays fixed size */}
        <div className='shrink-0 flex flex-wrap gap-6 lg:gap-8 text-sm text-neutral-600 bg-neutral-50/80 p-4 rounded-xl border border-neutral-100'>
          {/* Start Time */}
          <div className='flex flex-col gap-1.5'>
            <span className='text-[10px] text-neutral-400 uppercase tracking-wider font-bold'>Bắt đầu</span>
            <span className='flex items-center font-semibold text-neutral-800'>
              <Calendar size={14} className='mr-2 text-primary' />
              {formatDate(session.startTimeAtUtc)}
            </span>
          </div>

          <div className='w-px bg-neutral-200 my-1 hidden md:block'></div>

          {/* End Time / Deadline */}
          <div className='flex flex-col gap-1.5'>
            <span className='text-[10px] text-neutral-400 uppercase tracking-wider font-bold'>Kết Thúc</span>
            <span className='flex items-center font-semibold text-neutral-800'>
              <Timer size={14} className='mr-2 text-orange-500' />
              {formatDate(session.endTimeAtUtc)}
            </span>
          </div>

          <div className='w-px bg-neutral-200 my-1 hidden md:block'></div>

          {/* Duration */}
          <div className='flex flex-col gap-1.5'>
            <span className='text-[10px] text-neutral-400 uppercase tracking-wider font-bold'>Thời lượng</span>
            <span className='flex items-center font-semibold text-neutral-800'>
              <Clock size={14} className='mr-2 text-primary' />
              {session.durationInMinutes} phút
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};