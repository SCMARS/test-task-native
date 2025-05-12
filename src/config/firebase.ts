import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  inMemoryPersistence,
  browserLocalPersistence,
  indexedDBLocalPersistence,
  Auth
} from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Используем переменные окружения для конфигурации Firebase
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Determine which persistence to use based on platform
const getPersistenceType = () => {
  if (Platform.OS === 'web') {
    // Use appropriate persistence for web
    return typeof indexedDB !== 'undefined'
        ? indexedDBLocalPersistence
        : browserLocalPersistence;
  }

  return inMemoryPersistence;
};


let app;
let auth: Auth;
let db: Firestore;

try {
  if (getApps().length === 0) {

    app = initializeApp(firebaseConfig);


    try {

      auth = initializeAuth(app, {
        persistence: getPersistenceType()
      });
    } catch (authError) {
      console.log('Auth initialization error:', authError);

      auth = getAuth(app);
    }

    db = getFirestore(app);
  } else {

    app = getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
  // Last resort fallback
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}


if (Platform.OS !== 'web') {
  auth.onAuthStateChanged(async (user) => {
    if (user) {

      try {
        await AsyncStorage.setItem('@auth_user', JSON.stringify({
          uid: user.uid,
          email: user.email,

        }));
      } catch (e) {
        console.error('Error saving auth state:', e);
      }
    } else {

      try {
        await AsyncStorage.removeItem('@auth_user');
      } catch (e) {
        console.error('Error clearing auth state:', e);
      }
    }
  });
}

export { auth, db, app };


export const retrieveUserFromStorage = async () => {
  if (Platform.OS !== 'web') {
    try {
      const userJSON = await AsyncStorage.getItem('@auth_user');
      return userJSON ? JSON.parse(userJSON) : null;
    } catch (e) {
      console.error('Error retrieving user from storage:', e);
      return null;
    }
  }
  return null;
};