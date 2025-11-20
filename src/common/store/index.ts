import { configureStore } from '@reduxjs/toolkit';
import monitoringReducer from '@/features/learning-sessions/store/monitoringSlice';
import sessionReducer from '@/features/learning-sessions/store/sessionSlice';
import authReducer from './auth/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
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
