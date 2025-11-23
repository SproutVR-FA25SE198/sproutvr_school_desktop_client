import { Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '@/common/components/ui/badge';
import type { VRDeviceTaskProgress } from '@/features/learning-sessions/types/session-manage.type'; // Adjust import

interface TaskHistoryListProps {
  tasks: VRDeviceTaskProgress[];
}

export const TaskHistoryList = ({ tasks }: TaskHistoryListProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
        <Clock size={20} className="text-slate-500" />
        Chi tiết các bước thực hiện
      </h2>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {tasks.length === 0 ? (
          <div className="p-8 text-center text-slate-500 italic bg-slate-50">
            <p>Không có dữ liệu chi tiết.</p>
            <span className="text-xs text-slate-400">
              (Dữ liệu này chỉ hiển thị khi truy cập từ danh sách phiên học)
            </span>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {tasks.map((task) => (
              <div key={task.id} className="p-5 flex gap-4 hover:bg-slate-50/50 transition-colors group">
                
                {/* Task Number Bubble */}
                <div
                  className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${
                    task.isCompleted
                      ? task.isCorrect
                        ? 'bg-green-100 text-green-700 border-green-200'
                        : 'bg-red-100 text-red-700 border-red-200'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                >
                  {task.vrTask.taskNumber}
                </div>

                <div className="flex-1 space-y-2">
                  <p className="text-sm text-slate-800 font-medium leading-relaxed">
                    {task.vrTask.taskDescription}
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-2 py-0.5 border font-semibold ${
                        task.isCompleted
                          ? task.isCorrect
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-slate-50 text-slate-500 border-slate-200'
                      }`}
                    >
                      {task.isCompleted
                        ? task.isCorrect
                          ? 'CHÍNH XÁC'
                          : 'SAI KẾT QUẢ'
                        : 'CHƯA LÀM'}
                    </Badge>

                    {task.completionTimeAtUtc && (
                      <span className="text-xs text-slate-400 flex items-center">
                        <CheckCircle2 size={12} className="mr-1" />
                        Hoàn thành: {new Date(task.completionTimeAtUtc).toLocaleTimeString('vi-VN')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Icon */}
                <div className="shrink-0 pt-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  {task.isCompleted ? (
                    task.isCorrect ? (
                      <CheckCircle2 className="text-green-500" size={24} />
                    ) : (
                      <XCircle className="text-red-500" size={24} />
                    )
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-slate-200 border-dashed" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};