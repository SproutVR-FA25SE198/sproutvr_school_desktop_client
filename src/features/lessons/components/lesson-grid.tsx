'use client';

import { useEffect, useMemo, useState } from 'react';
import { MOCK_LESSONS, SUBJECTS } from '../services/lessons-mock-data';
import { LessonCard } from './lesson-card';
import { Button } from '@/common/components/ui/button';
import { BookOpen, SortAsc, SortDesc } from 'lucide-react';
import Pagination from '@/common/components/pagination';
import { useNavigate } from 'react-router-dom';
import { usePagination } from '@/common/hooks/usePagination';
import routes from '@/core/configs/routes';

export function LessonsGrid() {
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [sort, setSort] = useState<'asc' | 'desc'>('asc');
  const navigate = useNavigate();
  const selectLesson = (lessonId: string) => {
    navigate(routes.lessonDetails.replace(':id', lessonId));
  };
  const itemsPerPage = 4;

  const filteredLessons = useMemo(() => {
    const filtered =
      selectedSubject === 'all' ? MOCK_LESSONS : MOCK_LESSONS.filter((lesson) => lesson.subjectId === selectedSubject);
    const sorted = [...filtered].sort((a, b) =>
      sort === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name),
    );
    return sorted;
  }, [selectedSubject, sort]);

  const { currentData, currentPage, setPage, totalPages } = usePagination(filteredLessons, itemsPerPage);

  useEffect(() => {
    setPage(1);
  }, [selectedSubject, sort]);

  return (
    <div className='w-full'>
      {/* Subject Filter Tabs */}
      <div className='flex mb-6 pb-4 border-b justify-between border-neutral-200 overflow-x-auto'>
        <div className='flex gap-2'>
          {SUBJECTS.map((subject) => (
            <button
              key={subject.id}
              onClick={() => {
                setSelectedSubject(subject.id === selectedSubject ? 'all' : subject.id);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-all active:bg-primary active:text-white whitespace-nowrap ${
                selectedSubject === subject.id ? 'bg-primary text-white' : 'text-neutral-700 hover:bg-primary/20 '
              }`}
            >
              {subject.name}
            </button>
          ))}
        </div>

        <div className='flex gap-3 mb-0'>
          <Button
            onClick={() => setSort(sort === 'asc' ? 'desc' : 'asc')}
            variant='outline'
            className='border-neutral-300 bg-transparent'
          >
            {sort === 'asc' ? <SortDesc /> : <SortAsc />} Sắp xếp
          </Button>
          <Button className='bg-primary text-white hover:bg-primary/90' onClick={() => navigate(routes.lessonCreation)}>
            <BookOpen /> Tạo bài học mới
          </Button>
        </div>
      </div>

      {/* Lessons Grid */}
      <div className='grid grid-cols-2 gap-4 mb-6'>
        {currentData.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} onSelect={selectLesson} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />}
    </div>
  );
}
