import React, { useState } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { AuthStackScreenProps } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';

export const SignUpScreen = ({ navigation }: AuthStackScreenProps<'SignUp'>) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      // Success message could go here
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
      <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <View style={styles.iconContainer}>
              <Ionicons name="wallet-outline" size={48} color="white" />
            </View>
            <Text style={styles.appName}>Finance Tracker</Text>
            <Text style={styles.tagline}>Take control of your finances</Text>
          </View>

          <Card style={styles.card}>
            <View style={styles.content}>
              <Text variant="headlineMedium" style={styles.title}>
                Create Account
              </Text>

              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={22} color="#5E72E4" style={styles.inputIcon} />
                <Input
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    error={!!errors.email}
                    helperText={errors.email}
                    style={styles.input}
                    placeholder="your@email.com"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={22} color="#5E72E4" style={styles.inputIcon} />
                <View style={styles.passwordContainer}>
                  <Input
                      label="Password"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      error={!!errors.password}
                      helperText={errors.password}
                      style={styles.input}
                      placeholder="Min. 6 characters"
                  />
                  <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIconContainer}>
                    <Ionicons
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={22}
                        color="#5B5B5B"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="shield-checkmark-outline" size={22} color="#5E72E4" style={styles.inputIcon} />
                <View style={styles.passwordContainer}>
                  <Input
                      label="Confirm Password"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showConfirmPassword}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword}
                      style={styles.input}
                      placeholder="Confirm your password"
                  />
                  <TouchableOpacity onPress={toggleConfirmPasswordVisibility} style={styles.eyeIconContainer}>
                    <Ionicons
                        name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                        size={22}
                        color="#5B5B5B"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <Button
                  onPress={handleSignUp}
                  loading={isLoading}
                  disabled={isLoading}
                  style={styles.signUpButton}
                  labelStyle={styles.signUpButtonLabel}
              >
                Create Account
              </Button>

              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.divider} />
              </View>

              <View style={styles.socialButtonsContainer}>
                <TouchableOpacity style={[styles.socialButton, styles.googleButton]}>
                  <Ionicons name="logo-google" size={22} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.socialButton, styles.appleButton]}>
                  <Ionicons name="logo-apple" size={22} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.socialButton, styles.facebookButton]}>
                  <Ionicons name="logo-facebook" size={22} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                  onPress={() => navigation.navigate('Login')}
                  disabled={isLoading}
                  style={styles.signInLink}
              >
                <Text style={styles.signInText}>
                  Already have an account? <Text style={styles.signInHighlight}>Sign In</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </Card>

          <Text style={styles.termsText}>
            By signing up, you agree to our <Text style={styles.termsLink}>Terms</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  headerContainer: {
    backgroundColor: '#5E72E4',
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  appName: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  tagline: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    marginTop: 4,
  },
  card: {
    margin: 16,
    marginTop: -30,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    backgroundColor: 'white',
  },
  content: {
    padding: 24,
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: '600',
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 10,
    height: '100%',
    justifyContent: 'center',
    paddingTop: 15, // Adjust this value based on your Input component's label height
  },
  signUpButton: {
    marginTop: 16,
    backgroundColor: '#5E72E4',
    borderRadius: 8,
    paddingVertical: 8,
  },
  signUpButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#8898AA',
    fontWeight: '600',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  googleButton: {
    backgroundColor: '#DB4437',
  },
  appleButton: {
    backgroundColor: '#000000',
  },
  facebookButton: {
    backgroundColor: '#4267B2',
  },
  signInLink: {
    alignItems: 'center',
    padding: 8,
  },
  signInText: {
    fontSize: 15,
    color: '#525F7F',
  },
  signInHighlight: {
    color: '#5E72E4',
    fontWeight: '600',
  },
  termsText: {
    textAlign: 'center',
    color: '#8898AA',
    fontSize: 13,
    marginTop: 4,
    paddingHorizontal: 16,
  },
  termsLink: {
    color: '#5E72E4',
    fontWeight: '500',
  },
});