import { useState } from 'react';
import { ChevronLeft, X, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import type { VRDeviceTaskProgress } from '@/features/learning-sessions/types/session-manage.type';

interface QuizNavigationDrawerProps {
  tasks: VRDeviceTaskProgress[];
  onScrollTo: (index: number) => void;
}

export const QuizNavigationDrawer = ({ tasks, onScrollTo }: QuizNavigationDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleScrollAndClose = (index: number) => {
    onScrollTo(index);
  };

  return (
    <>
      {/* Trigger Button */}
      <div 
        className={`fixed right-0 top-1/2 -translate-y-1/2 z-40 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-full' : 'translate-x-0'
        }`}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="h-16 w-8 rounded-l-xl rounded-r-none bg-blue-600 hover:bg-blue-700 shadow-lg border-l border-t border-b border-white/20 flex items-center justify-center p-0"
        >
          <ChevronLeft className="text-white" size={20} />
        </Button>
      </div>

      {/* The Sliding Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-slate-200 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-bold text-slate-800">Danh Sách Nhiệm Vụ</h3>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-full"
          >
            <X size={18} />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
          <div className="grid grid-cols-5 gap-2">
            {tasks.map((task, index) => {
              // Determine color based on state
              let colorClass = "bg-slate-50 text-slate-400 border-slate-200 hover:border-slate-300"; // Default
              
              if (task.isCompleted) {
                if (task.isCorrect) {
                  colorClass = "bg-green-100 text-green-700 border-green-200 hover:bg-green-200 hover:border-green-300 font-bold";
                } else {
                  colorClass = "bg-red-100 text-red-700 border-red-200 hover:bg-red-200 hover:border-red-300 font-bold";
                }
              }

              return (
                <button
                  key={task.id}
                  onClick={() => handleScrollAndClose(index)}
                  className={`
                    aspect-square w-full rounded-md text-sm border transition-all duration-200
                    flex items-center justify-center
                    ${colorClass}
                  `}
                >
                  {task.vrTask.taskNumber}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-8 space-y-3 px-1">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Chú thích</h4>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <CheckCircle2 size={16} className="text-green-600" /> 
              <span>Chính xác</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <XCircle size={16} className="text-red-500" /> 
              <span>Sai / Chưa đạt</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="w-4 h-4 rounded-full border-2 border-slate-300 border-dashed" /> 
              <span>Chưa làm</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-center text-xs text-slate-400">
            Tổng số câu hỏi: {tasks.length}
        </div>
      </div>
    </>
  );
};