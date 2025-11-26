import * as XLSX from 'xlsx';
import type { VRLearningSessionDetail } from '@/features/learning-sessions/types/session-manage.type';

// Helper function to convert string to CleanPascalCase (e.g., "TN Ảo: Este" -> "TnAoEste")
const toCleanCamelCase = (str: string) => {
  if (!str) return '';
  return str
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove Vietnamese accents
    .replace(/[^a-zA-Z0-9 ]/g, " ") // Replace special chars with spaces
    .split(" ")
    .filter(w => w.trim().length > 0) // Remove empty spaces
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()) // Capitalize first letter
    .join("");
};

export const exportSessionToExcel = (session: VRLearningSessionDetail) => {
  // Prepare the Data Rows
  const rows = session.vrDeviceSessionSummaries.map((summary, index) => {
    
    const studentTasks = session.vrDeviceTaskProgresses.filter(
      (t) => t.studentName === summary.studentName
    );

    const totalTasks = studentTasks.length;
    const correctTasks = studentTasks.filter((t) => t.isCorrect).length;
    const score = totalTasks > 0 ? ((correctTasks / totalTasks) * 10).toFixed(1) : '0.0';

    const completedTasks = studentTasks.filter((t) => t.isCompleted).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      STT: index + 1,
      'Tên Học Sinh': summary.studentName,
      'Thiết Bị': (summary as any).vrDevice?.deviceName || 'N/A',
      'Điểm Số': score,
      'Tiến Độ (%)': `${completionRate}%`,
      'NV Hoàn Thành': completedTasks,
      'NV Đúng (TN)': correctTasks,
      'Tổng Số NV': totalTasks,
    };
  });

  // Create Worksheet
  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Auto-width columns
  const wscols = [
    { wch: 5 },  // STT
    { wch: 20 }, // Name
    { wch: 20 }, // Device
    { wch: 15 }, // Score
    { wch: 15 }, // Progress
    { wch: 15 }, // Completed
    { wch: 15 }, // Correct
    { wch: 15 }, // Total
  ];
  worksheet['!cols'] = wscols;

  // Create Workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'KetQuaHocTap');

  // --- GENERATE FILE NAME ---
  
  // Convert names to CamelCase/PascalCase
  const cleanClassName = toCleanCamelCase(session.className);
  const cleanLessonName = toCleanCamelCase(session.vrLesson.name);
  
  const dateStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  
  // Example result: KetQua_Lop12A1_TnAoEsteVaLipit_2025-11-26.xlsx
  const fileName = `KetQua_${cleanClassName}_${cleanLessonName}_${dateStr}.xlsx`;

  // Trigger Download
  XLSX.writeFile(workbook, fileName);
};