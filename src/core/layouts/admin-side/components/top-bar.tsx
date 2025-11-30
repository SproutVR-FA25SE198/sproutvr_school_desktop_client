'use client';

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, KeyRound, LogOut, ChevronDown } from 'lucide-react';
import { useAppDispatch } from '@/common/store/hooks';
import { logoutThunk } from '@/common/store/auth/authThunks';
import logo from '@/assets/SproutVR_Icon.png'
import routes from '@/core/configs/routes';

interface AdminTopBarProps {
  title: string;
  userName: string;
  role?: string;
}

export function AdminTopBar({ title, userName, role = 'Quản trị viên' }: AdminTopBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const handleLogout = () => {
    dispatch(logoutThunk());
  };

  const initials = userName
    .split(' ')
    .filter(Boolean)
    .map((name) => name.charAt(0).toUpperCase())
    .join('')
    .slice(0, 1); 

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
    <header className='bg-white border-b border-neutral-200 px-8 py-4 flex items-center justify-between shadow-sm relative z-50'>
      {/* Left Title */}
      <div className='flex items-center gap-4'>
        {/* Logo Container - Fixed size */}
        <div className='w-16 h-16 flex items-center justify-center p-2 shrink-0'>
          <img
            src={logo}
            alt='SproutVR Logo'
            className='w-full h-full object-contain'
          />
        </div>

        {/* Text Info */}
        <div>
          <h1 className='text-xl font-bold text-neutral-900 leading-tight'>{title}</h1>
          <p className='text-sm text-neutral-500'>Xin chào, {userName}</p>
        </div>
      </div>

      {/* Right User Menu */}
      <div className='relative' ref={menuRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className='flex items-center gap-3 hover:bg-neutral-50 p-2 -mr-2 rounded-lg transition-colors group outline-none'
        >
          <div className='text-right hidden md:block'>
            <p className='text-sm font-semibold text-neutral-900 group-hover:text-primary transition-colors'>
              {userName}
            </p>
            <p className='text-xs text-neutral-500'>{role}</p>
          </div>
          
          <div className='w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold shadow-sm ring-2 ring-white'>
            {initials}
          </div>

          <ChevronDown 
            size={16} 
            className={`text-neutral-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className='absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right'>
            <div className='p-1'>
              <button 
                onClick={() => navigate(routes.adminProfile)} 
                className='w-full flex items-center gap-3 px-3 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary rounded-lg transition-colors text-left'
              >
                <User size={16} />
                Tài khoản cá nhân
              </button>
              
              <button 
                onClick={() => navigate(routes.resetPassword)} 
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
    </header>
  );
}