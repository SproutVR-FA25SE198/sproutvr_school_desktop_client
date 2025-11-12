'use client';
import React, { useEffect, useState } from 'react';

interface DurationInputProps {
  value: { minutes: number; seconds: number };
  onChange: (value: { minutes: number; seconds: number }) => void;
  error?: string;
}

export function DurationInput({ value, onChange, error }: DurationInputProps) {
  const [minutes, setMinutes] = useState<number>(value.minutes || 0);
  const [seconds, setSeconds] = useState<number>(value.seconds || 0);
  const [localError, setLocalError] = useState<string | undefined>(error);

  // Keep parent updated
  useEffect(() => {
    onChange({ minutes, seconds });
  }, [minutes, seconds]);

  // Validation: total duration <= 60 minutes
  useEffect(() => {
    const totalSeconds = minutes * 60 + seconds;
    if (totalSeconds > 3600) {
      setLocalError('Maximum allowed duration is 60 minutes');
    } else {
      setLocalError(undefined);
    }
  }, [minutes, seconds]);

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || /^\d+$/.test(val)) {
      const num = Math.min(60, Number(val)); // cap at 60
      setMinutes(num);
      if (num === 60) setSeconds(0); // reset seconds if at max minute
    }
  };

  const handleSecondChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || /^\d+$/.test(val)) {
      const num = Math.min(59, Number(val)); // max 59 seconds
      setSeconds(num);
    }
  };

  return (
    <div className='space-y-2'>
      <label className='text-sm font-medium text-neutral-700'>Thời lượng</label>
      <div className='flex items-center gap-3'>
        {/* Minutes Input */}
        <div className='flex items-center gap-1'>
          <input
            type='text'
            inputMode='numeric'
            value={minutes}
            onChange={handleMinuteChange}
            placeholder='0'
            className={`flex h-10 w-20 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              localError ? 'border-red-500' : ''
            }`}
          />
          <span className='text-sm text-neutral-600'>phút</span>
        </div>

        {/* Seconds Input */}
        <div className='flex items-center gap-1'>
          <input
            type='text'
            inputMode='numeric'
            value={seconds}
            onChange={handleSecondChange}
            placeholder='0'
            className={`flex h-10 w-20 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              localError ? 'border-red-500' : ''
            }`}
          />
          <span className='text-sm text-neutral-600'>giây</span>
        </div>
      </div>
      {(localError || error) && <p className='text-xs text-red-500'>{localError || error}</p>}
    </div>
  );
}
