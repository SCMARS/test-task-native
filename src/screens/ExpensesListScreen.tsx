import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text } from 'react-native-paper';
import { useStore } from '../store/useStore';
import { auth } from '../config/firebase';
import { useNavigation } from '@react-navigation/native';
import { ExpenseItem } from '../components/ExpenseItem';
import { Expense } from '../types/expense';
import { MainTabScreenProps } from '../types/navigation';

export const ExpensesListScreen = () => {
  const { expenses, fetchExpenses, deleteExpense, isLoading } = useStore();
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<MainTabScreenProps<'ExpensesList'>['navigation']>();

  const loadExpenses = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.log('User is not authenticated');
        return;
      }
      
      console.log('Fetching expenses for user:', currentUser.uid);
      await fetchExpenses();
    } catch (error) {
      console.error('Error loading expenses:', error);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadExpenses();
    setRefreshing(false);
  };
  const handleExpensePress = (expense: Expense) => {
    navigation.navigate('ExpenseForm', { 
      mode: 'edit', 
      expenseId: expense.id 
    });
  };

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      await deleteExpense(expenseId);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  if (isLoading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ExpenseItem
            expense={item}
            onPress={() => handleExpensePress(item)}
            onDelete={() => handleDeleteExpense(item.id)}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No expenses yet</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
}); 