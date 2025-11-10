'use client';

import { Input } from "@/common/components/ui/input";

interface KeyInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function KeyInput({ value, onChange, error }: KeyInputProps) {
  return (
    <div className='space-y-1'>
      <label className='text-sm font-medium text-neutral-700'>Activation Key</label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder='XXXXX-XXXXX-XXXXX-XXXXX-XXXXX'
        className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none resize-none focus:ring-2 focus:ring-primary ${
          error ? 'border-red-500' : 'border-neutral-300'
        }`}
      />
      {error && <p className='text-xs text-red-500'>{error}</p>}
    </div>
  );
}
