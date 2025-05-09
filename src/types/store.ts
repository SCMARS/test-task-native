import { User } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  description?: string;
  date: Timestamp;
  userId: string;
}

export interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface ExpensesState {
  expenses: Expense[];
  isLoading: boolean;
  error: string | null;
}

export interface StoreState extends UserState, ExpensesState {
  // User actions
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  signOut: () => Promise<void>;

  // Expenses actions
  fetchExpenses: () => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id' | 'userId'>) => Promise<void>;
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
} 