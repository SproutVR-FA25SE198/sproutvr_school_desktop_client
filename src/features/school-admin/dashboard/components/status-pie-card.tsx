import { Card } from "@/common/components/ui/card";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip as ReTooltip } from "recharts";

type StatusItem = {
  key: number;     // 1 = Active, 0 = Inactive
  name: string;
  value: number;
  percent: number;
};

export default function StatusPieCard({
  title,
  data,
  colors = {
    active: "#10b981",     
    inactive: "#3b82f6",   
  },
}: {
  title: string;
  data: StatusItem[];
  colors?: {
    active: string;
    inactive: string;
  };
}) {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>

      <div style={{ height: 220 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
              innerRadius={0}
              paddingAngle={2}
              label={(entry) => `${entry.percent}%`}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={entry.key === 1 ? colors.active : colors.inactive}
                />
              ))}
            </Pie>
            <Legend />
            <ReTooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
