import { Badge } from '@/common/components/ui/badge';
import { Card, CardContent } from '@/common/components/ui/card';
import type { VRDeviceTaskProgress } from '@/features/learning-sessions/types/session-manage.type';
import { 
  CheckCircle2, 
  Clock, 
  Timer, 
  XCircle, 
  Activity, 
  Server, 
  ChevronRight 
} from 'lucide-react';

interface TaskHistoryListProps {
  tasks: VRDeviceTaskProgress[];
  refs: {
    current: { [key: number]: HTMLDivElement | null };
  };
}

// Format: 09/12/2025 14:00:00
const formatFullDateTime = (isoString?: string | null) => {
  if (!isoString) return '---';
  const date = new Date(isoString);
  const dayStr = date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const timeStr = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  return `${dayStr} ${timeStr}`;
};

export const TaskHistoryList = ({ tasks, refs }: TaskHistoryListProps) => {
  return (
    <div className="space-y-8">
       <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
         <Activity className="text-blue-600" />
         Chi Tiết Nhiệm Vụ
       </h2>

      <div className="space-y-6">
        {tasks.map((task, index) => {
            // --- Determine Styles based on status ---
            let borderClass = "border-l-4 border-l-slate-300 border-slate-200"; 
            let bgClass = "bg-white";
            let statusIcon = <div className="w-8 h-8 rounded-full border-2 border-slate-300 border-dashed" />;
            let statusText = "Chưa làm";
            let statusColor = "text-slate-500 bg-slate-100 border-slate-200";

            if (task.isCompleted) {
                if (task.isCorrect) {
                    borderClass = "border-l-4 border-l-green-500 border-green-200 shadow-sm shadow-green-50/50";
                    bgClass = "bg-green-50/5";
                    statusIcon = <CheckCircle2 className="w-8 h-8 text-green-600 drop-shadow-sm" />;
                    statusText = "Chính xác";
                    statusColor = "text-green-700 bg-green-100 border-green-200";
                } else {
                    borderClass = "border-l-4 border-l-red-500 border-red-200 shadow-sm shadow-red-50/50";
                    bgClass = "bg-red-50/5";
                    statusIcon = <XCircle className="w-8 h-8 text-red-600 drop-shadow-sm" />;
                    statusText = "Sai kết quả";
                    statusColor = "text-red-700 bg-red-100 border-red-200";
                }
            }

            return (
              <div 
                key={task.id} 
                ref={(el) => { refs.current[index] = el; }} 
                className="scroll-mt-32 group" 
              >
                <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${borderClass} ${bgClass}`}>
                  <CardContent className="p-0">
                    
                    {/* --- Task Info --- */}
                    <div className="p-6">
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-2 flex-1">
                           <div className="flex items-center gap-3">
                              <Badge variant="outline" className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider bg-slate-900 text-white border-slate-900 shadow-sm">
                                Nhiệm vụ {String(task.vrTask.taskNumber).padStart(2, '0')}
                              </Badge>
                           </div>
                           
                           <h3 className="font-bold text-slate-900 text-lg leading-snug">
                              {task.vrTask.taskDescription}
                           </h3>
                        </div>

                        {/* Status Stamp */}
                        <div className="shrink-0 flex flex-col items-end gap-2">
                           {statusIcon}
                           <Badge variant="outline" className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 ${statusColor}`}>
                              {statusText}
                           </Badge>
                        </div>
                      </div>
                    </div>

                    {/* --- Divider --- */}
                    <div className={`h-px w-full bg-linear-to-r from-transparent via-slate-200 to-transparent`} />

                    {/* --- Bottom Section: Response History / System Log --- */}
                    <div className="px-6 py-4 bg-white/50">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <Server size={12} /> Lịch sử thực hiện
                        </h4>
                        
                        {task.isCompleted ? (
                            <div className="space-y-0 text-sm">
                                {/* Log Entry 1: Submission */}
                                <div className={`flex gap-3 pb-3 relative`}>
                                    <div className={`absolute top-2 left-[7px] w-px h-full bg-slate-200`} /> {/* Line */}
                                    <div className="shrink-0 mt-1.5 w-3.5 h-3.5 rounded-full bg-blue-100 border-2 border-blue-400 z-10" />
                                    <div className="flex-1 bg-slate-50 rounded p-2 border border-slate-100">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-semibold text-slate-700 text-xs">Đã nhận dữ liệu</span>
                                            <span className="font-mono text-[10px] text-slate-400">
                                                {formatFullDateTime(task.completionTimeAtUtc)}
                                            </span>
                                        </div>
                                        <div className="text-xs text-slate-500 flex items-center gap-1">
                                            <Clock size={12} /> Người dùng đã hoàn thành thao tác trên thiết bị
                                        </div>
                                    </div>
                                </div>

                                {/* Log Entry 2: Processing (Fake visual step for detail) */}
                                <div className={`flex gap-3 pb-3 relative`}>
                                    <div className={`absolute top-2 left-[7px] w-px h-full bg-slate-200`} />
                                    <div className="shrink-0 mt-1.5 w-3.5 h-3.5 rounded-full bg-slate-100 border-2 border-slate-300 z-10" />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 text-xs text-slate-400 pl-2">
                                            <Timer size={12} /> Đang kiểm tra kết quả...
                                        </div>
                                    </div>
                                </div>

                                {/* Log Entry 3: Final Result */}
                                <div className={`flex gap-3 relative`}>
                                    <div className={`shrink-0 mt-1.5 w-3.5 h-3.5 rounded-full z-10 border-2 ${
                                        task.isCorrect ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'
                                    }`} />
                                    <div className={`flex-1 rounded p-2 border text-xs flex justify-between items-center ${
                                        task.isCorrect 
                                            ? 'bg-green-50 border-green-100 text-green-800' 
                                            : 'bg-red-50 border-red-100 text-red-800'
                                    }`}>
                                        <span className="font-semibold flex items-center gap-1.5">
                                            {task.isCorrect ? <CheckCircle2 size={14}/> : <XCircle size={14}/>}
                                            Đánh giá hệ thống: {task.isCorrect ? 'CHÍNH XÁC' : 'SAI KẾT QUẢ'}
                                        </span>
                                        <ChevronRight size={14} className="opacity-50"/>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Empty State Log
                            <div className="flex gap-3 relative opacity-50">
                                <div className="shrink-0 mt-1 w-3.5 h-3.5 rounded-full bg-slate-100 border-2 border-slate-300" />
                                <div className="text-xs text-slate-400 italic pt-0.5">
                                    Người dùng chưa hoàn thành nhiệm vụ
                                </div>
                            </div>
                        )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
        })}
      </div>
    </div>
  );
};