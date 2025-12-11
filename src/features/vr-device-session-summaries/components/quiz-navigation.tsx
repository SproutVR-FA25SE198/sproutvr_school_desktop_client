import type { VRDeviceTaskProgress } from '@/features/learning-sessions/types/session-manage.type';

interface QuizNavigationProps {
  tasks: VRDeviceTaskProgress[];
  onScrollTo: (index: number) => void;
}

export const QuizNavigation = ({ tasks, onScrollTo }: QuizNavigationProps) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm sticky top-6">
      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
        Question Navigation
      </h3>
      
      <div className="grid grid-cols-5 gap-2">
        {tasks.map((task, index) => {
          // Determine color based on state
          let colorClass = "bg-slate-100 text-slate-400 border-slate-200 hover:border-slate-300"; // Default/Incomplete
          
          if (task.isCompleted) {
            if (task.isCorrect) {
              colorClass = "bg-green-100 text-green-700 border-green-200 hover:bg-green-200 hover:border-green-300";
            } else {
              colorClass = "bg-red-100 text-red-700 border-red-200 hover:bg-red-200 hover:border-red-300";
            }
          }

          return (
            <button
              key={task.id}
              onClick={() => onScrollTo(index)}
              className={`
                h-10 w-full rounded-lg text-sm font-bold border transition-all duration-200
                flex items-center justify-center
                ${colorClass}
              `}
            >
              {task.vrTask.taskNumber}
            </button>
          );
        })}
      </div>

      <div className="mt-6 space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="w-3 h-3 rounded bg-green-500"></div> Chính xác
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="w-3 h-3 rounded bg-red-500"></div> Sai / Chưa đạt
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="w-3 h-3 rounded bg-slate-300"></div> Chưa làm
        </div>
      </div>
    </div>
  );
};