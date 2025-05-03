import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction, FinancialSummary, TransactionType } from '../types';
import { useCategoryStore } from './categoryStore';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface TransactionState {
  transactions: Transaction[];
  summary: FinancialSummary;
  isLoading: boolean;
  error: string | null;
  fetchTransactions: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'category_name'>) => Promise<void>;
  updateTransaction: (id: number, transaction: Omit<Transaction, 'id' | 'category_name'>) => Promise<void>;
  deleteTransaction: (id: number) => Promise<void>;
  calculateSummary: () => void;
}

// Initial demo data
const initialTransactions: Transaction[] = [
  {
    id: 1,
    amount: 5000,
    description: 'Monthly salary',
    transaction_type: 'income',
    category: 7,
    date: '2025-06-01'
  },
  {
    id: 2,
    amount: 1500,
    description: 'Rent',
    transaction_type: 'expense',
    category: 3,
    date: '2025-06-05'
  },
  {
    id: 3,
    amount: 500,
    description: 'Groceries',
    transaction_type: 'expense',
    category: 1,
    date: '2025-06-10'
  },
  {
    id: 4,
    amount: 2000,
    description: 'Stock dividends',
    transaction_type: 'income',
    category: 8,
    date: '2025-06-15'
  },
  {
    id: 5,
    amount: 300,
    description: 'Internet bill',
    transaction_type: 'expense',
    category: 5,
    date: '2025-06-18'
  },
  {
    id: 6,
    amount: 17000,
    description: 'Trip to Zanzibar',
    transaction_type: 'expense',
    category: 4,
    date: '2025-06-21'
  }
];

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
      transactions: initialTransactions,
      summary: calculateSummary(initialTransactions),
      isLoading: false,
      error: null,
      
      fetchTransactions: async () => {
        try {
          set({ isLoading: true, error: null });
          
          // In a real app, this would be an API call
          // For this demo, we'll use the stored transactions
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Transactions are already set by the store
          set({ isLoading: false });
          get().calculateSummary();
        } catch (error) {
          if (error instanceof Error) {
            set({ error: error.message, isLoading: false });
          } else {
            set({ error: 'Failed to fetch transactions', isLoading: false });
          }
        }
      },
      
      addTransaction: async (transaction) => {
        try {
          set({ isLoading: true, error: null });
          
          // Validate category exists
          const { categories } = useCategoryStore.getState();
          const categoryExists = categories.some(c => c.id === transaction.category);
          if (!categoryExists) {
            throw new Error('Selected category does not exist');
          }
          
          // In a real app, this would be an API call
          // For this demo, we'll just add to the stored transactions
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const newTransaction: Transaction = {
            id: Math.max(0, ...get().transactions.map(t => t.id)) + 1,
            ...transaction
          };
          
          set(state => ({
            transactions: [...state.transactions, newTransaction],
            isLoading: false
          }));
          
          get().calculateSummary();
          toast.success('Transaction added successfully');
        } catch (error) {
          if (error instanceof Error) {
            set({ error: error.message, isLoading: false });
            toast.error(error.message);
          } else {
            set({ error: 'Failed to add transaction', isLoading: false });
            toast.error('Failed to add transaction');
          }
        }
      },
      
      updateTransaction: async (id, transaction) => {
        try {
          set({ isLoading: true, error: null });
          
          // Validate category exists
          const { categories } = useCategoryStore.getState();
          const categoryExists = categories.some(c => c.id === transaction.category);
          if (!categoryExists) {
            throw new Error('Selected category does not exist');
          }
          
          // In a real app, this would be an API call
          // For this demo, we'll just update the stored transactions
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 300));
          
          set(state => ({
            transactions: state.transactions.map(t => 
              t.id === id ? { ...transaction, id } : t
            ),
            isLoading: false
          }));
          
          get().calculateSummary();
          toast.success('Transaction updated successfully');
        } catch (error) {
          if (error instanceof Error) {
            set({ error: error.message, isLoading: false });
            toast.error(error.message);
          } else {
            set({ error: 'Failed to update transaction', isLoading: false });
            toast.error('Failed to update transaction');
          }
        }
      },
      
      deleteTransaction: async (id) => {
        try {
          set({ isLoading: true, error: null });
          
          // In a real app, this would be an API call
          // For this demo, we'll just remove from the stored transactions
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 300));
          
          set(state => ({
            transactions: state.transactions.filter(t => t.id !== id),
            isLoading: false
          }));
          
          get().calculateSummary();
          toast.success('Transaction deleted successfully');
        } catch (error) {
          if (error instanceof Error) {
            set({ error: error.message, isLoading: false });
            toast.error(error.message);
          } else {
            set({ error: 'Failed to delete transaction', isLoading: false });
            toast.error('Failed to delete transaction');
          }
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