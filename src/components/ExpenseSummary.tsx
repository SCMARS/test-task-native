import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { Expense } from '../types/expense';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

interface ExpenseSummaryProps {
  expenses: Expense[];
  period: 'day' | 'week' | 'month' | 'year';
}

export const ExpenseSummary: React.FC<ExpenseSummaryProps> = ({ expenses, period }) => {
  const getPeriodDates = () => {
    const now = new Date();
    
    switch (period) {
      case 'day':
        return {
          start: startOfDay(now),
          end: endOfDay(now)
        };
      case 'week':
        return {
          start: startOfWeek(now, { weekStartsOn: 1 }),
          end: endOfWeek(now, { weekStartsOn: 1 })
        };
      case 'month':
        return {
          start: startOfMonth(now),
          end: endOfMonth(now)
        };
      case 'year':
        return {
          start: startOfYear(now),
          end: endOfYear(now)
        };
    }
  };

  const { start, end } = getPeriodDates();
  
  const periodExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= start && expenseDate <= end;
  });

  // Группировка по валютам
  const totalsByCurrency = periodExpenses.reduce((acc, expense) => {
    const currency = expense.account;
    if (!acc[currency]) {
      acc[currency] = {
        total: 0,
        categories: {}
      };
    }
    
    acc[currency].total += expense.amount;
    
    if (!acc[currency].categories[expense.category]) {
      acc[currency].categories[expense.category] = 0;
    }
    acc[currency].categories[expense.category] += expense.amount;
    
    return acc;
  }, {} as Record<string, { total: number; categories: Record<string, number> }>);

  return (
    <Surface style={styles.container} elevation={4}>
      <View style={styles.content}>
        <Text variant="titleLarge" style={styles.title}>
          {period.charAt(0).toUpperCase() + period.slice(1)}ly Summary
        </Text>
        
        {Object.entries(totalsByCurrency).map(([currency, data]) => (
          <View key={currency} style={styles.currencySection}>
            <View style={styles.totalContainer}>
              <Text variant="headlineMedium" style={styles.total}>
                {data.total.toFixed(2)} {currency}
              </Text>
              <Text variant="bodyMedium" style={styles.subtitle}>
                Total Expenses
              </Text>
            </View>

            <View style={styles.categoriesContainer}>
              {Object.entries(data.categories).map(([category, amount]) => (
                <View key={category} style={styles.categoryItem}>
                  <Text variant="bodyMedium">{category}</Text>
                  <Text variant="bodyMedium" style={styles.categoryAmount}>
                    {amount.toFixed(2)} {currency}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  currencySection: {
    marginBottom: 24,
  },
  totalContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  total: {
    color: '#6200EE',
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#666',
  },
  categoriesContainer: {
    marginTop: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryAmount: {
    fontWeight: '500',
  },
}); 