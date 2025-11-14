import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { VRLearningSession } from '../services/session.type';

interface RoomStateEvent extends VRLearningSession {}

interface VrMessage {
  // Define your VR message structure
  device_serial?: string;
  data?: any;
  // Add other fields from your proto
}

interface GrpcState {
  roomStateEvents: RoomStateEvent[];
  vrMessages: VrMessage[];
  isConnected: boolean;
  error: string | null;
}

const initialState: GrpcState = {
  roomStateEvents: [],
  vrMessages: [],
  isConnected: false,
  error: null,
};

const monitoringSlice = createSlice({
  name: 'monitoring',
  initialState,
  reducers: {
    teacherRoomUpdated(state, action: PayloadAction<RoomStateEvent>) {
      state.roomStateEvents.push(action.payload);
      state.isConnected = true;
      state.error = null;
    },
    vrStreamUpdated(state, action: PayloadAction<VrMessage>) {
      state.vrMessages.push(action.payload);
    },
    grpcError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isConnected = false;
    },
    grpcDisconnected(state) {
      state.isConnected = false;
    },
    clearRoomEvents(state) {
      state.roomStateEvents = [];
    },
    clearVrMessages(state) {
      state.vrMessages = [];
    },
  },
});

export const { teacherRoomUpdated, vrStreamUpdated, grpcError, grpcDisconnected, clearRoomEvents, clearVrMessages } =
  monitoringSlice.actions;

export default monitoringSlice.reducer;
