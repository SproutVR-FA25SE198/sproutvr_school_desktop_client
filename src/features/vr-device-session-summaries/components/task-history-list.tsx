import { Badge } from '@/common/components/ui/badge';
import { Card, CardContent } from '@/common/components/ui/card';
import type { VRDeviceTaskProgress } from '@/features/learning-sessions/types/session-manage.type';
import { CheckCircle2, Clock, Timer, XCircle } from 'lucide-react';

interface TaskHistoryListProps {
  tasks: VRDeviceTaskProgress[];
  // Typed manually as an object with a mutable 'current' property
  refs: {
    current: { [key: number]: HTMLDivElement | null };
  };
}

// Updated type to accept 'string | null | undefined'
const formatFullDateTime = (isoString?: string | null) => {
  if (!isoString) return '---';
  const date = new Date(isoString);
  const dayStr = date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const timeStr = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${dayStr} ${timeStr}`;
};

export const TaskHistoryList = ({ tasks, refs }: TaskHistoryListProps) => {
  return (
    <div className="space-y-6">
       <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
         Chi tiết các bước thực hiện
       </h2>

      <div className="space-y-4">
        {tasks.map((task, index) => {
            // Determine Styles based on status
            let borderClass = "border-l-4 border-l-slate-300 border-slate-200"; 
            let bgClass = "bg-white";
            let statusIcon = <div className="w-6 h-6 rounded-full border-2 border-slate-300 border-dashed" />;
            let statusText = "Chưa làm";
            let statusColor = "text-slate-500";

            if (task.isCompleted) {
                if (task.isCorrect) {
                    borderClass = "border-l-4 border-l-green-500 border-green-200 shadow-sm shadow-green-50/50";
                    bgClass = "bg-green-50/10";
                    statusIcon = <CheckCircle2 className="w-6 h-6 text-green-600" />;
                    statusText = "Chính xác";
                    statusColor = "text-green-700";
                } else {
                    borderClass = "border-l-4 border-l-red-500 border-red-200 shadow-sm shadow-red-50/50";
                    bgClass = "bg-red-50/10";
                    statusIcon = <XCircle className="w-6 h-6 text-red-600" />;
                    statusText = "Sai kết quả";
                    statusColor = "text-red-700";
                }
            }

            return (
              <div 
                key={task.id} 
                // FIX 3: Added braces { } to ensure the function returns void, not the element
                ref={(el) => { refs.current[index] = el; }} 
                className="scroll-mt-24" 
              >
                <Card className={`overflow-hidden transition-all hover:shadow-md ${borderClass} ${bgClass}`}>
                  <CardContent className="p-0">
                    <div className="p-5 flex gap-5">
                      {/* Left: Task Number */}
                      <div className="shrink-0 flex flex-col items-center gap-2">
                        <span className="text-3xl font-black text-slate-200 select-none">
                            {String(task.vrTask.taskNumber).padStart(2, '0')}
                        </span>
                      </div>

                      {/* Middle: Content */}
                      <div className="flex-1 space-y-3">
                        <div className="flex justify-between items-start">
                             <h3 className="font-semibold text-slate-900 text-lg">
                                {task.vrTask.taskDescription}
                             </h3>
                             <Badge variant="outline" className={`${statusColor} bg-white/50 border-current`}>
                                {statusText}
                             </Badge>
                        </div>

                        {/* Detailed Metadata Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                            {/* Time Completed */}
                            <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-100">
                                <div className="p-1.5 bg-white rounded border border-slate-200 text-blue-500">
                                    <Clock size={16} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold">Thời gian hoàn thành</p>
                                    <p className="text-sm font-medium text-slate-700 font-mono">
                                        {formatFullDateTime(task.completionTimeAtUtc)}
                                    </p>
                                </div>
                            </div>

                            {/* System Status */}
                            <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-100">
                                <div className="p-1.5 bg-white rounded border border-slate-200 text-orange-500">
                                    <Timer size={16} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold">Trạng thái hệ thống</p>
                                    <p className="text-sm font-medium text-slate-700">
                                        {task.isCompleted ? 'Đã ghi nhận' : 'Đang chờ'}
                                    </p>
                                </div>
                            </div>
                        </div>
                      </div>

                      {/* Right: Big Icon Visual */}
                      <div className="shrink-0 flex items-center justify-center pl-4 border-l border-slate-100/50">
                          {statusIcon}
                      </div>
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