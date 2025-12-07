import { getCurrentUser, login } from '@/common/services/auth.services';
import { removeAccessToken, setAccessToken } from '@/common/utils';

import { createAsyncThunk } from '@reduxjs/toolkit';

export const loginThunk = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, thunkAPI) => {
    try {
      const data = await login(email, password);

      // Save tokens securely
      setAccessToken(data.accessToken);

      // The http interceptor should auto-attach the token we just saved
      const userProfile = await getCurrentUser();

      // Return the Full Profile (Not just the decoded JWT)
      return userProfile;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Đăng nhập thất bại');
    }
  },
);

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  try {
    removeAccessToken();
  } catch {
    // even if failed, clear tokens
    removeAccessToken();
  }
});
