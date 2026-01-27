'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PageSection from '@/components/_core/layout/PageSection';

/**
 * This page handles legacy URLs like /register?event=xyz
 * and redirects to the new format /register/xyz
 */
export default function RegisterPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const eventId = searchParams.get('event');

  useEffect(() => {
    if (eventId) {
      // Redirect to new URL format
      router.replace(`/register/${eventId}`);
    } else {
      // No event specified, redirect to events page
      router.replace('/events');
    }
  }, [eventId, router]);

  return (
    <PageSection title="Register" className="min-h-screen">
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Redirecting...</p>
        </div>
      </div>
    </PageSection>
  );
}
