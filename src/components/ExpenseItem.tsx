import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Card, IconButton } from 'react-native-paper';
import { Expense } from '../types/expense';
import { format } from 'date-fns';

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
  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content style={styles.content}>
        <View style={styles.mainInfo}>
          <Text style={styles.title}>{expense.title}</Text>
          <Text style={styles.amount}>
            {expense.amount} {expense.account}
          </Text>
        </View>
        
        <View style={styles.details}>
          <Text style={styles.category}>{expense.category}</Text>
          <Text style={styles.date}>
            {format(expense.date, 'MMM dd, yyyy')}
          </Text>
        </View>

        {expense.description && (
          <Text style={styles.description} numberOfLines={2}>
            {expense.description}
          </Text>
        )}

        {onDelete && (
          <IconButton
            icon="delete"
            size={20}
            onPress={onDelete}
            style={styles.deleteButton}
          />
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
  },
  content: {
    padding: 12,
  },
  mainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6200EE',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: '#666',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  deleteButton: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
}); 