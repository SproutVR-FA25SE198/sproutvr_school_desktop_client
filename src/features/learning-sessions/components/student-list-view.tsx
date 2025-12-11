import { Badge } from '@/common/components/ui/badge';
import { Button } from '@/common/components/ui/button';
import { ChevronRight, User, Laptop } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import type { VRDeviceSessionSummary, VRDeviceTaskProgress } from '../types/session-manage.type';

interface StudentListViewProps {
  summaries: VRDeviceSessionSummary[];
  allTasks: VRDeviceTaskProgress[];
}

export const StudentListView = ({ summaries, allTasks }: StudentListViewProps) => {
  const navigate = useNavigate();
  const { id: sessionId } = useParams<{ id: string }>();

  const handleRowClick = (summary: VRDeviceSessionSummary) => {
    const studentTasks = allTasks.filter(t => t.studentName === summary.studentName);
    if (sessionId) {
      navigate(`/sessions/${sessionId}/devices/${summary.vrDevice.vrDeviceId}`, {
        state: { tasks: studentTasks }
      });
    }
  };

  const calculateScore = (studentName: string) => {
    const tasks = allTasks.filter(t => t.studentName === studentName);
    const total = tasks.length;
    const correct = tasks.filter(t => t.isCorrect).length;
    const score = total > 0 ? (correct / total) * 10 : 0;
    return { score, scoreDisplay: score.toFixed(1) };
  };

  const getScoreColor = (score: number) => {
    if (score >= 8.0) return 'bg-green-100 text-green-700 border-green-200';
    if (score >= 5.0) return 'bg-orange-100 text-orange-700 border-orange-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden mt-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-neutral-50 text-neutral-500 font-medium border-b border-neutral-200 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4 w-[30%]">Học sinh</th>
              <th className="px-6 py-4">Thiết bị</th>
              <th className="px-6 py-4 text-center">Tiến độ</th>
              <th className="px-6 py-4 text-center">Điểm số</th>
              <th className="px-6 py-4 text-right">Chi tiết</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {summaries.length === 0 ? (
                <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-neutral-400 italic bg-neutral-50/30">
                        Không tìm thấy học sinh nào phù hợp với từ khóa tìm kiếm.
                    </td>
                </tr>
            ) : (
                summaries.map((summary) => {
                const { score, scoreDisplay } = calculateScore(summary.studentName);
                const taskCount = allTasks.filter(t => t.studentName === summary.studentName).length;
                
                return (
                    <tr 
                      key={summary.id}
                      onClick={() => handleRowClick(summary)}
                      className="group hover:bg-blue-50/40 transition-colors cursor-pointer"
                    >
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 border border-neutral-200 group-hover:bg-white group-hover:text-primary group-hover:border-blue-200 transition-all">
                            <User size={16} />
                        </div>
                        <span className="font-semibold text-neutral-800 group-hover:text-primary transition-colors">
                            {summary.studentName}
                        </span>
                        </div>
                    </td>
                    
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-neutral-600">
                        <Laptop size={14} className="text-neutral-400" />
                        <span className="bg-neutral-50 px-2 py-0.5 rounded text-xs border border-neutral-200 font-mono text-neutral-500">
                            {summary.vrDevice.deviceName}
                        </span>
                        </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center">
                            <span className="font-bold text-neutral-700">
                                {summary.noTasksCompleted}<span className="text-neutral-400 font-normal">/{taskCount}</span>
                            </span>
                        </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                        <Badge variant="outline" className={`font-bold border ${getScoreColor(score)}`}>
                        {scoreDisplay}
                        </Badge>
                    </td>

                    <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-300 group-hover:text-primary hover:bg-white cursor-pointer">
                            <ChevronRight size={18} />
                        </Button>
                    </td>
                    </tr>
                );
                })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};