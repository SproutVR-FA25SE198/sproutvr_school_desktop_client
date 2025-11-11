'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/common/components/ui/select';
import type { MapRetrieve } from '@/common/types/map.type';

interface MapSelectProps {
  value: string;
  maps: MapRetrieve[];
  onChange: (value: string) => void;
  error?: string;
}

export function MapSelect({ value, maps, onChange, error }: MapSelectProps) {
  return (
    <div className='space-y-2'>
      <label className='text-sm font-medium text-neutral-700'>Bản đồ</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={error ? 'border-red-500' : ''}>
          <SelectValue placeholder='Chọn bản đồ' />
        </SelectTrigger>
        <SelectContent>
          {maps.map((map) => (
            <SelectItem key={map.id} value={map.id}>
              {map.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className='text-xs text-red-500'>{error}</p>}
    </div>
  );
}
