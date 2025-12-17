import { Outlet } from 'react-router-dom';
import { TopBar } from './components/top-bar';
import { useSelector } from 'react-redux';
import type { RootState } from '@/common/store';
import { Toaster } from 'sonner';

const TeacherSideLayout = ({ children }: { children?: React.ReactNode }) => {
  const { user } = useSelector((state: RootState) => state.auth);

  const displayName = user?.fullName || 'User';

  return (
    <div className='flex flex-col h-[calc(100vh)] bg-neutral-50'>
      {/* Top bar */}
      <TopBar schoolName='SproutVR' userName={displayName} notificationCount={3} />
      <main className='flex-1 overflow-auto'>{children || <Outlet />}</main>
      <Toaster richColors closeButton position='top-center' />
    </div>
  );
};

export default TeacherSideLayout;
