'use client';

import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/common/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { ArrowLeft, User, Gamepad2, CheckCircle2, XCircle, Target, BarChart3, Calendar } from 'lucide-react';
import { Badge } from '@/common/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { useGetStudentDeviceSummary } from '../hooks/useDeviceSummary';

export default function DeviceSummaryDetailsPage() {
  const { sessionId, deviceId } = useParams<{ sessionId: string; deviceId: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useGetStudentDeviceSummary(sessionId || '', deviceId || '');

  if (isLoading) {
    return (
      <div className="flex h-full flex-1 items-center justify-center bg-slate-50/50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) return <div className="p-8 text-center">Không tìm thấy dữ liệu học sinh</div>;

  // Calculate percentages for visual bars
  // Completion Rate: Based on Total Tasks vs Completed
  const completionRate = data.totalTasks > 0 
    ? Math.round((data.noTasksCompleted / data.totalTasks) * 100) 
    : 0;

  // Score Calculation (Scale 10)
  const scoreRaw = data.totalTasks > 0 
    ? (data.noCorrected / data.totalTasks) * 10 
    : 0;

  const scoreDisplay = scoreRaw.toFixed(1);

  // Convert to % for visual board (Score 8.5 -> Progress 85%)
  const scoreBarWidth = scoreRaw * 10;

  return (
    <div className='flex-1 overflow-y-auto bg-slate-50/50 p-8'>
      <div className='max-w-5xl mx-auto space-y-6'>
        
        {/* --- Navigation --- */}
        <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-primary text-slate-500" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
        </Button>

        {/* --- Header Card --- */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
              <User size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">
                  {data.vrLearningSession.className}
                </Badge>
                <span className="text-slate-400 text-xs flex items-center">
                   <Calendar size={12} className="mr-1"/> {new Date(data.createdAtUtc).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">{data.studentName}</h1>
            </div>
          </div>

          {/* Device Info (Hiding ID, showing Serial) */}
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
            <Gamepad2 className="text-slate-400" size={24} />
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Thiết bị sử dụng</p>
              <p className="font-semibold text-slate-700">{data.vrDevice.deviceName}</p>
              <p className="text-xs text-slate-500 font-mono">SN: {data.vrDevice.serialNumber}</p>
            </div>
          </div>
        </div>

        {/* --- Stats Grid --- */}
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
              {/* Visual Bar */}
              <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                <div className="bg-blue-600 h-4 rounded-full transition-all duration-500" style={{ width: `${completionRate}%` }}></div>
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

          {/* Accuracy Stats */}
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-green-50/50 border-b border-slate-100 pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <BarChart3 className="text-green-600" size={20} /> Điểm số
                </CardTitle>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-green-700">{scoreDisplay}</span>
                    <span className="text-sm font-medium text-green-600/70">/ 10</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              {/* Visual Bar */}
              <div className="w-full bg-red-100 rounded-full h-4 overflow-hidden">
                <div 
                    className="bg-green-500 h-4 rounded-full transition-all duration-500" 
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
                
                {/* Changed Label to be more accurate since it includes "Uncompleted" */}
                <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                  <div className="flex items-center gap-2 mb-1">
                    <XCircle size={16} className="text-red-500" />
                    <span className="text-xs font-bold text-red-500 uppercase">Sai / Chưa làm</span>
                  </div>
                  {/* This is effectively the points they lost */}
                  <p className="text-2xl font-bold text-red-800">
                    {data.totalTasks - data.noCorrected}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Helper sub-component
const StatBox = ({ label, value, total, color, bg }: any) => (
  <div className={`p-4 rounded-xl border border-slate-100 ${bg}`}>
    <p className="text-xs font-medium text-slate-500 mb-1 uppercase">{label}</p>
    <div className="flex items-baseline gap-1">
      <span className={`text-2xl font-bold ${color}`}>{value}</span>
      <span className="text-sm text-slate-400">/ {total}</span>
    </div>
  </div>
);