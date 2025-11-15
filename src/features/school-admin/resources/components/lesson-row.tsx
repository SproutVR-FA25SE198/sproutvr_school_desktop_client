"use client";

import { Button } from "@/common/components/ui/button";
import { Badge } from "@/common/components/ui/badge";
import { useNavigate } from "react-router-dom";
import type { LessonListItem } from "../types/lesson.types";
import routes from "@/core/configs/routes";
import { formatDateOnly } from "@/common/utils/date-time-vn-converter";

interface LessonRowProps extends LessonListItem {}

export function LessonRow({
  id,
  name,
  subject,
  teacher,
  status,
  createdAtVietNam,
}: LessonRowProps) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`${routes.rsLessons}/${id}`);
  };

  return (
    <tr className="border-b hover:bg-neutral-50 transition">
      <td className="px-4 py-3 font-medium text-neutral-900">{name}</td>
      <td className="px-4 py-3 text-neutral-600">{subject.name}</td>
      <td className="px-4 py-3 text-neutral-600">{teacher.firstName} {teacher.lastName}</td>
      <td className="px-4 py-3 text-neutral-600">{formatDateOnly(createdAtVietNam)}</td>
      <td className="px-4 py-3">
        <Badge
          variant={status.key === 1 ? "secondary" : "default"}
          className="font-semibold"
        >
          {status.key === 1 ? "Hoạt động" : "Không hoạt động"}
        </Badge>
      </td>
      <td className="px-4 py-3 text-right">
        <Button
          variant="outline"
          size="sm"
          className="font-semibold"
          onClick={handleViewDetails}
        >
          Chi tiết
        </Button>
      </td>
    </tr>
  );
}
