'use client';

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/common/components/ui/card';
import { Button } from '@/common/components/ui/button';
import { ArrowLeft, Lock, LockOpen, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import routes from '@/core/configs/routes';
import { Badge } from '@/common/components/ui/badge';
import type { Subject } from '../types/subject.types';
import { fetchSubjectById, updateSubjectStatus } from '../services/subject.services';
import type { LessonListItem } from '../types/lesson.types';
import { fetchLessons } from '../services/lesson.services';
import type { MapListItem } from '../types/map.types';
import { fetchMaps } from '../services/map.services';
import { formatDateTime } from '@/common/utils/date-time-vn-converter';
import { confirmDialog } from '@/common/components/ui/confirm-dialog';

export default function SubjectDetail() {
  const navigate = useNavigate();
  const params = useParams();
  const subjectId = params?.id as string;

  const [subject, setSubject] = useState<Subject | null>(null);
  const [lessons, setLessons] = useState<LessonListItem[]>([]);
  const [maps, setMaps] = useState<MapListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLessonsLoading, setIsLessonsLoading] = useState(true);
  const [isMapsLoading, setIsMapsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Data Fetching ---
  const loadSubjectDetails = useCallback(async () => {
    if (!subjectId) {
      setError('Không tìm thấy môn học.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setIsLessonsLoading(true);
    setIsMapsLoading(true);

    try {
      const data = await fetchSubjectById(subjectId);
      const lessonsData = await fetchLessons({ subjectId: subjectId, isPaginated: false });
      const mapsData = await fetchMaps({ subjectId: subjectId, isPaginated: false });

      if (data) setSubject(data);
      else setError('Lỗi tải thông tin môn học.');

      if (lessonsData) setLessons(lessonsData.items);
      else setError('Lỗi tải các bài giảng liên quan.');

      if (mapsData) setMaps(mapsData.items);
      else setError('Lỗi tải các học liệu VR liên quan.');
    } catch (err) {
      console.error(err);
      setError('Đã xảy ra lỗi khi tải thông tin chi tiết.');
    } finally {
      setIsLoading(false);
      setIsLessonsLoading(false);
      setIsMapsLoading(false);
    }
  }, [subjectId]);

  useEffect(() => {
    loadSubjectDetails();
  }, [loadSubjectDetails]);

  // --- Handlers ---
  const handleBack = () => navigate(`${routes.resources}?tab=subject`);

  const handleStatusChange = async () => {
    if (!subject) return;

    const newStatus = subject.status.key === 1 ? 0 : 1;
    const actionText = subject.status.key === 1 ? 'khóa' : 'mở khóa';

    const result = await confirmDialog(`Bạn có xác nhận ${actionText} môn học này không?`);

    if (result) {
      setIsUpdatingStatus(true);
      try {
        await updateSubjectStatus(subject.id, newStatus);
        toast.success('Cập nhật trạng thái môn học thành công!');
        loadSubjectDetails();
      } catch (err) {
        console.error(err);
        toast.error('Lỗi cập nhật trạng thái môn học.');
      } finally {
        setIsUpdatingStatus(false);
      }
    }
  };

  // --- Loading / Error States ---
  if (isLoading || isLessonsLoading || isMapsLoading) {
    return (
      <div className='flex h-full bg-neutral-50 items-center justify-center'>
        <Loader2 className='w-12 h-12 animate-spin text-neutral-400' />
      </div>
    );
  }

  if (error || !subject) {
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
              Quản lý môn học
            </Button>

            <div className='flex items-start justify-between'>
              <div>
                <h1 className='text-3xl font-bold text-neutral-900 mb-2'>{subject.name}</h1>
                <div className='flex items-center gap-1 text-neutral-600'>
                  <span className='text-sm font-medium'>Trạng thái:</span>
                  <span
                    className='text-sm font-semibold'
                    style={{
                      color: subject.status.key === 1 ? '#10b981' : '#f59e0b',
                    }}
                  >
                    {subject.status.key === 1 ? 'Hoạt động' : 'Không hoạt động'}
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
                ) : subject.status.key === 1 ? (
                  <>
                    <Lock className='w-4 h-4 mr-2' />
                    Khóa môn học
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

          {/* Subject Info */}
          <Card className='overflow-hidden'>
            <div className='flex items-center justify-between bg-neutral-50 px-8 py-5 border-b border-neutral-200'>
              <h3 className='text-lg font-bold text-neutral-900'>Thông tin môn học</h3>
            </div>
            {/* Grid layout for image and info */}
            <div className='p-8 grid grid-cols-1 md:grid-cols-3 gap-8'>
              {/* Image Column */}
              <div className='md:col-span-1'>
                <div className='w-full rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100'>
                  <img src={subject.imageUrl} alt={subject.name} className='w-full h-auto' />
                </div>
              </div>

              {/* Info Column */}
              <div className='md:col-span-2 space-y-4'>
                <div>
                  <label className='text-xs font-semibold text-neutral-500 uppercase tracking-wider'>Tên môn học</label>
                  <div className='bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200 mt-2'>
                    <p className='text-sm text-neutral-900 font-medium'>{subject.name}</p>
                  </div>
                </div>

                <div>
                  <label className='text-xs font-semibold text-neutral-500 uppercase tracking-wider'>Mô tả</label>
                  <div className='bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200 mt-2 min-h-[100px]'>
                    <p className='text-sm text-neutral-900 whitespace-pre-wrap'>{subject.description}</p>
                  </div>
                </div>

                <div>
                  <label className='text-xs font-semibold text-neutral-500 uppercase tracking-wider'>Ngày tạo</label>
                  <div className='bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200 mt-2'>
                    <p className='text-sm text-neutral-900'>{formatDateTime(subject.createdAtVietNam)}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Maps */}
          <Card className='overflow-hidden'>
            <div className='flex items-center justify-between bg-neutral-50 px-8 py-5 border-b border-neutral-200'>
              <h3 className='text-lg font-bold text-neutral-900'>Danh sách học liệu VR</h3>
              <p className='text-sm text-neutral-600 font-medium'>Tổng số: {maps.length}</p>
            </div>
            <div className='p-8 space-y-4'>
              {maps.length === 0 ? (
                <p className='text-neutral-500 text-sm text-center'>Không có học liệu VR nào.</p>
              ) : (
                maps.map((m) => (
                  <div
                    key={m.id}
                    className='flex items-center justify-between p-4 rounded-lg bg-neutral-50 border border-neutral-200'
                  >
                    <div className='flex items-center gap-3'>
                      <div
                        className={`w-2 h-2 rounded-full ${m.status.key === 1 ? 'bg-green-500' : 'bg-neutral-400'}`}
                      />
                      <p className='text-sm font-semibold text-neutral-900'>{m.name}</p>
                    </div>
                    <Badge variant={m.status.key === 1 ? 'secondary' : 'default'}>
                      {m.status.key === 1 ? 'Hoạt động' : 'Không hoạt động'}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Lessons */}
          <Card className='overflow-hidden'>
            <div className='flex items-center justify-between bg-neutral-50 px-8 py-5 border-b border-neutral-200'>
              <h3 className='text-lg font-bold text-neutral-900'>Danh sách bài giảng</h3>
              <p className='text-sm text-neutral-600 font-medium'>Tổng số: {lessons.length}</p>
            </div>
            <div className='p-8 space-y-4'>
              {lessons.length === 0 ? (
                <p className='text-neutral-500 text-sm text-center'>Không có bài giảng nào.</p>
              ) : (
                lessons.map((l) => (
                  <div
                    key={l.id}
                    className='flex items-center justify-between p-4 rounded-lg bg-neutral-50 border border-neutral-200'
                  >
                    <div className='flex items-center gap-3'>
                      <div
                        className={`w-2 h-2 rounded-full ${l.status.key === 1 ? 'bg-green-500' : 'bg-neutral-400'}`}
                      />
                      <p className='text-sm font-semibold text-neutral-900'>{l.name}</p>
                    </div>
                    <Badge variant={l.status.key === 1 ? 'secondary' : 'default'}>
                      {l.status.key === 1 ? 'Hoạt động' : 'Không hoạt động'}
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
