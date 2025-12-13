"use client";

import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Laptop2 } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/common/components/ui/card";
import { Button } from "@/common/components/ui/button";
import { Loader2 } from "lucide-react";
import routes from "@/core/configs/routes";
import { fetchSessionById, fetchTaskCountByVRLessonId } from "../services/session.services"; 
import type { Session } from "../types/session.types";
import { formatDateOnly, formatTimeOnly } from "@/common/utils/date-time-vn-converter";

export default function SessionDetailPage() {
  const navigate = useNavigate();
  const params = useParams();
  const sessionId = params?.id as string;

  const [session, setSession] = useState<Session | null>(null);
  const [taskCount, setTaskCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchSessionById(sessionId);
      if (data) setSession(data as any);
      else setError("Không tìm thấy phiên học VR.");
    } catch (err) {
      console.error(err);
      setError("Lỗi khi tải dữ liệu.");
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  // Fetch total task count of VR Lesson used in session
  const loadTaskCount = useCallback(async () => {
    try {
      if (!session) return;
      const taskData = await fetchTaskCountByVRLessonId(session.vrLesson.id);
      setTaskCount(taskData.totalItems);
    } catch (err) {
      console.error(err);
      setError("Lỗi tải nhiệm vụ của bài học VR trong phiên học.");
    }
  }, [session]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  useEffect(() => {
    if (session) {
      loadTaskCount();
    }
  }, [session, loadTaskCount]);

  const handleBack = () => navigate(routes.adminSessions);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-50">
        <Loader2 className="w-10 h-10 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-50">
        <Card className="p-8 text-center">
          <p className="text-neutral-600 mb-4">{error || "Phiên học VR không tồn tại"}</p>
          <Button onClick={handleBack}>Quay lại</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-8 pt-8 pb-24 space-y-8">
          
          {/* --- 1. HEADER & NAVIGATION --- */}
          <div>
            <Button variant="ghost" size="sm" onClick={handleBack} className="mb-4 -ml-2 text-neutral-500 hover:text-neutral-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quản lý phiên học VR
            </Button>
            
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                        {session.className}
                    </h1>
                    <div className="flex items-center gap-3 text-neutral-600">
                        <span className="text-xs font-medium bg-neutral-100 px-2 py-1 rounded uppercase">
                            Trạng thái
                        </span>
                        <span
                            className="text-m font-mono font-semibold"
                            style={{
                                color: session.status.key === 0 ? "#10b981" : "#f59e0b",
                            }}
                        >
                            {session.status.key === 0 ? "Hoàn thành" : "Đã hủy"}
                        </span>
                    </div>
                </div>
            </div>
          </div>

          {/* --- 2. INFO CARD --- */}
          <Card className="overflow-hidden shadow-sm">
            <div className="flex items-center justify-between bg-neutral-50 px-8 py-5 border-b border-neutral-200">
                <h3 className="text-lg font-bold text-neutral-900">
                    Thông tin chung
                </h3>
            </div>
            <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                            Bài học VR
                        </label>
                        <div className="bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200 mt-1">
                            <p className="text-sm text-neutral-900 font-mono break-all font-medium">
                                {session.vrLesson.name}
                            </p>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                            Giáo viên
                        </label>
                        <div className="bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200 mt-1">
                            <p className="text-sm text-neutral-900 font-mono break-all">
                                {session.teacher.name}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                            Thời gian
                        </label>
                        <div className="bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200 mt-1">
                            <p className="text-sm text-neutral-900">
                                {formatTimeOnly(session.startTimeAtUtc)} - {formatTimeOnly(session.endTimeAtUtc)} ngày {formatDateOnly(session.createdAtUtc)}
                            </p>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                            Thời lượng
                        </label>
                        <div className="bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200 mt-1">
                            <p className="text-sm text-neutral-900">
                                {session.durationInMinutes} phút
                            </p>
                        </div>
                    </div>
                </div>
            </div>
          </Card>

          {/* --- 3. STUDENT SUMMARY TABLE --- */}
          <Card className="overflow-hidden shadow-sm">
            <CardHeader className="border-b px-8 py-5">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                Kết quả chi tiết
                <span className="text-sm font-normal text-neutral-700 ml-2 bg-neutral-300 px-2 py-0.5 rounded-full">
                  {session.vrDeviceSessionSummaries.length} học sinh
                </span>
              </CardTitle>
            </CardHeader>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-neutral-50/50 text-neutral-500 font-medium">
                  <tr>
                    <th className="px-8 py-4 w-[25%]">Học sinh</th>
                    <th className="px-8 py-4 w-[30%]">Thiết bị VR</th>
                    <th className="px-8 py-4 w-[15%]">Kết quả</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {session.vrDeviceSessionSummaries.map((summary) => {
                    const percentage = taskCount > 0 
                      ? Math.round((summary.noTasksCompleted / taskCount) * 100) 
                      : 0;
                    
                    const isPerfect = taskCount > 0 && summary.noTasksCompleted === taskCount;

                    return (
                      <tr key={summary.id} className="hover:bg-neutral-50/50 transition-colors">
                        {/* Column 1: Student Name */}
                        <td className="px-8 py-4 align-middle">
                          <span className="font-semibold text-neutral-900 block">
                            {summary.studentName}
                          </span>
                        </td>

                        {/* Column 2: Device Info */}
                        <td className="px-8 py-4 align-middle">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-neutral-100 rounded text-neutral-500">
                              <Laptop2 className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-medium text-neutral-900">
                                {summary.vrDevice?.deviceName || "Unknown Device"}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Column 3: Progress Bar */}
                        <td className="px-8 py-4 align-middle">
                          <div className="flex items-center gap-4">
                            <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ${
                                  isPerfect ? "bg-green-500" : "bg-blue-600"
                                }`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-xs font-semibold min-w-[3rem] text-right">
                                {percentage}%
                            </span>
                          </div>
                          <div className="text-xs text-neutral-500 mt-1.5">
                            Hoàn thành {summary.noTasksCompleted} / {taskCount} nhiệm vụ
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Empty State check */}
            {session.vrDeviceSessionSummaries.length === 0 && (
              <div className="p-12 text-center text-neutral-500">
                Chưa có dữ liệu học sinh tham gia phiên học này.
              </div>
            )}
          </Card>

        </div>
      </div>
    </div>
  );
}