import { Outlet } from 'react-router-dom';
import { TopBar } from './components/top-bar';
import { Sidebar } from './components/sidebar';
import { useSelector } from 'react-redux';
import type { RootState } from '@/common/store';

const TeacherSideLayout = ({ children }: { children?: React.ReactNode }) => {
  const { user } = useSelector((state: RootState) => state.auth);

  const displayName = user?.fullName || 'User'; 

  return (
    <div className='flex h-screen bg-neutral-50'>
      {/* Sidebar */}
      <Sidebar />
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Top bar */}
        <TopBar schoolName='SproutVR' userName={displayName} notificationCount={3} />
        <main className=' h-[calc(100vh-80px)]'>{children || <Outlet />}</main>
      </div>
    </div>
  );
};

export default TeacherSideLayout;
