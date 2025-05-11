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
  Firestore
} from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { Expense } from '../types/expense';

const firestore = db;

export const getExpenses = async (): Promise<Expense[]> => {
  const user = auth.currentUser;
  if (!user) {
    console.log('No authenticated user found');
    throw new Error('User not authenticated');
  }

  console.log('Getting expenses for user:', user.uid);

  try {
    const expensesCollection = collection(firestore, 'expenses');
    const q = query(
      expensesCollection,
      where('userId', '==', user.uid),
      orderBy('date', 'desc')
    );

    console.log('Executing query...');
    const querySnapshot = await getDocs(q);
    console.log('Query completed, documents:', querySnapshot.size);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      if (!data) {
        console.warn('Document has no data:', doc.id);
        return null;
      }

      try {
        return {
          id: doc.id,
          userId: data.userId || user.uid,
          title: data.title || '',
          amount: data.amount || 0,
          category: data.category || 'Other',
          date: data.date?.toDate() || new Date(),
          account: data.account || 'USD',
          description: data.description || '',
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Expense;
      } catch (error) {
        console.error('Error processing document:', doc.id, error);
        return null;
      }
    }).filter((expense): expense is Expense => expense !== null);
  } catch (error) {
    console.error("Error getting expenses:", error);
    throw error;
  }
};

export const addExpense = async (expense: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<void> => {
  const user = auth.currentUser;
  if (!user) {
    console.log('No authenticated user found');
    throw new Error('User not authenticated');
  }

  console.log('Adding expense for user:', user.uid);

  try {
    if (!expense.title || !expense.amount || !expense.category) {
      throw new Error('Missing required fields');
    }

    const dateTimestamp = expense.date instanceof Date
      ? Timestamp.fromDate(expense.date)
      : Timestamp.fromDate(new Date(expense.date));

    const newExpense = {
      ...expense,
      userId: user.uid,
      date: dateTimestamp,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    console.log('New expense data:', newExpense);

    const expensesCollection = collection(firestore, 'expenses');
    const docRef = await addDoc(expensesCollection, newExpense);
    console.log('Expense added with ID:', docRef.id);
  } catch (error) {
    console.error("Error adding expense:", error);
    throw error;
  }
};

export const updateExpense = async (id: string, expense: Partial<Expense>): Promise<void> => {
  const user = auth.currentUser;
  if (!user) {
    console.log('No authenticated user found');
    throw new Error('User not authenticated');
  }

  console.log('Updating expense for user:', user.uid);

  try {
    const expenseRef = doc(firestore, 'expenses', id);
    const expenseDoc = await getDoc(expenseRef);
    
    if (!expenseDoc.exists()) {
      throw new Error('Expense not found');
    }

    const expenseData = expenseDoc.data();
    if (expenseData.userId !== user.uid) {
      throw new Error('Unauthorized to update this expense');
    }

    const updateData: any = { ...expense, updatedAt: serverTimestamp() };

    if (expense.date) {
      updateData.date = expense.date instanceof Date
        ? Timestamp.fromDate(expense.date)
        : Timestamp.fromDate(new Date(expense.date));
    }

    await updateDoc(expenseRef, updateData);
    console.log('Expense updated successfully');
  } catch (error) {
    console.error("Error updating expense:", error);
    throw error;
  }
};

export const deleteExpense = async (id: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user) {
    console.log('No authenticated user found');
    throw new Error('User not authenticated');
  }

  console.log('Deleting expense for user:', user.uid);

  try {
    const expenseRef = doc(firestore, 'expenses', id);
    const expenseDoc = await getDoc(expenseRef);
    
    if (!expenseDoc.exists()) {
      throw new Error('Expense not found');
    }

    const expenseData = expenseDoc.data();
    if (expenseData.userId !== user.uid) {
      throw new Error('Unauthorized to delete this expense');
    }

    await deleteDoc(expenseRef);
    console.log('Expense deleted successfully');
  } catch (error) {
    console.error("Error deleting expense:", error);
    throw error;
  }
};