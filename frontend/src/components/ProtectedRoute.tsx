import React from 'react';
import { authService } from '../services/authService';

interface Props {
  children: React.ReactNode;
  onUnauthorized: () => void;
}

export const ProtectedRoute: React.FC<Props> = ({ children, onUnauthorized }) => {
  React.useEffect(() => {
    if (!authService.isAuthenticated()) {
      onUnauthorized();
    }
  }, [onUnauthorized]);

  if (!authService.isAuthenticated()) {
    return null;
  }

  return <>{children}</>;
};
