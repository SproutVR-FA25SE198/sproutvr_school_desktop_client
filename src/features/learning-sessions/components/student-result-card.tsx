import { Card, CardHeader, CardTitle, CardContent } from '@/common/components/ui/card';
import { User, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import type { VRDeviceSessionSummary, VRDeviceTaskProgress } from '../types/session-manage.type';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge } from '@/common/components/ui/badge';

interface StudentResultCardProps {
  summary: VRDeviceSessionSummary;
  tasks: VRDeviceTaskProgress[];
}

export const StudentResultCard = ({ summary, tasks }: StudentResultCardProps) => {
  const navigate = useNavigate();

  // Get Session ID from the URL
  const { id: sessionId } = useParams<{ id: string }>();

  // Get Device ID from the summary object
  const deviceId = summary.vrDevice.vrDeviceId;

  // --- Calculate Score (Scale 10) ---
  const totalTasks = tasks.length;
  const correctTasks = tasks.filter(t => t.isCorrect).length;
  
  // If totalTasks is 0, score is 0. Otherwise calculate score / 10.
  const scoreRaw = totalTasks > 0 ? (correctTasks / totalTasks) * 10 : 0;
  
  // Format to 1 decimal place (e.g., "6.7", "10.0")
  const scoreDisplay = scoreRaw === 10 ? "10" : scoreRaw.toFixed(1);

  // --- Determine Color ---
  const getScoreColor = (score: number) => {
    if (score >= 8.0) return 'bg-green-100 text-green-700 border-green-200'; // Good
    if (score >= 5.0) return 'bg-orange-100 text-orange-700 border-orange-200'; // Average
    return 'bg-red-100 text-red-700 border-red-200'; // Bad
  };

  const handleCardClick = () => {
    // Check if we have the session ID
    if (sessionId && deviceId) {
      navigate(`/sessions/${sessionId}/devices/${deviceId}`, {
        state: { tasks: tasks }
      });
    }
  };

  // Sort tasks by Task Number (Ascending)
  const sortedTasks = [...tasks].sort((a, b) => a.vrTask.taskNumber - b.vrTask.taskNumber);

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
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded border border-neutral-200">
                  {summary.vrDevice.deviceName}
                </span>
                <p className="text-xs text-neutral-500">Hoàn thành: <b className="text-neutral-800">{summary.noTasksCompleted}</b> task</p>
              </div>
            </div>
          </div>

          {/* --- Score Badge & Chevron --- */}
          <div className="flex items-center gap-2"> {/* Changed flex-col to items-center gap-2 */}
            <Badge variant="outline" className={`font-bold border ${getScoreColor(scoreRaw)}`}>
              {scoreDisplay}
            </Badge>
            <ChevronRight className="text-neutral-300 group-hover:text-primary transition-colors" size={18} />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-5 bg-white">
        <div className="space-y-4">
          {sortedTasks.length === 0 ? (
            <p className="text-xs text-neutral-400 italic text-center py-2">Chưa có dữ liệu</p>
          ) : (
            sortedTasks.map((task) => (
              <div key={task.id} className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 overflow-hidden">
                  {/* Task Number Badge */}
                  <div className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold border mt-0.5
                    ${task.isCompleted 
                      ? (task.isCorrect ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200') 
                      : 'bg-neutral-50 text-neutral-400 border-neutral-200'}`}>
                    {task.vrTask.taskNumber}
                  </div>
                  
                  {/* Task Description & Status Text */}
                  <div className="flex flex-col min-w-0">
                    <p 
                        className="text-xs text-neutral-600 font-medium line-clamp-1 w-full mb-0.5 group-hover/item:text-neutral-900 transition-colors" 
                        title={task.vrTask.taskDescription}
                    >
                      {task.vrTask.taskDescription || "Nhiệm vụ không có mô tả"}
                    </p>
                    <span className={`text-[10px] font-medium ${task.isCompleted ? 'text-neutral-500' : 'text-neutral-400'}`}>
                      {task.isCompleted ? (task.isCorrect ? 'Chính xác' : 'Sai kết quả') : 'Chưa làm'}
                    </span>
                  </div>
                </div>

                {/* Icon Status */}
                <div className="shrink-0 mt-1">
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