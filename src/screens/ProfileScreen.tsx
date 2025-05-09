import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const ProfileScreen = () => {
  const { user } = useStore();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Failed to sign out:', error);
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  if (!user) return null;

  return (
    <View style={styles.container}>
      <Card>
        <View style={styles.content}>
          <Text variant="headlineMedium" style={styles.title}>Profile</Text>
          
          <View style={styles.infoContainer}>
            <Text variant="bodyLarge" style={styles.label}>Email</Text>
            <Text variant="bodyLarge">{user.email}</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text variant="bodyLarge" style={styles.label}>Account Created</Text>
            <Text variant="bodyLarge">
              {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}
            </Text>
          </View>

          <View style={styles.infoContainer}>
            <Text variant="bodyLarge" style={styles.label}>Last Sign In</Text>
            <Text variant="bodyLarge">
              {user.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString() : 'N/A'}
            </Text>
          </View>

          <Button
            mode="outlined"
            onPress={handleSignOut}
            icon="logout"
            style={styles.signOutButton}
            color="#DC3545"
          >
            Sign Out
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
    padding: 8,
  },
  title: {
    marginBottom: 24,
    fontWeight: '600',
  },
  infoContainer: {
    marginBottom: 16,
  },
  label: {
    color: '#666',
    marginBottom: 4,
  },
  signOutButton: {
    marginTop: 24,
    borderColor: '#DC3545',
  },
});

export default ProfileScreen; 