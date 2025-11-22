"use client";

import { useEffect, useMemo, useState } from "react";
import { Tooltip as ReTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend } from "recharts";
import { Card } from "@/common/components/ui/card";
import { fetchMasterSubjects } from "../../resources/services/master-subject.services";
import { fetchSubjects } from "../../resources/services/subject.services";
import { fetchMaps } from "../../resources/services/map.services";
import { fetchLessons } from "../../resources/services/lesson.services";
import { fetchVRLessons } from "../../resources/services/vr-lesson.services";
import type { MasterSubject } from "../../resources/types/master-subject.types";
import type { MapListItem } from "../../resources/types/map.types";
import type { Subject } from "../../resources/types/subject.types";
import type { LessonListItem } from "../../resources/types/lesson.types";
import type { VRLesson } from "../../resources/types/vr-lesson.types";
import { HHMMSSToDuration } from "@/common/utils/duration-converter";
import { KpiCard } from "../components/kpi-card";
import StatusPieCard from "../components/status-pie-card";
import type { SessionListItem } from "../../sessions/types/session.types";
import { fetchSessions } from "../../sessions/services/session.services";

export default function Dashboard() {
  const [masterSubjects, setMasterSubjects] = useState<MasterSubject[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [maps, setMaps] = useState<MapListItem[]>([]);
  const [lessons, setLessons] = useState<LessonListItem[]>([]);
  const [vrLessons, setVrLessons] = useState<VRLesson[]>([]);
  const [sessions, setSessions] = useState<SessionListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadAll() {
      setIsLoading(true);
      try {
        const ms = await fetchMasterSubjects({ isPaginated: false });
        const s = await fetchSubjects({ isPaginated: false });
        const m = await fetchMaps({ isPaginated: false });
        const l = await fetchLessons({ isPaginated: false });
        const v = await fetchVRLessons({ isPaginated: false });
        const ss = await fetchSessions({isPaginated: false});

        if (!mounted) return;
        setMasterSubjects(ms.items || []);
        setSubjects(s.items || []);
        setMaps(m.items || []);
        setLessons(l.items || []);
        setVrLessons(v.items || []);
        setSessions(ss.items || []);
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    loadAll();
    return () => {
      mounted = false;
    };
  }, []);

  // Total counts of resources
  const totals = useMemo(() => {
    return {
      masterSubjects: masterSubjects.length,
      subjects: subjects.length,
      maps: maps.length,
      lessons: lessons.length,
      vrLessons: vrLessons.length,
      sessions: sessions.length
    };
  }, [masterSubjects, subjects, maps, lessons, vrLessons, sessions]);

  // Count of MasterSubjects by Status
  const msStatusData = useMemo(() => {
    const counts: Record<string, number> = { Active: 0, Inactive: 0 };
    masterSubjects.forEach((m) => {
      if (m.status.key === 1) counts.Active++;
      else counts.Inactive++;
    });

    const total = counts.Active + counts.Inactive;
    const activePercentage = (counts.Active/total)*100;
    const inactivePercentage = (counts.Inactive/total)*100;

    return [
      { key: 1, name: "Hoạt động", value: counts.Active, percent: activePercentage},
      { key: 0, name: "Không hoạt động", value: counts.Inactive, percent: inactivePercentage }
    ];
  }, [masterSubjects]);

  // Count of Subjects by Status
  const subjectsStatusData = useMemo(() => {
    const counts: Record<string, number> = { Active: 0, Inactive: 0 };
    subjects.forEach((s) => {
      if (s.status.key === 1) counts.Active++;
      else counts.Inactive++;
    });

    const total = counts.Active + counts.Inactive;
    const activePercentage = (counts.Active/total)*100;
    const inactivePercentage = (counts.Inactive/total)*100;

    return [
      { key: 1, name: "Hoạt động", value: counts.Active, percent: activePercentage},
      { key: 0, name: "Không hoạt động", value: counts.Inactive, percent: inactivePercentage }
    ];
  }, [subjects]);

  // Count of Maps by Status
  const mapsStatusData = useMemo(() => {
    const counts: Record<string, number> = { Active: 0, Inactive: 0 };
    maps.forEach((m) => {
      if (m.status.key === 1) counts.Active++;
      else counts.Inactive++;
    });

    const total = counts.Active + counts.Inactive;
    const activePercentage = (counts.Active/total)*100;
    const inactivePercentage = (counts.Inactive/total)*100;

    return [
      { key: 1, name: "Hoạt động", value: counts.Active, percent: activePercentage},
      { key: 0, name: "Không hoạt động", value: counts.Inactive, percent: inactivePercentage }
    ];
  }, [maps]);
  
  // Count of Lessons by Status
  const lessonsStatusData = useMemo(() => {
    const counts: Record<string, number> = { Active: 0, Inactive: 0 };
    lessons.forEach((l) => {
      if (l.status.key === 1) counts.Active++;
      else counts.Inactive++;
    });

    const total = counts.Active + counts.Inactive;
    const activePercentage = (counts.Active/total)*100;
    const inactivePercentage = (counts.Inactive/total)*100;

    return [
      { key: 1, name: "Hoạt động", value: counts.Active, percent: activePercentage},
      { key: 0, name: "Không hoạt động", value: counts.Inactive, percent: inactivePercentage }
    ];
  }, [lessons]);

  // Count of VRLessons by Status
  const vrStatusData = useMemo(() => {
    const counts: Record<string, number> = { Active: 0, Inactive: 0 };
    vrLessons.forEach((v) => {
      if (v.status.key === 1) counts.Active++;
      else counts.Inactive++;
    });

    const total = counts.Active + counts.Inactive;
    const activePercentage = (counts.Active/total)*100;
    const inactivePercentage = (counts.Inactive/total)*100;

    return [
      { key: 1, name: "Hoạt động", value: counts.Active, percent: activePercentage},
      { key: 0, name: "Không hoạt động", value: counts.Inactive, percent: inactivePercentage }
    ];
  }, [vrLessons]);

  // Count of Sessions by Status
  const sessionsStatusData = useMemo(() => {
    const counts: Record<string, number> = { Completed: 0, Cancelled: 0 };
    sessions.forEach((ss) => {
      if (ss.status.key === 0) counts.Completed++;
      else counts.Cancelled++;
    });

    const total = counts.Completed + counts.Cancelled;
    const completedPercentage = (counts.Completed/total)*100;
    const cancelledPercentage = (counts.Cancelled/total)*100;

    return [
      { key: 1, name: "Hoàn thành", value: counts.Completed, percent: completedPercentage},
      { key: 0, name: "Đã hủy", value: counts.Cancelled, percent: cancelledPercentage }
    ];
  }, [sessions])

  // Count of Lessons per MasterSubject
  const lessonsByMasterSubject = useMemo(() => {
    const mapCounts = new Map<string, { name: string; count: number }>();
    masterSubjects.forEach((ms) => {
      mapCounts.set(ms.id, { name: ms.name, count: 0 });
    });
    lessons.forEach((l) => {
      const msId = l.masterSubject.id;
      if (!msId) return;
      const existing = mapCounts.get(msId);
      if (existing) existing.count++;
      else mapCounts.set(msId, { name: l.masterSubject?.name ?? "Không xác định", count: 1 });
    });
    const arr = Array.from(mapCounts.values()).sort((a, b) => b.count - a.count);
    // Limit to top 5 for readability
    return arr.slice(0, 5);
  }, [lessons, masterSubjects]);

  // Count of VRLessons per MasterSubject
  const vrLessonsByMasterSubject = useMemo(() => {
    const mapCounts = new Map<string, { name: string; count: number }>();
    masterSubjects.forEach((ms) => {
      mapCounts.set(ms.id, { name: ms.name, count: 0 });
    });
    vrLessons.forEach((v) => {
      const lessonId = v.lesson.id;
      if (!lessonId) return;
      const lessonRef = lessons.find(l => l.id === lessonId);
      if(!lessonRef) return;
      const msId = lessonRef.masterSubject.id;
      const existing = mapCounts.get(msId);
      if (existing) existing.count++;
      else mapCounts.set(msId, { name: lessonRef.masterSubject?.name ?? "Không xác định", count: 1 });
    });
    const arr = Array.from(mapCounts.values()).sort((a, b) => b.count - a.count);
    // Limit to top 5 for readability
    return arr.slice(0, 5);
  }, [vrLessons, lessons, masterSubjects])

  // Recent Sessions created
  const recentSessions = useMemo(() => {
    return [...sessions]
      .sort((a, b) => (b.createdAtUtc > a.createdAtUtc ? 1 : -1))
      .slice(0, 8);
  }, [sessions]);

  // Recent VR Lessons created
  const recentVrLessons = useMemo (() => {
    return[...vrLessons]
    .sort((a, b) => (b.createdAtUtc > a.createdAtUtc ? 1 : -1))
    .slice(0, 5); 
  }, [vrLessons]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-neutral-500">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* KPI Cards: Total count by resources */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard title="Bộ môn" value={totals.masterSubjects} icon="📚"  />
        <KpiCard title="Môn học" value={totals.subjects} icon="📘"  />
        <KpiCard title="Học liệu VR" value={totals.maps} icon="🗺️" />
        <KpiCard title="Bài giảng" value={totals.lessons} icon="🎓"  />
        <KpiCard title="Bài học VR" value={totals.vrLessons} icon="🥽" />
        <KpiCard title="Phiên học VR" value={totals.sessions} icon="🖥️" />
      </div>

      {/* Pie charts */}
      <div>
        {/* Pie chart: MasterSubjects count by Status */}
        <StatusPieCard
          datasets={{
            masterSubjects: msStatusData,
            subjects: subjectsStatusData,
            maps: mapsStatusData,
            lessons: lessonsStatusData,
            vrLessons: vrStatusData,
            sessions: sessionsStatusData
          }}
        />
      </div>

      {/* Bar charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bar chart: Lessons count by MasterSubject */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Số lượng bài giảng theo bộ môn</h3>
          <div style={{ height: 240 }}>
            <ResponsiveContainer>
              <BarChart data={lessonsByMasterSubject} layout="horizontal" margin={{ left: 10 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <ReTooltip />
                <Legend />
                <Bar dataKey="count" name="Số lượng" fill="#b592f6ff" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 text-sm text-neutral-600">Hiển thị top {lessonsByMasterSubject.length}</div>
        </Card>

        {/* Bar chart: VRLessons count by MasterSubject */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Số lượng bài học VR theo bộ môn</h3>
          <div style={{ height: 240 }}>
            <ResponsiveContainer>
              <BarChart data={vrLessonsByMasterSubject} layout="horizontal" margin={{ left: 10 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <ReTooltip />
                <Legend />
                <Bar dataKey="count" name="Số lượng" fill="#b592f6ff" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 text-sm text-neutral-600">Hiển thị top {vrLessonsByMasterSubject.length}</div>
        </Card>
      </div>
      
      {/* Recent resources tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Sessions table */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Phiên học VR mới nhất</h3>
            <div className="text-sm text-neutral-600">({recentSessions.length})</div>
          </div>

          <div className="mt-3 overflow-hidden">
            <table className="min-w-full text-xs">
              <thead className="bg-neutral-100 text-neutral-600">
                <tr>
                  <th className="px-3 py-2 text-left">Tên lớp</th>
                  <th className="px-3 py-2 text-left">Tạo bởi</th>
                  <th className="px-3 py-2 text-left">Bài học VR</th>
                  <th className="px-3 py-2 text-left">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="text-neutral-800">
                {recentSessions.map((r) => (
                  <tr key={r.id} className="border-b">
                    <td className="px-3 py-2 max-w-[220px] truncate">{r.className}</td>
                    <td className="px-3 py-2">{r.teacher.name}</td>
                    <td className="px-3 py-2">{r.vrLesson.name}</td>
                    <td className="px-3 py-2">{r.status.key === 0 ? "🟢 Hoàn thành" : "🔵 Đã hủy"}</td>
                  </tr>
                ))}
                {recentSessions.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-3 py-6 text-center text-neutral-500">
                      Không có phiên học VR được tạo gần đây.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
        
        {/* Recent VR Lessons table */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Bài học VR mới nhất</h3>
            <div className="text-sm text-neutral-600">({recentVrLessons.length})</div>
          </div>

          <div className="mt-3 overflow-hidden">
            <table className="min-w-full text-xs">
              <thead className="bg-neutral-100 text-neutral-600">
                <tr>
                  <th className="px-3 py-2 text-left">Tên</th>
                  <th className="px-3 py-2 text-left">Học liệu VR</th>
                  <th className="px-3 py-2 text-left">Thời lượng</th>
                  <th className="px-3 py-2 text-left">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="text-neutral-800">
                {recentVrLessons.map((r) => (
                  <tr key={r.id} className="border-b">
                    <td className="px-3 py-2 max-w-[220px] truncate">{r.name}</td>
                    <td className="px-3 py-2">{r.map.name}</td>
                    <td className="px-3 py-2">
                        {HHMMSSToDuration(r.maxDuration).minutes} phút 
                        {HHMMSSToDuration(r.maxDuration).seconds === 0 ? "" : ` ${HHMMSSToDuration(r.maxDuration).seconds} giây`}</td>
                    <td className="px-3 py-2">{r.status?.key === 1 ? "🟢 Hoạt động" : "🔵 Không hoạt động"}</td>
                  </tr>
                ))}
                {recentVrLessons.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-3 py-6 text-center text-neutral-500">
                      Không có bài học VR được tạo gần đây.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

      </div>
    </div>
  );
}
