import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyD9gBVKllbp7IVKRC9A3XkdPKvgRz-u6QM",
  authDomain: "k-market-connect.firebaseapp.com",
  projectId: "k-market-connect",
  storageBucket: "k-market-connect.firebasestorage.app",
  messagingSenderId: "62539333549",
  appId: "1:62539333549:web:b095c700541759bdbcab24",
  measurementId: "G-8TZFVHVHP1"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Analytics (client-side only)
export const getAnalyticsInstance = () => {
  if (typeof window !== 'undefined') {
    return getAnalytics(app);
  }
  return null;
};

export default app;