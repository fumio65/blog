import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/"
const BLOG_API_URL = `${API_BASE_URL}blogs/`
const AUTH_API_URL = `${API_BASE_URL}auth/`

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token refresh on 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${AUTH_API_URL}token/refresh/`, {
            refresh: refreshToken
          });
          
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Authentication API functions
export const login = async (credentials) => {
  const res = await axios.post(`${AUTH_API_URL}login/`, credentials);
  return res.data;
};

export const register = async (userData) => {
  const res = await axios.post(`${AUTH_API_URL}register/`, userData);
  return res.data;
};

export const logout = async (refreshToken) => {
  const res = await api.post(`auth/logout/`, { refresh: refreshToken });
  return res.data;
};

export const getUserProfile = async () => {
  const res = await api.get(`auth/profile/`);
  return res.data;
};

export const updateUserProfile = async (userData) => {
  const res = await api.patch(`auth/profile/`, userData);
  return res.data;
};

// Blog API functions
export const getBlogById = async (id) => {
  const res = await api.get(`blogs/${id}/`);
  return res.data;
};

export const updateBlog = async (id, update) => {
  const res = await api.patch(`blogs/${id}/`, update);
  return res.data;
};

export const deleteBlog = async (id) => {
  const res = await api.delete(`blogs/${id}/`);
  return res.data;
};

export const getBlogs = async () => {
  const res = await api.get(`blogs/`);
  return res.data;
};

export const createBlog = async (payload) => {
  const res = await api.post(`blogs/`, payload);
  return res.data;
};
