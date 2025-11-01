'use client';

import { taskLocations } from '../services/mock-data';

interface TaskLocationSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function TaskLocationSelect({ value, onChange, error }: TaskLocationSelectProps) {
  return (
    <div className='space-y-2'>
      <label className='text-sm font-medium text-neutral-700'>Task location:</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
          error ? 'border-red-500' : 'border-neutral-300'
        }`}
      >
        <option value=''>Select a location</option>
        {taskLocations.map((location) => (
          <option key={location.id} value={location.id}>
            {location.name}
          </option>
        ))}
      </select>
      {error && <p className='text-xs text-red-500'>{error}</p>}
    </div>
  );
}
