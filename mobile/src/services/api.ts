import axios, { AxiosInstance, AxiosError } from 'axios';
import { router } from 'expo-router';
import { useAuthStore } from '@store/authStore';
import { useConfigStore } from '@store/configStore';

// Function to get the current API base URL
const getApiBaseUrl = (): string => {
  const configuredUrl = useConfigStore.getState().getApiBaseUrl();
  return `${configuredUrl}/api/v1`;
};

// Create axios instance with dynamic baseURL
const api: AxiosInstance = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add baseURL dynamically and auth token
api.interceptors.request.use(
  (config) => {
    // Set baseURL dynamically from config store
    config.baseURL = getApiBaseUrl();

    // Add auth token
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshToken = useAuthStore.getState().refreshToken;
        if (refreshToken) {
          const response = await axios.post(`${getApiBaseUrl()}/auth/refresh`, {}, {
            headers: { Authorization: `Bearer ${refreshToken}` },
          });

          const { access_token } = response.data;
          useAuthStore.getState().setAccessToken(access_token);

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - logout user
        useAuthStore.getState().logout();
        router.replace('/(auth)/login');
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    return Promise.reject(error);
  }
);

export default api;
