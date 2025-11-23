import { getAccessToken } from '@/common/utils';
import http, { http_provider, http_school } from '@/common/utils/http';

import { loginThunk, logoutThunk } from './authThunks';
import { type User } from './authTypes';

import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload as User;
        http.defaults.headers['Authorization'] = `Bearer ${getAccessToken()}`;
        http_school.defaults.headers['Authorization'] = `Bearer ${getAccessToken()}`;
        http_provider.defaults.headers['Authorization'] = `Bearer ${getAccessToken()}`;
        state.error = null;
        // dispatch(fetchBasketThunk());
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        http.defaults.headers['Authorization'] = '';
        http_school.defaults.headers['Authorization'] = '';
        http_provider.defaults.headers['Authorization'] = '';
      })
      //   // CHECK AUTH
      //   .addCase(checkAuthThunk.pending, (state) => {
      //     state.isLoading = true;
      //   })
      //   .addCase(checkAuthThunk.fulfilled, (state, action) => {
      //     state.isLoading = false;
      //     state.isAuthenticated = true;
      //     state.user = action.payload;
      //   })
      //   .addCase(checkAuthThunk.rejected, (state) => {
      //     state.isLoading = false;
      //     state.isAuthenticated = false;
      //     state.user = null;
      //   })
      // LOGOUT
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        http.defaults.headers['Authorization'] = '';
        http_school.defaults.headers['Authorization'] = '';
        http_provider.defaults.headers['Authorization'] = '';
      });
  },
});

export default authSlice.reducer;
