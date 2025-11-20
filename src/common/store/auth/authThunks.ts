import { login } from '@/common/services/auth.services';
import { removeAccessToken, setAccessToken } from '@/common/utils';
import JwtDecode from '@/common/utils/jwt-decode';

import { createAsyncThunk } from '@reduxjs/toolkit';

export const loginThunk = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, thunkAPI) => {
    try {
      const data = await login(email, password);

      // Save tokens securely
      setAccessToken(data.accessToken);

      return JwtDecode(data.accessToken);
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
