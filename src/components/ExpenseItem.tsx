import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, Surface, IconButton } from 'react-native-paper';
import { Expense } from '../types/expense';
import { format } from 'date-fns';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';

interface ExpenseItemProps {
  expense: Expense;
  onPress?: () => void;
  onDelete?: () => void;
}

export const ExpenseItem: React.FC<ExpenseItemProps> = ({ 
  expense, 
  onPress, 
  onDelete 
}) => {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      food: '#4CAF50',
      transport: '#2196F3',
      bills: '#F44336',
      entertainment: '#9C27B0',
      shopping: '#FF9800',
      health: '#E91E63',
      other: '#607D8B',
    };
    return colors[category] || '#607D8B';
  };

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      layout={Layout}
    >
      <Surface style={styles.container} elevation={1}>
        <TouchableOpacity 
          style={styles.content} 
          onPress={onPress}
          activeOpacity={0.7}
        >
          <View style={styles.mainInfo}>
            <View style={styles.titleContainer}>
              <Text variant="titleMedium" style={styles.title}>
                {expense.title}
              </Text>
              <Text variant="bodySmall" style={[styles.category, { color: getCategoryColor(expense.category) }]}>
                {expense.category}
              </Text>
            </View>
            <Text variant="titleMedium" style={styles.amount}>
              {expense.amount} {expense.account}
            </Text>
          </View>
          
          <View style={styles.footer}>
            <Text variant="bodySmall" style={styles.date}>
              {format(expense.date, 'MMM dd, yyyy')}
            </Text>
            {onDelete && (
              <IconButton
                icon="delete-outline"
                size={20}
                onPress={onDelete}
                style={styles.deleteButton}
              />
            )}
          </View>

          {expense.description && (
            <Text variant="bodySmall" style={styles.description} numberOfLines={2}>
              {expense.description}
            </Text>
          )}
        </TouchableOpacity>
      </Surface>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
  mainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    marginBottom: 4,
  },
  category: {
    textTransform: 'capitalize',
  },
  amount: {
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  date: {
    color: '#666',
  },
  description: {
    color: '#666',
    marginTop: 8,
  },
  deleteButton: {
    margin: 0,
  },
}); 