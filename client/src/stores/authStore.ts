import { create } from 'zustand';
import { User } from '@/types';
import { authService } from '@/services/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await authService.login({ email, password });
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    authService.logout();
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  initializeAuth: () => {
    const user = authService.getCurrentUser();
    const isAuthenticated = authService.isAuthenticated();
    set({
      user,
      isAuthenticated,
      isLoading: false,
    });
  },
}));
