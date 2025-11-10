'use client';

import type { MapObjectRetrieve } from '@/common/types/map.type';

interface ObjectSelectProps {
  value: string;
  onChange: (value: string) => void;
  objects: MapObjectRetrieve[];
  error?: string;
}

export function ObjectSelect({ value, onChange, error, objects }: ObjectSelectProps) {
  return (
    <div className='space-y-2'>
      <label className='text-sm font-medium text-neutral-700'>Đồ vật:</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
          error ? 'border-red-500' : 'border-neutral-300'
        }`}
      >
        <option value=''>Chọn một đồ vật</option>
        {objects?.map((obj) => (
          <option key={obj.id} value={obj.id}>
            {obj.name}
          </option>
        ))}
      </select>
      {error && <p className='text-xs text-red-500'>{error}</p>}
    </div>
  );
}
