import type { MapRetrieve, TaskLocationRetrieve } from '@/common/types/map.type';

interface MapPreviewProps {
  selectedMapId: string;
  locations?: TaskLocationRetrieve[];
  locationPreviewUrl?: string;
  isLocationPreview?: boolean;
  maps: MapRetrieve[];
  selectedLocationId?: string | null;
}

export function MapPreview({
  selectedMapId,
  maps,
  selectedLocationId,
  locations,
  locationPreviewUrl,
  isLocationPreview,
}: MapPreviewProps) {
  const selectedMap = maps?.find((map) => map.id === selectedMapId);
  const selectedLocation = locations?.find((loc) => loc.id === selectedLocationId);

  return (
    <div className='space-y-2'>
      <div className='h-64 w-full rounded-lg border border-neutral-300 bg-neutral-100 overflow-hidden'>
        {isLocationPreview ? (
          selectedLocation ? (
            <img
              src={selectedLocation.imageUrl || '/placeholder.svg'}
              alt={selectedLocation.name}
              className='w-full h-full object-cover'
            />
          ) : (
            <img
              src={locationPreviewUrl || '/placeholder.svg'}
              alt={selectedMap?.name}
              className='w-full h-full object-cover'
            />
          )
        ) : selectedMap ? (
          <img
            src={selectedMap.imageUrl || '/placeholder.svg'}
            alt={selectedMap.name}
            className='w-full h-full object-cover'
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center text-neutral-400'>
            <p className='text-sm'>Chọn để xem hình ảnh</p>
          </div>
        )}
      </div>
    </div>
  );
}
