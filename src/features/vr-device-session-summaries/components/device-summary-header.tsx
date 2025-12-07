import { Button } from '@/common/components/ui/button';
import { Badge } from '@/common/components/ui/badge';
import { ArrowLeft, User, Calendar, Gamepad2 } from 'lucide-react';

interface DeviceSummaryHeaderProps {
  studentName: string;
  className: string;
  createdAtUtc: string;
  deviceName: string;
  serialNumber: string;
  onBack: () => void;
}

export const DeviceSummaryHeader = ({
  studentName,
  className,
  createdAtUtc,
  deviceName,
  serialNumber,
  onBack,
}: DeviceSummaryHeaderProps) => {
  return (
    <div className="space-y-6">
      {/* Navigation */}
      <Button 
        variant="ghost" 
        className="pl-0 hover:bg-transparent hover:text-primary text-slate-500" 
        onClick={onBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
      </Button>

      {/* Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
            <User size={32} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">
                {className}
              </Badge>
              <span className="text-slate-400 text-xs flex items-center">
                <Calendar size={12} className="mr-1" />{' '}
                {new Date(createdAtUtc).toLocaleDateString('vi-VN')}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">{studentName}</h1>
          </div>
        </div>

        {/* Device Info */}
        <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
          <Gamepad2 className="text-slate-400" size={24} />
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Thiết bị sử dụng</p>
            <p className="font-semibold text-slate-700">{deviceName}</p>
            <p className="text-xs text-slate-500 font-mono">SN: {serialNumber}</p>
          </div>
        </div>
      </div>
    </div>
  );
};