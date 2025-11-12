'use client';

import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './components/sidebar';
import { AdminTopBar } from './components/top-bar';
import { Toaster } from 'sonner';

const AdminSideLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className='flex h-screen bg-neutral-100'>
      <AdminSidebar />
      <div className='flex-1 flex flex-col overflow-hidden'>
        <AdminTopBar title='VR Device Management' userName='Alex Morgan' />
        <main className='flex-1 overflow-y-auto bg-neutral-50'>{children || <Outlet />}</main>
      </div>

      {/* Toaster component */}
      <Toaster richColors closeButton position="bottom-right" />
    </div>
  );
};

export default AdminSideLayout;
