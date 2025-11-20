import { Button } from '@/common/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/common/components/ui/select';
import { sendNotification } from '@/core/ipc/grpc';
import { useState } from 'react';
import { NotificationSeverity } from '../services/session-data.type';
import { Input } from '@/common/components/ui/input';
import { Spinner } from '@/common/components/ui/spinner';
import { Send } from 'lucide-react';
import Loading from '@/common/components/loading';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/common/components/ui/tooltip';

interface SendNotificationProps {
  vrLessonId: string;
}

export function SendNotification({ vrLessonId }: SendNotificationProps) {
  const [loading, setLoading] = useState(false);
  const [severity, setSeverity] = useState(NotificationSeverity[0].value);
  const [notification, setNotification] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);

    if (!notification) {
      setError('Nội dung thông báo không được để trống');
      setLoading(false);
      return;
    }

    try {
      await sendNotification(vrLessonId, { text: notification, severity });
      error && setError(null);
      // Response contains: { vr_learning_session_id }
      alert('Gửi' + (severity === 'WARNING' ? ' cảnh báo ' : ' thông báo ') + 'thành công!');
      setNotification('');
      setSeverity(NotificationSeverity[0].value);
    } catch (err: any) {
      console.error('CreateRoom error', err);
      alert('Error: ' + err.message);
    }

    setLoading(false);
  }

  if (loading) return <Loading isLoading={loading} />;

  return (
    <TooltipProvider>
      <div className='flex flex-row items-center gap-4 mr-4'>
        <Tooltip>
          <TooltipTrigger>
            <Input
              placeholder='Nội dung thông báo'
              className={`mb-4 my-auto w-100 ${error ? 'border-red-500' : ''}`}
              value={notification}
              onChange={(e) => setNotification(e.target.value)}
            />
            {error && <TooltipContent className='text-red-500 bg-red-100 text-sm mr-2'>{error}</TooltipContent>}
          </TooltipTrigger>
        </Tooltip>
        <div className='w-35'>
          <Select value={severity} onValueChange={setSeverity}>
            <SelectTrigger className={`${error ? 'border-red-500' : ''}`}>
              <SelectValue placeholder='Chọn bài học' />
            </SelectTrigger>
            <SelectContent>
              {NotificationSeverity.map((severity) => (
                <SelectItem key={severity.value} value={severity.value}>
                  {severity.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          variant={'secondary'}
          onClick={handleClick}
          disabled={loading}
          className={`hover:cursor-pointer  ${severity === 'WARNING' ? 'bg-orange-700 hover:bg-orange-800' : 'bg-blue-700 hover:bg-blue-800'} `}
        >
          {loading ? <Spinner /> : <Send className='w-4 h-4' />}
        </Button>
      </div>
    </TooltipProvider>
  );
}
