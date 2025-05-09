import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import Constants from 'expo-constants';

const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseConfig.apiKey,
  authDomain: Constants.expoConfig?.extra?.firebaseConfig.authDomain,
  projectId: Constants.expoConfig?.extra?.firebaseConfig.projectId,
  storageBucket: Constants.expoConfig?.extra?.firebaseConfig.storageBucket,
  messagingSenderId: Constants.expoConfig?.extra?.firebaseConfig.messagingSenderId,
  appId: Constants.expoConfig?.extra?.firebaseConfig.appId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

export { auth, db }; 