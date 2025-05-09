import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { RootStackScreenProps } from '../types/navigation';
import { format } from 'date-fns';
import { DEFAULT_CATEGORIES } from '../types/expense';

export const ExpenseDetailsScreen = ({ route, navigation }: RootStackScreenProps<'ExpenseDetails'>) => {
  const { expenses, deleteExpense, isLoading } = useStore();
  const { expenseId } = route.params;
  const expense = expenses.find(e => e.id === expenseId);

  if (!expense) {
    return (
      <View style={styles.container}>
        <Text>Expense not found</Text>
      </View>
    );
  }

  const category = DEFAULT_CATEGORIES.find(cat => cat.id === expense.category) || DEFAULT_CATEGORIES[DEFAULT_CATEGORIES.length - 1];

  const handleEdit = () => {
    navigation.navigate('Main', {
      screen: 'ExpenseForm',
      params: {
        mode: 'edit',
        expenseId: expense.id,
      },
    } as any);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteExpense(expense.id)
              .then(() => {
                navigation.goBack();
              })
              .catch(error => {
                console.error('Failed to delete expense:', error);
                Alert.alert('Error', 'Failed to delete expense');
              });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Card>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            {expense.title}
          </Text>
          <Text variant="headlineMedium" style={[styles.amount, { color: category.color }]}>
            {expense.amount.toFixed(2)}
          </Text>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text variant="bodyMedium" style={styles.label}>Category</Text>
            <View style={[styles.categoryBadge, { backgroundColor: category.color + '20' }]}>
              <Text style={[styles.categoryText, { color: category.color }]}>
                {category.name}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text variant="bodyMedium" style={styles.label}>Date</Text>
            <Text variant="bodyMedium">{format(expense.date, 'PPP')}</Text>
          </View>

          {expense.description && (
            <View style={styles.detailRow}>
              <Text variant="bodyMedium" style={styles.label}>Description</Text>
              <Text variant="bodyMedium">{expense.description}</Text>
            </View>
          )}
        </View>

        <View style={styles.actions}>
          <Button
            mode="contained"
            onPress={handleEdit}
            style={styles.editButton}
            disabled={isLoading}
          >
            Edit Expense
          </Button>
          <Button
            mode="outlined"
            onPress={handleDelete}
            style={styles.deleteButton}
            disabled={isLoading}
            color="#DC3545"
          >
            Delete Expense
          </Button>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    marginBottom: 8,
  },
  amount: {
    fontWeight: '600',
  },
  detailsContainer: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    color: '#666',
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actions: {
    gap: 8,
  },
  editButton: {
    marginBottom: 8,
  },
  deleteButton: {
    borderColor: '#DC3545',
  },
}); 