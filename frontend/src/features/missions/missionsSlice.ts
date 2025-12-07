import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiClient } from '@/services/apiClient';
import type { MissionRequest } from '@/types';

interface MissionState {
  items: MissionRequest[];
  selected?: MissionRequest | null;
  loading: boolean;
  error?: string | null;
}

const initialState: MissionState = {
  items: [],
  selected: null,
  loading: false,
  error: null
};

export const fetchMissions = createAsyncThunk('missions/fetchAll', async (_, thunkAPI) => {
  try {
    const { data } = await apiClient.get('/missions');
    return data.data as MissionRequest[];
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Unable to load missions');
  }
});

interface MissionPayload {
  purpose: string;
  destination: string;
  startDate: string;
  endDate: string;
  duration: number;
  estimatedCost: number;
}

export const createMission = createAsyncThunk('missions/create', async (payload: MissionPayload, thunkAPI) => {
  try {
    const { data } = await apiClient.post('/missions', payload);
    return data.data as MissionRequest;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Unable to create mission');
  }
});

interface MissionDecisionPayload {
  missionId: string;
  action: 'approve' | 'reject';
  comment?: string;
}

export const decideOnMission = createAsyncThunk(
  'missions/decide',
  async ({ missionId, action, comment }: MissionDecisionPayload, thunkAPI) => {
    try {
      const { data } = await apiClient.patch(`/missions/${missionId}/${action}`, { comment });
      return data.data as MissionRequest;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Unable to update mission');
    }
  }
);

export const missionsSlice = createSlice({
  name: 'missions',
  initialState,
  reducers: {
    setSelectedMission(state, action) {
      state.selected = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMissions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createMission.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(decideOnMission.fulfilled, (state, action) => {
        state.items = state.items.map((mission) =>
          mission.id === action.payload.id ? action.payload : mission
        );
        if (state.selected?.id === action.payload.id) {
          state.selected = action.payload;
        }
      });
  }
});

export const { setSelectedMission } = missionsSlice.actions;
export default missionsSlice.reducer;

