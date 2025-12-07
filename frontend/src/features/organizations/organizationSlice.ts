import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiClient } from '@/services/apiClient';
import type { Organization } from '@/types';

interface OrganizationState {
  pending: Organization[];
  loading: boolean;
  error?: string | null;
}

const initialState: OrganizationState = {
  pending: [],
  loading: false,
  error: null
};

export const fetchPendingOrganizations = createAsyncThunk(
  'organizations/fetchPending',
  async (_, thunkAPI) => {
    try {
      const { data } = await apiClient.get('/organizations/pending');
      return data.data as Organization[];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Unable to load organizations');
    }
  }
);

export const approveOrganization = createAsyncThunk('organizations/approve', async (id: string, thunkAPI) => {
  try {
    const { data } = await apiClient.patch(`/organizations/${id}/approve`);
    return data.data as Organization;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Unable to approve organization');
  }
});

export const organizationSlice = createSlice({
  name: 'organizations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingOrganizations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingOrganizations.fulfilled, (state, action) => {
        state.loading = false;
        state.pending = action.payload;
      })
      .addCase(fetchPendingOrganizations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(approveOrganization.fulfilled, (state, action) => {
        state.pending = state.pending.filter((org) => org.id !== action.payload.id);
      });
  }
});

export default organizationSlice.reducer;

