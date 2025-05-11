import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import {
    TextInput,
    Button,
    Text,
    Surface
} from 'react-native-paper';
import { useStore } from '../store/useStore';
import { AuthStackScreenProps } from '../types/navigation';
import { LinearGradient } from 'expo-linear-gradient';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export const LoginScreen = ({ navigation }: AuthStackScreenProps<'Login'>) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const setUser = useStore(state => state.setUser);

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleLogin = async () => {
        setError('');

        if (!email.trim()) {
            setError('Email is required');
            return;
        }

        if (!isValidEmail(email)) {
            setError('Please enter a valid email');
            return;
        }

        if (!password) {
            setError('Password is required');
            return;
        }

        setIsLoading(true);

        try {
            const { user } = await signInWithEmailAndPassword(auth, email, password);
            setUser(user);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to login. Please try again.');
            }
        }

        setIsLoading(false);
    };

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <LinearGradient
            colors={['rgba(0,0,0,0.03)', 'rgba(0,0,0,0.07)']}
            style={styles.gradient}
        >
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.container}
                >
                    <View style={styles.logoContainer}>
                        <Text style={styles.appName}>FinTrack</Text>
                        <Text style={styles.tagline}>Your personal finance assistant</Text>
                    </View>

                    <Surface style={styles.formContainer}>
                        <Text variant="headlineSmall" style={styles.title}>Welcome Back</Text>

                        <TextInput
                            label="Email"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            style={styles.input}
                            mode="outlined"
                            outlineColor="#E0E0E0"
                            activeOutlineColor="#6200EE"
                            left={<TextInput.Icon icon="email" />}
                        />

                        <TextInput
                            label="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            style={styles.input}
                            mode="outlined"
                            outlineColor="#E0E0E0"
                            activeOutlineColor="#6200EE"
                            left={<TextInput.Icon icon="lock" />}
                            right={<TextInput.Icon icon="eye" />}
                        />

                        {error ? <Text style={styles.error}>{error}</Text> : null}

                        <Button
                            mode="contained"
                            onPress={handleLogin}
                            style={styles.button}
                            contentStyle={styles.buttonContent}
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            Log In
                        </Button>

                        <View style={styles.signUpContainer}>
                            <Text style={styles.signUpText}>Don't have an account?</Text>
                            <Button
                                mode="text"
                                onPress={() => navigation.navigate('SignUp')}
                                style={styles.signUpButton}
                            >
                                Sign Up
                            </Button>
                        </View>
                    </Surface>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    appName: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    tagline: {
        fontSize: 16,
        color: '#666',
    },
    formContainer: {
        padding: 24,
        borderRadius: 10,
        elevation: 4,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 24,
        color: '#333',
    },
    input: {
        marginBottom: 16,
        backgroundColor: 'white',
    },
    button: {
        marginTop: 16,
        borderRadius: 5,
        backgroundColor: '#6200EE',
    },
    buttonContent: {
        paddingVertical: 8,
    },
    error: {
        color: '#D32F2F',
        fontSize: 14,
        marginBottom: 16,
        textAlign: 'center',
    },
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    signUpText: {
        color: '#757575',
    },
    signUpButton: {
        marginLeft: 4,
    },
});