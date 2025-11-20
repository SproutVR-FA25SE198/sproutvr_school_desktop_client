import Loading from '@/common/components/loading';
import { UserRole } from '@/common/utils/constants';
import { type RootState } from '@/common/store';

import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import routes from '../configs/routes';
import http from '@/common/utils/http';
import { useEffect } from 'react';

export default function AdminGuard() {
  const { user, isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

  const fetchProfile = async () => {
    const result = await http.get('/api/v1/auth/profile');
    console.log('profile', result.data);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (isLoading) {
    return <Loading isLoading />;
  }

  if (!isAuthenticated) {
    return <Navigate to={routes.login} replace />;
  }

  // Check if user has admin role
  if (!user?.roles.includes(UserRole.ADMIN)) {
    return <Navigate to={routes.home} replace />;
  }

  return <Outlet />;
}
