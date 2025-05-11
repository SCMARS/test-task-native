import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { Expense } from './expense';
import { AuthStackParamList } from './navigation';

export type MainTabParamList = {
  ExpensesList: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  ExpenseForm: {
    mode: 'add' | 'edit';
    expenseId?: string;
  };
};

export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<AuthStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> = BottomTabScreenProps<MainTabParamList, T>;

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type AuthStackNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
export type MainTabNavigationProp = BottomTabNavigationProp<MainTabParamList>; 