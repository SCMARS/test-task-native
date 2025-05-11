import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, FAB, Portal, Dialog, Button, Appbar, Menu } from 'react-native-paper';
import { useStore } from '../store/useStore';
import { auth } from '../config/firebase';
import { useNavigation } from '@react-navigation/native';
import { ExpenseItem } from '../components/ExpenseItem';
import { ExpenseFilter } from '../components/ExpenseFilter';
import { ExpenseSummary } from '../components/ExpenseSummary';
import { MainTabScreenProps, RootStackNavigationProp } from '../types/navigation';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { Expense } from '../types/expense';
import { DEFAULT_CATEGORIES } from '../types/expense';

export const ExpensesListScreen = () => {
  const { 
    filteredExpenses, 
    fetchExpenses, 
    deleteExpense, 
    isLoading, 
    error,
    filter,
    setFilter,
    resetFilter,
    getMonthlySummary
  } = useStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const navigation = useNavigation<RootStackNavigationProp>();

  const loadExpenses = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.log('User is not authenticated');
        return;
      }
      
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

  const handleDeletePress = (expense: Expense) => {
    setExpenseToDelete(expense);
    setDeleteDialogVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (expenseToDelete) {
      try {
        await deleteExpense(expenseToDelete.id);
        setDeleteDialogVisible(false);
        setExpenseToDelete(null);
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const renderItem = ({ item }: { item: Expense }) => (
    <ExpenseItem
      expense={item}
      onPress={() => handleExpensePress(item)}
      onDelete={() => handleDeletePress(item)}
    />
  );

  if (isLoading && !refreshing) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadExpenses} />;
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Expenses" />
        <Appbar.Action 
          icon={sortOrder === 'asc' ? 'sort-calendar-ascending' : 'sort-calendar-descending'} 
          onPress={toggleSortOrder} 
        />
        <Menu
          visible={filterMenuVisible}
          onDismiss={() => setFilterMenuVisible(false)}
          anchor={
            <Appbar.Action 
              icon="filter-variant" 
              onPress={() => setFilterMenuVisible(true)} 
            />
          }
        >
          <Menu.Item 
            title="All Categories" 
            onPress={() => {
              setFilter({ category: null });
              setFilterMenuVisible(false);
            }} 
          />
          {DEFAULT_CATEGORIES.map((category) => (
            <Menu.Item
              key={category.id}
              title={category.name}
              onPress={() => {
                setFilter({ category: category.id });
                setFilterMenuVisible(false);
              }}
            />
          ))}
        </Menu>
      </Appbar.Header>

      <ExpenseSummary 
        expenses={filteredExpenses} 
        period="month" 
      />
      
      <ExpenseFilter
        startDate={filter.startDate}
        endDate={filter.endDate}
        category={filter.category}
        onStartDateChange={(date) => setFilter({ startDate: date })}
        onEndDateChange={(date) => setFilter({ endDate: date })}
        onCategoryChange={(category) => setFilter({ category })}
        onReset={resetFilter}
      />

      <FlatList
        data={sortedExpenses}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No expenses found</Text>
            <Button 
              mode="contained" 
              onPress={() => navigation.navigate('ExpenseForm', { mode: 'add' })}
              style={styles.addButton}
            >
              Add Your First Expense
            </Button>
          </View>
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('ExpenseForm', { mode: 'add' })}
      />

      <Portal>
        <Dialog
          visible={deleteDialogVisible}
          onDismiss={() => setDeleteDialogVisible(false)}
        >
          <Dialog.Title>Delete Expense</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this expense?</Text>
            {expenseToDelete && (
              <Text style={styles.deleteExpenseDetails}>
                {expenseToDelete.title} - {expenseToDelete.amount} {expenseToDelete.account}
              </Text>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleDeleteConfirm}>Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    marginBottom: 16,
  },
  addButton: {
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  deleteExpenseDetails: {
    marginTop: 8,
    color: '#666',
  },
}); 