"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/common/components/ui/card";
import { Button } from "@/common/components/ui/button";
import { Loader2 } from "lucide-react";
import routes from "@/core/configs/routes";
import { fetchSessionById } from "../services/session.services"; 
import type { Session } from "../types/session.types";
import { formatDateOnly, formatTimeOnly } from "@/common/utils/date-time-vn-converter";

export default function SessionDetailPage() {
  const navigate = useNavigate();
  const params = useParams();
  const sessionId = params?.id as string;

  const [session, setSession] = useState<Session | null>(null);
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

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const handleBack = () => navigate(routes.adminSessions);

  // Calculate total tasks of the session
  const totalUniqueTasks = useMemo(() => {
    if (!session?.vrDeviceTaskProgresses) return 0;
    const uniqueTaskIds = new Set(session.vrDeviceTaskProgresses.map(p => p.vrTaskId));
    return uniqueTaskIds.size;
  }, [session]);

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
    <div className="flex flex-col h-screen bg-neutral-50 overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-8 pt-8 pb-24 space-y-8">
          
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
                                color:
                                session.status.key === 0
                                    ? "#10b981"
                                    : "#f59e0b",
                            }}
                        >
                            {session.status.key === 0 ? "Hoàn thành" : "Đã hủy"}
                        </span>
                    </div>
                </div>
            </div>
          </div>

          {/* --- 2. INFO CARD --- */}
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between bg-neutral-50 px-8 py-5 border-b border-neutral-200">
                <h3 className="text-lg font-bold text-neutral-900">
                    Thông tin phiên học VR
                </h3>
            </div>
            <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                            Bài học VR
                        </label>
                        <div className="bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200">
                            <p className="text-sm text-neutral-900 font-mono break-all">
                                {session.vrLesson.name}
                            </p>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                            Tạo bởi
                        </label>
                        <div className="bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200">
                            <p className="text-sm text-neutral-900 font-mono break-all">
                                {session.teacher.name}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                            Ngày tạo
                        </label>
                        <div className="bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200">
                            <p className="text-sm text-neutral-900">
                                {formatTimeOnly(session.startTimeAtUtc)} - {formatTimeOnly(session.endTimeAtUtc)} ngày {formatDateOnly(session.createdAtUtc)}
                            </p>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                            Thời lượng
                        </label>
                        <div className="bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200">
                            <p className="text-sm text-neutral-900">
                                {session.durationInMinutes} phút
                            </p>
                        </div>
                    </div>
                </div>
            </div>
          </Card>

          {/* --- 3. STUDENT SUMMARY --- */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                Kết quả học sinh
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {session.vrDeviceSessionSummaries.map((summary) => {
                  const percentage = totalUniqueTasks > 0 
                    ? Math.round((summary.noTasksCompleted / totalUniqueTasks) * 100) 
                    : 0;
                  
                  const isPerfect = totalUniqueTasks > 0 && summary.noTasksCompleted === totalUniqueTasks;

                  return (
                    <div 
                      key={summary.id} 
                      className={`flex flex-col p-5 rounded-xl border transition-all hover:shadow-md ${
                        isPerfect 
                          ? "bg-green-50/50 border-green-200" 
                          : "bg-white border-neutral-200"
                      }`}
                    >
                      {/* Student Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-semibold text-neutral-900">{summary.studentName}</p>
                          </div>
                        </div>
                        {isPerfect && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                      </div>

                      {/* Progress Stats */}
                      <div className="mt-auto space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-500">Hoàn thành</span>
                          <span className="font-bold text-neutral-900">
                            {summary.noTasksCompleted} <span className="text-neutral-400 font-normal">/ {totalUniqueTasks}</span>
                          </span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${isPerfect ? "bg-green-500" : "bg-blue-500"}`} 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}