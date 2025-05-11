import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Surface, Divider, TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Expense, Category, DEFAULT_CATEGORIES } from '../types/expense';
import { format } from 'date-fns';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
        <Text style={styles.formTitle}>
          {initialValues ? 'Update Expense' : 'New Expense'}
        </Text>
        <Divider style={styles.divider} />

        {/* Title */}
        <View style={styles.row}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="tag-outline" size={24} color="#6200ee" />
          </View>
          <View style={{ flex: 1 }}>
            <TextInput
                label="Title"
                value={title}
                onChangeText={setTitle}
                mode="outlined"
                error={!!errors.title}
                style={styles.input}
                theme={{ colors: { text: '#000', primary: '#6200ee' } }}
            />
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
          </View>
        </View>

        {/* Amount */}
        <View style={styles.row}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="currency-usd" size={24} color="#6200ee" />
          </View>
          <View style={{ flex: 1 }}>
            <TextInput
                label="Amount"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                mode="outlined"
                error={!!errors.amount}
                style={styles.input}
                theme={{ colors: { text: '#000', primary: '#6200ee' } }}
            />
            {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
          </View>
        </View>

        {/* Account */}
        <View style={styles.row}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="wallet-outline" size={24} color="#6200ee" />
          </View>
          <TextInput
              label="Account"
              value={account}
              onChangeText={setAccount}
              mode="outlined"
              style={styles.input}
              theme={{ colors: { text: '#000', primary: '#6200ee' } }}
          />
        </View>

        {/* Date Picker */}
        <View style={styles.row}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="calendar-outline" size={24} color="#6200ee" />
          </View>
          <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>Date</Text>
            <Text style={styles.dateValue}>{format(date, 'PPP')}</Text>
          </TouchableOpacity>
        </View>

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
              mode="contained"
              style={styles.submitButton}
              contentStyle={styles.buttonContent}
          >
            {initialValues ? 'Update Expense' : 'Save Expense'}
          </Button>
        </View>
      </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 12,
    elevation: 4,
    backgroundColor: '#ffffff',
  },
  formTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  divider: {
    marginBottom: 16,
    height: 1.5,
    backgroundColor: '#e0e0e0',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginRight: 8,
  },
  input: {
    backgroundColor: '#ffffff',
  },
  errorText: {
    color: '#B00020',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  datePickerButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dateText: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  buttonContainer: {
    marginTop: 24,
  },
  submitButton: {
    height: 50,
    borderRadius: 25,
  },
  buttonContent: {
    height: 50,
    justifyContent: 'center',
  },
});