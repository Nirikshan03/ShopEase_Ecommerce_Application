import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken');
    // BUG FIX: Only add Bearer token if the request doesn't already have
    // an Authorization header set manually (e.g. Basic auth on /signIn).
    // Without this check, the interceptor overwrites the Basic header
    // with an old Bearer token and login always fails with auth=null.
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (!error.config?.url?.includes('/ecom/signIn')) {
        localStorage.clear();
        const isAdmin = window.location.pathname.startsWith('/admin');
        window.location.href = isAdmin ? '/admin-login' : '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
