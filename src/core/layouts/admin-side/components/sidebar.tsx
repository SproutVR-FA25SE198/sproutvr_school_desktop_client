'use client';

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import routes from '../../../configs/routes';

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  { label: 'Quản lý tài nguyên', href: routes.resources, icon: '📚' },
  { label: 'Quản lý thiết bị', href: routes.vrDevices, icon: '🖥️' },
  { label: 'Quản lý tài khoản', href: routes.accounts, icon: '👥' },
  { label: 'Kích Hoạt Gói', href: routes.activation, icon: '🔑' },
  { label: 'Gói Học Liệu', href: routes.myBundles, icon: '📦' },
];

export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const isActive = (href: string) => location.pathname.startsWith(href.replace(/:\w+/, ''));

  return (
    <aside
      className={`${isOpen ? 'w-64' : 'w-20'} bg-neutral-900 text-white transition-all duration-300 flex flex-col h-screen shadow-xl`}
    >
      <div className='p-6 border-b border-neutral-800 flex items-center justify-between'>
        {isOpen && <h2 className='text-xl font-bold tracking-wide'>Admin Console</h2>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='p-2 hover:bg-neutral-800 rounded-lg transition-colors'
          aria-label='Toggle sidebar'
        >
          {isOpen ? '←' : '→'}
        </button>
      </div>

      <nav className='flex-1 p-4 space-y-2 overflow-y-auto'>
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                active ? 'bg-neutral-800' : 'hover:bg-neutral-800/70'
              }`}
            >
              <span className='text-xl'>{item.icon}</span>
              {isOpen && <span className='font-medium'>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className='p-4 border-t border-neutral-800'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 bg-neutral-700 rounded-full flex items-center justify-center font-bold'>AM</div>
          {isOpen && (
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-medium truncate'>Alex Morgan</p>
              <p className='text-xs text-neutral-300 truncate'>System Admin</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
