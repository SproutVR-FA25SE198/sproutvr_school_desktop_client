'use client';

import { useEffect, useMemo, useState } from 'react';
import { LessonCard } from './lesson-card';
import { Button } from '@/common/components/ui/button';
import { Search } from 'lucide-react';
import Pagination from '@/common/components/pagination';
import { useNavigate } from 'react-router-dom';
import { usePagination } from '@/common/hooks/usePagination';
import routes from '@/core/configs/routes';
import type { LessonRetrieve } from '../services/lesson.service';
import type { MasterSubjectRetrieve } from '@/common/services/subject.service';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/common/components/ui/select';
import { Input } from '@/common/components/ui/input';

interface LessonsGridProps {
  lessons?: LessonRetrieve[];
  subjects?: MasterSubjectRetrieve[];
}

export function LessonsGrid({ lessons = [], subjects = [] }: LessonsGridProps) {
  const navigate = useNavigate();

  const [selectedSubject, setSelectedSubject] = useState('all');
  const [sortBy, setSortBy] = useState<'nameAsc' | 'nameDesc' | 'createdAtUtcAsc' | 'createdAtUtcDesc'>('nameAsc');
  const [search, setSearch] = useState('');

  const itemsPerPage = 4;

  const filteredLessons = useMemo(() => {
    // Active lessons only
    let result = [...lessons].filter((l) => l.status.key === 1);

    if (selectedSubject !== 'all') {
      result = result.filter((l) => l.masterSubject.name === selectedSubject);
    }

    if (search.trim()) {
      const text = search.toLowerCase();
      result = result.filter((l) => l.name.toLowerCase().includes(text) || l.subject.name.toLowerCase().includes(text));
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'nameAsc':
          return a.name.localeCompare(b.name);
        case 'nameDesc':
          return b.name.localeCompare(a.name);
        case 'createdAtUtcAsc':
          return new Date(a.createdAtUtc).getTime() - new Date(b.createdAtUtc).getTime();
        case 'createdAtUtcDesc':
          return new Date(b.createdAtUtc).getTime() - new Date(a.createdAtUtc).getTime();
        default:
          return 0;
      }
    });

    return result;
  }, [lessons, search, selectedSubject, sortBy]);

  const { currentData, currentPage, totalPages, setPage } = usePagination(filteredLessons, itemsPerPage);

  useEffect(() => {
    setPage(1);
  }, [selectedSubject, search, sortBy]);

  const selectLesson = (lessonId: string) => {
    navigate(routes.lessonDetails.replace(':id', lessonId));
  };

  return (
    <div className='w-full'>
      {/* Top Controls */}
      <div className='flex flex-col gap-3 mb-6 md:flex-row md:items-center md:justify-between'>
        {/* Left: Search */}
        <div className='flex flex-col gap-3 md:flex-row md:items-center md:gap-4 w-full'>
          <div className='relative w-full md:max-w-sm'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400' />
            <Input
              type='text'
              placeholder='Tìm kiếm bài giảng...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='pl-10'
            />
          </div>

          {/* Middle: Sort Dropdown */}
          <Select
            value={sortBy}
            onValueChange={(v) => setSortBy(v as 'nameAsc' | 'nameDesc' | 'createdAtUtcAsc' | 'createdAtUtcDesc')}
          >
            <SelectTrigger className='w-48'>
              <SelectValue placeholder='Sắp xếp theo' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='nameAsc'>Tên (A → Z)</SelectItem>
              <SelectItem value='nameDesc'>Tên (Z → A)</SelectItem>
              <SelectItem value='createdAtUtcAsc'>Ngày tạo (cũ nhất)</SelectItem>
              <SelectItem value='createdAtUtcDesc'>Ngày tạo (mới nhất)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Right: Create Button */}
        <Button
          className='bg-primary text-white hover:bg-primary/90 w-full md:w-auto'
          onClick={() => navigate(routes.lessonCreation)}
        >
          Tạo bài giảng mới
        </Button>
      </div>

      {/* Subject Filter Tabs */}
      <div className='flex gap-2 mb-6 pb-4 border-b border-neutral-200 overflow-x-auto'>
        {subjects.map((subject) => (
          <button
            key={subject.id}
            onClick={() => setSelectedSubject(selectedSubject === subject.name ? 'all' : subject.name)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              selectedSubject === subject.name
                ? 'bg-primary text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            {subject.name}
          </button>
        ))}
      </div>

      {/* Lessons Grid */}
      <div className='grid grid-cols-2 gap-4 mb-8'>
        {currentData.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} onSelect={selectLesson} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />}
    </div>
  );
}
