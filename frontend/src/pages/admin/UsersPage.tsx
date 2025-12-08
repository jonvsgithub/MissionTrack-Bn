import React, { useState, useEffect } from 'react';
import { userService } from '@/services/userService';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: 'active' | 'disabled';
  department: string;
  phone: string;
  createdAt: string;
}

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState<'active' | 'disabled' | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.listUsers();
      setUsers(response.data.data || []);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusClick = (user: User, newStatus: 'active' | 'disabled') => {
    setSelectedUser(user);
    setActionType(newStatus);
    setShowConfirmModal(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedUser || !actionType) return;

    try {
      // Immediately update the UI
      setUsers(users.map(u =>
        u.id === selectedUser.id ? { ...u, status: actionType } : u
      ));
      setSelectedUser(null);
      setShowConfirmModal(false);
      
      // Then update on backend
      await userService.updateUserStatus(selectedUser.id, actionType);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user status');
      // Revert on error
      fetchUsers();
    }
  };

  if (loading) return <div className="p-4">Loading users...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">User Management</h1>
        <p className="text-gray-600 mb-6">Manage and control user account status</p>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-600 to-blue-700">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-white">Name</th>
                <th className="px-6 py-4 text-left font-semibold text-white">Email</th>
                <th className="px-6 py-4 text-left font-semibold text-white">Role</th>
                <th className="px-6 py-4 text-left font-semibold text-white">Department</th>
                <th className="px-6 py-4 text-center font-semibold text-white">Status</th>
                <th className="px-6 py-4 text-center font-semibold text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-blue-50 transition duration-150">
                  <td className="px-6 py-4 font-medium text-gray-900">{user.fullName}</td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-800">
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.department || '-'}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status === 'active' ? '✓ ACTIVE' : '✗ DISABLED'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {user.status === 'active' ? (
                      <button
                        onClick={() => handleStatusClick(user, 'disabled')}
                        className="inline-flex items-center px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition duration-200 shadow-md hover:shadow-lg"
                      >
                        ✗ Disable
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusClick(user, 'active')}
                        className="inline-flex items-center px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold transition duration-200 shadow-md hover:shadow-lg"
                      >
                        ✓ Activate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No users found</p>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && selectedUser && actionType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full transform transition">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 0v2m0-6v-2m0 0V7a2 2 0 012-2h2.586a1 1 0 00.707-.293l2.414-2.414a2 2 0 112.828 2.828l-2.414 2.414a1 1 0 00-.293.707V9a2 2 0 01-2 2m0 0H9a2 2 0 01-2-2V7a2 2 0 012-2h2.586" />
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-4">Confirm Status Change</h3>
            
            <p className="text-center text-gray-600 mb-6">
              Are you sure you want to <strong className={actionType === 'active' ? 'text-green-600' : 'text-red-600'}>
                {actionType === 'active' ? 'activate' : 'disable'}
              </strong> <strong>{selectedUser.fullName}</strong>?
            </p>
            
            <div className="flex gap-4">
              <button
                onClick={confirmStatusChange}
                className={`flex-1 text-white font-bold py-3 px-4 rounded-lg transition duration-200 ${
                  actionType === 'active'
                    ? 'bg-green-500 hover:bg-green-600 shadow-md hover:shadow-lg'
                    : 'bg-red-500 hover:bg-red-600 shadow-md hover:shadow-lg'
                }`}
              >
                {actionType === 'active' ? '✓ Activate' : '✗ Disable'}
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

