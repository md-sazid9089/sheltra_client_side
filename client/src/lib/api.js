import axios from 'axios';
import { storage } from './storage';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      storage.removeToken();
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Forbidden - user doesn't have permission
      console.error('Access Forbidden:', error.response.data);
    } else if (error.response?.status === 404) {
      // Not Found
      console.error('Resource not found:', error.response.data);
    } else if (error.response?.status === 422) {
      // Validation Error - pass through for form handling
      return Promise.reject(error);
    } else if (error.response?.status >= 500) {
      // Server Error
      console.error('Server error:', error.response.status, error.response.data);
    } else if (!error.response) {
      // Network error
      console.error('Network error. Please check your connection.', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;

export const refugeeApi = {
  analyzeCv: async ({ cvText, targetRole, targetCountry }) => {
    const response = await api.post('/refugee/cv-analyze', {
      cv_text: cvText,
      target_role: targetRole,
      target_country: targetCountry,
    });

    return response.data;
  },
};
