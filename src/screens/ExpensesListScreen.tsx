import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import { useStore } from '../store/useStore';
import { ExpenseList } from '../components/ExpenseList';
import { MainTabScreenProps } from '../types/navigation';
import { Expense } from '../types/expense';

export const ExpensesListScreen = ({ navigation }: MainTabScreenProps<'ExpensesList'>) => {
  const { expenses, fetchExpenses, isLoading } = useStore();

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleExpensePress = (expense: Expense) => {
    navigation.navigate('ExpenseDetails', { expenseId: expense.id });
  };

  const handleAddPress = () => {
    navigation.navigate('ExpenseForm', { mode: 'create' });
  };

  return (
    <View style={styles.container}>
      <ExpenseList
        expenses={expenses}
        onExpensePress={handleExpensePress}
      />
      <FAB
        icon="plus"
        onPress={handleAddPress}
        style={styles.fab}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
}); 