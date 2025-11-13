'use client';

import { type ChangeEvent, useState } from 'react';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/common/components/ui/dialog';
import { importVRDevices } from '../../services/vr-device.service';
import type { VRDeviceDisplay } from '../../types/device.types';

interface ImportDevicesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (devices: VRDeviceDisplay[]) => void;
}

export default function ImportDevicesDialog({ isOpen, onClose, onImport }: ImportDevicesDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setFile(selectedFile || null);
    setError(null);
  };

  const handleImport = async () => {
    if (!file) {
      setError('Vui lòng chọn file Excel để tải dữ liệu.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await importVRDevices(file);
      onImport([]);
      setFile(null);
      onClose();
    } catch (err) {
      console.error('Import VR devices failed', err);
      setError('Không thể tải file lên. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Nhập danh sách thiết bị VR</DialogTitle>
          <DialogDescription>Chọn file Excel theo mẫu để thêm mới thiết bị VR vào hệ thống.</DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          <div className='border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center'>
            <p className='text-sm text-neutral-600 mb-3'>Tải lên file Excel (.xlsx) chứa danh sách thiết bị</p>
            <Input
              type='file'
              accept='.xlsx,.xls'
              className='w-full'
              placeholder='Chọn file'
              onChange={handleFileChange}
              disabled={isLoading}
            />
            {file && <p className='text-xs text-neutral-500 mt-2'>Đã chọn: {file.name}</p>}
            {error && <p className='text-xs text-error mt-2'>{error}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={onClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button onClick={handleImport} disabled={isLoading || !file} variant='default'>
            {isLoading ? 'Đang tải...' : 'Tải lên'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
