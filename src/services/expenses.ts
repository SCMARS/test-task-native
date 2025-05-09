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
  QueryDocumentSnapshot,
  DocumentData
} from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { Expense } from '../types/expense';

export const getExpenses = async (): Promise<Expense[]> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }

  const q = query(
    collection(db, 'expenses'),
    where('userId', '==', user.uid),
    orderBy('date', 'desc')
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      title: data.title,
      amount: data.amount,
      category: data.category,
      date: data.date.toDate(),
      account: data.account,
      description: data.description,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } as Expense;
  });
};

export const getExpense = async (expenseId: string): Promise<Expense> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }

  const q = query(
    collection(db, 'expenses'),
    where('userId', '==', user.uid),
    where('id', '==', expenseId)
  );

  const querySnapshot = await getDocs(q);
  const expenseDoc = querySnapshot.docs[0];
  
  if (!expenseDoc) {
    throw new Error('Expense not found');
  }

  const data = expenseDoc.data();
  return {
    id: expenseDoc.id,
    userId: data.userId,
    title: data.title,
    amount: data.amount,
    category: data.category,
    date: data.date.toDate(),
    account: data.account,
    description: data.description,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
  } as Expense;
};

export const addExpense = async (expense: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<void> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }

  const now = new Date();
  const newExpense = {
    ...expense,
    userId: user.uid,
    createdAt: Timestamp.fromDate(now),
    updatedAt: Timestamp.fromDate(now),
  };

  await addDoc(collection(db, 'expenses'), newExpense);
};

export const updateExpense = async (id: string, expense: Partial<Expense>): Promise<void> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }

  const expenseRef = doc(db, 'expenses', id);
  await updateDoc(expenseRef, {
    ...expense,
    updatedAt: Timestamp.fromDate(new Date()),
  });
};

export const deleteExpense = async (id: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }

  const expenseRef = doc(db, 'expenses', id);
  await deleteDoc(expenseRef);
}; 