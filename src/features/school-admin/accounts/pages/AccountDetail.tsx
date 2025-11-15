"use client";

import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/common/components/ui/card";
import { Button } from "@/common/components/ui/button";
import { Badge } from "@/common/components/ui/badge";
import { ArrowLeft, Lock, LockOpen, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { AccountDetail } from "../types/account.types";
import { AccountStatus, AccountDetailLessonStatus, getStatusLabel } from "../types/account.types";
import { fetchAccountById, updateAccountStatus } from "../services/account.services";
import routes from "@/core/configs/routes";
import { formatDateTime } from "@/common/utils/date-time-vn-converter";

export default function AccountDetailPage() {
  const navigate = useNavigate();
  const params = useParams();
  const accountId = params?.id as string;

  const [accountDetail, setAccountDetail] = useState<AccountDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Data Fetching ---
  const loadAccountDetails = useCallback(async () => {
    if (!accountId) {
      setError("Không tìm thấy tài khoản giáo viên.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await fetchAccountById(accountId);
      if (data) setAccountDetail(data);
      else setError("Không tìm thấy tài khoản giáo viên.");
    } catch (err) {
      console.error(err);
      setError("Đã xảy ra lỗi khi tải thông tin chi tiết.");
    } finally {
      setIsLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    loadAccountDetails();
  }, [loadAccountDetails]);

  // --- Handlers ---
  const handleBack = () => navigate(routes.accounts);

  const handleStatusChange = async () => {
    if (!accountDetail) return;
    const isActivating = accountDetail.status.key === AccountStatus.Disabled;
    const newStatus = isActivating ? AccountStatus.Active : AccountStatus.Disabled;
    const actionText = isActivating ? "mở khóa" : "khóa";

    if (window.confirm(`Bạn có chắc bạn muốn ${actionText} tài khoản này?`)) {
      setIsUpdatingStatus(true);
      try {
        await updateAccountStatus(accountDetail.teacherId, newStatus);
        toast.success("Cập nhật trạng thái tài khoản thành công!");
        loadAccountDetails();
      } catch (err) {
        console.error(err);
        toast.error("Cập nhật trạng thái tài khoản thất bại.");
      } finally {
        setIsUpdatingStatus(false);
      }
    }
  };

  const formatDateOnly = (dateString: string | null) => {
    if (!dateString) return "Chưa cập nhật";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // --- Loading / Error States ---
  if (isLoading) {
    return (
      <div className="flex h-full bg-neutral-50 items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (error || !accountDetail) {
    return (
      <div className="flex h-full bg-neutral-50 items-center justify-center">
        <Card className="p-8 flex flex-col items-center justify-center text-center">
          <p className="text-neutral-600">{error || "Không tìm thấy tài khoản."}</p>
          <Button onClick={handleBack} className="mt-4">
            Quay lại
          </Button>
        </Card>
      </div>
    );
  }

  // --- Main Content ---
  return (
    <div className="flex flex-col h-full bg-neutral-50 overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-8 pt-8 pb-24 space-y-8">
          {/* Header */}
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="mb-6 -ml-2 hover:bg-white/50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quản lý tài khoản giáo viên
            </Button>

            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                  {accountDetail.fullName}
                </h1>
                <div className="flex items-center gap-3 text-neutral-600">
                  <span className="text-xs font-medium bg-neutral-100 px-2 py-1 rounded uppercase">
                    Trạng thái
                  </span>
                  <span
                    className="text-m font-mono font-semibold"
                    style={{
                      color:
                        accountDetail.status.key === AccountStatus.Active
                          ? "#10b981"
                          : "#f59e0b",
                    }}
                  >
                    {getStatusLabel(accountDetail.status.key)}
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleStatusChange}
                disabled={isUpdatingStatus}
                className="text-error hover:text-error"
              >
                {isUpdatingStatus ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : accountDetail.status.key === AccountStatus.Active ? (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Khóa tài khoản
                  </>
                ) : (
                  <>
                    <LockOpen className="w-4 h-4 mr-2" />
                    Mở khóa
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Account Info */}
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between bg-neutral-50 px-8 py-5 border-b border-neutral-200">
              <h3 className="text-lg font-bold text-neutral-900">
                Thông tin tài khoản giáo viên
              </h3>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Họ tên
                  </label>
                  <div className="bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200">
                    <p className="text-sm text-neutral-900 font-mono break-all">
                      {accountDetail.fullName}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Email
                  </label>
                  <div className="bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200">
                    <p className="text-sm text-neutral-900 font-mono break-all">
                      {accountDetail.email}
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Ngày sinh
                  </label>
                  <div className="bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200">
                    <p className="text-sm text-neutral-900">
                      {formatDateOnly(accountDetail.dateOfBirth)}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Ngày tạo
                  </label>
                  <div className="bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200">
                    <p className="text-sm text-neutral-900">
                      {formatDateTime(accountDetail.joinedAtUtc)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Lessons */}
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between bg-neutral-50 px-8 py-5 border-b border-neutral-200">
              <h3 className="text-lg font-bold text-neutral-900">Danh sách bài học</h3>
              <p className="text-sm text-neutral-600 font-medium">
                Tổng số: {accountDetail.lessons.length}
              </p>
            </div>
            <div className="p-8 space-y-4">
              {accountDetail.lessons.length === 0 ? (
                <p className="text-neutral-500 text-sm text-center">
                  Không có bài học nào.
                </p>
              ) : (
                accountDetail.lessons.map((lesson) => (
                  <div
                    key={lesson.lessonId}
                    className="flex items-center justify-between p-4 rounded-lg bg-neutral-50 border border-neutral-200"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          lesson.status === AccountDetailLessonStatus.Active
                            ? "bg-green-500"
                            : "bg-neutral-400"
                        }`}
                      />
                      <p className="text-sm font-semibold text-neutral-900">
                        {lesson.name}
                      </p>
                    </div>
                    <Badge
                      variant={
                        lesson.status === AccountDetailLessonStatus.Active
                          ? "secondary"
                          : "default"
                      }
                    >
                      {lesson.status === AccountDetailLessonStatus.Active
                        ? "Hoạt động"
                        : "Không hoạt động"}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Sessions */}
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between bg-neutral-50 px-8 py-5 border-b border-neutral-200">
              <h3 className="text-lg font-bold text-neutral-900">Danh sách buổi học</h3>
              <p className="text-sm text-neutral-600 font-medium">
                Tổng số: {accountDetail.vrLearningSessions.length}
              </p>
            </div>
            <div className="p-8 space-y-4">
              {accountDetail.vrLearningSessions.length === 0 ? (
                <p className="text-neutral-500 text-sm text-center">
                  Không có buổi học nào.
                </p>
              ) : (
                accountDetail.vrLearningSessions.map((session) => (
                  <div
                    key={session.sessionId}
                    className="flex items-center justify-between p-4 rounded-lg bg-neutral-50 border border-neutral-200"
                  >
                    <p className="text-sm font-semibold text-neutral-900">
                      {session.className}
                    </p>
                    <p className="text-xs text-neutral-600">
                      {formatDateTime(session.createdAtUtc)}
                    </p>
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
