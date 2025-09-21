import api from './api';
import { API_ENDPOINTS } from '@/utils/constants';
import type { LoginRequest, LoginResponse, ApiResponse } from '@/types';

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await api.post<ApiResponse<LoginResponse>>(
        API_ENDPOINTS.LOGIN,
        credentials
      );
      if (response.data.success && response.data.data) {
        const { token, user } = response.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return response.data.data;
      } else {
        throw new Error(response.data.error || response.data.message || 'Login failed');
      }
    } catch (error: any) {
      let errorMessage = 'Login failed';

      if (error.response) {
        const { status, data } = error.response;
        if (status === 401) {
          errorMessage = data.error || data.message || 'Invalid credentials';
        } else if (status === 400) {
          errorMessage = data.error || data.message || 'Bad request';
        } else if (status >= 500) {
          errorMessage = data.error || data.message || 'Server error';
        } else {
          errorMessage = data.error || data.message || `Error ${status}`;
        }
      } else if (error.request) {
        errorMessage = 'Network error - please check your connection';
      } else {
        errorMessage = error.message || 'An unexpected error occurred';
      }
      throw new Error(errorMessage);
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

