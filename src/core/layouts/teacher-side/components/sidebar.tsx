'use client';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import routes from '@/core/configs/routes';

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  { label: 'Bài giảng', href: routes.home, icon: '📚' },
  { label: 'Phiên học VR', href: routes.sessionList, icon: '▶️' },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-primary text-white transition-all duration-300 flex flex-col h-screen shadow-lg`}
    >
      {/* Logo */}
      <div className='p-6 border-b border-primary-light flex items-center justify-between'>
        {isOpen && <h2 className='text-xl font-bold'>Danh sách</h2>}
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
    </aside>
  );
}
