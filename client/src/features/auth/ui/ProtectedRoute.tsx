import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../model/store';
import type { UserRole } from '@/entities/user';
import Spinner from '@/shared/ui/Spinner';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[]; // Prop is now optional
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);
  const location = useLocation();

  if (isAuthLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  const isRoleAllowed = allowedRoles ? allowedRoles.includes(user.role) : true;
  if (!isRoleAllowed) {
    return <Navigate to='/' replace />;
  }

  return <Outlet />;
};
