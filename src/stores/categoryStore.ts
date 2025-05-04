import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';
import { Category } from '../types';
import { api } from '../utils/api';
import { useAuthStore } from './authStore';
import { useTransactionStore } from './transactionStore';

interface CategoryState {
  categories: Category[];
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  addCategory: (name: string) => Promise<void>;
  updateCategory: (id: number, name: string) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      categories: [],
      currentPage: 1,
      totalPages: 1,
      isLoading: false,
      error: null,

      fetchCategories: async (page = 1) => {
        try {
          set({ isLoading: true, error: null });
    
          const token = useAuthStore.getState().token;
          const response = await api.get<any>(`/finance/categories/?page=${page}`, token);
    
          if (response.success && response.data) {
            const { data, current_page, pages } = response.data;
            set({
              categories: data,
              currentPage: current_page,
              totalPages: pages,
              isLoading: false,
            });
          } else {
            throw new Error(response.error || 'Failed to fetch categories');
          }
        } catch (error) {
          const message =
            error instanceof Error ? error.message : 'Failed to fetch categories';
          set({ error: message, isLoading: false });
          toast.error(message);
        }
      },
      

      addCategory: async (name: string) => {
        try {
          set({ isLoading: true, error: null });
      
          const token = useAuthStore.getState().token;
          const response = await api.post<{ name: string }, any>(
            '/finance/categories/',
            { name },
            token
          );
      
          if (response.data.success) {
            toast.success(response.data.message || 'Category added successfully');
          } else {
            throw new Error(response.data.message || 'Failed to add category');
          }
          
          set({ isLoading: false });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : 'Failed to add category';
          set({ error: message, isLoading: false });
          toast.error(message);
        }
      },
      
      
      updateCategory: async (id: number, name: string) => {
        try {
          set({ isLoading: true, error: null });

          const response = await api.put<{ name: string }, Category>(
            `/finance/categories/${id}/`,
            { name }
          );

          if (response.success && response.data) {
            set((state) => ({
              categories: state.categories.map((category) =>
                category.id === id ? response.data : category
              ),
              isLoading: false,
            }));
            toast.success(response.message || 'Category updated successfully');
          } else {
            throw new Error(response.error || 'Failed to update category');
          }
        } catch (error) {
          const message =
            error instanceof Error ? error.message : 'Failed to update category';
          set({ error: message, isLoading: false });
          toast.error(message);
        }
      },

      deleteCategory: async (id: number) => {
        const token = useAuthStore.getState().token;
        await api.delete(`/finance/categories/${id}/`, token);
        // Optionally re-fetch current page
        const currentPage = useCategoryStore.getState().currentPage;
        await useCategoryStore.getState().fetchCategories(currentPage);
      },
    }),
    {
      name: 'category-storage',
    }
  )
);
