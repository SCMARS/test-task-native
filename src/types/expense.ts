import { Timestamp } from 'firebase/firestore';

export type Currency = 'USD' | 'UAH' | 'EUR';

export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
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
  userId: string;
  name: string;
  currency: Currency;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
};

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Food', icon: 'food', color: '#FF6B6B' },
  { id: '2', name: 'Transport', icon: 'car', color: '#4ECDC4' },
  { id: '3', name: 'Bills', icon: 'file-document', color: '#45B7D1' },
  { id: '4', name: 'Shopping', icon: 'shopping', color: '#96CEB4' },
  { id: '5', name: 'Entertainment', icon: 'movie', color: '#FFEEAD' },
  { id: '6', name: 'Health', icon: 'medical-bag', color: '#D4EE9F' },
  { id: '7', name: 'Education', icon: 'school', color: '#FFD93D' },
  { id: '8', name: 'Other', icon: 'dots-horizontal', color: '#95A5A6' }
]; 