import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach JWT Token
api.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem('retail_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user && user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (e) {
        console.error('Error parsing token from storage', e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
