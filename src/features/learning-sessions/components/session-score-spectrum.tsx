import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { BarChart as BarChartIcon } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import type { VRDeviceSessionSummary, VRDeviceTaskProgress } from '../types/session-manage.type';

interface SessionScoreSpectrumProps {
  summaries: VRDeviceSessionSummary[];
  allTasks: VRDeviceTaskProgress[];
}

interface HistogramBin {
  name: string;   
  count: number;  
  rangeLabel: string;
}

export const SessionScoreSpectrum = ({ summaries, allTasks }: SessionScoreSpectrumProps) => {
  const chartData = useMemo(() => {
    // Calculate raw scores
    const scores = summaries.map(s => {
      const studentTasks = allTasks.filter(t => t.studentName === s.studentName);
      const total = studentTasks.length;
      const correct = studentTasks.filter(t => t.isCorrect).length;
      return total > 0 ? (correct / total) * 10 : 0;
    });

    if (scores.length === 0) return [];

    const binSize = 0.2; 
    const bins: HistogramBin[] = [];
    
    // Exactly 50 bins (0.0 to 9.8). 
    // i goes from 0 to 49.
    const totalBins = 50; 

    for (let i = 0; i < totalBins; i++) {
      // Calculate start based on integer step
      const rawStart = i * binSize;
      
      const binStart = parseFloat(rawStart.toFixed(1));
      const binEnd = parseFloat((rawStart + binSize).toFixed(1));
      
      // Special label for the final bin (9.8)
      const isLastBin = i === totalBins - 1; // Index 49 is the last one (9.8)
      
      const rangeLabel = isLastBin 
        ? `[${binStart} - 10]` 
        : `[${binStart} - ${binEnd})`;

      bins.push({ 
        name: binStart.toString(), 
        count: 0,
        rangeLabel: rangeLabel
      });
    }

    // Distribute scores
    scores.forEach(score => {
      // Logic: floor(score / 0.2)
      let binIndex = Math.floor(score / binSize);
      
      // Score 10.0 / 0.2 = 50. But our max index is 49.
      // We clamp any score >= 10 into the last bin (index 49).
      if (binIndex >= bins.length) {
        binIndex = bins.length - 1;
      }

      const safeIndex = Math.max(0, binIndex);
      if (bins[safeIndex]) {
        bins[safeIndex].count++;
      }
    });

    return bins;
  }, [summaries, allTasks]);

  if (!chartData || chartData.length === 0) return null;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as HistogramBin;
      return (
        <div className="bg-white p-3 border border-neutral-200 shadow-xl rounded-lg text-sm z-50">
          <p className="font-bold text-neutral-800 mb-1">Khoảng điểm: {data.rangeLabel}</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span className="text-neutral-600">Số lượng: <b className="text-neutral-900">{data.count}</b> HS</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-neutral-200 shadow-sm mt-8">
      {/* Header */}
      <CardHeader className="pb-2 border-b border-neutral-100">
        <CardTitle className="text-lg font-bold text-neutral-800 flex items-center gap-2">
          <BarChartIcon size={20} className="text-neutral-500" />
          Phổ điểm phiên học
        </CardTitle>
      </CardHeader>
      
      {/* Content */}
      <CardContent className="p-6">
        <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={chartData} 
                barCategoryGap={1}
                margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                
                <XAxis 
                  dataKey="name" 
                  ticks={['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']}
                  tick={{ fontSize: 12, fill: '#666' }} 
                  label={{ 
                    value: 'Điểm số (Thang 10)', 
                    position: 'insideBottom', 
                    offset: -10,
                    fontSize: 13, 
                    fill: '#888' 
                  }}
                  height={50}
                />
                
                <YAxis 
                  allowDecimals={false} 
                  tick={{ fontSize: 12, fill: '#666' }}
                  label={{ value: 'Số lượng học sinh', angle: -90, position: 'insideLeft', fontSize: 13, fill: '#888' }}
                />
                
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f4f6' }} />
                
                <Bar 
                  dataKey="count" 
                  name="Số lượng" 
                  radius={[2, 2, 0, 0]} 
                  fill="#3b82f6" 
                />
              </BarChart>
            </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};