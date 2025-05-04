import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction, FinancialSummary,  ApiResponse } from '../types';
import { useCategoryStore } from './categoryStore';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { api } from '../utils/api';
import { useAuthStore } from './authStore';


interface TransactionState {
  transactions: Transaction[];
  summary: FinancialSummary;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  fetchTransactions: (page: number) => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'category_name'>) => Promise<void>;
  updateTransaction: (id: number, transaction: Omit<Transaction, 'id' | 'category_name'>) => Promise<void>;
  deleteTransaction: (id: number) => Promise<void>;
  calculateSummary: () => void;
}

const calculateSummary = (transactions: Transaction[]): FinancialSummary => {
  const total_income = transactions
    .filter(t => t.transaction_type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const total_expense = transactions
    .filter(t => t.transaction_type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  return {
    total_income,
    total_expense,
    net_balance: total_income - total_expense
  };
};

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: [],
      summary: calculateSummary([]),
      isLoading: false,
      error: null,
      currentPage: 1,
      totalPages: 1,
      totalCount: 0,

      fetchTransactions: async (page = 1) => {
        try {
          set({ isLoading: true, error: null });
      
          const token = useAuthStore.getState().token;
      
          const response = await api.get<ApiResponse<Transaction[]>>(
            `/finance/transactions/?page=${page}`,
            token
          );
      
          if (response.success) {
            const { data, count, pages, current_page } = response.data;
      
            set({
              transactions: data,
              totalCount: count,
              totalPages: pages,
              currentPage: current_page,
              isLoading: false
            });
      
            get().calculateSummary();
          } else {
            throw new Error(response.error || 'Failed to fetch transactions');
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Unknown error',
            isLoading: false
          });
          toast.error(error instanceof Error ? error.message : 'Unknown error');
        }
      },
      
      

      addTransaction: async (transaction) => {
        try {
          set({ isLoading: true, error: null });
      
          const { categories } = useCategoryStore.getState();
          const token = useAuthStore.getState().token;
      
          const categoryExists = categories.some(c => c.id === transaction.category);
          if (!categoryExists) {
            throw new Error('Selected category does not exist');
          }
      
          const response = await api.post<typeof transaction, any>(
            '/finance/transactions/',
            transaction,
            token
          );
      
          if (response.data && response.status === 201) {
            toast.success('Transaction added successfully');
      
      
            set({ isLoading: false });
          } else {
            throw new Error(response.data?.message || 'Failed to add transaction');
          }
      
        } catch (error) {
          const message =
            error instanceof Error ? error.message : 'Failed to add transaction';
          set({ error: message, isLoading: false });
          toast.error(message);
        }
      },
      
      

      updateTransaction: async (id, transaction) => {
        try {
          set({ isLoading: true, error: null });

          const { categories } = useCategoryStore.getState();
          const categoryExists = categories.some(c => c.id === transaction.category);
          if (!categoryExists) {
            throw new Error('Selected category does not exist');
          }

          await new Promise(resolve => setTimeout(resolve, 300));

          set(state => ({
            transactions: state.transactions.map(t => t.id === id ? { ...transaction, id } : t),
            isLoading: false
          }));

          get().calculateSummary();
          toast.success('Transaction updated successfully');
        } catch (error) {
          set({ error: 'Failed to update transaction', isLoading: false });
          toast.error('Failed to update transaction');
        }
      },

      deleteTransaction: async (id) => {
        try {
          set({ isLoading: true, error: null });

          await new Promise(resolve => setTimeout(resolve, 300));

          set(state => ({
            transactions: state.transactions.filter(t => t.id !== id),
            isLoading: false
          }));

          get().calculateSummary();
          toast.success('Transaction deleted successfully');
        } catch (error) {
          set({ error: 'Failed to delete transaction', isLoading: false });
          toast.error('Failed to delete transaction');
        }
      },

      calculateSummary: () => {
        const summary = calculateSummary(get().transactions);
        set({ summary });
      }
    }),
    {
      name: 'transaction-storage'
    }
  )
);
