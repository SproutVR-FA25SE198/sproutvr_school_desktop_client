'use client';

import { Button } from '@/common/components/ui/button';
import { Card } from '@/common/components/ui/card';
import type { MapPayload } from '@/features/school-admin/bundles/types/bundle.type';
import { CheckCircle, Download, Loader2 } from 'lucide-react';

interface MapCardProps {
  map: MapPayload;
  isDownloaded: boolean;
  isDownloading: boolean;
  isThisDownloading: boolean;
  onDownload: (map: MapPayload) => void;
}

export function MapCard({
  map,
  isDownloaded,
  isDownloading,
  isThisDownloading,
  onDownload,
}: MapCardProps) {
  const { mapName, mapCode, imageUrl } = map;

  const handleDownload = () => {
    onDownload(map);
  };

  return (
    <Card className={`group relative overflow-hidden p-0 transition-all duration-300 ${isDownloaded ? 'bg-neutral-50' : ''}`}>
      {/* Image Thumbnail */}
      <div className="aspect-video w-full overflow-hidden bg-neutral-100">
        <img
          src={imageUrl}
          alt={mapName}
          className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${isDownloaded ? 'opacity-60' : ''}`}
        />
      </div>

      {/* Overlay for downloaded items */}
      {isDownloaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <CheckCircle className="h-16 w-16 text-white/80" />
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="mb-4 min-h-[60px]">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-neutral-900 mb-1 truncate" title={mapName}>
                {mapName}
              </h3>
              <p className="text-xs text-neutral-500 font-mono">{mapCode}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-neutral-200/50">
          
          <Button
            variant={isDownloaded ? 'outline' : 'default'}
            size="sm"
            className="flex-1 font-semibold shadow-sm transition-all duration-200"
            onClick={handleDownload}
            // Disable if:
            // 1. It's already downloaded
            // 2. Any other map is "processing" (downloading + marking)
            disabled={isDownloaded || isDownloading}
          >
            {isDownloaded ? (
              <span className="inline-flex items-center text-green-700">
                Đã Tải Về
                <CheckCircle className="ms-2 h-4 w-4" />
              </span>
            ) : isThisDownloading ? (
              <span className="inline-flex items-center">
                Đang Xử Lý...
                <Loader2 className="ms-2 h-4 w-4 animate-spin" />
              </span>
            ) : (
              <span className="inline-flex items-center">
                Tải Về
                <Download className="ms-2 h-4 w-4" />
              </span>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}