'use client';

import { useState, useRef } from 'react';
import { Button } from '@/common/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/common/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { importAccounts } from '../../services/account.services';

interface ImportAccountsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: () => void;
}

export default function ImportAccountsDialog({
  isOpen,
  onClose,
  onImport,
}: ImportAccountsDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast.error('Vui lòng chọn một file để tải lên.');
      return;
    }

    setIsLoading(true);
    try {
      await importAccounts(selectedFile);
      onImport();
      handleClose(); 
    } catch (error) {
      console.error('Import failed:', error);
      toast.error('Tải lên thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm tài khoản</DialogTitle>
          <DialogDescription>
            Thêm tài khoản mới bằng cách tải file Excel.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
            <p className="text-sm text-neutral-600 mb-3">
              {selectedFile ? `Đã chọn: ${selectedFile.name}` : 'Chưa có file nào được chọn'}
            </p>

            <input
              id="file-upload"
              type="file"
              accept=".csv, .xlsx, .xls"
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={isLoading}
              className="hidden"
            />

            <label
              htmlFor="file-upload"
              className={`inline-flex items-center justify-center px-4 py-2 rounded-md font-semibold cursor-pointer transition-colors duration-200 ${
                isLoading
                  ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-primary/90'
              }`}
            >
              {isLoading ? 'Đang tải...' : selectedFile
                ? 'Chọn file khác' : 'Chọn file để tải lên'}
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button variant="default" onClick={handleImport} disabled={isLoading || !selectedFile}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang tạo mới...
              </>
            ) : (
              'Tạo tài khoản'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
