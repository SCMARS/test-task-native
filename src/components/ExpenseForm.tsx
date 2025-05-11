import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, HelperText, Menu } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { DEFAULT_CATEGORIES, DEFAULT_ACCOUNTS } from '../types/expense';

interface ExpenseFormProps {
  initialValues?: {
    title: string;
    amount: number;
    category: string;
    date: Date;
    account: string;
    description?: string;
  };
  onSubmit: (values: {
    title: string;
    amount: number;
    category: string;
    date: Date;
    account: string;
    description?: string;
  }) => void;
  isLoading?: boolean;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  initialValues,
  onSubmit,
  isLoading = false,
}) => {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [amount, setAmount] = useState(initialValues?.amount?.toString() || '');
  const [category, setCategory] = useState(initialValues?.category || '');
  const [date, setDate] = useState(initialValues?.date || new Date());
  const [account, setAccount] = useState(initialValues?.account || 'USD');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await onSubmit({
        title: title.trim(),
        amount: Number(amount),
        category,
        date,
        account,
        description: description.trim() || undefined
      });
    } catch (error) {
      console.error('Failed to submit expense:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Title"
        value={title}
        onChangeText={setTitle}
        error={!!errors.title}
        style={styles.input}
      />
      {errors.title && <HelperText type="error">{errors.title}</HelperText>}

      <TextInput
        label="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        error={!!errors.amount}
        style={styles.input}
      />
      {errors.amount && <HelperText type="error">{errors.amount}</HelperText>}

      <TextInput
        label="Category"
        value={category}
        onChangeText={setCategory}
        error={!!errors.category}
        style={styles.input}
      />
      {errors.category && <HelperText type="error">{errors.category}</HelperText>}

      <Button
        mode="outlined"
        onPress={() => setShowDatePicker(true)}
        style={styles.input}
      >
        {date.toLocaleDateString()}
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

      <TextInput
        label="Account"
        value={account}
        onChangeText={setAccount}
        style={styles.input}
      />

      <TextInput
        label="Description (optional)"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={isLoading}
        disabled={isLoading}
        style={styles.submitButton}
      >
        {initialValues ? 'Update Expense' : 'Add Expense'}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    marginBottom: 12,
  },
  submitButton: {
    marginTop: 16,
  },
});