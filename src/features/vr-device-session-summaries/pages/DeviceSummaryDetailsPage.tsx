'use client';

import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useGetStudentDeviceSummary } from '../hooks/useDeviceSummary';
import type { VRDeviceTaskProgress } from '@/features/learning-sessions/types/session-manage.type';
import { getScoreTheme } from '../helpers/score-color-helper';
import { DeviceSummaryHeader } from '../components/device-summary-header';
import { DeviceStatsGrid } from '../components/device-stats-grid';
import { TaskHistoryList } from '../components/task-history-list';

export default function DeviceSummaryDetailsPage() {
  const { sessionId, deviceId } = useParams<{ sessionId: string; deviceId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const { data, isLoading } = useGetStudentDeviceSummary(sessionId || '', deviceId || '');

  // Retrieve and sort tasks
  const studentTasks: VRDeviceTaskProgress[] = location.state?.tasks || [];
  const tasksList = [...studentTasks].sort((a, b) => a.vrTask.taskNumber - b.vrTask.taskNumber);

  if (isLoading) {
    return (
      <div className="flex h-full flex-1 items-center justify-center bg-slate-50/50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) return <div className="p-8 text-center">Không tìm thấy dữ liệu học sinh</div>;

  // --- Calculations ---
  const completionRate = data.totalTasks > 0 
    ? Math.round((data.noTasksCompleted / data.totalTasks) * 100) 
    : 0;

  const scoreRaw = data.totalTasks > 0 
    ? (data.noCorrected / data.totalTasks) * 10 
    : 0;

  const scoreDisplay = scoreRaw.toFixed(1);
  const scoreBarWidth = scoreRaw * 10;
  const theme = getScoreTheme(scoreRaw);

  return (
    <div className='flex-1 overflow-y-auto bg-slate-50/50 p-8'>
      <div className='max-w-5xl mx-auto space-y-8'>
        
        {/* Header Section */}
        <DeviceSummaryHeader 
          studentName={data.studentName}
          className={data.vrLearningSession.className}
          createdAtUtc={data.createdAtUtc}
          deviceName={data.vrDevice.deviceName}
          serialNumber={data.vrDevice.serialNumber}
          onBack={() => navigate(-1)}
        />

        {/* Statistics Grid */}
        <DeviceStatsGrid 
          data={data}
          completionRate={completionRate}
          scoreRaw={scoreRaw}
          scoreDisplay={scoreDisplay}
          scoreBarWidth={scoreBarWidth}
          theme={theme}
        />

        {/* Task History */}
        <TaskHistoryList tasks={tasksList} />
      </div>
    </div>
  );
}
