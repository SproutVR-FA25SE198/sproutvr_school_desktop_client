'use client';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  { label: 'Lessons', href: '/', icon: '📚' },
  { label: 'Sessions', href: '/sessions', icon: '▶️' },
  { label: 'Devices', href: '/devices', icon: '🖥️' },
  { label: 'Accounts', href: '/accounts', icon: '👥' },
  { label: 'Reports', href: '/reports', icon: '📈' },
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
        {isOpen && <h2 className='text-xl font-bold'>SproutVR</h2>}
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
      <div className='p-4 border-t border-primary-light'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 bg-secondary rounded-full flex items-center justify-center font-bold'>JD</div>
          {isOpen && (
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-medium truncate'>John Doe</p>
              <p className='text-xs text-primary-light truncate'>Admin</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
