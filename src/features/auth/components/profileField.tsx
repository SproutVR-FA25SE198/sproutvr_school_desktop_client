interface ProfileFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}

export function ProfileField({ icon, label, value, mono }: ProfileFieldProps) {
  return (
    <div className='flex items-start gap-4'>
      <div className='p-2 bg-slate-50 rounded-lg border border-slate-100 mt-1'>
        {icon}
      </div>
      <div>
        <p className='text-sm font-medium text-slate-500 mb-1'>{label}</p>
        <p className={`text-base text-slate-900 font-medium ${mono ? 'font-mono text-sm tracking-tight' : ''}`}>
          {value}
        </p>
      </div>
    </div>
  );
}