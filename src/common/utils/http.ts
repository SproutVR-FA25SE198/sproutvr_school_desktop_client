import axios, { AxiosError, type AxiosInstance } from 'axios';

import { HTTP_STATUS } from './constants';
import { getAccessToken, removeAccessToken, setAccessToken } from './cookies';
import { getRuntimeConfigSync, initializeRuntimeConfig } from '@/core/configs/runtime-config';

class Http {
  instance: AxiosInstance;

  // Accept optional base url string
  constructor(baseUrl?: string) {
    const config = getRuntimeConfigSync();
    this.instance = axios.create({
      baseURL: baseUrl || config.BASE_URL || import.meta.env.VITE_BASE_URL,
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

// Get runtime config for creating HTTP instances
const runtimeConfig = getRuntimeConfigSync();

const http = new Http().instance;

export const http_provider = new Http(runtimeConfig.PROVIDER_URL || import.meta.env.VITE_PROVIDER_URL).instance;

export const http_school = new Http(runtimeConfig.SCHOOL_URL || import.meta.env.VITE_SCHOOL_URL).instance;

export default http;

/**
 * Re-initialize HTTP instances with updated runtime config.
 * Call this after runtime config has been loaded.
 */
export async function reinitializeHttpClients(): Promise<void> {
  await initializeRuntimeConfig();
  const config = getRuntimeConfigSync();
  
  // Note: Since axios instances are already created, we need to update baseURL
  http_provider.defaults.baseURL = config.PROVIDER_URL;
  http_school.defaults.baseURL = config.SCHOOL_URL;
  http.defaults.baseURL = config.BASE_URL;
  
  console.log('[HTTP] Clients reinitialized with runtime config:', {
    PROVIDER_URL: config.PROVIDER_URL,
    SCHOOL_URL: config.SCHOOL_URL,
    BASE_URL: config.BASE_URL,
  });
}
