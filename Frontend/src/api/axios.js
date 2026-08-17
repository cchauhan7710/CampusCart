import axios from 'axios';

// Base API URL from environment variable with local fallback
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Request Interceptor: Automatically attach JWT Access Token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global error logging / unauthorized handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("API Unauthorized - session may have expired.");
    }
    return Promise.reject(error);
  }
);

export default API;
