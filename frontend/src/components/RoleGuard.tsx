import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelectors';
import type { UserRole } from '@/types';

interface RoleGuardProps {
  allowed: UserRole[] | UserRole;
  children: ReactNode;
}

export const RoleGuard = ({ allowed, children }: RoleGuardProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const roles = Array.isArray(allowed) ? allowed : [allowed];
  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/app/overview" replace />;
  }
  return <>{children}</>;
};

