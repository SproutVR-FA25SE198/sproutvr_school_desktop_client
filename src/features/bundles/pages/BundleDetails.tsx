'use client';

import { useState } from 'react';
import { Card } from '@/common/components/ui/card';
import { Button } from '@/common/components/ui/button';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import routes from '@/core/configs/routes';
import { MapCard } from '../components/map-card';
import { useGetBundleDetails } from '../hooks/useGetBundleDetails';
import { useMarkMapAsDownloaded } from '../hooks/useMapMarkAsDownloaded';
import type { MapPayload } from '@/common/types/bundle.type';
import { useSeedMapBundle } from '../hooks/useSeedMapBundle';
import { toast } from 'sonner';

export default function BundleDetailsPage() {
  const navigate = useNavigate();
  const {orderId} = useParams<{orderId: string}>();

  // TODO: Get organization id from auth context
  const organizationId = 'c0000001-0000-0000-0000-000000000002';

  // Fetch bundle details
  const { 
    data: bundle, 
    isLoading, 
    isError,
    error 
  } = useGetBundleDetails(orderId!, organizationId);
  
  // State for downloading
  const [downloadingMapId, setDownloadingMapId] = useState<string | null>(null);
  
  // Get the mutation function from your hook
  const { mutate: seedMap } = useSeedMapBundle();
  const { mutate: markAsDownloaded } = useMarkMapAsDownloaded();  

  // Go back to bundle lists
  const handleBack = () => {
    navigate(routes.myBundles);
  };

  /**
   * Handles the download logic for a single map.
   *
   * FLOW:
   * 1. Call seed-bundle API.
   * 2. On success, call markAsDownloaded API.
   * 3. On settled (success/error of chain), clear spinner.
   */
  const handleDownload = (map: MapPayload) => {
    // Set local spinner
    setDownloadingMapId(map.mapId);

    // Trigger the seed-bundle import
    seedMap(
      { mapId: map.mapId, downloadUrl: map.downloadUrl }, // Pass new payload
      {
        onSuccess: () => {
          // On successful import, trigger mark as downloaded
          markAsDownloaded(
            { orderItemId: map.orderItemId, organizationId },
            {
              onSuccess: () => {
                // SUCCESS TOAST
                toast.success(
                  `Học liệu "${map.mapName}" đã tải thành công.`,
                );
              },
              onError: (markError: any) => {
                // ERROR TOAST (MarkAsDownloaded failed)
                const message = markError.response?.data?.Message ||
                  'Lỗi khi tải học liệu.';
                
                toast.error(
                  `Nhập thành công, nhưng theo dõi trạng thái tải về thất bại: ${message}`,
                );
              }
            },
          );
        },
        onError: (seedError: any) => {
          // ERROR TOAST (Seed bundle failed)
          const message =
            seedError.response?.data?.Message || 'Lỗi không xác định.';
          
          toast.error(`Nhập học liệu thất bại: ${message}`);
        },
        onSettled: () => {
          // This runs after the entire chain is complete
          setDownloadingMapId(null);
        },
      },
    );
  };

  // --- Handle Loading and Error States ---
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-50">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-500" />
      </div>
    );
  }

  if (isError || !bundle) {
     return (
      <div className="flex h-screen items-center justify-center bg-neutral-50">
        <Card className="p-8 text-center text-red-600">
          <p>Lỗi khi tải chi tiết học liệu:</p>
          <p className="font-mono">{error?.response?.data?.Message || 'Không tìm thấy gói.'}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-8 pt-8 pb-24 bg-neutral-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant='ghost' size='icon' onClick={handleBack} className='rounded-full bg-white shadow-sm'>
            <ChevronLeft className='size-5' />
          </Button>
          <h1 className='text-3xl self-center font-bold text-neutral-900'>
            Chi Tiết Gói Học Liệu
          </h1>
        </div>

        {/* Status overview*/}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card className="p-6">
                <div>
                    <p className="text-sm text-neutral-500 mb-1">Mã Đơn Hàng</p>
                    <p className="text-xl font-bold text-neutral-900 font-mono truncate">
                        {bundle.orderId}
                    </p>
                </div>
            </Card>
            <Card className="p-6">
                <div>
                    <p className="text-sm text-neutral-500 mb-1">Số Học Liệu</p>
                    <p className="text-3xl font-bold text-neutral-900">
                        {bundle.mapCount} {/* <-- Use new mapCount field */}
                    </p>
                </div>
            </Card>
        </div>


        {/* Maps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {bundle.maps.map((map) => (
            <MapCard
              key={map.mapId}
              map={map}
              isDownloaded={map.isDownloaded}
              isDownloading={downloadingMapId !== null}
              isThisDownloading={downloadingMapId === map.mapId}
              onDownload={handleDownload}
            />
          ))}
        </div>

        {bundle.maps.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-neutral-500">Không tìm thấy học liệu nào trong gói này.</p>
          </Card>
        )}
      </div>
    </div>
  );
}