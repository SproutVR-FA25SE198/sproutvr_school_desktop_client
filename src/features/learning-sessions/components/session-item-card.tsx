import { useNavigate } from 'react-router-dom';
import { Card } from '@/common/components/ui/card';
import { Badge } from '@/common/components/ui/badge';
import { Clock, User, ArrowRight, Timer } from 'lucide-react';
import routes from '@/core/configs/routes';
import type { VRLearningSession } from '../types/session-manage.type';

interface SessionItemCardProps {
  session: VRLearningSession;
}

export const SessionItemCard = ({ session }: SessionItemCardProps) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`${routes.sessionList}/${session.id}`);
  };

  const isCompleted = session.status.name === 'Completed';

  // --- Date Helpers ---
  const startDate = new Date(session.startTimeAtUtc);
  const day = startDate.getDate().toString().padStart(2, '0');
  const month = startDate.toLocaleString('vi-VN', { month: 'short' }).toUpperCase();
  
  // Format Time: "08:00 - 09:30"
  const formatTime = (date: string) => 
    new Date(date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  return (
    <Card 
      onClick={handleViewDetails}
      className="group relative flex flex-col sm:flex-row overflow-hidden border border-neutral-200/80 bg-white shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer rounded-xl"
    >
      {/* --- LEFT: Date Block (Calendar Style) --- */}
      <div className={`
        min-w-[100px] sm:w-[120px] shrink-0 flex flex-row sm:flex-col items-center justify-center sm:justify-center gap-2 sm:gap-0 p-4 sm:p-0
        ${isCompleted ? 'bg-neutral-50' : 'bg-blue-50/50'} 
        border-b sm:border-b-0 sm:border-r border-neutral-100 group-hover:bg-primary/5 transition-colors
      `}>
        <span className="text-3xl font-bold text-neutral-800 tracking-tighter">{day}</span>
        <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{month}</span>
      </div>

      {/* --- RIGHT: Main Content --- */}
      <div className="flex-1 p-5 flex flex-col gap-4">
        
        {/* Header: Class & Status */}
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="bg-neutral-50 text-neutral-600 border-neutral-200 font-semibold">
            {session.className}
          </Badge>

          <Badge className={`
            ${isCompleted 
              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'} 
            border-0 shadow-none font-bold px-2.5
          `}>
            {isCompleted ? 'Đã hoàn thành' : 'Đã hủy'}
          </Badge>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-lg font-bold text-neutral-900 leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {session.vrLesson.name}
          </h3>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mt-auto">
          {/* Time Range */}
          <div className="flex items-center text-sm text-neutral-500">
            <Clock size={16} className="text-neutral-400 mr-2 shrink-0" />
            <span className="font-medium text-neutral-700">
              {formatTime(session.startTimeAtUtc)} - {formatTime(session.endTimeAtUtc)}
            </span>
          </div>

          {/* Duration */}
          <div className="flex items-center text-sm text-neutral-500">
            <Timer size={16} className="text-neutral-400 mr-2 shrink-0" />
            <span>{session.durationInMinutes} phút</span>
          </div>

          {/* Teacher */}
          <div className="flex items-center text-sm text-neutral-500 col-span-1 sm:col-span-2 mt-1">
            <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center mr-2 border border-neutral-200">
                <User size={12} className="text-neutral-500" />
            </div>
            <span className="truncate">GV: <span className="font-semibold text-neutral-700">{session.teacher.name}</span></span>
          </div>
        </div>
      </div>

      {/* --- Hover Action Overlay (Desktop) --- */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
        <ArrowRight size={20} />
      </div>
    </Card>
  );
};