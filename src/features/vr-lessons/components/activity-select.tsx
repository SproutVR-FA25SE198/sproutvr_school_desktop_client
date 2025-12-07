'use client';

import type { ActivityTypeRetrieve } from '@/common/types/map.type';

interface ActivitySelectProps {
  value: string;
  onChange: (value: string) => void;
  activityTypes: ActivityTypeRetrieve[];
  error?: string;
}

export function ActivitySelect({ value, onChange, activityTypes, error }: ActivitySelectProps) {
  return (
    <div className='space-y-2'>
      <label className='text-sm font-medium text-neutral-700'>Hoạt động:</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
          error ? 'border-red-500' : 'border-neutral-300'
        }`}
      >
        <option value=''>Chọn hoạt động</option>
        {activityTypes.map((activity) => (
          <option key={activity.id} value={activity.id}>
            {activity.name}
          </option>
        ))}
      </select>
      {error && <p className='text-xs text-red-500'>{error}</p>}
    </div>
  );
}
