import axios from 'axios';
import { tokenStorage } from '@/utils/tokenStorage';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

const userAPI = axios.create({
  baseURL: `${API_BASE_URL}/users`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
userAPI.interceptors.request.use((config) => {
  const token = tokenStorage.access;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
userAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const userService = {
  // List all users
  listUsers: () => userAPI.get('/'),

  // Get user by ID
  getUserById: (id: string) => userAPI.get(`/${id}`),

  // Update user status
  updateUserStatus: (id: string, status: 'active' | 'disabled') => {
    console.log(`Updating user ${id} status to ${status}`);
    return userAPI.patch(`/${id}/status`, { status });
  },
};
