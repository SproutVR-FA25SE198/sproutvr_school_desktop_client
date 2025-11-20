import { Outlet } from 'react-router-dom';

const TeacherDesignLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className='flex h-screen bg-neutral-50'>
      <div className='flex-1 flex flex-col overflow-hidden align-center my-auto'>
        {/* Top bar */}
        {/* <TopBar schoolName='Lincoln High School' userName='John Doe' notificationCount={3} /> */}
        <main className=' h-[calc(100vh)]'>{children || <Outlet />}</main>
      </div>
    </div>
  );
};

export default TeacherDesignLayout;
