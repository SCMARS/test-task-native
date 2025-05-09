import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Expense, Category, Currency, DEFAULT_CATEGORIES } from '../types/expense';
import { format } from 'date-fns';

interface ExpenseFormProps {
  onSubmit: (expense: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialValues?: Partial<Expense>;
  isLoading?: boolean;
}

export const ExpenseForm = ({
  onSubmit,
  initialValues,
  isLoading = false,
}: ExpenseFormProps) => {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [amount, setAmount] = useState(initialValues?.amount?.toString() || '');
  const [category, setCategory] = useState<Category>(DEFAULT_CATEGORIES[0]);
  const [account, setAccount] = useState(initialValues?.account || 'Cash');
  const [date, setDate] = useState<Date>(initialValues?.date || new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const expenseData = {
      title: title.trim(),
      amount: Number(amount),
      category: category.id,
      account,
      date,
    };

    onSubmit(expenseData).catch(error => {
      console.error('Failed to submit expense:', error);
    });
  };

  return (
    <Card style={styles.container}>
      <Input
        label="Title"
        value={title}
        onChangeText={setTitle}
        error={!!errors.title}
        helperText={errors.title}
        autoCapitalize="sentences"
        autoCorrect={true}
      />

      <Input
        label="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        error={!!errors.amount}
        helperText={errors.amount}
      />

      <Input
        label="Account"
        value={account}
        onChangeText={setAccount}
      />

      <Button
        mode="outlined"
        onPress={() => setShowDatePicker(true)}
        icon="calendar"
      >
        {format(date, 'PPP')}
      </Button>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setDate(selectedDate);
            }
          }}
        />
      )}

      <View style={styles.buttonContainer}>
        <Button
          onPress={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
        >
          {initialValues ? 'Update Expense' : 'Add Expense'}
        </Button>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  buttonContainer: {
    marginTop: 16,
  },
}); 