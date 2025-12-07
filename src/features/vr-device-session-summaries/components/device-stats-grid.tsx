import { Card, CardHeader, CardTitle, CardContent } from '@/common/components/ui/card';
import { Target, BarChart3, CheckCircle2, XCircle } from 'lucide-react';
import type { VRDeviceSessionSummaryDetail } from '../types/device-summary.type';
import { StatBox } from '../helpers/stat-box-helper';

interface DeviceStatsGridProps {
  data: VRDeviceSessionSummaryDetail;
  completionRate: number;
  scoreRaw: number;
  scoreDisplay: string;
  scoreBarWidth: number;
  theme: {
    headerBg: string;
    borderColor: string;
    iconColor: string;
    textColor: string;
    subTextColor: string;
    barFill: string;
    barTrack: string;
  };
}

export const DeviceStatsGrid = ({
  data,
  completionRate,
  scoreDisplay,
  scoreBarWidth,
  theme,
}: DeviceStatsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Completion Stats */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-blue-50/50 border-b border-slate-100 pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Target className="text-blue-600" size={20} /> Tiến độ hoàn thành
            </CardTitle>
            <span className="text-2xl font-bold text-blue-700">{completionRate}%</span>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <StatBox
              label="Đã hoàn thành"
              value={data.noTasksCompleted}
              total={data.totalTasks}
              color="text-blue-700"
              bg="bg-blue-50"
            />
            <StatBox
              label="Chưa hoàn thành"
              value={data.noTasksUncompleted}
              total={data.totalTasks}
              color="text-slate-500"
              bg="bg-slate-100"
            />
          </div>
        </CardContent>
      </Card>

      {/* Score Stats */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className={`${theme.headerBg} border-b ${theme.borderColor} pb-4`}>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 className={theme.iconColor} size={20} /> Điểm số
            </CardTitle>
            <div className="flex items-baseline gap-1">
              <span className={`text-2xl font-bold ${theme.textColor}`}>{scoreDisplay}</span>
              <span className={`text-sm font-medium ${theme.subTextColor}`}>/ 10</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className={`w-full ${theme.barTrack} rounded-full h-4 overflow-hidden`}>
            <div
              className={`${theme.barFill} h-4 rounded-full transition-all duration-500`}
              style={{ width: `${scoreBarWidth}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-xl border border-green-100">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 size={16} className="text-green-600" />
                <span className="text-xs font-bold text-green-600 uppercase">Chính xác</span>
              </div>
              <p className="text-2xl font-bold text-green-800">{data.noCorrected}</p>
            </div>

            <div className="p-4 bg-red-50 rounded-xl border border-red-100">
              <div className="flex items-center gap-2 mb-1">
                <XCircle size={16} className="text-red-500" />
                <span className="text-xs font-bold text-red-500 uppercase">Sai / Chưa làm</span>
              </div>
              <p className="text-2xl font-bold text-red-800">
                {data.totalTasks - data.noCorrected}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};