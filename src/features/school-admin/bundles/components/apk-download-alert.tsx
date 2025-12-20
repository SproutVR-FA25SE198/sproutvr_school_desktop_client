'use client';

import { Alert, AlertDescription, AlertTitle } from '@/common/components/ui/alert';
import { Button } from '@/common/components/ui/button';
import { DownloadCloud } from 'lucide-react';
import { useRuntimeConfig } from '@/core/configs/runtime-config';

/**
 * A reusable Alert component to prompt the admin to download the latest APK.
 * It pulls the download URL from runtime configuration (modifiable after export).
 */
export function ApkDownloadAlert() {
  const { config } = useRuntimeConfig();
  
  // Get the download link from runtime config (allows modification after export)
  // Falls back to build-time env var, then to '#' if not set
  const apkDownloadLink = config.APK_DOWNLOAD_URL || import.meta.env.VITE_APK_DOWNLOAD_URL || '#';

  // Use the correct Electron API to open the link in the user's default browser
  const handleApkDownload = () => {
    if (apkDownloadLink === '#') {
      console.error('VITE_APK_DOWNLOAD_URL is not set in your .env file.');
      return;
    }

    // Open browser download page
    window.open(apkDownloadLink, '_blank');
  };

  return (
    <Alert className="mb-6 bg-white shadow-sm border-blue-500">
      <DownloadCloud className="h-4 w-4 text-blue-600" />
      <AlertTitle className="font-bold text-neutral-900">
        Tải Về APK Mới Nhất
      </AlertTitle>
      <AlertDescription className="flex flex-col md:flex-row md:items-center md:justify-between">
        <p className="text-neutral-600 mb-3 md:mb-0">
          Để không xảy ra lỗi, vui lòng tải về và cài đặt phiên bản APK mới nhất
          sau mỗi lần mua một gói hàng mới.
        </p>
        <Button onClick={handleApkDownload} size="sm" className="ml-0 md:ml-4 shrink-0">
          <DownloadCloud className="h-4 w-4 mr-2" />
          Tải Ngay
        </Button>
      </AlertDescription>
    </Alert>
  );
}