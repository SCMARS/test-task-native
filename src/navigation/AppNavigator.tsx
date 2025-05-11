import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../store/useStore';
import { RootStackParamList, MainTabParamList } from '../types/navigation';
import { ExpensesListScreen } from '../screens/ExpensesListScreen';
import { ExpenseFormScreen } from '../screens/ExpenseFormScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { AuthNavigator } from './AuthNavigator';
import type { RouteProp } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

type TabBarIconProps = {
    focused: boolean;
    color: string;
    size: number;
};

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }: { route: RouteProp<MainTabParamList, keyof MainTabParamList> }) => ({
                tabBarIcon: ({ focused, color, size }: TabBarIconProps) => {
                    let iconName: keyof typeof Ionicons.glyphMap = 'help-circle';

                    if (route.name === 'ExpensesList') {
                        iconName = focused ? 'list' : 'list-outline';
                    } else if (route.name === 'ExpenseForm') {
                        iconName = focused ? 'add-circle' : 'add-circle-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: '#8E8E93'
            })}
        >
            <Tab.Screen
                name="ExpensesList"
                component={ExpensesListScreen}
                options={{
                    title: 'Expenses',
                    headerShown: true
                }}
            />
            <Tab.Screen
                name="ExpenseForm"
                component={ExpenseFormScreen}
                options={{
                    title: 'Add Expense',
                    headerShown: true
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    title: 'Profile',
                    headerShown: true
                }}
            />
        </Tab.Navigator>
    );
};

export const AppNavigator = () => {
    const { user, setUser } = useStore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        return () => unsubscribe();
    }, [setUser]);

    return (

            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {user ? (
                    <Stack.Screen name="Main" component={TabNavigator} />
                ) : (
                    <Stack.Screen name="Auth" component={AuthNavigator} />
                )}
            </Stack.Navigator>

    );
};