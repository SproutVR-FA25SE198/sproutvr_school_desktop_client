'use client';

import { Card } from "@/common/components/ui/card";

export interface KpiCardProps {
  title: string;
  value: number | string;
  icon: string;
}

export function KpiCard({
  title,
  value,
  icon,
}: KpiCardProps) {
  return (
    <Card
      className="p-4 rounded-xl gap-4 shadow-sm flex items-center bg-white border border-neutral-200"
    >
      <div
        className="w-12 h-12 flex items-center justify-center rounded-xl text-white text-3xl"
      >
        {icon}
      </div>

      <div>
        <div className="text-xs text-neutral-500">{title}</div>
        <div className="text-2xl font-bold text-neutral-900 leading-tight">{value}</div>
      </div>
    </Card>
  );
}
