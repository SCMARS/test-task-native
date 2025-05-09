import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Card } from './ui/Card';
import { Expense, Category, DEFAULT_CATEGORIES } from '../types/expense';
import { format } from 'date-fns';

interface ExpenseListProps {
  expenses: Expense[];
  onExpensePress: (expense: Expense) => void;
}

export const ExpenseList = ({ expenses, onExpensePress }: ExpenseListProps) => {
  const getCategory = (categoryId: string): Category => {
    const category = DEFAULT_CATEGORIES.filter((cat: Category) => cat.id === categoryId)[0];
    return category || DEFAULT_CATEGORIES[DEFAULT_CATEGORIES.length - 1];
  };

  const renderExpenseItem = ({ item }: { item: Expense }) => {
    const category = getCategory(item.category || '');
    
    return (
      <Card
        onPress={() => onExpensePress(item)}
        style={styles.expenseCard}
      >
        <View style={styles.expenseHeader}>
          <Text variant="titleMedium" style={styles.title}>
            {item.title}
          </Text>
          <Text variant="titleMedium" style={[styles.amount, { color: category.color }]}>
            {item.amount.toFixed(2)}
          </Text>
        </View>
        
        <View style={styles.expenseFooter}>
          <View style={[styles.categoryBadge, { backgroundColor: category.color + '20' }]}>
            <Text style={[styles.categoryText, { color: category.color }]}>
              {category.name}
            </Text>
          </View>
          <Text variant="bodySmall" style={styles.date}>
            {format(item.date, 'PPP')}
          </Text>
        </View>
      </Card>
    );
  };

  if (expenses.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="titleMedium">No expenses yet</Text>
        <Text variant="bodyMedium">Add your first expense to get started</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={expenses}
      renderItem={renderExpenseItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  expenseCard: {
    marginBottom: 8,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    marginRight: 8,
  },
  amount: {
    fontWeight: '600',
  },
  expenseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  date: {
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
}); 