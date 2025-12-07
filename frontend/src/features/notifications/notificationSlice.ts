import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiClient } from '@/services/apiClient';
import type { Notification } from '@/types';

interface NotificationState {
  items: Notification[];
  loading: boolean;
  error?: string | null;
}

const initialState: NotificationState = {
  items: [],
  loading: false,
  error: null
};

export const fetchNotifications = createAsyncThunk('notifications/fetchAll', async (_, thunkAPI) => {
  try {
    const { data } = await apiClient.get('/notifications');
    return data.data as Notification[];
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Unable to load notifications');
  }
});

export const markNotificationRead = createAsyncThunk('notifications/markRead', async (id: string, thunkAPI) => {
  try {
    const { data } = await apiClient.patch(`/notifications/${id}/read`);
    return data.data as Notification;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Unable to update notification');
  }
});

export const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        state.items = state.items.map((notification) =>
          notification.id === action.payload.id ? action.payload : notification
        );
      });
  }
});

export default notificationSlice.reducer;

