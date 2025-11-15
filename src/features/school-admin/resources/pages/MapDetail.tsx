"use client";

import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/common/components/ui/card";
import { Button } from "@/common/components/ui/button";
import { ArrowLeft, Lock, LockOpen, Loader2 } from "lucide-react";
import { toast } from "sonner";
import routes from "@/core/configs/routes";
import { Badge } from "@/common/components/ui/badge";
import type { Map } from "../types/map.types";
import type { VRLesson } from "../types/vr-lesson.types";
import { fetchMapById, updateMapStatus } from "../services/map.services";
import { fetchVRLessons } from "../services/vr-lesson.services";
import { formatDateTime } from "@/common/utils/date-time-vn-converter";

export default function MapDetail() {
  const navigate = useNavigate();
  const params = useParams();
  const mapId = params?.id as string;

  const [map, setMap] = useState<Map | null>(null);
  const [vrLessons, setVrLessons] = useState<VRLesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVrLessonsLoading, setIsVrLessonsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Data Fetching ---
  const loadMapDetails = useCallback(async () => {
    if (!mapId) {
      setError("Không tìm thấy học liệu VR.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setIsVrLessonsLoading(true);

    try {
      const data = await fetchMapById(mapId);
      const vrLessonsData = await fetchVRLessons({mapId: mapId, isPaginated: false});

      if (data) setMap(data);
      else setError("Lỗi tải thông tin học liệu VR.");

      if(vrLessonsData) setVrLessons(vrLessonsData.items);
      else setError("Lỗi tải các bài học VR liên quan.");

    } catch (err) {
      console.error(err);
      setError("Đã xảy ra lỗi khi tải thông tin chi tiết.");
    } finally {
      setIsLoading(false);
      setIsVrLessonsLoading(false);
    }
  }, [mapId]);

  useEffect(() => {
    loadMapDetails();
  }, [loadMapDetails]);

  // --- Handlers ---
  const handleBack = () => navigate(`${routes.resources}?tab=map`); 

  const handleStatusChange = async () => {
    if (!map) return;

    const newStatus = map.status.key === 1 ? 0 : 1;
    const actionText = map.status.key === 1 ? "khóa" : "mở khóa";

    if (window.confirm(`Bạn có chắc bạn muốn ${actionText} học liệu VR này?`)) {
      setIsUpdatingStatus(true);
      try {
        await updateMapStatus(map.id, newStatus);
        toast.success("Cập nhật trạng thái học liệu VR thành công!");
        loadMapDetails();
      } catch (err) {
        console.error(err);
        toast.error("Lỗi cập nhật trạng thái học liệu VR.");
      } finally {
        setIsUpdatingStatus(false);
      }
    }
  };

  // --- Loading / Error States ---
  if (isLoading || isVrLessonsLoading) {
    return (
      <div className="flex h-full bg-neutral-50 items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (error || !map) {
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
              Quản lý học liệu VR
            </Button>

            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">{map.name}</h1>
                <div className="flex items-center gap-3 text-neutral-600">
                  <span className="text-xs font-medium bg-neutral-100 px-2 py-1 rounded uppercase">
                    Trạng thái
                  </span>
                  <span
                    className="text-m font-mono font-semibold"
                    style={{
                      color: map.status.key === 1 ? "#10b981" : "#f59e0b",
                    }}
                  >
                    {map.status.key === 1 ? "Hoạt động" : "Không hoạt động"}
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
                ) : map.status.key === 1 ? (
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

          {/* Map Info */}
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between bg-neutral-50 px-8 py-5 border-b border-neutral-200">
              <h3 className="text-lg font-bold text-neutral-900">Thông tin học liệu VR</h3>
            </div>
            {/* Grid layout for image and info */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Image Column */}
              <div className="md:col-span-1 space-y-6">
                <div className="w-full rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100">
                  <img
                    src={map.imageUrl}
                    className="w-full h-auto"
                  />
                </div>
                <div className="w-full rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100">
                  <img
                    src={map.previewUrl}
                    className="w-full h-auto"
                  />
                </div>
              </div>

              {/* Info Column */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Mã 
                  </label>
                  <div className="bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200 mt-2">
                    <p className="text-sm text-neutral-900 font-medium">{map.mapCode}</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Tên 
                  </label>
                  <div className="bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200 mt-2">
                    <p className="text-sm text-neutral-900 font-medium">{map.name}</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Mô tả
                  </label>
                  <div className="bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200 mt-2 min-h-[100px]">
                    <p className="text-sm text-neutral-900 whitespace-pre-wrap">{map.description}</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Môn học
                  </label>
                  <div className="bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200 mt-2 min-h-[100px]">
                    <p className="text-sm text-neutral-900 whitespace-pre-wrap">{map.subject.name}</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Ngày tạo
                  </label>
                  <div className="bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200 mt-2">
                    <p className="text-sm text-neutral-900">{formatDateTime(map.createdAtVietNam)}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* VR lessons */}
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between bg-neutral-50 px-8 py-5 border-b border-neutral-200">
              <h3 className="text-lg font-bold text-neutral-900">Danh sách bài học VR</h3>
              <p className="text-sm text-neutral-600 font-medium">
                Tổng số: {vrLessons.length}
              </p>
            </div>
            <div className="p-8 space-y-4">
              {vrLessons.length === 0 ? (
                <p className="text-neutral-500 text-sm text-center">Không có bài học VR nào.</p>
              ) : (
                vrLessons.map((v) => (
                  <div
                    key={v.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-neutral-50 border border-neutral-200"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          v.status.key === 1 ? "bg-green-500" : "bg-neutral-400"
                        }`}
                      />
                      <p className="text-sm font-semibold text-neutral-900">{v.name}</p>
                    </div>
                    <Badge
                      variant={ v.status.key === 1 ? "secondary" : "default" }
                    >
                      {v.status.key === 1 ? "Hoạt động" : "Không hoạt động"}
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