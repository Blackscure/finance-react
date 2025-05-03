import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User } from '../types';
import { api } from '../utils/api';
import toast from 'react-hot-toast';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: async (email: string, password: string) => {
        try {
          // In a real application, this would be an API call
          // For this demo, we'll simulate a successful login
          const userData: User = {
            id: '1',
            username: email.split('@')[0],
            email
          };
          
          const token = 'demo-token-' + Math.random().toString(36).substring(2);
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 800));
          
          set({ 
            user: userData, 
            token, 
            isAuthenticated: true 
          });
          
          toast.success('Logged in successfully');
          return;
        } catch (error) {
          toast.error('Login failed');
          throw error;
        }
      },
      
      register: async (username: string, email: string, password: string, password2: string) => {
        try {
          if (password !== password2) {
            throw new Error('Passwords do not match');
          }
          
          // In a real application, this would be an API call
          // For this demo, we'll simulate a successful registration
          const userData: User = {
            id: '1',
            username,
            email
          };
          
          const token = 'demo-token-' + Math.random().toString(36).substring(2);
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 800));
          
          set({ 
            user: userData, 
            token, 
            isAuthenticated: true 
          });
          
          toast.success('Registered successfully');
          return;
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
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);