import { create } from 'zustand';
import { User } from 'firebase/auth';
import { Expense } from '../types/expense';
import * as ExpenseService from '../services/expenses';

interface StoreState {
  // User state
  user: User | null;
  setUser: (user: User | null) => void;
  
  // Expense state
  expenses: Expense[];
  isLoading: boolean;
  error: string | null;
  fetchExpenses: () => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
  // User state
  user: null,
  setUser: (user) => set({ user }),

  // Expense state
  expenses: [],
  isLoading: false,
  error: null,

  fetchExpenses: async () => {
    set({ isLoading: true, error: null });
    try {
      const expenses = await ExpenseService.getExpenses();
      // Sort by date desc (newest first)
      expenses.sort((a, b) => b.date.getTime() - a.date.getTime());
      set({ expenses, isLoading: false });
    } catch (error) {
      console.error('Error fetching expenses:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch expenses',
        isLoading: false
      });
    }
  },

  addExpense: async (expense) => {
    set({ isLoading: true, error: null });
    try {
      await ExpenseService.addExpense(expense);
      // Refresh the expense list after adding
      await get().fetchExpenses();
      set({ isLoading: false });
    } catch (error) {
      console.error('Error adding expense:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to add expense',
        isLoading: false
      });
      throw error; // Re-throw to handle in UI if needed
    }
  },

  updateExpense: async (id, expenseUpdate) => {
    set({ isLoading: true, error: null });
    try {
      await ExpenseService.updateExpense(id, expenseUpdate);
      // Refresh or update locally
      await get().fetchExpenses();
      set({ isLoading: false });
    } catch (error) {
      console.error('Error updating expense:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to update expense',
        isLoading: false
      });
      throw error;
    }
  },

  deleteExpense: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await ExpenseService.deleteExpense(id);
      // Remove from local state
      set(state => ({
        expenses: state.expenses.filter(e => e.id !== id),
        isLoading: false
      }));
    } catch (error) {
      console.error('Error deleting expense:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to delete expense',
        isLoading: false
      });
      throw error;
    }
  },
}));