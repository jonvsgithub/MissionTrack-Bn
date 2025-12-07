import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const missionAPI = axios.create({
  baseURL: `${API_BASE_URL}/missions`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
missionAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const missionService = {
  // List all missions
  listMissions: () => missionAPI.get('/'),

  // Get mission by ID
  getMissionById: (id: string) => missionAPI.get(`/${id}`),

  // Create new mission
  createMission: (data: any) => missionAPI.post('/', data),

  // Approve mission
  approveMission: (id: string, data: any) => missionAPI.patch(`/${id}/approve`, data),

  // Reject mission
  rejectMission: (id: string, data: any) => missionAPI.patch(`/${id}/reject`, data),
};
