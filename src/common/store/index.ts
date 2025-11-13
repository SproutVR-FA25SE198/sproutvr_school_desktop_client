import { configureStore } from '@reduxjs/toolkit';
import monitoringReducer from '@/features/learning-sessions/store/monitoringSlice';

export const store = configureStore({
  reducer: {
    monitoring: monitoringReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // gRPC streams sometimes send complex objects
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
