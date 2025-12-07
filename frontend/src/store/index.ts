import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import missionsReducer from '@/features/missions/missionsSlice';
import organizationsReducer from '@/features/organizations/organizationSlice';
import usersReducer from '@/features/users/userSlice';
import notificationsReducer from '@/features/notifications/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    missions: missionsReducer,
    organizations: organizationsReducer,
    users: usersReducer,
    notifications: notificationsReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

