'use client';

import { activityTypes } from '../services/mock-data';

interface ActivitySelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function ActivitySelect({ value, onChange, error }: ActivitySelectProps) {
  return (
    <div className='space-y-2'>
      <label className='text-sm font-medium text-neutral-700'>Activity:</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
          error ? 'border-red-500' : 'border-neutral-300'
        }`}
      >
        <option value=''>Select an activity</option>
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
