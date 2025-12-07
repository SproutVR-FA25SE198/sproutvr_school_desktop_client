'use client';

import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './components/sidebar';
import { AdminTopBar } from './components/top-bar';
import { Toaster } from 'sonner';
import { useSelector } from 'react-redux';
import type { RootState } from '@/common/store';

const AdminSideLayout = ({ children }: { children?: React.ReactNode }) => {
  const { user } = useSelector((state: RootState) => state.auth);

  const displayName = user?.fullName || 'User';
  
  return (
    <div className='flex h-screen bg-neutral-100'>
      <AdminSidebar />
      <div className='flex-1 flex flex-col overflow-hidden'>
        <AdminTopBar title='SproutVR' userName={displayName} />
        <main className='flex-1 overflow-y-auto bg-neutral-50'>{children || <Outlet />}</main>
      </div>

      {/* Toaster component */}
      <Toaster richColors closeButton position="top-center" />
    </div>
  );
};

export default AdminSideLayout;
