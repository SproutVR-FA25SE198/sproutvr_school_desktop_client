'use client';

interface LessonDescriptionTextareaProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function VrLessonDescriptionTextarea({ value, onChange, error }: LessonDescriptionTextareaProps) {
  return (
    <div className='space-y-2'>
      <label className='text-sm font-medium text-foreground'>Description:</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder='Enter lesson description'
        className={`w-full min-h-32 px-3 py-2 border resize-none rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
          error ? 'border-red-500' : 'border-input'
        }`}
      />
      {error && <p className='text-xs text-red-500'>{error}</p>}
    </div>
  );
}
