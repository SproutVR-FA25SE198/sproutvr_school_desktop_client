'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Textarea } from '@/common/components/ui/textarea';
import { Label } from '@/common/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/common/components/ui/dialog';
import { updateLesson, type LessonRetrieve } from '../../services/lesson.service';

interface UpdateLessonDialogProps {
  lesson: LessonRetrieve;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function UpdateLessonDialog({ lesson, open, onOpenChange, onSuccess }: UpdateLessonDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (open && lesson) {
      setName(lesson.name || '');
      setDescription(lesson.description || '');
      setSelectedFile(null);
    }
  }, [open, lesson]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        toast.error('Vui lòng chỉ chọn file PDF.');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      toast.error('Tên và mô tả không được để trống.');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('Name', name);
      formData.append('Description', description);
      
      if (selectedFile) {
        formData.append('ResourceFile', selectedFile);
      }

      await updateLesson(lesson.id, formData);
      toast.success('Cập nhật bài giảng thành công!');
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error('Lỗi khi cập nhật bài giảng.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa bài giảng</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className='space-y-4 py-2'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Tên bài giảng <span className='text-red-500'>*</span></Label>
            <Input 
              id='name' 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder='Nhập tên bài giảng'
              disabled={isLoading}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='description'>Mô tả <span className='text-red-500'>*</span></Label>
            <Textarea 
              id='description' 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder='Nhập mô tả bài giảng'
              className='min-h-[100px]'
              disabled={isLoading}
            />
          </div>

          <div className='space-y-2'>
            <Label>Tài liệu (PDF)</Label>
            
            {!selectedFile && lesson.resourceRelativeFilePath && (
               <div className='flex items-center gap-2 text-sm text-neutral-600 bg-neutral-50 p-2 rounded border border-neutral-200 mb-2'>
                  <span className='truncate max-w-[250px]'>
                    Hiện tại: ...{lesson.resourceRelativeFilePath.split('/').pop()}
                  </span>
               </div>
            )}

            <div className='flex items-center gap-3'>
               <Button
                 type='button'
                 variant='outline'
                 size='sm'
                 className='relative'
                 disabled={isLoading}
               >
                 <Upload className='w-4 h-4 mr-2' />
                 {selectedFile ? 'Thay đổi file' : 'Chọn file mới'}
                 <input 
                   type='file' 
                   accept='application/pdf'
                   className='absolute inset-0 opacity-0 cursor-pointer'
                   onChange={handleFileChange}
                 />
               </Button>
               
               {selectedFile && (
                 <div className='flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded'>
                   <span className='truncate max-w-[200px]'>{selectedFile.name}</span>
                   <button 
                     type='button' 
                     onClick={() => setSelectedFile(null)}
                     className='hover:text-blue-800'
                   >
                     <X className='w-3 h-3' />
                   </button>
                 </div>
               )}
            </div>
          </div>

          <DialogFooter className='mt-6'>
            <Button type='button' variant='ghost' onClick={() => onOpenChange(false)} disabled={isLoading}>
              Hủy
            </Button>
            <Button type='submit' disabled={isLoading}>
              {isLoading && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}