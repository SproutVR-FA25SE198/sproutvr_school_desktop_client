'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, Loader2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Card } from '@/common/components/ui/card';
import { Input } from '@/common/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/common/components/ui/select';
import { toast } from 'sonner';
import type { SessionListItem } from '../types/session.types';
import { fetchSessions, type FetchSessionsParams } from '../services/session.services';
import { SessionRow } from '../components/session-row';

// Debounce helper
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

const PAGE_SIZE = 10;

export default function SessionsPage() {
  // Data
  const [allSessions, setAllSessions] = useState<SessionListItem[]>([]); // Store ALL data here
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // UI & Filters
  const [filterStatus, setFilterStatus] = useState<number | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [sortBy, setSortBy] = useState<
    'classNameAsc' | 'classNameDesc' | 'createdAtUtcAsc' | 'createdAtUtcDesc'
  >('createdAtUtcDesc');

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Fetch sessions from API 
  const loadSessions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params: FetchSessionsParams = {
        vrLearningSessionStatus: filterStatus === undefined ? undefined : filterStatus,
        sortBy,
        isPaginated: false, 
      };
      
      const { items } = await fetchSessions(params);
      
      setAllSessions(items);
    } catch (e) {
      setError(e as Error);
      toast.error('Không thể tải danh sách phiên học.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [filterStatus, sortBy]); 

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  // Reset page when filters or search change
  useEffect(() => {
    setPageIndex(1);
  }, [filterStatus, debouncedSearchQuery, sortBy]);

  const filteredSessions = useMemo(() => {
    const query = debouncedSearchQuery.toLowerCase();
    if (!query) return allSessions;
    
    return allSessions.filter(
      (s) =>
        s.className?.toLowerCase().includes(query) ||
        s.teacher?.name.toLowerCase().includes(query) ||
        s.vrLesson?.name.toLowerCase().includes(query)
    );
  }, [allSessions, debouncedSearchQuery]);

  const pageCount = Math.ceil(filteredSessions.length / PAGE_SIZE);
  const paginatedSessions = filteredSessions.slice(
    (pageIndex - 1) * PAGE_SIZE,
    pageIndex * PAGE_SIZE
  );

  const renderContent = () => {
    if (isLoading)
      return (
        <div className="flex justify-center items-center h-96">
          <Loader2 className="w-12 h-12 animate-spin text-neutral-400" />
        </div>
      );

    if (error)
      return (
        <Card className="text-center py-12 text-red-600">
          <p>{error.message || 'Đã xảy ra lỗi khi tải dữ liệu.'}</p>
        </Card>
      );

    if (paginatedSessions.length === 0)
      return (
        <Card className="text-center py-12">
          <p className="text-neutral-500">Không tìm thấy phiên học nào theo bộ lọc.</p>
        </Card>
      );

    return (
      <div className="overflow-x-auto border rounded-lg bg-white shadow-sm">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-100 text-neutral-600 text-sm font-semibold">
            <tr>
              <th className="px-4 py-3 text-left">Tên lớp</th>
              <th className="px-4 py-3 text-left">Tạo bởi</th>
              <th className="px-4 py-3 text-left">Học liệu VR</th>
              <th className="px-4 py-3 text-left">Ngày tạo</th>
              <th className="px-4 py-3 text-left">Trạng thái</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="text-sm text-neutral-800">
            {paginatedSessions.map((session) => (
              <SessionRow key={session.id} {...session} />
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto px-8 pt-8 pb-24">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-neutral-900 mb-2">
                  Quản lý phiên học VR
                </h2>
                <p className="text-neutral-500">
                  Danh sách các phiên học VR được lưu trong hệ thống.
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              {/* Search */}
              <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm theo tên lớp, tên giáo viên..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filter buttons */}
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === undefined ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus(undefined)}
                >
                  Tất cả
                </Button>
                <Button
                  variant={filterStatus === 0 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus(0)}
                >
                  Hoàn thành
                </Button>
                <Button
                  variant={filterStatus === 1 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus(1)}
                >
                  Đã hủy
                </Button>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 ml-auto">
                <Select
                  value={sortBy}
                  onValueChange={(v) =>
                    setSortBy(
                      v as
                        | 'classNameAsc'
                        | 'classNameDesc'
                        | 'createdAtUtcAsc'
                        | 'createdAtUtcDesc'
                    )
                  }
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sắp xếp theo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="classNameAsc">Tên lớp (A → Z)</SelectItem>
                    <SelectItem value="classNameDesc">Tên lớp (Z → A)</SelectItem>
                    <SelectItem value="createdAtUtcAsc">Ngày tạo (cũ nhất)</SelectItem>
                    <SelectItem value="createdAtUtcDesc">Ngày tạo (mới nhất)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Content */}
            <div className="mb-6">{renderContent()}</div>

            {/* Pagination */}
            {!isLoading && !error && pageCount > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-neutral-600">
                  Hiển thị <strong>{paginatedSessions.length}</strong> trên tổng{' '}
                  <strong>{filteredSessions.length}</strong> phiên học
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPageIndex(1)}
                    disabled={pageIndex === 1}
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPageIndex((p) => Math.max(1, p - 1))}
                    disabled={pageIndex === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm font-medium px-2">
                    Trang {pageIndex} / {pageCount}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPageIndex((p) => Math.min(pageCount, p + 1))}
                    disabled={pageIndex === pageCount}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPageIndex(pageCount)}
                    disabled={pageIndex === pageCount}
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}