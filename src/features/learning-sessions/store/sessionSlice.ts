import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface SessionMetadata {
  vrLearningSessionId: string | null;
  startTimeUtc: string | null;
  endTimeUtc: string | null;
}

const initialState: SessionMetadata = {
  vrLearningSessionId: null,
  startTimeUtc: null,
  endTimeUtc: null,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSessionId(state, action: PayloadAction<string>) {
      state.vrLearningSessionId = action.payload;
    },
    setSessionTimes(
      state,
      action: PayloadAction<{
        start_time_at_utc: string;
        end_time_at_utc: string;
      }>,
    ) {
      state.startTimeUtc = action.payload.start_time_at_utc;
      state.endTimeUtc = action.payload.end_time_at_utc;
    },
    clearSession(state) {
      state.vrLearningSessionId = null;
      state.startTimeUtc = null;
      state.endTimeUtc = null;
    },
  },
});

export const { setSessionId, setSessionTimes, clearSession } = sessionSlice.actions;
export default sessionSlice.reducer;
