'use client';

interface TopBarProps {
  schoolName: string;
  userName: string;
  notificationCount?: number;
}

export function TopBar({ schoolName, userName, notificationCount = 3 }: TopBarProps) {
  return (
    <div className='bg-white border-b border-neutral-200 px-8 py-4 flex items-center justify-between shadow-sm'>
      {/* Left side - School name */}
      <div>
        <h1 className='text-2xl font-bold text-neutral-900'>{schoolName}</h1>
        <p className='text-sm text-neutral-500'>Welcome back, {userName}</p>
      </div>

      {/* Right side - Notifications and user */}
      <div className='flex items-center gap-6'>
        {/* Notifications */}
        <button className='relative p-2 hover:bg-neutral-100 rounded-lg transition-colors'>
          <span className='text-2xl'>🔔</span>
          {notificationCount > 0 && (
            <span className='absolute top-0 right-0 w-5 h-5 bg-error text-white text-xs rounded-full flex items-center justify-center font-bold'>
              {notificationCount}
            </span>
          )}
        </button>

        {/* User avatar */}
        <div className='flex items-center gap-3 pl-6 border-l border-neutral-200'>
          <div className='text-right'>
            <p className='text-sm font-medium text-neutral-900'>{userName}</p>
            <p className='text-xs text-neutral-500'>Administrator</p>
          </div>
          <div className='w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold'>
            {userName
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
        </div>
      </div>
    </div>
  );
}
