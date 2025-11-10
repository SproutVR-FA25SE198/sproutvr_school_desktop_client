'use client';

import type { TaskLocationRetrieve } from '@/common/types/map.type';
interface TaskLocationSelectProps {
  value: string;
  onChange: (value: string) => void;
  locations: TaskLocationRetrieve[];
  blockedLocations?: string[];
  error?: string;
}

export function TaskLocationSelect({ value, onChange, locations, error, blockedLocations }: TaskLocationSelectProps) {
  return (
    <div className='space-y-2'>
      <label className='text-sm font-medium text-neutral-700'>Vị trí nhiệm vụ:</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
          error ? 'border-red-500' : 'border-neutral-300'
        }`}
      >
        <option value=''>Chọn một vị trí</option>
        {locations.map((location) => {
          const disabled = blockedLocations?.includes(location.id);

          return (
            <option
              key={location.id}
              value={location.id}
              disabled={disabled}
              className={disabled ? 'text-neutral-400' : ''}
            >
              {location.name}
              {disabled ? ' (đã dùng)' : ''}
            </option>
          );
        })}
      </select>
      {error && <p className='text-xs text-red-500'>{error}</p>}
    </div>
  );
}
