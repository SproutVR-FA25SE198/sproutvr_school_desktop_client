import { maps } from '../services/mock-data';

interface MapPreviewProps {
  selectedMapId: string;
}

export function MapPreview({ selectedMapId }: MapPreviewProps) {
  const selectedMap = maps.find((map) => map.id === selectedMapId);

  return (
    <div className='space-y-2'>
      <div className='h-64 w-full rounded-lg border border-neutral-300 bg-neutral-100 overflow-hidden'>
        {selectedMap ? (
          <img
            src={selectedMap.imageUrl || '/placeholder.svg'}
            alt={selectedMap.name}
            className='w-full h-full object-cover'
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center text-neutral-400'>
            <p className='text-sm'>Select a map to preview</p>
          </div>
        )}
      </div>
    </div>
  );
}
