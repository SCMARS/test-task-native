import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useStore } from '../store/useStore';
import { ExpenseForm } from '../components/ExpenseForm';
import { MainTabScreenProps } from '../types/navigation';
import { Expense } from '../types/expense';

export const ExpenseFormScreen = ({ route, navigation }: MainTabScreenProps<'ExpenseForm'>) => {
  const { addExpense, updateExpense, expenses, isLoading } = useStore();
  const { mode, expenseId } = route.params;
  const expense  = expenseId ? expenses.find(e => e.id === expenseId) : undefined;

  const handleSubmit = async (expenseData: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (mode === 'edit' && expenseId) {
        await updateExpense(expenseId, expenseData);
      } else {
        await addExpense(expenseData);
      }
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save expense:', error);
    }
  };

  return (
      <View style={styles.container}>
        <ExpenseForm
            onSubmit={handleSubmit}
            initialValues={expense}
            isLoading={isLoading}
        />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
});