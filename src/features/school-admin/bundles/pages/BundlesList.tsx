'use client';

import { useNavigate } from 'react-router-dom';
import { Card } from '@/common/components/ui/card';
import { Loader2, Search, WifiOff } from 'lucide-react';
import { useGetMyBundles } from '../hooks/useGetMyBundles';
import type { BundlePayload } from '@/features/school-admin/bundles/types/bundle.type';
import { BundleCard } from '../components/bundle-card';
import routes from '@/core/configs/routes';
import { useState } from 'react';
import { Input } from '@/common/components/ui/input';
import { ApkDownloadAlert } from '../components/apk-download-alert';
import { ActivationDialog } from '../components/dialogs/activation-dialog';
import { useSelector } from 'react-redux';
import type { RootState } from '@/common/store';
import { Button } from '@/common/components/ui/button';

export default function MyBundlesPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get organization id from currently logged in admin
  const organizationId = user?.organizationId!;

  // Fetch all bundles using the new hook
  const { data: bundles, isLoading, isError, refetch } = useGetMyBundles(organizationId);

  // Navigate to the detail page
  const handleViewDetails = (bundle: BundlePayload) => {
    navigate(`${routes.myBundles}/${bundle.orderId}`);
  };

  // Create the filtered list based on search query
  const filteredBundles = bundles?.filter((bundle) => {
    const query = searchQuery.toLowerCase().trim();
    const idMatch = bundle.orderId.toLowerCase().includes(query);
    return idMatch;
  });

  return (
    <div className="flex-1 overflow-y-auto px-8 pt-8 pb-24 bg-neutral-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900 mb-2">
              Danh Sách Học Liệu
            </h2>
            <p className="text-neutral-500">
              Quản lý và tải về các gói học liệu đã kích hoạt của bạn.
            </p>
          </div>

          {/* Group search and activate button */}
          <div className="flex items-center gap-2">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                type="text"
                placeholder="Tìm theo mã đơn hàng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <ActivationDialog />
          </div>
        </div>

        {/* APK Download Alert UI */}
        <ApkDownloadAlert />

        {/* Content Section */}
        {isLoading ? (
          /* --- LOADING STATE --- */
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-neutral-500 mt-4">Đang tải dữ liệu...</p>
          </div>
        ) : isError ? (
          /* --- ERROR STATE --- */
          <Card className="flex flex-col items-center justify-center py-16 text-center border-dashed">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <WifiOff className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Không thể tải danh sách
            </h3>
            <p className="text-neutral-500 max-w-md mb-6">
              Vui lòng kiểm tra lại mạng trường học và thử lại sau.
            </p>
            <Button variant="outline" onClick={() => refetch()}>
              Thử lại
            </Button>
          </Card>
        ) : (
          /* --- SUCCESS STATE --- */
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBundles?.map((bundle) => (
                <BundleCard
                  key={bundle.orderId}
                  bundle={bundle}
                  onView={handleViewDetails}
                />
              ))}
            </div>

            {/* Empty Data State */}
            {!isError && bundles?.length === 0 && (
              <Card className="text-center py-12">
                <p className="text-neutral-500">
                  Không tìm thấy gói học liệu nào đã được kích hoạt.
                </p>
              </Card>
            )}

            {/* Empty Search State */}
            {!isError && bundles && bundles.length > 0 && filteredBundles?.length === 0 && (
              <Card className="text-center py-12">
                <p className="text-neutral-500">
                  Không tìm thấy gói học liệu nào khớp với "{searchQuery}".
                </p>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}