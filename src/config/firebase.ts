import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import Constants from 'expo-constants';


const firebaseConfig = {
  apiKey: "AIzaSyDd6zTWBt3xvn_5x8C-YpZz31ZH-8xlVXU",
  authDomain: "myproject-15aa7.firebaseapp.com",
  projectId: "myproject-15aa7",
  storageBucket: "myproject-15aa7.firebasestorage.app",
  messagingSenderId: "596512143640",
  appId: "1:596512143640:web:1720c6fb8d924d0c68466d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, app };