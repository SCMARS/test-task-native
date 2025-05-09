import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ExpensesListScreen } from '../screens/ExpensesListScreen';
import { ExpenseFormScreen } from '../screens/ExpenseFormScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { MainTabParamList } from '../types/navigation';
import { IconButton } from 'react-native-paper';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'ExpensesList') {
            iconName = 'format-list-bulleted';
          } else if (route.name === 'ExpenseForm') {
            iconName = 'plus-circle';
          } else if (route.name === 'Profile') {
            iconName = 'account';
          }

          return <IconButton icon={iconName} size={size} iconColor={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="ExpensesList" 
        component={ExpensesListScreen}
        options={{ title: 'Expenses' }}
      />
      <Tab.Screen 
        name="ExpenseForm" 
        component={ExpenseFormScreen}
        options={{ title: 'Add Expense' }}
        initialParams={{ mode: 'create' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}; 