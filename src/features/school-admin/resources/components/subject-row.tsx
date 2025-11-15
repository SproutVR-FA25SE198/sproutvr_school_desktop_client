"use client";

import { Button } from "@/common/components/ui/button";
import { Badge } from "@/common/components/ui/badge";
import { useNavigate } from "react-router-dom";
import type { Subject } from "../types/subject.types";
import routes from "@/core/configs/routes";
import { formatDateOnly } from "@/common/utils/date-time-vn-converter";

interface SubjectRowProps extends Subject {}

export function SubjectRow({
  id,
  name,
  masterSubject,
  status,
  createdAtVietNam,
}: SubjectRowProps) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`${routes.rsSubjects}/${id}`);
  };

  return (
    <tr className="border-b hover:bg-neutral-50 transition">
      <td className="px-4 py-3 font-medium text-neutral-900">{name}</td>
      <td className="px-4 py-3 text-neutral-600">{masterSubject.name}</td>
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
