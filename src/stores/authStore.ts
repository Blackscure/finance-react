import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User } from '../types';
import { api } from '../utils/api';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../utils/api';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (username: string, password: string) => {
        try {
          const response = await fetch(`${API_BASE_URL}/authentication/login/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
          });
          

          if (!response.ok) {
            const err = await response.json();
            toast.error(err.message || 'Login failed');
            throw new Error(err.message || 'Login failed');
          }

          const data = await response.json();

          const userData: User = {
            id: data.user.id,
            username: data.user.username,
            email: data.user.email,
           
          };

          const token = data.token;

          set({
            user: userData,
            token,
            isAuthenticated: true
          });

          toast.success('Logged in successfully');
        } catch (error) {
          console.error('Login error:', error);
          toast.error('Login failed');
          throw error;
        }
      },

      register: async (username: string, email: string, password: string, password2: string) => {
        try {
          if (password !== password2) {
            throw new Error('Passwords do not match');
          }

          const response = await api.post('/authentication/register/', {
            username,
            email,
            password,
            password2,
          });

          if (!response.success) {
            throw new Error(response.error || 'Registration failed');
          }

          const { token, user } = response.data;

          set({
            user,
            token,
            isAuthenticated: true,
          });

          toast.success('Registered successfully');
        } catch (error) {
          if (error instanceof Error) {
            toast.error(error.message);
          } else {
            toast.error('Registration failed');
          }
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        toast.success('Logged out successfully');
      },

      logoutAll: () => {
        set({ user: null, token: null, isAuthenticated: false });
        // Optionally make an API call to invalidate all sessions here
        toast.success('Logged out from all devices');
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);
