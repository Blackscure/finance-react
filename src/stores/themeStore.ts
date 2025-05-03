import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ThemeState } from '../types';

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
      
      toggleTheme: () => {
        set((state) => ({ 
          theme: state.theme === 'dark' ? 'light' : 'dark' 
        }));
      }
    }),
    {
      name: 'theme-storage'
    }
  )
);