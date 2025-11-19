import { configureStore } from '@reduxjs/toolkit';
import monitoringReducer from '@/features/learning-sessions/store/monitoringSlice';
import sessionReducer from '@/features/learning-sessions/store/sessionSlice';

export const store = configureStore({
  reducer: {
    monitoring: monitoringReducer,
    session: sessionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // gRPC streams sometimes send complex objects
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
