import axios, { AxiosError, type AxiosInstance } from 'axios';

import { HTTP_STATUS } from './constants';
import { getAccessToken, removeAccessToken, setAccessToken } from './cookies';

class Http {
  instance: AxiosInstance;

  // Accept optional base url string
  constructor(baseUrl?: string) {
    this.instance = axios.create({
      baseURL: baseUrl || import.meta.env.VITE_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    this.instance.interceptors.request.use(
      (config) => {
        // Always try to get the latest token from LocalStorage
        const token = getAccessToken();
        
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );
    this.instance.interceptors.response.use(
      (response) => {
        const { url, method } = response.config;
        if (method === 'post' && (url?.includes('token/refresh') || url?.includes('sign-in'))) {
            const data = response.data.data || response.data; 
            if (data?.accessToken) {
                setAccessToken(data.accessToken);
                // setRefreshToken(data.refreshToken);
            }
        } else if (url?.endsWith('/logout')) {
          removeAccessToken();
           // removeRefreshToken();
        }
        return response;
      },
      (error: AxiosError) => {
        if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
          // Safety Check: Do not clear token if the 401 came from the Login endpoint itself
          const isLoginRequest = error.config?.url?.includes('sign-in') || error.config?.url?.includes('login');

          if (!isLoginRequest) {
            removeAccessToken();
            // Optional: Force hard redirect if AuthGuard doesn't catch it
            // window.location.href = '/login'; 
          }
        }

        return Promise.reject(error);
      },
    );
  }
}

const http = new Http().instance;

export const http_provider = new Http(import.meta.env.VITE_PROVIDER_URL).instance;

export const http_school = new Http(import.meta.env.VITE_SCHOOL_URL).instance;

export default http;
