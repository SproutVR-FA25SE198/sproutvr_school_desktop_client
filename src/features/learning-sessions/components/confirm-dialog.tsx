import { MessageCircleWarning } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/common/components/ui/dialog';
import { Button } from '@/common/components/ui/button';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  question?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  question,
  onConfirm,
  onCancel,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <div className='flex items-center gap-3 mb-2'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-red-100'>
              <MessageCircleWarning className='h-5 w-5 text-red-600' />
            </div>
            <DialogTitle className='text-lg font-semibold'>{title}</DialogTitle>
          </div>
          {/* <DialogDescription className='text-neutral-600 text-left pt-2'>{message}</DialogDescription> */}
          {question && <p className='text-sm text-center font-medium text-neutral-800'>{question}</p>}
        </DialogHeader>
        <DialogFooter className='gap-2 sm:gap-2'>
          <Button
            type='button'
            variant={'destructive'}
            onClick={handleConfirm}
            className='flex-1 bg-transparent border-1 border-destructive text-destructive hover:cursor-pointer hover:text-white'
          >
            {confirmText}
          </Button>
          <Button variant={'default'} type='button' onClick={handleCancel} className='flex-1 hover:cursor-pointer'>
            {cancelText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
