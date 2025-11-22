'use client';

import { useEffect, useState } from 'react';
import { fetchMasterSubjects } from '../services/master-subject.services';
import { fetchSubjects } from '../services/subject.services';
import { fetchMaps } from '../services/map.services';
import { MapRow } from '../components/map-row';
import { SubjectRow } from '../components/subject-row';
import { MasterSubjectRow } from '../components/master-subject-row';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from 'lucide-react';
import { Input } from '@/common/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/common/components/ui/select';
import { Button } from '@/common/components/ui/button';
import { fetchLessons } from '../services/lesson.services';
import { fetchVRLessons } from '../services/vr-lesson.services';
import { VRLessonRow } from '../components/vr-lesson-row';
import { LessonRow } from '../components/lesson-row';
import { useSearchParams } from 'react-router-dom';

export default function ResourcesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'master';
  const [activeTab, setActiveTab] = useState(initialTab);

  const [sortBy, setSortBy] = useState('createdAtUtcDesc');
  const [filterStatus, setFilterStatus] = useState<number | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  const [masterSubjects, setMasterSubjects] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [maps, setMaps] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [vrLessons, setVrLessons] = useState<any[]>([]);

  // Pagination
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch functions
  const loadMasterSubjects = async (page = pageIndex) => {
    const res = await fetchMasterSubjects({
      masterSubjectStatus: filterStatus === undefined ? undefined : filterStatus,
      sortBy,
      pageIndex: page,
      pageSize,
    });
    setMasterSubjects(res.items || []);
    setTotalItems(res.totalItems || 0);
  };

  const loadSubjects = async (page = pageIndex) => {
    const res = await fetchSubjects({
      subjectStatus: filterStatus === undefined ? undefined : filterStatus,
      sortBy,
      pageIndex: page,
      pageSize,
    });
    setSubjects(res.items || []);
    setTotalItems(res.totalItems || 0);
  };

  const loadMaps = async (page = pageIndex) => {
    const res = await fetchMaps({
      mapStatus: filterStatus === undefined ? undefined : filterStatus,
      sortBy,
      pageIndex: page,
      pageSize,
    });
    setMaps(res.items || []);
    setTotalItems(res.totalItems || 0);
  };

  const loadLessons = async (page = pageIndex) => {
    const res = await fetchLessons({
      lessonStatus: filterStatus === undefined ? undefined : filterStatus,
      sortBy,
      pageIndex: page,
      pageSize,
    });
    setLessons(res.items || []);
    setTotalItems(res.totalItems || 0);
  };

  const loadVrLessons = async (page = pageIndex) => {
    const res = await fetchVRLessons({
      vrLessonStatus: filterStatus === undefined ? undefined : filterStatus,
      sortBy,
      pageIndex: page,
      pageSize,
    });
    setVrLessons(res.items || []);
    setTotalItems(res.totalItems || 0);
  };

  // Load initial data
  useEffect(() => {
    loadMasterSubjects();
  }, []);

  // Tab changes and handling URL updates
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab }); 
  };

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  // Refresh when tab/sort/page/filter changes
  useEffect(() => {
    if (activeTab === 'master') loadMasterSubjects();
    else if (activeTab === 'subject') loadSubjects();
    else if (activeTab === 'map') loadMaps();
    else if (activeTab === 'lesson') loadLessons();
    else if (activeTab === 'vrlesson') loadVrLessons();
  }, [activeTab, sortBy, pageIndex, filterStatus]);

  const totalPages = Math.ceil(totalItems / pageSize);

  // Search filtering
  const filterBySearch = (items: any[]) => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLocaleLowerCase();
    return items.filter((item) =>
      Object.values(item).join(' ').toLocaleLowerCase().includes(q)
    );
  };

  const getActiveData = () => {
    if (activeTab === 'master') return filterBySearch(masterSubjects);
    if (activeTab === 'subject') return filterBySearch(subjects);
    if(activeTab === 'map') return filterBySearch(maps);
    if(activeTab === 'lesson') return filterBySearch(lessons);
    return filterBySearch(vrLessons);
  };

  const displayedData = getActiveData();

  return (
    <div className="p-6 space-y-6 overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-neutral-900 mb-2">Quản lý tài nguyên</h2>
          <p className="text-neutral-500">
            Tìm kiếm và cập nhật tài nguyên môn học, học liệu VR, bài học VR, ..., trong hệ thống.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b pb-2">
        <button
          onClick={() => handleTabChange('master')}
          className={`px-4 py-2 font-semibold ${
            activeTab === 'master' ? 'border-b-2 border-green-500 text-green-600' : 'text-neutral-600'
          }`}
        >
          Bộ môn
        </button>
        <button
          onClick={() => handleTabChange('subject')}
          className={`px-4 py-2 font-semibold ${
            activeTab === 'subject' ? 'border-b-2 border-green-500 text-green-600' : 'text-neutral-600'
          }`}
        >
          Môn học
        </button>
        <button
          onClick={() => handleTabChange('map')}
          className={`px-4 py-2 font-semibold ${
            activeTab === 'map' ? 'border-b-2 border-green-500 text-green-600' : 'text-neutral-600'
          }`}
        >
          Học liệu VR
        </button>
        <button
          onClick={() => handleTabChange('lesson')}
          className={`px-4 py-2 font-semibold ${
            activeTab === 'lesson' ? 'border-b-2 border-green-500 text-green-600' : 'text-neutral-600'
          }`}
        >
          Bài giảng
        </button>
        <button
          onClick={() => handleTabChange('vrlesson')}
          className={`px-4 py-2 font-semibold ${
            activeTab === 'vrlesson' ? 'border-b-2 border-green-500 text-green-600' : 'text-neutral-600'
          }`}
        >
          Bài học VR
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left section: Search */}
        <div className="flex items-center gap-3">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Center: Filter buttons */}
        <div className="flex gap-2">
          <Button
            variant={filterStatus === undefined ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus(undefined)}
          >
            Tất cả
          </Button>
          <Button
            variant={filterStatus === 1 ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus(1)}
          >
            Hoạt động
          </Button>
          <Button
            variant={filterStatus === 0 ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus(0)}
          >
            Không hoạt động
          </Button>
        </div>

        {/* Right: Sort dropdown */}
        <div className="flex items-center gap-2 ml-auto">
          <Select
            value={sortBy}
            onValueChange={(v) =>
              setSortBy(v as 'nameAsc' | 'nameDesc' | 'createdAtUtcAsc' | 'createdAtUtcDesc')
            }
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sắp xếp theo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nameAsc">Tên (A → Z)</SelectItem>
              <SelectItem value="nameDesc">Tên (Z → A)</SelectItem>
              <SelectItem value="createdAtUtcAsc">Ngày tạo (cũ nhất)</SelectItem>
              <SelectItem value="createdAtUtcDesc">Ngày tạo (mới nhất)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-neutral-100 text-neutral-600 text-sm font-semibold text-left">
            <tr>
              {activeTab === 'vrlesson' ? (
                <>
                  <th className="px-4 py-2">Tên</th>
                  <th className="px-4 py-2">Mã học liệu VR</th>
                  <th className="px-4 py-2">Bài giảng</th>
                  <th className="px-4 py-2">Thời lượng</th>
                  <th className="px-4 py-2">Ngày tạo</th>
                  <th className="px-4 py-2">Trạng thái</th>
                  <th className="px-4 py-2 text-right">Thao tác</th>
                </>
              ) : activeTab === 'lesson' ? (
                <>
                  <th className="px-4 py-2">Tên</th>
                  <th className="px-4 py-2">Môn học</th>
                  <th className="px-4 py-2">Tạo bởi</th>
                  <th className="px-4 py-2">Ngày tạo</th>
                  <th className="px-4 py-2">Trạng thái</th>
                  <th className="px-4 py-2 text-right">Thao tác</th>
                </>
              ) : activeTab === 'map' ? (
                <>
                  <th className="px-4 py-2">Mã</th>
                  <th className="px-4 py-2">Tên</th>
                  <th className="px-4 py-2">Môn học</th>
                  <th className="px-4 py-2">Ngày tạo</th>
                  <th className="px-4 py-2">Trạng thái</th>
                  <th className="px-4 py-2 text-right">Thao tác</th>
                </>
              ) : activeTab === 'subject' ? (
                <>
                  <th className="px-4 py-2">Tên</th>
                  <th className="px-4 py-2">Bộ môn</th>
                  <th className="px-4 py-2">Ngày tạo</th>
                  <th className="px-4 py-2">Trạng thái</th>
                  <th className="px-4 py-2 text-right">Thao tác</th>
                </>
              ) : (
                <>
                  <th className="px-4 py-2">Tên</th>
                  <th className="px-4 py-2">Ngày tạo</th>
                  <th className="px-4 py-2">Trạng thái</th>
                  <th className="px-4 py-2 text-right">Thao tác</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="text-sm text-neutral-800">
            {displayedData.length > 0 ? (
              displayedData.map((item) =>
                activeTab === 'vrlesson' ? (
                  <VRLessonRow key={item.id} {...item} />
                ) : activeTab === 'lesson' ? (
                  <LessonRow key={item.id} {...item}/>
                ) : activeTab === 'map' ? (
                  <MapRow key={item.id} {...item} />
                ) : activeTab === 'subject' ? (
                  <SubjectRow key={item.id} {...item} />
                ) : (
                  <MasterSubjectRow key={item.id} {...item} />
                )
              )
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-6 text-neutral-500">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pt-4 flex justify-end">
        <div className="flex items-center gap-2">
          {/* First Page */}
          <button
            onClick={() => setPageIndex(1)}
            disabled={pageIndex === 1}
            className="flex items-center justify-center w-9 h-9 border rounded-md hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>

          {/* Previous Page */}
          <button
            onClick={() => setPageIndex((p) => Math.max(1, p - 1))}
            disabled={pageIndex === 1}
            className="flex items-center justify-center w-9 h-9 border rounded-md hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-sm font-medium px-2">
            Trang {pageIndex} / {totalPages || 1}
          </span>

          {/* Next Page */}
          <button
            onClick={() => setPageIndex((p) => Math.min(totalPages, p + 1))}
            disabled={pageIndex >= totalPages}
            className="flex items-center justify-center w-9 h-9 border rounded-md hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Last Page */}
          <button
            onClick={() => setPageIndex(totalPages)}
            disabled={pageIndex >= totalPages}
            className="flex items-center justify-center w-9 h-9 border rounded-md hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
