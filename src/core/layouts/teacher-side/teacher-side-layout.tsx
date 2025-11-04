import { Outlet } from 'react-router-dom';
import { TopBar } from './components/top-bar';
import { Sidebar } from './components/sidebar';

const TeacherSideLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className='flex h-screen bg-neutral-50'>
      {/* Sidebar */}
      <Sidebar />
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Top bar */}
        <TopBar schoolName='Lincoln High School' userName='John Doe' notificationCount={3} />
        <main className=' h-[calc(100vh-80px)]'>{children || <Outlet />}</main>
      </div>
    </div>
  );
};

export default TeacherSideLayout;
