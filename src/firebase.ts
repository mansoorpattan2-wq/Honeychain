import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';
import firebaseConfig from '../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);
export const storage = getStorage(app);

// Initialize Firebase Analytics safely for browser environment
export let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch((err) => {
    console.warn('Analytics initialization notice:', err);
  });
}

// Verify server connection on bootstrap
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'honeyBatches', 'HNY-2026-0001'));
  } catch (error: any) {
    // Non-blocking connectivity test
    console.warn('Firestore server ping notice:', error?.message || error);
  }
}

testConnection();

export default app;
