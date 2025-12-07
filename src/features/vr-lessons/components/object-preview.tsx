'use client';

import type { MapObjectRetrieve } from '@/common/types/map.type';

interface ObjectPreviewProps {
  selectedObjectId: string;
  objects: MapObjectRetrieve[];
}

export function ObjectPreview({ selectedObjectId, objects }: ObjectPreviewProps) {
  const selectedObject = objects.find((obj) => obj.id === selectedObjectId);
  return (
    <div className='flex justify-center items-center bg-accent rounded-2xl p-4 h-40'>
      {selectedObject ? (
        <div className='text-center'>
          <img
            src={selectedObject.imageUrl || '/placeholder.svg'}
            alt={selectedObject.name}
            className='w-32 h-32 object-cover rounded-md mx-auto'
          />
          <p className='text-sm font-medium text-neutral-700 mt-2'>{selectedObject.name}</p>
        </div>
      ) : (
        <p className='text-neutral-500 text-sm'>Chọn một đồ vật để xem</p>
      )}
    </div>
  );
}
