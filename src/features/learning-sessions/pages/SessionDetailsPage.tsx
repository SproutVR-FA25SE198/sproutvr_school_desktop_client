'use client';

import { useParams } from 'react-router-dom';
import { useGetSessionDetail } from '../hooks/useSession';
import { SessionHeader } from '../components/session-header';
import { SessionStatsGrid } from '../components/session-stats-grid';
import { StudentResultCard } from '../components/student-result-card';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { exportSessionToExcel } from '@/common/utils/export-to-excel';

export default function SessionDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session, isLoading } = useGetSessionDetail(id || '');

  if (isLoading) {
    return (
      <div className="flex h-full flex-1 items-center justify-center bg-slate-50/50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) return <div className="p-8 text-center">Không tìm thấy phiên học</div>;

  return (
    <div className='flex-1 overflow-y-auto bg-slate-50/50 p-8'>
      <div className='max-w-7xl mx-auto space-y-8'>
        
        {/* Header Section */}
        <SessionHeader session={session} />

        {/* Actions Bar - Add this new section between Header and Stats */}
        <div className="flex justify-end">
            <Button 
                onClick={() => exportSessionToExcel(session)}
                className="bg-green-600 hover:bg-green-700 text-white shadow-sm"
            >
                <Download size={18} className="mr-2" /> Xuất báo cáo Excel
            </Button>
        </div>

        {/* Stats Overview */}
        <SessionStatsGrid session={session} />

        {/* Student List Section */}
        <div className="space-y-5">
            <h2 className="text-xl font-bold text-neutral-900 pl-3">
              Kết quả chi tiết học sinh
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {session.vrDeviceSessionSummaries.map((summary) => (
                    <StudentResultCard 
                        key={summary.id}
                        summary={summary}
                        tasks={session.vrDeviceTaskProgresses.filter(t => t.studentName === summary.studentName)}
                    />
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}