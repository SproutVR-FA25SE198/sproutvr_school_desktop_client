'use client';

import { useState } from 'react';
import { Button } from '@/common/components/ui/button';
import type { LessonRetrieve } from '../services/lesson.service';
import { ChevronRight, Edit, Trash } from 'lucide-react';

interface LessonDetailsHeaderProps {
  lesson: LessonRetrieve;
  totalVrLessons?: number;
}

export function LessonDetailsHeader({ lesson, totalVrLessons }: LessonDetailsHeaderProps) {
  const [openPdf, setOpenPdf] = useState(false);

  const schoolResourceUrl = import.meta.env.VITE_SCHOOL_URL;
  const pdfUrl = lesson.resourceRelativeFilePath
    ? schoolResourceUrl + '/api' + lesson.resourceRelativeFilePath
    : null;

  return (
    <>
      <div className='bg-white rounded-lg p-6 mb-4'>
        <div className='flex items-start justify-between mb-4'>
          <div className='flex-1'>
            <h1 className='text-3xl font-bold text-neutral-900 mb-2'>{lesson?.name}</h1>
            <p className='text-sm text-neutral-600 mb-3'>{lesson.subject.name}</p>
            <p className='text-sm text-neutral-500'>
              Cập nhật lần cuối: {new Date(lesson.createdAtUtc).toLocaleDateString()}
            </p>
          </div>
          <div className='flex gap-2'>
            <Button variant='ghost' size='sm'>
              <Edit /> Chỉnh sửa
            </Button>
            <Button variant='ghost' className='hover:bg-destructive/30' size='sm'>
              <Trash /> Xóa
            </Button>
          </div>
        </div>

        <p className='text-neutral-700 text-sm leading-relaxed mb-4'>{lesson.description}</p>

        <div className='flex gap-6 text-sm'>
          <div>
            <p className='text-neutral-600'>Tổng số bài học VR</p>
            <p className='font-semibold text-neutral-900'>{totalVrLessons || 0}</p>
          </div>
          <div>
            <p className='text-neutral-600'>Trạng thái</p>
            <p className='font-semibold text-neutral-900 capitalize'>{lesson.status.name}</p>
          </div>
        </div>

        {/* PDF LINK */}
        {pdfUrl && (
          <div className='mt-4 pt-4 border-t border-neutral-200'>
            <button
              onClick={() => setOpenPdf(true)}
              className='flex gap-1 text-primary font-medium hover:underline text-sm'
            >
              Tài liệu bài học <ChevronRight className='w-5 h-5' />
            </button>
          </div>
        )}
      </div>

      {/* ---------- PDF MODAL ---------- */}
      {pdfUrl && openPdf && (
        <div
          className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]'
          onClick={() => setOpenPdf(false)}
        >
          <div
            className='bg-white rounded-lg shadow-xl w-[90vw] h-[90vh] overflow-hidden'
            onClick={(e) => e.stopPropagation()} // prevent click from closing
          >
            <div className='flex items-center justify-between p-4 border-b'>
              <h2 className='text-lg font-semibold'>Tài liệu bài học</h2>
              <Button size='sm' variant='outline' onClick={() => setOpenPdf(false)}>Đóng</Button>
            </div>

            <iframe
              src={pdfUrl}
              className='w-full h-full'
            />
          </div>
        </div>
      )}
    </>
  );
}
