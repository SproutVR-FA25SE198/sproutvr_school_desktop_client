import { Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/common/components/ui/dialog';
import { Button } from '@/common/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/common/components/ui/select';
import type { VrLessonRetrieve } from '@/common/types/vr-lesson.type';
import { useState } from 'react';
import { Checkbox } from '@/common/components/ui/checkbox';
import type { CheckedState } from '@radix-ui/react-checkbox';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { useMutation } from '@tanstack/react-query';
import { createRoom } from '@/core/ipc/grpc';
import Loading from '@/common/components/loading';
import { useDispatch } from 'react-redux';
import { setSessionId } from '@/features/learning-sessions/store/sessionSlice';

interface CreateVrLessonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (lessonId: string, vrLesson: VrLessonRetrieve, classroomNumber: string, classroomLetter: string) => void;
  vrLessons: VrLessonRetrieve[];
  vrLessonId?: string;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function CreateVrLessonDialog({
  open,
  onOpenChange,
  onConfirm,
  vrLessons,
  vrLessonId,
  onCancel,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
}: CreateVrLessonDialogProps) {
  const [selectedVrLessonId, setSelectedVrLessonId] = useState<string>(vrLessonId || '');
  const [confirm, setConfirm] = useState<CheckedState>(false);
  const [classroomNumber, setClassroomNumber] = useState('');
  const [classroomLetter, setClassroomLetter] = useState('');
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const inValidData = !confirm || !selectedVrLessonId || classroomNumber.trim() === '' || classroomLetter.trim() === '';

  const dispatch = useDispatch();

  // Hardcoded teacher ID - should be from auth context in production
  const teacherId = '0199f4b1-8487-4352-8a2a-320a00e40e58';

  const { mutate: createRoomMutation } = useMutation({
    mutationFn: async ({ vrLessonId, className }: { vrLessonId: string; className: string }) => {
      setIsCreatingRoom(true);
      return await createRoom(teacherId, vrLessonId, className);
    },
    onSuccess: (response) => {
      setIsCreatingRoom(false);

      dispatch(setSessionId(response.vr_learning_session_id));
    },
    onError: (error: any) => {
      console.error('Create room error:', error);
      alert(`Lỗi khi tạo phòng: ${error?.message || 'Unknown error'}`);
      setIsCreatingRoom(false);
    },
  });
  // Handle classroom number input - only numbers
  const handleClassroomNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value === '') {
      setClassroomNumber(value);
    }
    if (Number(value) <= 12) {
      setClassroomNumber(value);
    } else setClassroomNumber('12');
  };

  // Handle classroom letter input - allow Vietnamese and alphanumeric, no special chars
  const handleClassroomLetterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow letters (including Vietnamese), numbers, and spaces, remove special characters
    const value = e.target.value.replace(/[^a-zA-Z0-9\u00C0-\u1EF9\s]/g, '');
    setClassroomLetter(value);
  };

  const handleSelectVrLesson = () => {
    if (inValidData) {
      return;
    }
    const selectedVrLesson = vrLessons.find((lesson) => lesson.id === selectedVrLessonId);
    const className = `${classroomNumber}${classroomLetter ? ' ' + classroomLetter : ''}`.trim();
    // Only create room if class name is provided
    if (className) {
      setIsCreatingRoom(true);
      createRoomMutation({ vrLessonId: selectedVrLessonId, className });
    }
    onConfirm(selectedVrLessonId, selectedVrLesson || ({} as VrLessonRetrieve), classroomNumber, classroomLetter);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };
  if (isCreatingRoom) return <Loading isLoading={isCreatingRoom} />;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <div className='flex items-center gap-3 mb-2'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-100'>
              <Info className='h-5 w-5 text-blue-600' />
            </div>
            <DialogTitle className='text-lg font-semibold'>Bạn đang tạo một phiên học VR</DialogTitle>
          </div>
          <DialogDescription className='text-neutral-600 text-left pt-2 flex flex-col gap-4'>
            <Select
              value={selectedVrLessonId}
              onValueChange={setSelectedVrLessonId}
              disabled={vrLessonId !== undefined}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Chọn bài học VR' />
              </SelectTrigger>
              <SelectContent>
                {vrLessons.length > 0 ? (
                  vrLessons.map((vrLesson) => (
                    <SelectItem key={vrLesson.id} value={vrLesson.id}>
                      {vrLesson.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className='px-2 py-1.5 text-sm text-neutral-500'>Không có bài học VR nào</div>
                )}
              </SelectContent>
            </Select>
            <div>
              <Label className='text-sm font-medium mb-1.5 block'>Lớp học</Label>
              <div className='flex gap-2'>
                <div className='flex-1'>
                  <Input
                    placeholder='10, 11, 12...'
                    value={classroomNumber}
                    onChange={handleClassroomNumberChange}
                    className='w-full'
                    type='text'
                    inputMode='numeric'
                  />
                </div>
                <div className='flex-1'>
                  <Input
                    placeholder='1, 2, A, B...'
                    value={classroomLetter}
                    onChange={handleClassroomLetterChange}
                    className='w-full'
                  />
                </div>
              </div>
            </div>
          </DialogDescription>
          <p className='text-sm font-medium text-neutral-800 pt-3 flex gap-2'>
            <Checkbox checked={confirm} onCheckedChange={setConfirm} className='mt-1' /> Tôi đã chọn đúng bài học VR và
            đã kiểm tra các kết nối thiết bị cần thiết.
          </p>
        </DialogHeader>
        <DialogFooter className='gap-2 sm:gap-2'>
          <Button type='button' variant='outline' onClick={handleCancel} className='flex-1 hover:cursor-pointer'>
            {cancelText}
          </Button>
          <Button
            variant={'default'}
            disabled={inValidData}
            type='button'
            onClick={handleSelectVrLesson}
            className='flex-1 hover:cursor-pointer'
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
