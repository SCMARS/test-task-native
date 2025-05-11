import { Timestamp } from 'firebase/firestore';

export type Currency = 'USD' | 'UAH' | 'EUR';

export type Category = {
  id: string;
  name: string;
  icon?: string;
};

export interface Expense {
  id: string;
  userId: string;
  title: string;
  amount: number;
  category: string;
  date: Date;
  account: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Account = {
  id: string;
  name: string;
  currency: string;
  balance: number;
};

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'food', name: 'Food' },
  { id: 'transport', name: 'Transport' },
  { id: 'bills', name: 'Bills' },
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'shopping', name: 'Shopping' },
  { id: 'health', name: 'Health' },
  { id: 'other', name: 'Other' },
];

export const DEFAULT_ACCOUNTS: Account[] = [
  { id: 'usd', name: 'USD Account', currency: 'USD', balance: 0 },
  { id: 'uah', name: 'UAH Account', currency: 'UAH', balance: 0 },
  { id: 'eur', name: 'EUR Account', currency: 'EUR', balance: 0 },
]; 