'use client';

import { useState, useRef, useEffect } from 'react';
import { User, KeyRound, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/common/store/hooks';
import { logoutThunk } from '@/common/store/auth/authThunks';

interface TopBarProps {
  schoolName: string;
  userName: string;
  notificationCount?: number;
}

export function TopBar({ schoolName, userName }: TopBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    dispatch(logoutThunk());
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='bg-white border-b border-neutral-200 px-8 py-4 flex items-center justify-between shadow-sm relative z-50'>
      {/* Left side - School name */}
      <div>
        <h1 className='text-2xl font-bold text-neutral-900'>{schoolName}</h1>
        <p className='text-sm text-neutral-500'>Xin chào, {userName}</p>
      </div>

      {/* Right side - User */}
      <div className='flex items-center gap-6'>
        {/* User Menu Dropdown */}
        <div className='relative' ref={menuRef}>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className='flex items-center gap-3 pl-6 border-l border-neutral-200 hover:bg-neutral-50 p-2 rounded-lg transition-colors group'
          >
            <div className='text-right'>
              <p className='text-sm font-medium text-neutral-900 group-hover:text-primary transition-colors'>{userName}</p>
              <p className='text-xs text-neutral-500'>Giáo viên</p>
            </div>
            
            <div className='w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold shadow-sm'>
              {userName
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            
            <ChevronDown size={16} className={`text-neutral-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Content */}
          {isOpen && (
            <div className='absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200'>
              <div className='p-1'>
                <button 
                  onClick={() => navigate('')} 
                  className='w-full flex items-center gap-3 px-3 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary rounded-lg transition-colors text-left'
                >
                  <User size={16} />
                  Hồ sơ cá nhân
                </button>
                
                <button 
                  onClick={() => navigate('')} 
                  className='w-full flex items-center gap-3 px-3 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary rounded-lg transition-colors text-left'
                >
                  <KeyRound size={16} />
                  Đổi mật khẩu
                </button>
              </div>
              
              <div className='h-px bg-neutral-100 my-1' />
              
              <div className='p-1'>
                <button 
                  onClick={handleLogout}
                  className='w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left'
                >
                  <LogOut size={16} />
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}