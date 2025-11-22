import { Card, CardHeader, CardTitle, CardContent } from '@/common/components/ui/card';
import { User, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import type { VRDeviceSessionSummary, VRDeviceTaskProgress } from '../types/session-manage.type';
import { useNavigate } from 'react-router-dom';

interface StudentResultCardProps {
  summary: VRDeviceSessionSummary;
  tasks: VRDeviceTaskProgress[];
}

export const StudentResultCard = ({ summary, tasks }: StudentResultCardProps) => {
  const navigate = useNavigate();

  // Get current session ID from URL
  // const { id: sessionId } = useParams<{ id: string }>();

  // TODO: Get device ID from each of summary object
  const DEVICE_ID = "a1b2c3d4-e5f6-7890-1234-567890abcdef";

  // TODO: Get session ID from URL param
  const SESSION_ID = "aa49d5c7-be29-475e-8600-bbb383dab940";

  const handleCardClick = () => {
    // Check if we have the session ID
    // if (sessionId) {
      navigate(`/sessions/${SESSION_ID}/devices/${DEVICE_ID}`);
    // }
  };

  return (
    <Card 
        className="group overflow-hidden border-neutral-200 hover:border-primary/40 hover:shadow-md transition-all duration-300 cursor-pointer relative"
        onClick={handleCardClick}
    >
      <CardHeader className="bg-neutral-50/80 border-b border-neutral-100 pb-4 pt-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <User size={20} className="text-neutral-500" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-neutral-800">{summary.studentName}</CardTitle>
              <p className="text-xs text-neutral-500 mt-0.5">Hoàn thành: <b className="text-neutral-800">{summary.noTasksCompleted}</b> task</p>
            </div>
          </div>
          <ChevronRight className="text-neutral-300 group-hover:text-primary transition-colors" size={18} />
        </div>
      </CardHeader>
      
      <CardContent className="p-5 bg-white">
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <p className="text-xs text-neutral-400 italic text-center py-2">Chưa có dữ liệu</p>
          ) : (
            tasks.map((task, index) => (
              <div key={task.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Task Number Badge */}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border 
                    ${task.isCompleted 
                      ? (task.isCorrect ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200') 
                      : 'bg-neutral-50 text-neutral-400 border-neutral-200'}`}>
                    {index + 1}
                  </div>
                  <span className={`text-xs font-medium ${task.isCompleted ? 'text-neutral-700' : 'text-neutral-400'}`}>
                    {task.isCompleted ? (task.isCorrect ? 'Chính xác' : 'Sai kết quả') : 'Chưa làm'}
                  </span>
                </div>
                <div>
                  {task.isCompleted && (
                    task.isCorrect 
                      ? <CheckCircle2 size={16} className="text-green-500" /> 
                      : <XCircle size={16} className="text-red-500" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};