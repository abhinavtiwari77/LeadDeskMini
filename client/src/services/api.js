import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for global error parsing
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standardize error message extraction
    const customError = {
      status: error.response?.status || 500,
      message:
        error.response?.data?.message ||
        'An unexpected server error occurred. Please try again.',
      errors: error.response?.data?.errors || [],
    };
    return Promise.reject(customError);
  }
);

export default api;
