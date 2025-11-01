'use client';

import { mapObjects } from '../services/mock-data';

interface ObjectPreviewProps {
  selectedObjectId: string;
}

export function ObjectPreview({ selectedObjectId }: ObjectPreviewProps) {
  const selectedObject = mapObjects.find((obj) => obj.id === selectedObjectId);

  return (
    <div className='flex justify-center items-center bg-neutral-100 rounded-lg p-4 h-40'>
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
        <p className='text-neutral-500 text-sm'>Select an object to preview</p>
      )}
    </div>
  );
}
