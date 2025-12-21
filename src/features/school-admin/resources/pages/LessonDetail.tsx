'use client';

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/common/components/ui/card';
import { Button } from '@/common/components/ui/button';
import { ArrowLeft, Lock, LockOpen, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import routes from '@/core/configs/routes';
import { Badge } from '@/common/components/ui/badge';
import { formatDateTime } from '@/common/utils/date-time-vn-converter';
import type { Lesson } from '../types/lesson.types';
import { fetchLessonById, updateLessonStatus } from '../services/lesson.services';
import { fetchVRLessons } from '../services/vr-lesson.services';
import type { VRLesson } from '../types/vr-lesson.types';
import { confirmDialog } from '@/common/components/ui/confirm-dialog';
import { useRuntimeConfig } from '@/core/configs/runtime-config';

export default function LessonDetail() {
  const navigate = useNavigate();
  const params = useParams();
  const lessonId = params?.id as string;
  const { config } = useRuntimeConfig();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [vrLessons, setVrLessons] = useState<VRLesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVrLessonsLoading, setIsVrLessonsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const schoolResourceUrl = (config.SCHOOL_URL || import.meta.env.VITE_SCHOOL_URL) + '/api';

  // --- Data Fetching ---
  const loadLessonDetails = useCallback(async () => {
    if (!lessonId) {
      setError('Không tìm thấy bài giảng.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setIsVrLessonsLoading(true);

    try {
      const data = await fetchLessonById(lessonId);
      const vrLessonsData = await fetchVRLessons({ lessonId: lessonId, isPaginated: false });

      if (data) setLesson(data);
      else setError('Lỗi tải thông tin bài giảng.');

      if (vrLessonsData) setVrLessons(vrLessonsData.items);
      else setError('Lỗi tải các bài học VR liên quan.');
    } catch (err) {
      console.error(err);
      setError('Đã xảy ra lỗi khi tải thông tin chi tiết.');
    } finally {
      setIsLoading(false);
      setIsVrLessonsLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    loadLessonDetails();
  }, [loadLessonDetails]);

  // --- Handlers ---
  const handleBack = () => navigate(`${routes.resources}?tab=lesson`);

  const handleStatusChange = async () => {
    if (!lesson) return;

    const newStatus = lesson.status.key === 1 ? 0 : 1;
    const actionText = lesson.status.key === 1 ? 'khóa' : 'mở khóa';

    const result = await confirmDialog(`Bạn có xác nhận ${actionText} bài giảng này không?`);

    if (result) {
      setIsUpdatingStatus(true);
      try {
        await updateLessonStatus(lesson.id, newStatus);
        toast.success('Cập nhật trạng thái bài giảng thành công!');
        loadLessonDetails();
      } catch (err) {
        console.error(err);
        toast.error('Lỗi cập nhật trạng thái bài giảng.');
      } finally {
        setIsUpdatingStatus(false);
      }
    }
  };

  // --- Loading / Error States ---
  if (isLoading || isVrLessonsLoading) {
    return (
      <div className='flex h-full bg-neutral-50 items-center justify-center'>
        <Loader2 className='w-12 h-12 animate-spin text-neutral-400' />
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className='flex h-full bg-neutral-50 items-center justify-center'>
        <Card className='p-8 flex flex-col items-center justify-center text-center'>
          <p className='text-neutral-600'>{error || 'Không tìm thấy bộ môn.'}</p>
          <Button onClick={handleBack} className='mt-4'>
            Quay lại
          </Button>
        </Card>
      </div>
    );
  }

  // --- Main Content ---
  return (
    <div className='flex flex-col h-full bg-neutral-50 overflow-hidden'>
      <div className='flex-1 overflow-y-auto'>
        <div className='max-w-4xl mx-auto px-8 pt-8 pb-24 space-y-8'>
          {/* Header */}
          <div>
            <Button variant='ghost' size='sm' onClick={handleBack} className='mb-6 -ml-2 hover:bg-white/50'>
              <ArrowLeft className='w-4 h-4 mr-2' />
              Quản lý bài giảng
            </Button>

            <div className='flex items-start justify-between'>
              <div>
                <h1 className='text-3xl font-bold text-neutral-900 mb-2 mr-2'>{lesson.name}</h1>
                <div className='flex items-center gap-1 text-neutral-600'>
                  <span className='text-sm font-medium'>Trạng thái:</span>
                  <span
                    className='text-sm font-semibold'
                    style={{
                      color: lesson.status.key === 1 ? '#10b981' : '#f59e0b',
                    }}
                  >
                    {lesson.status.key === 1 ? 'Hoạt động' : 'Không hoạt động'}
                  </span>
                </div>
              </div>

              <Button
                variant='outline'
                size='sm'
                onClick={handleStatusChange}
                disabled={isUpdatingStatus}
                className='text-destructive hover:bg-destructive/10'
              >
                {isUpdatingStatus ? (
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                ) : lesson.status.key === 1 ? (
                  <>
                    <Lock className='w-4 h-4 mr-2' />
                    Khóa bài giảng
                  </>
                ) : (
                  <>
                    <LockOpen className='w-4 h-4 mr-2' />
                    Mở khóa
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Lesson Info */}
          <Card className='overflow-hidden'>
            <div className='flex items-center justify-between bg-neutral-50 px-8 py-5 border-b border-neutral-200'>
              <h3 className='text-lg font-bold text-neutral-900'>Thông tin bài giảng</h3>
            </div>
            <div className='p-8 space-y-4'>
              <div>
                <label className='text-xs font-semibold text-neutral-500 uppercase tracking-wider'>Tên bài giảng</label>
                <div className='bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200 mt-2'>
                  <p className='text-sm text-neutral-900 font-medium'>{lesson.name}</p>
                </div>
              </div>

              <div>
                <label className='text-xs font-semibold text-neutral-500 uppercase tracking-wider'>Mô tả</label>
                <div className='bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200 mt-2 min-h-[100px]'>
                  <p className='text-sm text-neutral-900 whitespace-pre-wrap'>{lesson.description}</p>
                </div>
              </div>

              <div>
                <label className='text-xs font-semibold text-neutral-500 uppercase tracking-wider'>Môn học</label>
                <div className='bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200 mt-2'>
                  <p className='text-sm text-neutral-900 whitespace-pre-wrap'>{lesson.subject.name}</p>
                </div>
              </div>

              <div>
                <label className='text-xs font-semibold text-neutral-500 uppercase tracking-wider'>Tạo bởi</label>
                <div className='bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200 mt-2'>
                  <p className='text-sm text-neutral-900 whitespace-pre-wrap'>
                    {lesson.teacher.firstName} {lesson.teacher.lastName}
                  </p>
                </div>
              </div>

              <div>
                <label className='text-xs font-semibold text-neutral-500 uppercase tracking-wider'>Ngày tạo</label>
                <div className='bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200 mt-2'>
                  <p className='text-sm text-neutral-900'>{formatDateTime(lesson.createdAtVietNam)}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Lesson's PDF resource file (if any) */}
          {lesson.resourceRelativeFilePath && (
            <Card className='overflow-hidden'>
              <div className='flex items-center justify-between bg-neutral-50 px-8 py-5 border-b border-neutral-200'>
                <h3 className='text-lg font-bold text-neutral-900'>Tài liệu đính kèm</h3>
              </div>

              <div className='p-8 space-y-4'>
                <Button
                  onClick={() => window.open(`${schoolResourceUrl}${lesson.resourceRelativeFilePath}`, '_blank')}
                  className='w-fit'
                >
                  Xem PDF
                </Button>

                <div className='border rounded-lg overflow-hidden h-[600px]'>
                  <iframe src={schoolResourceUrl + lesson.resourceRelativeFilePath} className='w-full h-full' />
                </div>
              </div>
            </Card>
          )}

          {/* VR Lessons */}
          <Card className='overflow-hidden'>
            <div className='flex items-center justify-between bg-neutral-50 px-8 py-5 border-b border-neutral-200'>
              <h3 className='text-lg font-bold text-neutral-900'>Danh sách bài học VR</h3>
              <p className='text-sm text-neutral-600 font-medium'>Tổng số: {vrLessons.length}</p>
            </div>
            <div className='p-8 space-y-4'>
              {vrLessons.length === 0 ? (
                <p className='text-neutral-500 text-sm text-center'>Không có bài học VR nào.</p>
              ) : (
                vrLessons.map((v) => (
                  <div
                    key={v.id}
                    className='flex items-center justify-between p-4 rounded-lg bg-neutral-50 border border-neutral-200'
                  >
                    <div className='flex items-center gap-3'>
                      <div
                        className={`w-2 h-2 rounded-full ${v.status.key === 1 ? 'bg-green-500' : 'bg-neutral-400'}`}
                      />
                      <p className='text-sm font-semibold text-neutral-900'>{v.name}</p>
                    </div>
                    <Badge variant={v.status.key === 1 ? 'secondary' : 'default'}>
                      {v.status.key === 1 ? 'Hoạt động' : 'Không hoạt động'}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
