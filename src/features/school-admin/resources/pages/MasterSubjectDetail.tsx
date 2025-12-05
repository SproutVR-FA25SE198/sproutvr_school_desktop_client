'use client';

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/common/components/ui/card';
import { Button } from '@/common/components/ui/button';
import { ArrowLeft, Lock, LockOpen, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import routes from '@/core/configs/routes';
import type { MasterSubject } from '../types/master-subject.types';
import { fetchMasterSubjectById, updateMasterSubjectStatus } from '../services/master-subject.services';
import { Badge } from '@/common/components/ui/badge';
import type { Subject } from '../types/subject.types';
import { fetchSubjects } from '../services/subject.services';
import { formatDateTime } from '@/common/utils/date-time-vn-converter';
import { confirmDialog } from '@/common/components/ui/confirm-dialog';

export default function MasterSubjectDetail() {
  const navigate = useNavigate();
  const params = useParams();
  const masterSubjectId = params?.id as string;

  const [masterSubject, setMasterSubject] = useState<MasterSubject | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubjectsLoading, setIsSubjectsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Data Fetching ---
  const loadMasterSubjectDetails = useCallback(async () => {
    if (!masterSubjectId) {
      setError('Không tìm thấy bộ môn.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setIsSubjectsLoading(true);

    try {
      const data = await fetchMasterSubjectById(masterSubjectId);
      const subjectsData = await fetchSubjects({ masterSubjectId: masterSubjectId, isPaginated: false });

      if (data) setMasterSubject(data);
      else setError('Lỗi tải thông tin bộ môn.');

      if (subjectsData) setSubjects(subjectsData.items);
      else setError('Lỗi tải các môn học liên quan.');
    } catch (err) {
      console.error(err);
      setError('Đã xảy ra lỗi khi tải thông tin chi tiết.');
    } finally {
      setIsLoading(false);
      setIsSubjectsLoading(false);
    }
  }, [masterSubjectId]);

  useEffect(() => {
    loadMasterSubjectDetails();
  }, [loadMasterSubjectDetails]);

  // --- Handlers ---
  const handleBack = () => navigate(`${routes.resources}?tab=master`);

  const handleStatusChange = async () => {
    if (!masterSubject) return;

    const newStatus = masterSubject.status.key === 1 ? 0 : 1;
    const actionText = masterSubject.status.key === 1 ? 'khóa' : 'mở khóa';

    const result = await confirmDialog(`Bạn có xác nhận ${actionText} bộ môn này không?`);

    if (result) {
      setIsUpdatingStatus(true);
      try {
        await updateMasterSubjectStatus(masterSubject.id, newStatus);
        toast.success('Cập nhật trạng thái bộ môn thành công!');
        loadMasterSubjectDetails();
      } catch (err) {
        console.error(err);
        toast.error('Lỗi cập nhật trạng thái bộ môn.');
      } finally {
        setIsUpdatingStatus(false);
      }
    }
  };

  // --- Loading / Error States ---
  if (isLoading || isSubjectsLoading) {
    return (
      <div className='flex h-full bg-neutral-50 items-center justify-center'>
        <Loader2 className='w-12 h-12 animate-spin text-neutral-400' />
      </div>
    );
  }

  if (error || !masterSubject) {
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
              Quản lý bộ môn
            </Button>

            <div className='flex items-start justify-between'>
              <div>
                <h1 className='text-3xl font-bold text-neutral-900 mb-2'>{masterSubject.name}</h1>
                <div className='flex items-center gap-1 text-neutral-600'>
                  <span className='text-sm font-medium'>Trạng thái:</span>
                  <span
                    className='text-sm font-semibold'
                    style={{
                      color: masterSubject.status.key === 1 ? '#10b981' : '#f59e0b',
                    }}
                  >
                    {masterSubject.status.key === 1 ? 'Hoạt động' : 'Không hoạt động'}
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
                ) : masterSubject.status.key === 1 ? (
                  <>
                    <Lock className='w-4 h-4 mr-2' />
                    Khóa bộ môn
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

          {/* Master Subject Info */}
          <Card className='overflow-hidden'>
            <div className='flex items-center justify-between bg-neutral-50 px-8 py-5 border-b border-neutral-200'>
              <h3 className='text-lg font-bold text-neutral-900'>Thông tin bộ môn</h3>
            </div>
            {/* Grid layout for image and info */}
            <div className='p-8 grid grid-cols-1 md:grid-cols-3 gap-8'>
              {/* Image Column */}
              <div className='md:col-span-1'>
                <div className='w-full rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100'>
                  <img src={masterSubject.imageUrl} alt={masterSubject.name} className='w-full h-auto' />
                </div>
              </div>

              {/* Info Column */}
              <div className='md:col-span-2 space-y-4'>
                <div>
                  <label className='text-xs font-semibold text-neutral-500 uppercase tracking-wider'>Tên bộ môn</label>
                  <div className='bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200 mt-2'>
                    <p className='text-sm text-neutral-900 font-medium'>{masterSubject.name}</p>
                  </div>
                </div>

                <div>
                  <label className='text-xs font-semibold text-neutral-500 uppercase tracking-wider'>Mô tả</label>
                  <div className='bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200 mt-2 min-h-[100px]'>
                    <p className='text-sm text-neutral-900 whitespace-pre-wrap'>{masterSubject.description}</p>
                  </div>
                </div>

                <div>
                  <label className='text-xs font-semibold text-neutral-500 uppercase tracking-wider'>Ngày tạo</label>
                  <div className='bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200 mt-2'>
                    <p className='text-sm text-neutral-900'>{formatDateTime(masterSubject.createdAtVietNam)}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Subjects */}
          <Card className='overflow-hidden'>
            <div className='flex items-center justify-between bg-neutral-50 px-8 py-5 border-b border-neutral-200'>
              <h3 className='text-lg font-bold text-neutral-900'>Danh sách môn học</h3>
              <p className='text-sm text-neutral-600 font-medium'>Tổng số: {subjects.length}</p>
            </div>
            <div className='p-8 space-y-4'>
              {subjects.length === 0 ? (
                <p className='text-neutral-500 text-sm text-center'>Không có môn học nào.</p>
              ) : (
                subjects.map((s) => (
                  <div
                    key={s.id}
                    className='flex items-center justify-between p-4 rounded-lg bg-neutral-50 border border-neutral-200'
                  >
                    <div className='flex items-center gap-3'>
                      <div
                        className={`w-2 h-2 rounded-full ${s.status.key === 1 ? 'bg-green-500' : 'bg-neutral-400'}`}
                      />
                      <p className='text-sm font-semibold text-neutral-900'>{s.name}</p>
                    </div>
                    <Badge variant={s.status.key === 1 ? 'secondary' : 'default'}>
                      {s.status.key === 1 ? 'Hoạt động' : 'Không hoạt động'}
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
