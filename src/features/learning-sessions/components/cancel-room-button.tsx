import { Button } from '@/common/components/ui/button';
import { cancelRoom } from '@/core/ipc/grpc';
import { useState } from 'react';
import { ConfirmDialog } from './confirm-dialog';
import { useNavigate } from 'react-router-dom';
import routes from '@/core/configs/routes';

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
      const response = await cancelRoom(vrLearningSessionId);
      console.log('Room cancelled:', response);

      // Response contains: { vr_learning_session_id }
      alert(response.message);
      navigate(vrLessionId ? routes.lessonDetails.replace(':lessonId', vrLessionId) : routes.home);
    } catch (err: any) {
      console.error('CreateRoom error', err);
      alert('Error: ' + err.message);
    }

    setLoading(false);
  }

  return (
    <>
      <Button
        variant={'destructive'}
        onClick={onCancelClick}
        disabled={loading}
        className='bg-transparent border-1 border-destructive text-destructive hover:cursor-pointer hover:text-white'
      >
        {loading ? 'Cancelling...' : 'Cancel Room'}
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
