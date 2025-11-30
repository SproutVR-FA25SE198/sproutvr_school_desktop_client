import Loading from '@/common/components/loading';
import { type RootState } from '@/common/store';

import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import routes from '../configs/routes';

export default function AuthGuard() {
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);
  if (isLoading) {
    return <Loading isLoading />;
  }

  if (!isAuthenticated) {
    return <Navigate to={routes.login} replace />;
  }

  return <Outlet />;
}
