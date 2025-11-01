'use client';

interface DescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function DescriptionInput({ value, onChange, error }: DescriptionInputProps) {
  return (
    <div className='space-y-2'>
      <label className='text-sm font-medium text-neutral-700'>Description:</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder='Enter task description'
        className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none resize-none focus:ring-2 focus:ring-primary ${
          error ? 'border-red-500' : 'border-neutral-300'
        }`}
        rows={3}
      />
      {error && <p className='text-xs text-red-500'>{error}</p>}
    </div>
  );
}
