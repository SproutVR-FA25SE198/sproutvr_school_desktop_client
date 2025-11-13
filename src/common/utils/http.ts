import configs from '@/core/configs/routes';

import axios, { AxiosError, type AxiosInstance } from 'axios';

import { HTTP_STATUS } from './constants';

class Http {
  //   private accessToken: string;
  //   private refreshToken: string;
  instance: AxiosInstance;

  // Accept optional base url string
  constructor(baseUrl?: string) {
    this.instance = axios.create({
      baseURL: baseUrl || import.meta.env.VITE_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        // Authorization: getAccessToken() || '',
      },
    });
    this.instance.interceptors.request.use(
      (config) => {
        // if (this.accessToken && config.headers) {
        //   config.headers.Authorization = `Bearer ${this.accessToken}`;
        //   return config;
        // }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );
    this.instance.interceptors.response.use(
      (response) => {
        const { url, method } = response.config;
        if (method === 'post' && url?.includes('token/refresh')) {
          if (response.data.access_token) {
            // this.accessToken = response.data.access_token;
            // this.refreshToken = response.data.refresh_token;
            // setAccessToken(this.accessToken);
            // setRefreshToken(this.refreshToken);
          }
        } else if (method === 'post' && url?.includes('sign-in')) {
          if (response.data.data.access_token) {
            // this.accessToken = response.data.data.access_token;
            // this.refreshToken = response.data.data.refresh_token;
            // setAccessToken(this.accessToken);
            // setRefreshToken(this.refreshToken);
          }
        } else if (url === configs.logout) {
          //   this.accessToken = '';
          //   this.refreshToken = '';
          //   removeAccessToken();
          //   removeRefreshToken();
        }
        return response;
      },
      (error: AxiosError) => {
        if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
          //   removeAccessToken();
          //   removeRefreshToken();
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
