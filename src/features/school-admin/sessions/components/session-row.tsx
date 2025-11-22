"use client";

import { Button } from "@/common/components/ui/button";
import { Badge } from "@/common/components/ui/badge";
import { useNavigate } from "react-router-dom";
import routes from "@/core/configs/routes";
import { formatDateOnly } from "@/common/utils/date-time-vn-converter";
import type { SessionListItem } from "../types/session.types";

interface SessionRowProps extends SessionListItem {}

export function SessionRow({
  id,
  className,
  teacher,
  vrLesson,
  status,
  createdAtUtc,
}: SessionRowProps) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`${routes.adminSessions}/${id}`);
  };

  return (
    <tr className="border-b hover:bg-neutral-50 transition">
      <td className="px-4 py-3 text-neutral-600">{className}</td>
      <td className="px-4 py-3 text-neutral-600">{teacher.name}</td>
      <td className="px-4 py-3 text-neutral-600">{vrLesson.name}</td>
      <td className="px-4 py-3 text-neutral-600">{formatDateOnly(createdAtUtc)}</td>
      <td className="px-4 py-3">
        <Badge
          variant={status.key === 1 ? "default" : "secondary"}
          className="font-semibold"
        >
          {status.key === 1 ? "Đã hủy" : "Hoàn thành"}
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
