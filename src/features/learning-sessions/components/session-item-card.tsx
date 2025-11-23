import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/common/components/ui/card';
import { Button } from '@/common/components/ui/button';
import { Calendar, Clock, Users, Play, Timer } from 'lucide-react';
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
  const statusColor = isCompleted ? 'bg-green-500' : 'bg-blue-500';
  const statusBg = isCompleted ? 'bg-green-50 text-green-700 border-green-100' : 'bg-blue-50 text-blue-700 border-blue-100';

  // Helper for short date format
  const formatDate = (dateStr: string) => 
    new Date(dateStr).toLocaleDateString('vi-VN', { 
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' 
    });

  return (
    <Card 
      className='group hover:shadow-xl transition-all duration-300 border-neutral-200/60 overflow-hidden cursor-pointer'
      onClick={handleViewDetails}
    >
      {/* Status Strip */}
      <div className={`h-1.5 w-full ${statusColor}`} />
      
      <CardContent className='p-6'>
        <div className='flex justify-between items-start mb-4'>
          <div>
            <span className='inline-block px-2.5 py-0.5 bg-neutral-100 text-neutral-600 text-xs font-bold rounded mb-2'>
              {session.className}
            </span>
            <h3 className='font-bold text-lg text-neutral-900 leading-tight line-clamp-2 min-h-14'>
              {session.vrLesson.name}
            </h3>
          </div>
        </div>

        <div className='space-y-2.5 mb-6'>
          {/* Start Time */}
          <InfoRow 
            icon={<Calendar size={15}/>} 
            text={`Bắt đầu: ${formatDate(session.startTimeAtUtc)}`} 
          />
          
          {/* End Time / Deadline */}
          <InfoRow 
            icon={<Timer size={15} className="text-orange-500"/>} 
            text={`Kết thúc: ${formatDate(session.endTimeAtUtc)}`} 
            className="text-orange-700/80 font-medium"
          />

          <InfoRow 
            icon={<Clock size={15}/>} 
            text={`Thời lượng: ${session.durationInMinutes} phút`} 
          />
          <InfoRow 
            icon={<Users size={15}/>} 
            text={session.teacher.name} 
          />
        </div>

        <div className='flex items-center justify-between mt-auto pt-4 border-t border-neutral-100'>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusBg}`}>
            {session.status.name}
          </span>
          <Button 
            variant='ghost' 
            size='sm' 
            className='text-primary hover:bg-primary/10 hover:text-primary font-medium cursor-pointer'
          >
            Chi tiết <Play size={14} className='ml-1.5' />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const InfoRow = ({ icon, text, className = '' }: { icon: React.ReactNode; text: string; className?: string }) => (
  <div className={`flex items-center text-sm text-neutral-500 ${className}`}>
    <span className='text-neutral-400 mr-2.5 shrink-0'>{icon}</span>
    <span className="truncate">{text}</span>
  </div>
);