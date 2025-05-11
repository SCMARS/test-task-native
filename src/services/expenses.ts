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
  serverTimestamp,
  getDoc,
  Firestore,
  QueryConstraint,
  startAt,
  endAt
} from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { Expense } from '../types/expense';

const firestore = db;

export const getExpenses = async (
  userId: string,
  filters?: {
    startDate?: Date;
    endDate?: Date;
    category?: string;
  }
): Promise<Expense[]> => {
  try {
    const expensesRef = collection(db, 'expenses');
    const constraints: QueryConstraint[] = [
      where('userId', '==', userId),
      orderBy('date', 'desc')
    ];

    // Добавляем фильтры по дате, если они указаны
    if (filters?.startDate) {
      constraints.push(where('date', '>=', Timestamp.fromDate(filters.startDate)));
    }
    if (filters?.endDate) {
      constraints.push(where('date', '<=', Timestamp.fromDate(filters.endDate)));
    }
    // Добавляем фильтр по категории, если она указана
    if (filters?.category) {
      constraints.push(where('category', '==', filters.category));
    }

    const q = query(expensesRef, ...constraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as Expense[];
  } catch (error) {
    console.error('Error getting expenses:', error);
    throw error;
  }
};

export const addExpense = async (userId: string, expense: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const expensesRef = collection(db, 'expenses');
    const now = Timestamp.now();
    
    // Удаляем undefined значения и преобразуем пустые строки в null
    const expenseData = Object.entries(expense).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        if (key === 'date' && value instanceof Date) {
          acc[key] = Timestamp.fromDate(value);
        } else if (key === 'description' && value === '') {
          acc[key] = null;
        } else {
          acc[key] = value;
        }
      }
      return acc;
    }, {} as Record<string, any>);

    const docRef = await addDoc(expensesRef, {
      ...expenseData,
      userId,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding expense:', error);
    throw error;
  }
};

export const updateExpense = async (expenseId: string, expense: Partial<Expense>): Promise<void> => {
  try {
    const expenseRef = doc(db, 'expenses', expenseId);
    
    // Remove undefined values from the update object
    const updateData = Object.entries(expense).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        // Преобразуем дату в Timestamp, если это поле date
        if (key === 'date' && value instanceof Date) {
          acc[key] = Timestamp.fromDate(value);
        } else {
          acc[key] = value;
        }
      }
      return acc;
    }, {} as Record<string, any>);

    await updateDoc(expenseRef, {
      ...updateData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating expense:', error);
    throw error;
  }
};

export const deleteExpense = async (expenseId: string): Promise<void> => {
  try {
    const expenseRef = doc(db, 'expenses', expenseId);
    await deleteDoc(expenseRef);
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
};