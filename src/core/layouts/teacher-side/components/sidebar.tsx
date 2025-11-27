'use client';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import routes from '@/core/configs/routes';
import { Button } from '@/common/components/ui/button';
import { LogOut } from 'lucide-react';
import { logoutThunk } from '@/common/store/auth/authThunks';
import { useAppDispatch } from '@/common/store/hooks';
import { useSelector } from 'react-redux';
import type { RootState } from '@/common/store';

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  { label: 'Bài giảng', href: routes.home, icon: '📚' },
  { label: 'Phiên học VR', href: routes.sessionList, icon: '▶️' },
  { label: 'Reports', href: '/reports', icon: '📈' },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    dispatch(logoutThunk());
  };

  const { user } = useSelector((state: RootState) => state.auth);
  const displayName = user?.fullName || 'User';

  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-primary text-white transition-all duration-300 flex flex-col h-screen shadow-lg`}
    >
      {/* Logo */}
      <div className='p-6 border-b border-primary-light flex items-center justify-between'>
        {isOpen && <h2 className='text-xl font-bold'>Menu</h2>}
        <button onClick={() => setIsOpen(!isOpen)} className='p-2 hover:bg-primary-light rounded-lg transition-colors'>
          {isOpen ? '←' : '→'}
        </button>
      </div>

      {/* Navigation */}
      <nav className='flex-1 p-4 space-y-2'>
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className='flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-primary-light transition-colors group'
          >
            <span className='text-xl'>{item.icon}</span>
            {isOpen && <span className='font-medium'>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* User profile */}
      <div className='p-4 mb-8 border-t border-neutral-800'>
        <Button
          onClick={handleLogout}
          variant='ghost'
          className='justify-start mb-5 hover:bg-neutral-100 rounded-lg transition-colors'
        >
          <LogOut className='h-4 w-4' /> {isOpen && <span className='ml-3'>Đăng xuất</span>}
        </Button>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 bg-secondary rounded-full flex items-center justify-center font-bold'>JD</div>
          {isOpen && (
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-medium truncate'>{displayName}</p>
              <p className='text-xs text-primary-light truncate'>Giáo viên</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
