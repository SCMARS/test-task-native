import React from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { Text, Avatar, Divider, Button } from 'react-native-paper';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { Ionicons } from '@expo/vector-icons';
import { ReactNode } from 'react';

const ProfileScreen = () => {
  const { user } = useStore();

  const handleSignOut = async () => {
    try {
      console.log('Signing out...');
      await auth.signOut();
      console.log('Sign out successful');
    } catch (error) {
      console.error('Failed to sign out:', error);
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  if (!user) return null;

  // Get first letter of email for avatar
  const avatarText = user.email ? user.email[0].toUpperCase() : '?';

  // Format dates nicely
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
      <ScrollView style={styles.container}>
        {/* Header with gradient background */}
        <View style={styles.header}>
          <Avatar.Text
              size={80}
              label={avatarText}
              style={styles.avatar}
              labelStyle={styles.avatarText}
              color="#FFFFFF"
          />
          <Text style={styles.userName}>{user.displayName || user.email}</Text>
          <Text style={styles.userRole}>Personal Account</Text>
        </View>

        <View style={styles.content}>
          {/* Account Information Card */}
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="person-circle-outline" size={22} color="#5B5B5B" />
              <Text style={styles.cardTitle}>Account Information</Text>
            </View>
            <Divider style={styles.divider} />

            <View style={styles.infoItem}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{user.email}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.label}>Account Created</Text>
              <Text style={styles.value}>
                {formatDate(user.metadata?.creationTime)}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.label}>Last Sign In</Text>
              <Text style={styles.value}>
                {formatDate(user.metadata?.lastSignInTime)}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.label}>Account Status</Text>
              <View style={styles.statusContainer}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Active</Text>
              </View>
            </View>
          </Card>

          <Button
              mode="outlined"
              onPress={handleSignOut}
              icon="logout"
              style={styles.signOutButton}
              textColor="#FF5252"
              contentStyle={styles.signOutButtonContent}
          >
            Sign Out
          </Button>
        </View>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  header: {
    backgroundColor: '#5E72E4',
    paddingTop: 60,
    paddingBottom: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatar: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 3,
    borderColor: 'white',
  },
  avatarText: {
    fontSize: 32,
  },
  userName: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
  },
  userRole: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    marginTop: 4,
  },
  content: {
    padding: 16,
    paddingTop: 24,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: 'white',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    color: '#333',
  },
  divider: {
    backgroundColor: '#EEEEEE',
    height: 1,
    marginHorizontal: 16,
  },
  infoItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 15,
    color: '#606060',
  },
  value: {
    fontSize: 15,
    color: '#333333',
    fontWeight: '500',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  statusText: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  signOutButton: {
    marginTop: 8,
    marginBottom: 32,
    borderColor: '#FF5252',
    borderRadius: 10,
    borderWidth: 1.5,
  },
  signOutButtonLabel: {
    color: '#FF5252',
    fontSize: 16,
    fontWeight: '600',
  },
  signOutButtonContent: {
    paddingVertical: 6,
  },
});

export default ProfileScreen;