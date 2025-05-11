import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import { useStore } from '../store/useStore';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MainTabScreenProps, RootStackScreenProps } from '../types/navigation';
import { Expense } from '../types/expense';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

export const ExpenseForm = () => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date());
  const [account, setAccount] = useState('USD');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDatePicker, setShowDatePicker] = useState(false);

  const navigation = useNavigation<RootStackScreenProps<'ExpenseForm'>['navigation']>();
  const route = useRoute<RootStackScreenProps<'ExpenseForm'>['route']>();
  const { addExpense, updateExpense, expenses } = useStore();

  const isEditMode = route.params?.mode === 'edit';
  const expenseId = route.params?.expenseId;

  useEffect(() => {
    if (isEditMode && expenseId) {
      const expense = expenses.find(e => e.id === expenseId);
      if (expense) {
        setTitle(expense.title);
        setAmount(expense.amount.toString());
        setCategory(expense.category);
        setDate(expense.date);
        setAccount(expense.account);
        setDescription(expense.description || '');
      }
    }
  }, [isEditMode, expenseId, expenses]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }

    if (!category.trim()) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const expenseData = {
      title,
      amount: Number(amount),
      category,
      date,
      account,
      description: description.trim() || undefined,
    };

    try {
      if (isEditMode && expenseId) {
        await updateExpense(expenseId, expenseData);
      } else {
        await addExpense(expenseData);
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error saving expense:', error);
      setErrors({ submit: 'Failed to save expense' });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <TextInput
          label="Title"
          value={title}
          onChangeText={setTitle}
          error={!!errors.title}
          style={styles.input}
        />
        <HelperText type="error" visible={!!errors.title}>
          {errors.title}
        </HelperText>

        <TextInput
          label="Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          error={!!errors.amount}
          style={styles.input}
        />
        <HelperText type="error" visible={!!errors.amount}>
          {errors.amount}
        </HelperText>

        <TextInput
          label="Category"
          value={category}
          onChangeText={setCategory}
          error={!!errors.category}
          style={styles.input}
        />
        <HelperText type="error" visible={!!errors.category}>
          {errors.category}
        </HelperText>

        <Button
          mode="outlined"
          onPress={() => setShowDatePicker(true)}
          style={styles.input}
        >
          {format(date, 'MMM dd, yyyy')}
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
          label="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
        >
          {isEditMode ? 'Update Expense' : 'Add Expense'}
        </Button>

        {errors.submit && (
          <HelperText type="error" visible={true}>
            {errors.submit}
          </HelperText>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  form: {
    padding: 16,
  },
  input: {
    marginBottom: 8,
  },
  submitButton: {
    marginTop: 16,
  },
}); 