"use client";

import { Button } from "@/common/components/ui/button";
import { Badge } from "@/common/components/ui/badge";
import { useNavigate } from "react-router-dom";
import type { VRLesson } from "../types/vr-lesson.types";
import routes from "@/core/configs/routes";
import { formatDateOnly } from "@/common/utils/date-time-vn-converter";
import { HHMMSSToDuration } from "@/common/utils/duration-converter";

interface VRLessonRowProps extends VRLesson {}

export function VRLessonRow({
  id,
  name,
  map,
  maxDuration,
  status,
  createdAtVietNam,
}: VRLessonRowProps) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`${routes.rsVrLessons}/${id}`);
  };

  return (
    <tr className="border-b hover:bg-neutral-50 transition">
      <td className="px-4 py-3 font-medium text-neutral-900">{name}</td>
      <td className="px-4 py-3 text-neutral-600">{map.mapCode}</td>
      <td className="px-4 py-3 text-neutral-600">
        {HHMMSSToDuration(maxDuration).minutes} phút 
        {HHMMSSToDuration(maxDuration).seconds === 0 ? "" : ` ${HHMMSSToDuration(maxDuration).seconds} giây`}
      </td>
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
