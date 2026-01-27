'use client';

import { useEffect } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth, googleProvider } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import PageSection from '@/components/_core/layout/PageSection';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  
  const redirectTo = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (!loading && user) {
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  const handleLogin = async () => {
    if (!auth) {
      console.error("Firebase auth is not initialized. Please check your environment variables.");
      alert("Login is currently unavailable. Please contact support.");
      return;
    }
    try {
      await signInWithPopup(auth, googleProvider);
      router.push(redirectTo);
    } catch (error: unknown) {
      console.error('Login error:', error);
      
      // Handle specific Firebase auth errors
      const firebaseError = error as { code?: string; message?: string };
      
      if (firebaseError.code === 'auth/popup-closed-by-user') {
        // User closed the popup - no need to show error
        return;
      }
      
      if (firebaseError.code === 'auth/popup-blocked') {
        alert('Popup was blocked by your browser. Please allow popups for this site and try again.');
        return;
      }
      
      if (firebaseError.code === 'auth/cancelled-popup-request') {
        // Another popup was opened - ignore
        return;
      }
      
      if (firebaseError.message?.includes('initial state') || 
          firebaseError.code === 'auth/missing-initial-state') {
        alert('Login failed due to browser privacy settings. Please try:\n\n1. Exit private/incognito mode\n2. Allow third-party cookies for this site\n3. Try a different browser');
        return;
      }
      
      if (firebaseError.code === 'auth/network-request-failed') {
        alert('Network error. Please check your internet connection and try again.');
        return;
      }
      
      alert('Login failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <PageSection title="Login" className="min-h-[70vh] flex items-center justify-center">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      </PageSection>
    );
  }

  if (user) {
    return null; // Will redirect via useEffect
  }

  return (
    <PageSection title="Login" className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-muted/20 border border-white/10 p-8 rounded-2xl shadow-2xl backdrop-blur-sm">
        <div className="text-center mb-8">
           <h3 className="text-xl font-semibold text-white mb-2">Welcome Back</h3>
           <p className="text-muted-foreground text-sm">Sign in to access your dashboard</p>
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={handleLogin}
            className="w-full bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-3"
          >
            {/* Google Icon SVG */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    </PageSection>
  );
}
