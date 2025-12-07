import { Info } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/common/components/ui/dialog';
import { TEACHER_INSTRUCTIONS } from '../constants';

interface InstructionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InstructionDialog({ open, onOpenChange }: InstructionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-2xl max-h-[80vh] overflow-y-auto gap-2'>
        <DialogHeader>
          <div className='flex items-center gap-3 mb-2'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-100'>
              <Info className='h-5 w-5 text-blue-600' />
            </div>
            <DialogTitle className='text-xl font-semibold'>Hướng dẫn cho giáo viên</DialogTitle>
          </div>
          <DialogDescription className='text-neutral-600 text-left pt-2'>
            Các bước tạo và quản lý phiên học VR
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 mt-4'>
          {TEACHER_INSTRUCTIONS.map((instruction) => (
            <div
              key={instruction.step}
              className='flex gap-4 p-4 rounded-lg border border-neutral-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors'
            >
              <div className='flex-shrink-0'>
                <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-semibold text-sm'>
                  {instruction.step}
                </div>
              </div>
              <div className='flex-1'>
                <h3 className='font-semibold text-neutral-900 mb-1.5'>{instruction.title}</h3>
                <p className='text-sm text-neutral-600 leading-relaxed'>{instruction.content}</p>
              </div>
            </div>
          ))}
        </div>

        <div className='mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg'>
          <p className='text-sm text-amber-800'>
            <span className='font-semibold'>Lưu ý:</span> Luôn kiểm tra kết nối internet và pin thiết bị trước khi bắt
            đầu phiên học. Hãy liên hệ IT support nếu gặp vấn đề kỹ thuật.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
