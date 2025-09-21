import api from './api';
import { API_ENDPOINTS } from '@/utils/constants';
import type { LoginRequest, LoginResponse, ApiResponse } from '@/types';

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      console.log("🛠️ [authService] Making login request to:", API_ENDPOINTS.LOGIN);
      
      const response = await api.post<ApiResponse<LoginResponse>>(
        API_ENDPOINTS.LOGIN,
        credentials
      );
      
      console.log("✅ [authService] API response received:", response.data);
      
      // Check if the response indicates success
      if (response.data.success && response.data.data) {
        const { token, user } = response.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        console.log("✅ [authService] Login successful, token saved");
        return response.data.data;
      } else {
        // Server returned success: false
        console.log("❌ [authService] Server error response:", response.data);
        throw new Error(response.data.error || response.data.message || 'Login failed');
      }
    } catch (error: any) {
      // Handle network/axios errors
      console.log("❌ [authService] Network/axios error:", error);
      console.log("❌ [authService] Error response data:", error.response?.data);
      console.log("❌ [authService] Error status:", error.response?.status);
      
      // ✅ Extract error message from axios error response
      let errorMessage = 'Login failed';
      
      if (error.response) {
        // Server responded with error status (4xx, 5xx)
        const { status, data } = error.response;
        console.log("❌ [authService] Status:", status, "Data:", data);
        
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
        // Network error (no response)
        errorMessage = 'Network error - please check your connection';
      } else {
        // Other errors
        errorMessage = error.message || 'An unexpected error occurred';
      }
      
      console.log("❌ [authService] Final error message:", errorMessage);
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


// import api from './api';
// import { API_ENDPOINTS } from '@/utils/constants';
// import type { LoginRequest, LoginResponse, ApiResponse } from '@/types';

// export const authService = {
//   login: async (credentials: LoginRequest): Promise<LoginResponse> => {
//     const response = await api.post<ApiResponse<LoginResponse>>(
//       API_ENDPOINTS.LOGIN,
//       credentials
//     );
    
//     if (response.data.success && response.data.data) {
//       const { token, user } = response.data.data;
//       localStorage.setItem('token', token);
//       localStorage.setItem('user', JSON.stringify(user));
//       return response.data.data;
//     }
    
//     throw new Error(response.data.error || 'Login failed');
//   },

//   logout: () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//   },

//   getCurrentUser: () => {
//     const userStr = localStorage.getItem('user');
//     return userStr ? JSON.parse(userStr) : null;
//   },

//   getToken: () => {
//     return localStorage.getItem('token');
//   },

//   isAuthenticated: () => {
//     return !!localStorage.getItem('token');
//   },
// };
