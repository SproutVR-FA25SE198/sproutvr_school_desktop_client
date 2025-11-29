import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { VRDevice, VRLearningSessionMonitor } from '../types/session-monitoring.type';

// This is the shape of one streaming event (from gRPC)
export interface RoomStateEvent {
  type: string; // "device_joined", "task_updated", etc.
  data: any; // payload varies
  vr_learning_session_id: string;
}

export interface VrMessage {
  type: string;
  data: any;
}

interface MonitoringState {
  roomState: VRLearningSessionMonitor | null; // <--- full room state
  roomStateEvents: RoomStateEvent[]; // <--- raw event logs
  vrMessages: VrMessage[]; // <--- VR device stream logs
  isConnected: boolean;
  error: string | null;
}

const initialState: MonitoringState = {
  roomState: null,
  roomStateEvents: [],
  vrMessages: [],
  isConnected: false,
  error: null,
};

const monitoringSlice = createSlice({
  name: 'monitoring',
  initialState,
  reducers: {
    // --------------------------------------------
    // STORE FULL SNAPSHOT (GetRoomState)
    // --------------------------------------------
    setRoomState(state, action: PayloadAction<VRLearningSessionMonitor>) {
      state.roomState = action.payload;
    },

    // --------------------------------------------
    // STORE RAW TEACHER STREAM EVENTS
    // --------------------------------------------
    teacherRoomUpdated(state, action: PayloadAction<RoomStateEvent>) {
      state.roomStateEvents.push(action.payload);
    },

    // --------------------------------------------
    // STORE RAW VR STREAM EVENTS
    // --------------------------------------------
    vrStreamUpdated(state, action: PayloadAction<VrMessage>) {
      state.vrMessages.push(action.payload);
    },

    // --------------------------------------------
    // APPLY STREAM EVENT TO roomState (MERGE)
    // --------------------------------------------
    applyRoomUpdate(state, action: PayloadAction<RoomStateEvent>) {
      const event = action.payload;
      const session = state.roomState;
      if (!session) return; // No snapshot loaded yet

      switch (event.type) {
        // DEVICE_JOINED or DEVICE_CONNECTED
        case 'device_joined': {
          const incomingDevice = event.data as VRDevice;

          // Find the specific device object in the array
          const existingDevice = session.devices.find(
            (d) => d.vr_device_serial_number === incomingDevice.vr_device_serial_number,
          );

          if (existingDevice) {
            // IF FOUND: Update the status to Connected
            existingDevice.status = 'Connected';

            // Optional: Update the student name in case it changed/was mapped recently
            if (incomingDevice.student_name) {
              existingDevice.student_name = incomingDevice.student_name;
            }
          } else {
            // IF NOT FOUND: Push the new device into the array
            // Ensure the incoming payload status is set, or force it here
            if (!incomingDevice.status) incomingDevice.status = 'Connected';
            session.devices.push(incomingDevice);
          }
          break;
        }

        // DEVICE_DISCONNECTED
        case 'device_disconnected': {
          const { vr_device_serial_number } = event.data;

          const device = session.devices.find((d) => d.vr_device_serial_number === vr_device_serial_number);
          if (device) {
            device.status = 'Disconnected';
          }
          break;
        }
        // ROOM_CANCELLED
        case 'room_ended': {
          session.status = 'Ended';
          break;
        }

        // TASK_UPDATED
        case 'task_updated': {
          const { vr_device_serial_number, vr_task_id, is_completed, is_correct } = event.data;

          const device = session.devices.find((d) => d.vr_device_serial_number === vr_device_serial_number);
          if (!device) break;

          const task = device.tasks.find((t) => t.vr_task_id === vr_task_id);
          if (task) {
            task.is_completed = is_completed;
            task.is_correct = is_correct;
          }
          break;
        }

        // ANY OTHER EVENT TYPES
        default:
          console.log('[monitoringSlice] Unhandled event:', event);
      }
    },

    grpcDisconnected(state) {
      state.isConnected = false;
    },

    grpcError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },

    // CLEAR LOGS IF NEEDED
    clearRoomEvents(state) {
      state.roomStateEvents = [];
    },

    clearVrMessages(state) {
      state.vrMessages = [];
    },
  },
});

export const {
  setRoomState,
  teacherRoomUpdated,
  vrStreamUpdated,
  applyRoomUpdate,
  grpcDisconnected,
  grpcError,
  clearRoomEvents,
  clearVrMessages,
} = monitoringSlice.actions;

export default monitoringSlice.reducer;
