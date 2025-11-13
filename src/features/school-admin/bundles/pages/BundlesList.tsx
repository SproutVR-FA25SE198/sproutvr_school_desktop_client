'use client';

import { useNavigate } from 'react-router-dom';
import { Card } from '@/common/components/ui/card';
import { DownloadCloud, Loader2, Search } from 'lucide-react';
import { useGetMyBundles } from '../hooks/useGetMyBundles';
import type { BundlePayload } from '@/common/types/bundle.type';
import { BundleCard } from '../components/bundle-card';
import routes from '@/core/configs/routes';
import { useState } from 'react';
import { Input } from '@/common/components/ui/input';
import { ApkDownloadAlert } from '../components/apk-download-alert';

export default function MyBundlesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // TODO: Get organization id from user context/auth state
  const organizationId = 'c0000001-0000-0000-0000-000000000002';

  // Fetch all bundles using the new hook
  const { data: bundles, isLoading, isError, error } = useGetMyBundles(organizationId);

  // Navigate to the detail page
  const handleViewDetails = (bundle: BundlePayload) => {
    navigate(`${routes.myBundles}/${bundle.orderId}`);
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-50">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-500" />
      </div>
    );
  }

  // Create the filtered list based on search query
  const filteredBundles = bundles?.filter((bundle) => {
    const query = searchQuery.toLowerCase().trim();
    const idMatch = bundle.orderId.toLowerCase().includes(query);
    return idMatch;
  });
  
  // Handle error state
  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-50">
        <Card className="p-8 text-center text-red-600">
          <p>Lỗi khi tải danh sách học liệu:</p>
          <p className="font-mono">{error?.response?.data?.Message || error.message}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-8 pt-8 pb-24 bg-neutral-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900 mb-2">
              Danh Sách Học Liệu
            </h2>
            <p className="text-neutral-500">
              Quản lý và tải về các gói học liệu đã kích hoạt của bạn.
            </p>
          </div>

          {/* Add the Search Bar UI */}
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
        </div>

        {/* APK Download Alert UI */}
        <ApkDownloadAlert />

        {/* Bundles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Map over the NEW filtered list */}
          {filteredBundles?.map((bundle) => (
            <BundleCard
              key={bundle.orderId}
              bundle={bundle}
              onView={handleViewDetails}
            />
          ))}
        </div>

        {/* Handle no bundles found */}
        {bundles?.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-neutral-500">
              Không tìm thấy gói học liệu nào đã được kích hoạt.
            </p>
          </Card>
        )}

        {/* Handle no search results */}
        {bundles && bundles.length > 0 && filteredBundles?.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-neutral-500">
              Không tìm thấy gói học liệu nào khớp với "{searchQuery}".
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}