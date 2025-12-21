'use client';

import { Card } from "@/common/components/ui/card";

export interface KpiCardProps {
  title: string;
  value: number | string;
}

export function KpiCard({
  title,
  value,
}: KpiCardProps) {
  return (
    <Card
      className="flex flex-col justify-center items-center p-4 rounded-xl gap-4 shadow-sm bg-white border border-neutral-200"
    >
      <div className="text-center">
        <div className="text-m text-neutral-500">{title}</div>
        <div className="text-2xl font-bold text-neutral-900 leading-tight">{value}</div>
      </div>
    </Card>
  );
}
