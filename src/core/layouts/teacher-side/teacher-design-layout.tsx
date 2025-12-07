import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';

const TeacherDesignLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className='flex h-screen bg-neutral-50'>
      <div className='flex-1 flex flex-col overflow-hidden align-center my-auto'>
        {/* Top bar */}
        {/* <TopBar schoolName='Lincoln High School' userName='John Doe' notificationCount={3} /> */}
        <main className=' h-[calc(100vh)]'>{children || <Outlet />}</main>
      </div>
      <Toaster richColors closeButton position="top-center" />
    </div>
  );
};

export default TeacherDesignLayout;
