import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { apiClient } from '@/services/apiClient';
import { tokenStorage } from '@/utils/tokenStorage';
import type { User } from '@/types';

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthState {
  user: User | null;
  tokens: Tokens | null;
  status: 'idle' | 'loading' | 'authenticated' | 'error';
  error?: string | null;
}

const loadInitialTokens = (): Tokens | null => {
  const accessToken = tokenStorage.access;
  const refreshToken = tokenStorage.refresh;
  if (accessToken && refreshToken) {
    return { accessToken, refreshToken };
  }
  return null;
};

const USER_KEY = 'missiontrack_user';

const loadUser = (): User | null => {
  try {
    const cached = localStorage.getItem(USER_KEY);
    if (!cached) return null;
    return JSON.parse(cached) as User;
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  user: loadUser(),
  tokens: loadInitialTokens(),
  status: 'idle',
  error: null
};

interface LoginPayload {
  email: string;
  password: string;
}

export const login = createAsyncThunk('auth/login', async (payload: LoginPayload, thunkAPI) => {
  try {
    const { data } = await apiClient.post('/auth/login', payload);
    return data.data as { user: User; tokens: Tokens };
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

export const registerOrganization = createAsyncThunk(
  'auth/registerOrganization',
  async (payload: FormData, thunkAPI) => {
    try {
      const { data } = await apiClient.post('/auth/register-organization', payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.tokens = null;
      state.status = 'idle';
      state.error = null;
      tokenStorage.clear();
      localStorage.removeItem(USER_KEY);
    },
    hydrateSession(state, action: PayloadAction<{ user: User | null }>) {
      state.user = action.payload.user;
      state.tokens = loadInitialTokens();
      state.status = state.tokens && state.user ? 'authenticated' : 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'authenticated';
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
        tokenStorage.access = action.payload.tokens.accessToken;
        tokenStorage.refresh = action.payload.tokens.refreshToken;
        localStorage.setItem(USER_KEY, JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload as string;
      })
      .addCase(registerOrganization.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerOrganization.fulfilled, (state) => {
        state.status = 'idle';
      })
      .addCase(registerOrganization.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload as string;
      });
  }
});

export const { logout, hydrateSession } = authSlice.actions;
export default authSlice.reducer;

