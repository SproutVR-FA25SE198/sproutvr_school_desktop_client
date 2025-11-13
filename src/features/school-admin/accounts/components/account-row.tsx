"use client";

import { Button } from "@/common/components/ui/button";
import { Badge } from "@/common/components/ui/badge";
import { useNavigate } from "react-router-dom";
import type { Account } from "../types/account.types";
import {
  AccountStatus,
  getStatusLabel,
} from "../types/account.types";

interface AccountRowProps extends Account {}

export function AccountRow({
  userId,
  fullName,
  email,
  status,
  createdAtVietNam,
}: AccountRowProps) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/accounts/${userId}`);
  };

  const formatDateOnly = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const datePart = date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return `${datePart}`;
  };

  return (
    <tr className="border-b hover:bg-neutral-50 transition">
      <td className="px-4 py-3 font-medium text-neutral-900">{fullName}</td>
      <td className="px-4 py-3 text-neutral-600">{email}</td>
      <td className="px-4 py-3 text-neutral-600">{formatDateOnly(createdAtVietNam)}</td>
      <td className="px-4 py-3">
        <Badge
          variant={status === AccountStatus.Active ? "secondary" : "default"}
          className="font-semibold"
        >
          {getStatusLabel(status)}
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
