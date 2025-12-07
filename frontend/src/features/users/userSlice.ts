import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiClient } from '@/services/apiClient';
import type { User, UserRole } from '@/types';

interface UserState {
  items: User[];
  loading: boolean;
  error?: string | null;
}

const initialState: UserState = {
  items: [],
  loading: false,
  error: null
};

export const fetchUsers = createAsyncThunk('users/fetchAll', async (_, thunkAPI) => {
  try {
    const { data } = await apiClient.get('/users');
    return data.data as User[];
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Unable to load users');
  }
});

interface CreateUserPayload {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  organizationId?: string;
  phone?: string;
  department?: string;
}

export const createUser = createAsyncThunk('users/create', async (payload: CreateUserPayload, thunkAPI) => {
  try {
    const { data } = await apiClient.post('/users', payload);
    return data.data as User;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Unable to create user');
  }
});

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  }
});

export default userSlice.reducer;

