import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useStore } from '../store/useStore';
import { AuthScreen } from '../screens/AuthScreen';
import { ExpensesListScreen } from '../screens/ExpensesListScreen';
import { ExpenseForm } from '../screens/ExpenseForm';
import { ProfileScreen } from '../screens/ProfileScreen';
import { RootStackParamList, MainTabParamList } from '../types/navigation';
import { IconButton } from 'react-native-paper';
import type { IconSource } from 'react-native-paper/lib/typescript/components/Icon';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const getTabIcon = (routeName: keyof MainTabParamList): IconSource => {
  switch (routeName) {
    case 'ExpensesList':
      return 'wallet';
    case 'Profile':
      return 'account';
    default:
      return 'help';
  }
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const iconName = getTabIcon(route.name as keyof MainTabParamList);
          return <IconButton icon={iconName} size={size} iconColor={color} />;
        },
        tabBarActiveTintColor: '#6200EE',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="ExpensesList" 
        component={ExpensesListScreen}
        options={{ 
          title: 'Expenses',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ 
          title: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export const RootNavigator = () => {
  const user = useStore((state) => state.user);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#6200EE',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {!user ? (
        <Stack.Screen 
          name="Auth" 
          component={AuthScreen}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen 
            name="MainTabs" 
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="ExpenseForm" 
            component={ExpenseForm}
            options={({ route }) => ({
              title: route.params.mode === 'edit' ? 'Edit Expense' : 'Add Expense'
            })}
          />
        </>
      )}
    </Stack.Navigator>
  );
}; 