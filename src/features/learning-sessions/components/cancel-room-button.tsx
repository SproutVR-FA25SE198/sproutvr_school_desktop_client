import { Button } from '@/common/components/ui/button';
import { cancelRoom, stopRoomStream } from '@/core/ipc/grpc';
import { useState } from 'react';
import { ConfirmDialog } from './confirm-dialog';
import { useNavigate } from 'react-router-dom';
import routes from '@/core/configs/routes';
import { toast } from 'sonner';

interface CancelRoomButtonProps {
  vrLearningSessionId: string;
  vrLessionId?: string;
}

export function CancelRoomButton({ vrLearningSessionId, vrLessionId }: CancelRoomButtonProps) {
  const [loading, setLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const navigate = useNavigate();

  function onCancelClick() {
    setIsConfirmOpen(true);
    return;
  }

  async function handleConfirmCancel() {
    setLoading(true);

    try {
      // First, cancel the room on the server
      const response = await cancelRoom(vrLearningSessionId);
      console.log('Room cancelled:', response);

      // Then, stop the gRPC stream
      console.log('⏹️ Stopping gRPC stream');
      await stopRoomStream();

      // Response contains: { vr_learning_session_id }
      toast.success('Đã kết thúc phiên học.');
      navigate(vrLessionId ? routes.lessonDetails.replace(':lessonId', vrLessionId) : routes.home);
    } catch (err: any) {
      console.error('CancelRoom error', err);
      toast.error('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button
        variant={'destructive'}
        onClick={onCancelClick}
        disabled={loading}
        className='bg-transparent border-1 border-destructive text-destructive hover:cursor-pointer hover:text-white'
      >
        {loading ? 'Đang kết thúc...' : 'Kết thúc phiên học'}
      </Button>
      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title='Bạn đang kết thúc một phiên học VR'
        question='Bạn có chắc chắn muốn kết thúc phiên học VR?'
        onConfirm={handleConfirmCancel}
        onCancel={() => setIsConfirmOpen(false)}
        confirmText='Kết thúc phiên học'
        cancelText='Quay lại'
      />
    </>
  );
}
