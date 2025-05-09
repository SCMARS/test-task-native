import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useStore } from '../store/useStore';
import { MainTabScreenProps } from '../types/navigation';

const AddExpenseScreen = ({ navigation }: MainTabScreenProps<'ExpenseForm'>) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const { addExpense, isLoading } = useStore();

  const handleAddExpense = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    addExpense({
      title: title.trim(),
      amount: amountNum,
      description: description.trim() || undefined,
      date: new Date(),
      category: '1', // Default category
      account: 'Cash', // Default account
    })
      .then(() => {
        navigation.goBack();
      })
      .catch(error => {
        Alert.alert('Error', 'Failed to add expense. Please try again.');
        console.error('Failed to add expense:', error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter expense title"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          placeholder="Enter amount"
          placeholderTextColor="#999"
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Description (Optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter description"
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleAddExpense}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Add Expense</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddExpenseScreen; 