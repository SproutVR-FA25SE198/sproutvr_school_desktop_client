'use client';

import { cn } from '@/common/utils';
import logo from '@/assets/SproutVR_Icon.png';

import { Spinner } from './ui/spinner';

interface LoadingProps {
  isLoading: boolean;
  className?: string;
  message?: string;
}

export default function Loading({ isLoading, className, message }: LoadingProps) {
  if (!isLoading) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex items-center justify-center bg-background/50 transition-all',
        className,
      )}
    >
      <div className='flex flex-col items-center gap-4'>
        {/* Logo */}
        <div className='w-20 h-20 flex items-center justify-center'>
          <img src={logo} alt='Sprout VR Logo' className='w-full h-full object-contain animate-bounce' />
        </div>
        {/* Dot loader */}
        <div className='flex items-center gap-3'>
          <div
            className='w-3 h-3 bg-secondary rounded-full animate-[bouncePulse_1s_ease-in-out_infinite]'
            style={{ animationDelay: '0ms' }}
          />
          <div
            className='w-3 h-3 bg-secondary rounded-full animate-[bouncePulse_1s_ease-in-out_infinite]'
            style={{ animationDelay: '150ms' }}
          />
          <div
            className='w-3 h-3 bg-secondary rounded-full animate-[bouncePulse_1s_ease-in-out_infinite]'
            style={{ animationDelay: '300ms' }}
          />
          <style>{`
            @keyframes bouncePulse {
              0%, 100% {
                transform: translateY(0) scale(1);
                opacity: 0.7;
              }
              50% {
                transform: translateY(-8px) scale(1.2);
                opacity: 1;
              }
            }
          `}</style>
        </div>
        <span className='text-sm text-muted-foreground'>{message ? message : 'Bạn chờ xíu nha...'}</span>
      </div>
    </div>
  );
}
