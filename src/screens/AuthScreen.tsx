import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useStore } from '../store/useStore';
import { auth } from '../config/firebase';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export const AuthScreen = () => {
  const setUser = useStore(state => state.setUser);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const auth = getAuth();
      if (isLogin) {
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        setUser(user);
      } else {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        setUser(user);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Expense Tracker</Text>
          <Text style={styles.subtitle}>
            {isLogin ? 'Welcome back!' : 'Create an account'}
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
            />
          </View>

          {!isLogin && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                secureTextEntry
              />
            </View>
          )}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleAuth}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>
                {isLogin ? 'Log In' : 'Sign Up'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => {
              setIsLogin(!isLogin);
              setEmail('');
              setPassword('');
              setConfirmPassword('');
            }}
          >
            <Text style={styles.switchButtonText}>
              {isLogin
                ? "Don't have an account? Sign Up"
                : 'Already have an account? Log In'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7'
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16
  },
  header: {
    alignItems: 'center',
    marginBottom: 32
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93'
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  inputGroup: {
    marginBottom: 16
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000000'
  },
  input: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA'
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16
  },
  buttonDisabled: {
    opacity: 0.5
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  },
  switchButton: {
    marginTop: 16,
    alignItems: 'center'
  },
  switchButtonText: {
    color: '#007AFF',
    fontSize: 16
  }
}); 