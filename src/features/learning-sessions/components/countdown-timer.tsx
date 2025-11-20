import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  startUtc: string; // e.g., "2025-01-10T15:00:00Z"
  endUtc: string; // e.g., "2025-01-10T15:30:00Z"
  className?: string; // optional styling override
  text?: string;
}

export default function CountdownTimer({ startUtc, endUtc, className, text }: CountdownTimerProps) {
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

  // Format seconds to HH:mm:ss
  const formatTime = (secs: number | null) => {
    if (secs === null) return '--:--:--';

    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;

    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!startUtc || !endUtc) return;

    const end = new Date(endUtc);

    const updateTimer = () => {
      const now = new Date();
      const diff = Math.floor((end.getTime() - now.getTime()) / 1000);
      setRemainingSeconds(diff > 0 ? diff : 0);
    };

    updateTimer(); // initial calculation
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [startUtc, endUtc]);

  return (
    <div className={className || 'flex flex-col items-center'}>
      <p className='text-xs text-neutral-500 uppercase tracking-wide'>{text || 'Thời gian còn lại'}</p>
      <p className='text-lg font-bold text-secondary'>{formatTime(remainingSeconds)}</p>
    </div>
  );
}
