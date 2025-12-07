import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { LoginPage } from './LoginPage';
import { MissionRequestPage } from './MissionRequestPage';
import { ProtectedRoute } from '../components/ProtectedRoute';

export const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    if (authService.isAuthenticated()) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  const handleUnauthorized = () => {
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <>
      {isAuthenticated ? (
        <div>
          <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">MissionTrack</h1>
            <div className="flex items-center gap-4">
              <span>Welcome, {authService.getUser()?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </nav>
          <ProtectedRoute onUnauthorized={handleUnauthorized}>
            <MissionRequestPage />
          </ProtectedRoute>
        </div>
      ) : (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  );
};
