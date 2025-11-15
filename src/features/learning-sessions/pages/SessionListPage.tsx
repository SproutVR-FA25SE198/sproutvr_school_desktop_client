'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/common/components/ui/button';
import { Card } from '@/common/components/ui/card';
import { Plus, Play } from 'lucide-react';
import routes from '@/core/configs/routes';
import Loading from '@/common/components/loading';
import { ConfirmDialog } from '../components/confirm-dialog';
import { CREATE_SESSION_CONFIRMATION } from '../constants';

export default function SessionListPage() {
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleCreateSessionClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmCreate = () => {
    navigate(routes.vrSessionCreate);
  };

  // TODO: Fetch sessions from API
  const sessions: Array<{
    id: string;
    roomCode: string;
    className: string;
    vrLessonName: string;
    createdAt: string;
    status: string;
  }> = [];

  const isLoading = false;

  if (isLoading) return <Loading isLoading />;

  return (
    <div className="flex-1 overflow-y-auto border-r border-neutral-200 p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-1">Danh sách phiên học</h2>
            <p className="text-neutral-500 text-sm">Xem lại các phiên học VR đã tạo</p>
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={handleCreateSessionClick}
          >
            <Plus size={16} className="mr-2" />
            Tạo phiên học mới
          </Button>
        </div>
      </div>

      {sessions.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-neutral-500 mb-4">Chưa có phiên học nào được tạo.</p>
          <Button
            variant="outline"
            onClick={handleCreateSessionClick}
          >
            <Plus size={16} className="mr-2" />
            Tạo phiên học đầu tiên
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.map((session) => (
            <Card key={session.id} className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-1">{session.className}</h3>
                  <p className="text-sm text-neutral-600">{session.vrLessonName}</p>
                </div>
                <div className="px-2 py-1 bg-primary/10 rounded text-xs font-mono font-bold text-primary">
                  {session.roomCode}
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-neutral-500 mb-3">
                <span>{new Date(session.createdAt).toLocaleDateString('vi-VN')}</span>
                <span className={`px-2 py-1 rounded ${session.status === 'Active'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-neutral-100 text-neutral-600'
                  }`}>
                  {session.status}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => navigate(
                  routes.learningSessionMonitoring.replace(':id', session.id),
                  { state: { roomCode: session.roomCode, sessionId: session.id } }
                )}
              >
                <Play size={14} className="mr-2" />
                Xem chi tiết
              </Button>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title={CREATE_SESSION_CONFIRMATION.title}
        message={CREATE_SESSION_CONFIRMATION.message}
        question={CREATE_SESSION_CONFIRMATION.question}
        onConfirm={handleConfirmCreate}
        confirmText="Tiếp tục"
        cancelText="Hủy"
      />
    </div>
  );
}

