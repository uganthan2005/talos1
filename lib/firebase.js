import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase (singleton pattern)
let app;
if (getApps().length === 0) {
  if (firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
  } else {
    console.warn("Firebase API Key is missing. Firebase features will not work.");
    // Provide a mock or handle the missing app case
  }
} else {
  app = getApps()[0];
}

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const googleProvider = new GoogleAuthProvider();

if (googleProvider) {
  // Force account selection on every sign-in
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });
}
