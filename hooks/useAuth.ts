import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!auth) {
      // Defer state update to avoid synchronous render warning
      setTimeout(() => setLoading(false), 0);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Set user immediately so auth state is available
          setUser(firebaseUser);
          
          // Firestore updates are non-blocking - don't let them fail auth
          if (db) {
            try {
              const userRef = doc(db, 'users', firebaseUser.uid);
              const userSnap = await getDoc(userRef);

              if (!userSnap.exists()) {
                await setDoc(userRef, {
                  uid: firebaseUser.uid,
                  name: firebaseUser.displayName,
                  email: firebaseUser.email,
                  profile_photo: firebaseUser.photoURL,
                  last_login: serverTimestamp(),
                  created_at: serverTimestamp(),
                });
              } else {
                await setDoc(
                  userRef,
                  { last_login: serverTimestamp() },
                  { merge: true }
                );
              }
            } catch (firestoreError) {
              // Log but don't block auth - Firestore updates are non-critical
              console.error('Firestore update failed (non-blocking):', firestoreError);
            }
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Auth state handler error:', err);
        setError(err instanceof Error ? err : new Error('Authentication error'));
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  return { user, loading, error };
};
