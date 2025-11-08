'use client';

interface AdminTopBarProps {
  title: string;
  userName: string;
  role?: string;
}

export function AdminTopBar({ title, userName, role = 'System Administrator' }: AdminTopBarProps) {
  const initials = userName
    .split(' ')
    .filter(Boolean)
    .map((name) => name.charAt(0).toUpperCase())
    .join('');

  return (
    <header className='bg-white border-b border-neutral-200 px-8 py-4 flex items-center justify-between shadow-sm'>
      <div>
        <h1 className='text-2xl font-bold text-neutral-900'>{title}</h1>
        <p className='text-sm text-neutral-500'>Manage VR infrastructure and device lifecycle</p>
      </div>

      <div className='flex items-center gap-4'>
        <div className='text-right'>
          <p className='text-sm font-semibold text-neutral-900'>{userName}</p>
          <p className='text-xs text-neutral-500'>{role}</p>
        </div>
        <div className='w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold'>
          {initials}
        </div>
      </div>
    </header>
  );
}
