import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';
import { Category } from '../types';
import { api } from '../utils/api';
import { useAuthStore } from './authStore';
import { useTransactionStore } from './transactionStore';

interface CategoryState {
  categories: Category[];
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
      isLoading: false,
      error: null,

      fetchCategories: async () => {
        try {
          set({ isLoading: true, error: null });
      
          const token = useAuthStore.getState().token;
          const response = await api.get<any>('/finance/categories/', token);
      
          if (response.success && response.data) {
            const categories = response.data.data; // extract actual list
            set({ categories, isLoading: false });
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
        try {
          set({ isLoading: true, error: null });

          const { transactions } = useTransactionStore.getState();
          const isCategoryUsed = transactions.some((t) => t.category === id);

          if (isCategoryUsed) {
            throw new Error('Cannot delete a category that is used in transactions');
          }

          const response = await api.delete<null>(`/finance/categories/${id}/`);
          if (response.success) {
            set((state) => ({
              categories: state.categories.filter((c) => c.id !== id),
              isLoading: false,
            }));
            toast.success(response.message || 'Category deleted successfully');
          } else {
            throw new Error(response.error || 'Failed to delete category');
          }
        } catch (error) {
          const message =
            error instanceof Error ? error.message : 'Failed to delete category';
          set({ error: message, isLoading: false });
          toast.error(message);
        }
      },
    }),
    {
      name: 'category-storage',
    }
  )
);
