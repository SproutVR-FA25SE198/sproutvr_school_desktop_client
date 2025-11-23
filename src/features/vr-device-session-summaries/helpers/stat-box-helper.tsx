// Helper Component
export const StatBox = ({ label, value, total, color, bg }: any) => (
  <div className={`p-4 rounded-xl border border-slate-100 ${bg}`}>
    <p className="text-xs font-medium text-slate-500 mb-1 uppercase">{label}</p>
    <div className="flex items-baseline gap-1">
      <span className={`text-2xl font-bold ${color}`}>{value}</span>
      <span className="text-sm text-slate-400">/ {total}</span>
    </div>
  </div>
);