import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { VRLearningSession, VRDevice, VRTask } from '../services/session.type';

interface MonitoringState {
  session: VRLearningSession | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: MonitoringState = {
  session: null,
  isLoading: false,
  error: null,
};

const monitoringSlice = createSlice({
  name: 'monitoring',
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    setSession(state, action: PayloadAction<VRLearningSession>) {
      state.session = action.payload;
      state.isLoading = false;
    },
    updateDevice(state, action: PayloadAction<VRDevice>) {
      if (!state.session) return;
      const index = state.session.devices.findIndex(
        (d) => d.vr_device_serial_number === action.payload.vr_device_serial_number,
      );
      if (index !== -1) state.session.devices[index] = action.payload;
    },
    updateTask(
      state,
      action: PayloadAction<{
        deviceSerial: string;
        task: VRTask;
      }>,
    ) {
      if (!state.session) return;
      const device = state.session.devices.find((d) => d.vr_device_serial_number === action.payload.deviceSerial);
      if (!device) return;
      const taskIndex = device.tasks.findIndex((t) => t.vr_task_id === action.payload.task.vr_task_id);
      if (taskIndex !== -1) {
        device.tasks[taskIndex] = action.payload.task;
      }
    },
    endSession(state) {
      state.session = null;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { startLoading, setSession, updateDevice, updateTask, endSession, setError } = monitoringSlice.actions;
export default monitoringSlice.reducer;
