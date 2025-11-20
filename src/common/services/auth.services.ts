import http from '../utils/http';

export const login = async (email: string, password: string) => {
  const response = await http.post(`/api/v1/auth/login`, { identifier: email, password });
  return response.data;
};
