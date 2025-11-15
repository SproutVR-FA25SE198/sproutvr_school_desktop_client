"use client";

import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/common/components/ui/card";
import { Button } from "@/common/components/ui/button";
import { ArrowLeft, Lock, LockOpen, Loader2 } from "lucide-react";
import { toast } from "sonner";
import routes from "@/core/configs/routes";
import { formatDateTime } from "@/common/utils/date-time-vn-converter";
import type { VRLesson } from "../types/vr-lesson.types";
import { fetchVRLessonById, updateVRLessonStatus } from "../services/vr-lesson.services";
import { HHMMSSToDuration } from "@/common/utils/duration-converter";

export default function VRLessonDetail() {
  const navigate = useNavigate();
  const params = useParams();
  const vrLessonId = params?.id as string;

  const [vrLesson, setVrLesson] = useState<VRLesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Data Fetching ---
  const loadVrLessonDetails = useCallback(async () => {
    if (!vrLessonId) {
      setError("Không tìm thấy bài học VR.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const data = await fetchVRLessonById(vrLessonId);

      if (data) setVrLesson(data);
      else setError("Lỗi tải thông tin bài học VR.");
    } catch (err) {
      console.error(err);
      setError("Đã xảy ra lỗi khi tải thông tin chi tiết.");
    } finally {
      setIsLoading(false);
    }
  }, [vrLessonId]);

  useEffect(() => {
    loadVrLessonDetails();
  }, [loadVrLessonDetails]);

  // --- Handlers ---
  const handleBack = () => navigate(`${routes.resources}?tab=vrlesson`); 

  const handleStatusChange = async () => {
    if (!vrLesson) return;

    const newStatus = vrLesson.status.key === 1 ? 0 : 1;
    const actionText = vrLesson.status.key === 1 ? "khóa" : "mở khóa";

    if (window.confirm(`Bạn có chắc bạn muốn ${actionText} bài học VR này?`)) {
      setIsUpdatingStatus(true);
      try {
        await updateVRLessonStatus(vrLesson.id, newStatus);
        toast.success("Cập nhật trạng thái bài học VR thành công!");
        loadVrLessonDetails();
      } catch (err) {
        console.error(err);
        toast.error("Lỗi cập nhật trạng thái bài học VR.");
      } finally {
        setIsUpdatingStatus(false);
      }
    }
  };

  // --- Loading / Error States ---
  if (isLoading) {
    return (
      <div className="flex h-full bg-neutral-50 items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (error || !vrLesson) {
    return (
      <div className="flex h-full bg-neutral-50 items-center justify-center">
        <Card className="p-8 flex flex-col items-center justify-center text-center">
          <p className="text-neutral-600">{error || "Không tìm thấy bộ môn."}</p>
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
              Quản lý bài học VR
            </Button>

            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 mb-2 ml-2 mr-2">{vrLesson.name}</h1>
                <div className="flex items-center gap-3 text-neutral-600">
                  <span className="text-xs font-medium bg-neutral-100 px-2 py-1 rounded uppercase">
                    Trạng thái
                  </span>
                  <span
                    className="text-m font-mono font-semibold"
                    style={{
                      color: vrLesson.status.key === 1 ? "#10b981" : "#f59e0b",
                    }}
                  >
                    {vrLesson.status.key === 1 ? "Hoạt động" : "Không hoạt động"}
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
                ) : vrLesson.status.key === 1 ? (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Khóa
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

          {/* Lesson Info */}
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between bg-neutral-50 px-8 py-5 border-b border-neutral-200">
              <h3 className="text-lg font-bold text-neutral-900">Thông tin bài học VR</h3>
            </div>
            <div className="p-8 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Tên
                  </label>
                  <div className="bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200 mt-2">
                    <p className="text-sm text-neutral-900 font-medium">{vrLesson.name}</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Mô tả
                  </label>
                  <div className="bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200 mt-2 min-h-[100px]">
                    <p className="text-sm text-neutral-900 whitespace-pre-wrap">{vrLesson.description}</p>
                  </div>
                </div>

                {vrLesson.duration && (
                <div>
                  <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Thời lượng
                  </label>
                  <div className="bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200 mt-2">
                    <p className="text-sm text-neutral-900 whitespace-pre-wrap">
                        {HHMMSSToDuration(vrLesson.duration).minutes} phút 
                        {HHMMSSToDuration(vrLesson.duration).seconds === 0 ? "" : ` ${HHMMSSToDuration(vrLesson.duration).seconds} giây`}
                    </p>
                  </div>
                </div>)}

                <div>
                  <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Bài giảng
                  </label>
                  <div className="bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200 mt-2">
                    <p className="text-sm text-neutral-900 whitespace-pre-wrap">{vrLesson.lesson.name}</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Học liệu VR
                  </label>
                  <div className="bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200 mt-2">
                    <p className="text-sm text-neutral-900 whitespace-pre-wrap">{vrLesson.map.name}</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Ngày tạo
                  </label>
                  <div className="bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200 mt-2">
                    <p className="text-sm text-neutral-900">{formatDateTime(vrLesson.createdAtVietNam)}</p>
                  </div>
                </div>

            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}