import { create } from 'zustand';
import { User } from 'firebase/auth';
import { Expense } from '../types/expense';
import { getExpenses, addExpense, updateExpense, deleteExpense } from '../services/expenses';

interface FilterState {
  startDate: Date | null;
  endDate: Date | null;
  category: string | null;
}

interface StoreState {
  // User state
  user: User | null;
  setUser: (user: User | null) => void;
  
  // Expense state
  expenses: Expense[];
  filteredExpenses: Expense[];
  filter: FilterState;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchExpenses: () => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  setFilter: (filter: Partial<FilterState>) => void;
  resetFilter: () => void;
  applyFilter: () => Promise<void>;
  getMonthlySummary: () => { total: number; byCategory: Record<string, number> };
}

const initialState: Omit<StoreState, 'setUser' | 'fetchExpenses' | 'addExpense' | 'updateExpense' | 'deleteExpense' | 'setFilter' | 'resetFilter' | 'applyFilter' | 'getMonthlySummary'> = {
  user: null,
  expenses: [],
  filteredExpenses: [],
  filter: {
    startDate: null,
    endDate: null,
    category: null,
  },
  isLoading: false,
  error: null,
};

export const useStore = create<StoreState>((set, get) => ({
  ...initialState,

  setUser: (user) => set({ user }),

  fetchExpenses: async () => {
    const user = get().user;
    if (!user) {
      set({ error: 'User not authenticated' });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const expenses = await getExpenses(user.uid);
      set({ expenses });
      await get().applyFilter();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch expenses';
      console.error('Error fetching expenses:', error);
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  addExpense: async (expense) => {
    const user = get().user;
    if (!user) {
      throw new Error('User not authenticated');
    }

    set({ isLoading: true, error: null });
    try {
      await addExpense(user.uid, expense);
      await get().fetchExpenses();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add expense';
      console.error('Error adding expense:', error);
      set({ error: errorMessage });
      throw error;
    }
  },

  updateExpense: async (id, expenseUpdate) => {
    set({ isLoading: true, error: null });
    try {
      await updateExpense(id, expenseUpdate);
      await get().fetchExpenses();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update expense';
      console.error('Error updating expense:', error);
      set({ error: errorMessage });
      throw error;
    }
  },

  deleteExpense: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deleteExpense(id);
      await get().fetchExpenses();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete expense';
      console.error('Error deleting expense:', error);
      set({ error: errorMessage });
      throw error;
    }
  },

  setFilter: (newFilter) => {
    set((state) => ({
      filter: { ...state.filter, ...newFilter },
    }));
    get().applyFilter();
  },

  resetFilter: () => {
    set({
      filter: {
        startDate: null,
        endDate: null,
        category: null,
      },
    });
    get().applyFilter();
  },

  applyFilter: async () => {
    const { filter } = get();
    const user = get().user;
    
    if (!user) {
      set({ error: 'User not authenticated' });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const filteredExpenses = await getExpenses(user.uid, {
        startDate: filter.startDate || undefined,
        endDate: filter.endDate || undefined,
        category: filter.category || undefined,
      });
      set({ filteredExpenses, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to apply filters';
      console.error('Error applying filters:', error);
      set({ error: errorMessage, isLoading: false });
    }
  },

  getMonthlySummary: () => {
    const { filteredExpenses } = get();
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const monthlyExpenses = filteredExpenses.filter(
      (expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startOfMonth && expenseDate <= endOfMonth;
      }
    );

    const total = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const byCategory = monthlyExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    return { total, byCategory };
  },
}));