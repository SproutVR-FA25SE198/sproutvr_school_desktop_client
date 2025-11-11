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
      <label className='text-xl font-bold text-neutral-700'>Nhập Khóa Kích Hoạt Học Liệu</label>
      <div className='text-sm font-normal text-neutral-700 mt-1'>
        Khóa kích hoạt của bạn thường sẽ nằm trong email từ nhà cung cấp chính hoặc một bên thứ ba.
      </div>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder='XXXXX-XXXXX-XXXXX-XXXXX-XXXXX'
        className={`w-full mt-2 px-3 py-2 border rounded-md text-sm focus:outline-none resize-none focus:ring-2 focus:ring-primary ${
          error ? 'border-red-500' : 'border-neutral-300'
        }`}
      />
      {error && <p className='text-xs text-red-500'>{error}</p>}
    </div>
  );
}
