import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const userAPI = axios.create({
  baseURL: `${API_BASE_URL}/users`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
userAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const userService = {
  // List all users
  listUsers: () => userAPI.get('/'),

  // Get user by ID
  getUserById: (id: string) => userAPI.get(`/${id}`),

  // Update user status
  updateUserStatus: (id: string, status: 'active' | 'disabled') =>
    userAPI.patch(`/${id}/status`, { status }),
};
