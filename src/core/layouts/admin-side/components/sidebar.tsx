'use client';

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import routes from '../../../configs/routes';
import {
  BarChart4,
  ChevronLeft,
  ChevronRight,
  FileBox,
  LucideBookMarked,
  Presentation,
  RectangleGoggles,
  Users,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: 'Tổng quan', href: routes.adminDashboard, icon: <BarChart4 /> },
  { label: 'Tài nguyên', href: routes.resources, icon: <LucideBookMarked /> },
  { label: 'Phiên học', href: routes.adminSessions, icon: <Presentation /> },
  { label: 'Thiết bị', href: routes.vrDevices, icon: <RectangleGoggles /> },
  { label: 'Tài khoản', href: routes.accounts, icon: <Users /> },
  { label: 'Gói Học Liệu', href: routes.myBundles, icon: <FileBox /> },
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
        {isOpen && <h2 className='text-xl font-bold tracking-wide'>Danh sách</h2>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='p-2 hover:bg-neutral-800 rounded-lg transition-colors'
          aria-label='Toggle sidebar'
        >
          {isOpen ? <ChevronLeft /> : <ChevronRight />}
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
    </aside>
  );
}
