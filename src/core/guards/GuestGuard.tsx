import Loading from '@/common/components/loading';
import { type RootState } from '@/common/store';

import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import routes from '../configs/routes';
import { UserRole } from '@/common/utils/constants';

export default function GuestGuard() {
  const { isAuthenticated, isLoading, user } = useSelector((state: RootState) => state.auth);

  if (isLoading) {
    return <Loading isLoading />;
  }
  if (isAuthenticated) {
    return <Navigate to={user?.roles[0] === UserRole.ADMIN ? routes.adminDashboard : routes.home} replace />;
  }

  return <Outlet />;
}
