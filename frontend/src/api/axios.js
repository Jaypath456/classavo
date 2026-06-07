import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

const AUTH_ENDPOINTS = ['/auth/login/', '/auth/register/'];

const isAuthEndpoint = (url = '') => (
  AUTH_ENDPOINTS.some((endpoint) => url.endsWith(endpoint))
);

api.interceptors.request.use((config) => {
  if (isAuthEndpoint(config.url)) {
    return config;
  }

  const token = sessionStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
