import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';

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

export const AdminUsersPage: React.FC = () => {
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
      await userService.updateUserStatus(selectedUser.id, actionType);
      setShowConfirmModal(false);
      fetchUsers();
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user status');
    }
  };

  if (loading) return <div className="p-4">Loading users...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Email</th>
              <th className="px-4 py-3 text-left font-semibold">Role</th>
              <th className="px-4 py-3 text-left font-semibold">Department</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{user.fullName}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3 capitalize">{user.role}</td>
                <td className="px-4 py-3">{user.department}</td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${
                    user.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {user.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {user.status === 'active' ? (
                    <button
                      onClick={() => handleStatusClick(user, 'disabled')}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                    >
                      Disable
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusClick(user, 'active')}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                    >
                      Activate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && !loading && (
          <div className="text-center p-4 text-gray-500">No users found</div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && selectedUser && actionType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Status Change</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to {actionType === 'active' ? 'activate' : 'disable'} <strong>{selectedUser.fullName}</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmStatusChange}
                className={`flex-1 text-white px-4 py-2 rounded ${
                  actionType === 'active'
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {actionType === 'active' ? 'Activate' : 'Disable'}
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
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
