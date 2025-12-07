import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelectors';

export const ProtectedRoute = () => {
  const { tokens } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!tokens?.accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

