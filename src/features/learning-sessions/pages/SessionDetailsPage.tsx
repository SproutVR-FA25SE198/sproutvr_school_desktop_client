'use client';

import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetSessionDetail } from '../hooks/useSession';
import { SessionHeader } from '../components/session-header';
import { SessionStatsGrid } from '../components/session-stats-grid';
import { StudentListView } from '../components/student-list-view'; 
import { Download, Loader2, Search } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input'; 
import { exportSessionToExcel } from '@/common/utils/export-to-excel';
import { SessionScoreSpectrum } from '../components/session-score-spectrum';

export default function SessionDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session, isLoading } = useGetSessionDetail(id || '');
  
  // State for Search
  const [searchTerm, setSearchTerm] = useState('');

  if (isLoading) {
    return (
      <div className="flex h-full flex-1 items-center justify-center bg-slate-50/50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) return <div className="p-8 text-center">Không tìm thấy phiên học</div>;

  // Filter Logic
  const filteredSummaries = session.vrDeviceSessionSummaries.filter(student => 
    student.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='p-8 h-full overflow-y-auto'>
      <div className='max-w-7xl mx-auto space-y-8'>
        
        {/* Header Section */}
        <SessionHeader session={session} />

        {/* Stats Overview */}
        <SessionStatsGrid session={session} />

        <div className="space-y-4">
            {/* Toolbar: Title + Search + Export */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-neutral-900 pl-1">
                    Danh sách học sinh
                </h2>

                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                    {/* Search Bar */}
                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 h-4 w-4 group-focus-within:text-primary transition-colors" />
                        <Input 
                            placeholder="Tìm kiếm học sinh..." 
                            className="pl-9 bg-white border-neutral-200 focus-visible:ring-primary"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Export Button */}
                    <Button 
                        onClick={() => exportSessionToExcel(session)}
                        className="bg-green-600 hover:bg-green-700 text-white shadow-sm whitespace-nowrap"
                    >
                        <Download size={16} className="mr-2" /> Xuất Excel
                    </Button>
                </div>
            </div>
            
            {/* Student List View */}
            <StudentListView 
                summaries={filteredSummaries} 
                allTasks={session.vrDeviceTaskProgresses}
            />
        </div>

        {/* Score Spectrum */}
        <div className="pt-4">
            <SessionScoreSpectrum 
                summaries={session.vrDeviceSessionSummaries}
                allTasks={session.vrDeviceTaskProgresses}
            />
        </div>

      </div>
    </div>
  );
}