import { create } from 'zustand';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User } from 'firebase/auth';
import { Expense, Account, Currency } from '../types/expense';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { addExpense, getExpenses, updateExpense, deleteExpense } from '../services/expenses';

interface State {
  user: User | null;
  expenses: Expense[];
  accounts: Account[];
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchExpenses: () => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  fetchAccounts: () => Promise<void>;
  addAccount: (account: Omit<Account, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateAccount: (id: string, account: Partial<Account>) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
}

export const useStore = create<State>((set, get) => ({
  user: null,
  expenses: [],
  accounts: [],
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),

  login: async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  fetchExpenses: async () => {
    set({ isLoading: true, error: null });
    try {
      const expenses = await getExpenses();
      console.log(expenses);
      set({ expenses, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addExpense: async (expense) => {
    set({ isLoading: true, error: null });
    try {
      await addExpense(expense);
      await get().fetchExpenses();
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateExpense: async (id, expense) => {
    set({ isLoading: true, error: null });
    try {
      await updateExpense(id, expense);
      await get().fetchExpenses();
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  deleteExpense: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deleteExpense(id);
      await get().fetchExpenses();
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchAccounts: () => {
    set({ isLoading: true, error: null });
    const user = get().user;
    if (!user) {
      set({ error: 'User not authenticated', isLoading: false });
      return Promise.reject('User not authenticated');
    }

    const q = query(
      collection(db, 'accounts'),
      where('userId', '==', user.uid)
    );
    
    return getDocs(q)
      .then(querySnapshot => {
        const accounts = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
          updatedAt: doc.data().updatedAt.toDate(),
        })) as unknown as Account[];

        set({ accounts, isLoading: false });
      })
      .catch(error => {
        set({ error: (error as Error).message, isLoading: false });
        return Promise.reject(error);
      });
  },

  addAccount: (account) => {
    set({ isLoading: true, error: null });
    const user = get().user;
    if (!user) {
      set({ error: 'User not authenticated', isLoading: false });
      return Promise.reject('User not authenticated');
    }

    const now = new Date();
    const newAccount = {
      ...account,
      userId: user.uid,
      createdAt: now,
      updatedAt: now,
    };

    return addDoc(collection(db, 'accounts'), newAccount)
      .then(() => get().fetchAccounts())
      .catch(error => {
        set({ error: (error as Error).message, isLoading: false });
        return Promise.reject(error);
      });
  },

  updateAccount: (id, account) => {
    set({ isLoading: true, error: null });
    const user = get().user;
    if (!user) {
      set({ error: 'User not authenticated', isLoading: false });
      return Promise.reject('User not authenticated');
    }

    const accountRef = doc(db, 'accounts', id);
    return updateDoc(accountRef, {
      ...account,
      updatedAt: new Date(),
    })
      .then(() => get().fetchAccounts())
      .catch(error => {
        set({ error: (error as Error).message, isLoading: false });
        return Promise.reject(error);
      });
  },

  deleteAccount: (id) => {
    set({ isLoading: true, error: null });
    const user = get().user;
    if (!user) {
      set({ error: 'User not authenticated', isLoading: false });
      return Promise.reject('User not authenticated');
    }

    return deleteDoc(doc(db, 'accounts', id))
      .then(() => get().fetchAccounts())
      .catch(error => {
        set({ error: (error as Error).message, isLoading: false });
        return Promise.reject(error);
      });
  },
})); 