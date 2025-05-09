import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { AuthStackScreenProps } from '../types/navigation';

export const SignUpScreen = ({ navigation }: AuthStackScreenProps<'SignUp'>) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
    } catch (error: any) {
      let message = 'Failed to create account';
      if (error.code === 'auth/email-already-in-use') {
        message = 'This email is already registered';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email address';
      } else if (error.code === 'auth/operation-not-allowed') {
        message = 'Email/password accounts are not enabled';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password is too weak';
      }
      Alert.alert('Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card>
        <View style={styles.content}>
          <Text variant="headlineMedium" style={styles.title}>
            Create Account
          </Text>

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={!!errors.email}
            helperText={errors.email}
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={!!errors.password}
            helperText={errors.password}
          />

          <Input
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
          />

          <Button
            onPress={handleSignUp}
            loading={isLoading}
            disabled={isLoading}
          >
            Sign Up
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.navigate('Login')}
            disabled={isLoading}
          >
            Already have an account? Sign In
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
  content: {
    padding: 16,
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: '600',
  },
}); 