import { Card, CardContent } from '@/common/components/ui/card';
import { User, CheckCircle2, HelpCircle } from 'lucide-react';
import type { VRLearningSessionDetail } from '../types/session-manage.type';

export const SessionStatsGrid = ({ session }: { session: VRLearningSessionDetail }) => {
  const totalStudents = session.vrDeviceSessionSummaries.length;
  const totalCompletedTasks = session.vrDeviceTaskProgresses.filter(t => t.isCompleted).length;
  
  const completedTasks = session.vrDeviceTaskProgresses.filter(t => t.isCompleted);
  const correctTasks = completedTasks.filter(t => t.isCorrect);
  const accuracy = completedTasks.length > 0 
    ? ((correctTasks.length / completedTasks.length) * 100).toFixed(0) 
    : '0';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard 
        title="Tổng học sinh" 
        value={totalStudents} 
        icon={<User className="text-blue-600" size={20} />} 
        bgClass="bg-blue-50"
      />
      <StatCard 
        title="Tổng nhiệm vụ hoàn thành" 
        value={totalCompletedTasks} 
        icon={<CheckCircle2 className="text-green-600" size={20} />} 
        bgClass="bg-green-50"
      />
      <StatCard 
        title="Tỉ lệ chính xác TB" 
        value={`${accuracy}%`} 
        icon={<HelpCircle className="text-orange-600" size={20} />} 
        bgClass="bg-orange-50"
      />
    </div>
  );
};

const StatCard = ({ title, value, icon, bgClass }: any) => (
  <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
    <CardContent className="p-5 flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-neutral-900">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${bgClass}`}>
        {icon}
      </div>
    </CardContent>
  </Card>
);