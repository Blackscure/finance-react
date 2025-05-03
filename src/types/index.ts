export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, password2: string) => Promise<void>;
  logout: () => void;
}

export interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export interface Category {
  id: number;
  name: string;
}

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: number;
  amount: number;
  description: string;
  transaction_type: TransactionType;
  category: number;
  category_name?: string;
  date: string;
}

export interface FinancialSummary {
  total_income: number;
  total_expense: number;
  net_balance: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}