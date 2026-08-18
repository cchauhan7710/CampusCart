import axios from 'axios';

/**
 * Dynamically resolves and normalizes the Backend API base URL.
 * Handles common environment variable formatting variations:
 * - https://backend.onrender.com       -> https://backend.onrender.com/api
 * - https://backend.onrender.com/     -> https://backend.onrender.com/api
 * - https://backend.onrender.com/api  -> https://backend.onrender.com/api
 * - /api                               -> /api
 */
export const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  
  if (!envUrl) {
    return 'http://localhost:5000/api';
  }

  let cleaned = envUrl.trim().replace(/\/+$/, '');
  
  // If user provided origin URL without /api path, append /api automatically
  if (cleaned.startsWith('http') && !cleaned.endsWith('/api')) {
    cleaned = `${cleaned}/api`;
  }
  
  return cleaned;
};

export const API_BASE_URL = getApiBaseUrl();

console.log(`[CampusCart API] Connecting to: ${API_BASE_URL}`);

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
      console.warn("[CampusCart API] Unauthorized response (401) - session may have expired.");
    }
    return Promise.reject(error);
  }
);

export default API;
