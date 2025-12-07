'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, Loader2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Card } from '@/common/components/ui/card';
import { Input } from '@/common/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/common/components/ui/select';
import { toast } from 'sonner';
import ImportAccountsDialog from '../components/dialogs/import-accounts-dialog';
import { AccountRow } from '../components/account-row';
import { AccountStatus, type Account } from '../types/account.types';
import { fetchAccounts, type FetchAccountsParams } from '../services/account.services';

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

export default function AccountsPage() {
  // Data
  const [allAccounts, setAllAccounts] = useState<Account[]>([]); // Store ALL data here
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // UI & Filters
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<AccountStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [sortBy, setSortBy] = useState<
    'firstNameAsc' | 'firstNameDesc' | 'createdAtUtcAsc' | 'createdAtUtcDesc'
  >('createdAtUtcDesc');

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Fetch accounts from API 
  const loadAccounts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params: FetchAccountsParams = {
        status: filterStatus === 'all' ? undefined : filterStatus,
        sortBy,
        isPaginated: false, 
      };
      
      const { items } = await fetchAccounts(params);
      
      setAllAccounts(items);
    } catch (e) {
      setError(e as Error);
      toast.error('Không thể tải danh sách tài khoản.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [filterStatus, sortBy]);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  // Reset page when filters or search change
  useEffect(() => {
    setPageIndex(1);
  }, [filterStatus, debouncedSearchQuery, sortBy]);

  const filteredAccounts = useMemo(() => {
    const query = debouncedSearchQuery.toLocaleLowerCase();
    if (!query) return allAccounts;
    
    return allAccounts.filter(
      (acc) =>
        acc.fullName?.toLocaleLowerCase().includes(query) ||
        acc.email?.toLocaleLowerCase().includes(query)
    );
  }, [allAccounts, debouncedSearchQuery]);

  const pageCount = Math.ceil(filteredAccounts.length / PAGE_SIZE);
  const paginatedAccounts = filteredAccounts.slice(
    (pageIndex - 1) * PAGE_SIZE,
    pageIndex * PAGE_SIZE
  );

  const handleImportSuccess = () => {
    toast.success('Tải lên thành công!');
    loadAccounts();
  };

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

    if (paginatedAccounts.length === 0)
      return (
        <Card className="text-center py-12">
          <p className="text-neutral-500">Không tìm thấy tài khoản nào theo bộ lọc.</p>
        </Card>
      );

    return (
      <div className="overflow-x-auto border rounded-lg bg-white shadow-sm">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-100 text-neutral-600 text-sm font-semibold">
            <tr>
              <th className="px-4 py-3 text-left">Họ và tên</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Ngày tạo</th>
              <th className="px-4 py-3 text-left">Trạng thái</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="text-sm text-neutral-800">
            {paginatedAccounts.map((account) => (
              <AccountRow key={account.userId} {...account} />
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
                  Quản lý tài khoản giáo viên
                </h2>
                <p className="text-neutral-500">
                  Tìm kiếm, sắp xếp và cập nhật tài khoản giáo viên trong hệ thống.
                </p>
              </div>
              <Button
                variant="default"
                size="lg"
                onClick={() => setIsImportDialogOpen(true)}
              >
                + Thêm tài khoản mới
              </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              {/* Search */}
              <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm theo tên hoặc email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filter buttons */}
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('all')}
                >
                  Tất cả
                </Button>
                <Button
                  variant={filterStatus === AccountStatus.Active ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus(AccountStatus.Active)}
                >
                  Hoạt động
                </Button>
                <Button
                  variant={filterStatus === AccountStatus.Disabled ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus(AccountStatus.Disabled)}
                >
                  Đã khóa
                </Button>
              </div>

              {/* Sort Dropdown (rightmost) */}
              <div className="flex items-center gap-2 ml-auto">
                <Select
                  value={sortBy}
                  onValueChange={(v) =>
                    setSortBy(
                      v as
                        | 'firstNameAsc'
                        | 'firstNameDesc'
                        | 'createdAtUtcAsc'
                        | 'createdAtUtcDesc'
                    )
                  }
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sắp xếp theo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="firstNameAsc">Tên (A → Z)</SelectItem>
                    <SelectItem value="firstNameDesc">Tên (Z → A)</SelectItem>
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
                  Hiển thị <strong>{paginatedAccounts.length}</strong> trên tổng{' '}
                  <strong>{filteredAccounts.length}</strong> tài khoản
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

      {/* Import dialog */}
      <ImportAccountsDialog
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onImport={handleImportSuccess}
      />
    </div>
  );
}