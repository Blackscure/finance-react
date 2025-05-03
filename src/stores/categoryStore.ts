import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Category } from '../types';
import toast from 'react-hot-toast';

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  addCategory: (name: string) => Promise<void>;
  updateCategory: (id: number, name: string) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
}

// Initial demo data
const initialCategories: Category[] = [
  { id: 1, name: 'Food & Drinks' },
  { id: 2, name: 'Transportation' },
  { id: 3, name: 'Housing' },
  { id: 4, name: 'Entertainment' },
  { id: 5, name: 'Utilities' },
  { id: 6, name: 'Healthcare' },
  { id: 7, name: 'Salary' },
  { id: 8, name: 'Investments' }
];

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      categories: initialCategories,
      isLoading: false,
      error: null,
      
      fetchCategories: async () => {
        try {
          set({ isLoading: true, error: null });
          
          // In a real app, this would be an API call
          // For this demo, we'll use the stored categories
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Categories are already set by the store
          set({ isLoading: false });
        } catch (error) {
          if (error instanceof Error) {
            set({ error: error.message, isLoading: false });
          } else {
            set({ error: 'Failed to fetch categories', isLoading: false });
          }
        }
      },
      
      addCategory: async (name: string) => {
        try {
          set({ isLoading: true, error: null });
          
          // In a real app, this would be an API call
          // For this demo, we'll just add to the stored categories
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const newCategory: Category = {
            id: Math.max(0, ...get().categories.map(cat => cat.id)) + 1,
            name
          };
          
          set(state => ({
            categories: [...state.categories, newCategory],
            isLoading: false
          }));
          
          toast.success('Category added successfully');
        } catch (error) {
          if (error instanceof Error) {
            set({ error: error.message, isLoading: false });
            toast.error(error.message);
          } else {
            set({ error: 'Failed to add category', isLoading: false });
            toast.error('Failed to add category');
          }
        }
      },
      
      updateCategory: async (id: number, name: string) => {
        try {
          set({ isLoading: true, error: null });
          
          // In a real app, this would be an API call
          // For this demo, we'll just update the stored categories
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 300));
          
          set(state => ({
            categories: state.categories.map(category => 
              category.id === id ? { ...category, name } : category
            ),
            isLoading: false
          }));
          
          toast.success('Category updated successfully');
        } catch (error) {
          if (error instanceof Error) {
            set({ error: error.message, isLoading: false });
            toast.error(error.message);
          } else {
            set({ error: 'Failed to update category', isLoading: false });
            toast.error('Failed to update category');
          }
        }
      },
      
      deleteCategory: async (id: number) => {
        try {
          set({ isLoading: true, error: null });
          
          // Check if category is used in any transactions
          const { transactions } = useTransactionStore.getState();
          const isCategoryUsed = transactions.some(transaction => transaction.category === id);
          
          if (isCategoryUsed) {
            throw new Error('Cannot delete a category that is used in transactions');
          }
          
          // In a real app, this would be an API call
          // For this demo, we'll just remove from the stored categories
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 300));
          
          set(state => ({
            categories: state.categories.filter(category => category.id !== id),
            isLoading: false
          }));
          
          toast.success('Category deleted successfully');
        } catch (error) {
          if (error instanceof Error) {
            set({ error: error.message, isLoading: false });
            toast.error(error.message);
          } else {
            set({ error: 'Failed to delete category', isLoading: false });
            toast.error('Failed to delete category');
          }
        }
      }
    }),
    {
      name: 'category-storage'
    }
  )
);

// Import this at the bottom to avoid circular dependencies
import { useTransactionStore } from './transactionStore';