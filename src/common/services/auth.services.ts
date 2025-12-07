import { http_school } from '../utils/http';

export const login = async (email: string, password: string) => {
  const response = await http_school.post(`/api/v1/auth/login`, { identifier: email, password });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await http_school.get('/api/v1/auth/profile'); 
  return response.data;
};

export const changePassword = async (CurrentPassword: string, NewPassword: string, ConfirmNewPassword: string) => {
  const response = await http_school.patch('/api/v1/auth/change-password', {CurrentPassword, NewPassword, ConfirmNewPassword});
  return response.data;
} 