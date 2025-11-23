'use client';

import { Card } from '@/common/components/ui/card';
import { Button } from '@/common/components/ui/button';
import type { BundlePayload } from '@/features/school-admin/bundles/types/bundle.type';
import { Eye, Map, Package } from 'lucide-react';

interface BundleCardProps {
  bundle: BundlePayload;
  onView: (bundle: BundlePayload) => void;
}

export function BundleCard({ bundle, onView }: BundleCardProps) {
  return (
    <Card className="w-full group relative overflow-hidden p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-neutral-500 mb-1 flex items-center">
              <Package className="w-4 h-4 mr-2" />
              Mã Đơn Hàng
            </h3>
            <p className="text-lg text-neutral-900 font-bold font-mono truncate" title={bundle.orderId}>
              {bundle.orderId}
            </p>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-3 mb-5">
        <div className="flex items-center gap-2 text-sm">
          <Map className="w-4 h-4 text-neutral-400 shrink-0" />
          <span className="text-neutral-600">Số lượng học liệu:</span>
          <span className="font-medium text-neutral-900 ml-auto">
            {bundle.mapCount}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-neutral-200/50">
        <Button
          variant="default"
          size="sm"
          className="flex-1 font-semibold shadow-sm"
          onClick={() => onView(bundle)}
        >
          <Eye className="w-4 h-4 mr-2" />
          Xem Chi Tiết
        </Button>
      </div>
    </Card>
  );
}