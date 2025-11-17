"use client";

import { useState } from "react";
import { Card } from "@/common/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export default function StatusPieCard({
  datasets,
}: {
  datasets: {
    masterSubjects: any[];
    subjects: any[];
    maps: any[];
    lessons: any[];
    vrLessons: any[];
  };
}) {
  const [chartType, setChartType] = useState<keyof typeof datasets>("masterSubjects");

  const chartOptions = [
    { label: "Bộ môn", value: "masterSubjects" },
    { label: "Môn học", value: "subjects" },
    { label: "Học liệu VR", value: "maps" },
    { label: "Bài giảng", value: "lessons" },
    { label: "Bài học VR", value: "vrLessons" },
  ];

  const data = datasets[chartType];

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Tỉ lệ theo trạng thái</h3>
        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value as any)}
          className="border border-neutral-300 rounded-sm px-3 py-2 text-sm shadow-sm bg-white transition-all duration-200 hover:shadow-md focus:shadow-md focus:ring-1 focus:ring-green-400 focus:border-green-400 outline-none"
        >
          {chartOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ height: 240 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
              innerRadius={0}
              paddingAngle={1}
              label={({ percent = 0 }) => `${percent.toFixed(0)}%`}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.key}
                  fill={entry.key === 1 ? "#10b981" : "#3b82f6"}
                />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
