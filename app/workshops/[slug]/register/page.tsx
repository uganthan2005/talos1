'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import PageSection from '@/components/_core/layout/PageSection';
import { api, type Workshop, type WorkshopRegistrationRequest } from '@/lib/api';
import workshopsData from '@/workshops.json';

export default function WorkshopRegistrationPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const workshopSlug = params?.slug as string;

  // Get workshop data from static JSON instead of API
  const getWorkshopFromJson = (): Workshop | null => {
    const workshop = (workshopsData as Workshop[]).find(w => w.workshop_id === workshopSlug);
    return workshop || null;
  };

  const [workshopData] = useState<Workshop | null>(getWorkshopFromJson);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);


  const PAYMENT_FORM_LINK = process.env.NEXT_PUBLIC_FORM_IPL_AUCTION; // TODO: Replace with actual link

  // Form state - Solo registration
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    year: '',
    collegeName: '',
    referralId: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Redirect if workshop not found
  useEffect(() => {
    if (!workshopData && !authLoading) {
      alert('Workshop not found');
      router.push('/workshops');
    }
  }, [workshopData, authLoading, router]);

  // Check if user is already registered (needs API call)
  useEffect(() => {
    const checkRegistration = async () => {
      // Wait for auth to fully complete before making API calls
      if (authLoading || !user || !workshopSlug) return;

      try {
        const regCheck = await api.checkWorkshopRegistration(workshopSlug);
        setAlreadyRegistered(regCheck.registered);
      } catch (error) {
        console.error('Error checking registration:', error);
      }
    };

    checkRegistration();
  }, [workshopSlug, user, authLoading]);

  // Pre-fill user data
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.displayName || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'email') {
      setEmailError(null);
    }
  };

  const checkEmailRegistered = async () => {
    if (!formData.email.trim()) return;

    try {
      const result = await api.checkWorkshopEmail(workshopSlug, formData.email.trim());
      if (result.registered) {
        setEmailError('This email is already registered for this workshop.');
        return false;
      }
      setEmailError(null);
      return true;
    } catch (error) {
      console.error('Error checking email:', error);
      return true; // Allow submission, backend will validate
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('Please login to register');
      router.push('/login');
      return;
    }

    if (!workshopData) return;

    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.year || !formData.collegeName) {
      alert('Please fill all required fields');
      return;
    }

    if (!transactionId.trim()) {
      alert('Please enter the Transaction ID after completing the payment');
      return;
    }

    // Validate phone number
    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    // Check if email is already registered
    const isEmailAvailable = await checkEmailRegistered();
    if (!isEmailAvailable) {
      return;
    }

    try {
      setSubmitting(true);

      const registrationData: WorkshopRegistrationRequest = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone.replace(/\D/g, ''),
        year: formData.year,
        college_name: formData.collegeName,
        referral_id: formData.referralId || undefined,
        transaction_id: transactionId.trim(),
      };

      // Register directly
      await api.registerWorkshop(workshopSlug, registrationData);

      alert('Registration successful! Your registration is pending verification.');
      router.push('/profile');

    } catch (error) {
      console.error('Error registering:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to register. Please try again.';
      alert(errorMessage);
      setSubmitting(false);
    }
  };

  const handlePayClick = () => {
    window.open(PAYMENT_FORM_LINK, '_blank');
  };

  if (loading || authLoading) {
    return (
      <PageSection title="Register" className="min-h-screen flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading workshop details...</p>
        </div>
      </PageSection>
    );
  }

  if (!workshopData) {
    return null;
  }

  if (alreadyRegistered) {
    return (
      <PageSection title={`Register - ${workshopData.title}`} className="min-h-screen font-sans">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-yellow-950/30 to-black/50 backdrop-blur-sm border border-yellow-900/30 rounded-2xl p-8 shadow-2xl text-center">
            <div className="mb-6">
              <svg className="w-20 h-20 mx-auto text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Already Registered</h2>
            <p className="text-gray-300 mb-6 text-lg">
              You are already registered for {workshopData.title}. You can only register once per workshop.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push('/profile')}
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all"
              >
                View My Registrations
              </button>
              <button
                onClick={() => router.push('/workshops')}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all"
              >
                Browse Workshops
              </button>
            </div>
          </div>
        </div>
      </PageSection>
    );
  }

  return (
    <PageSection title={`Register - ${workshopData.title}`} className="min-h-screen font-sans">
      <div className="max-w-2xl mx-auto">
        {/* Workshop Info */}
        <div className="bg-gradient-to-br from-red-950/30 to-black/50 backdrop-blur-sm border border-red-900/30 rounded-2xl p-8 mb-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-4">{workshopData.title}</h2>
          <p className="text-gray-300 mb-6 text-lg">{workshopData.description}</p>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="px-4 py-2 bg-red-600/20 border border-red-600/50 rounded-lg">
              <span className="text-red-400 font-semibold text-lg">
                Registration Fee: ₹{workshopData.registration_fee}
              </span>
            </div>
            <div className="px-4 py-2 bg-blue-600/20 border border-blue-600/50 rounded-lg">
              <span className="text-blue-400 font-semibold">Solo Registration</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div className="text-gray-400">
              <span className="font-semibold">Instructor:</span> {workshopData.instructor}
            </div>
            <div className="text-gray-400">
              <span className="font-semibold">Duration:</span> {workshopData.duration}
            </div>
            <div className="text-gray-400">
              <span className="font-semibold">Date:</span> {workshopData.date}
            </div>
            <div className="text-gray-400">
              <span className="font-semibold">Time:</span> {workshopData.time}
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <form className="bg-black/40 backdrop-blur-sm border border-red-900/30 rounded-2xl p-8 shadow-2xl">
          <h3 className="text-2xl font-bold text-white mb-6 border-b border-red-900/50 pb-4">
            Personal Information
          </h3>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-red-400">
                Full Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full bg-black/50 border border-red-900/30 rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50 transition-all"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-red-400">
                Year <span className="text-red-600">*</span>
              </label>
              <select
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                required
                className="w-full bg-black/50 border border-red-900/30 rounded-lg p-3 text-white focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50 transition-all"
              >
                <option value="">Select Year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-red-400">
                Email ID <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={checkEmailRegistered}
                required
                className={`w-full bg-black/50 border rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 transition-all ${emailError
                  ? 'border-red-600 focus:border-red-600 focus:ring-red-600/50'
                  : 'border-red-900/30 focus:border-red-600 focus:ring-red-600/50'
                  }`}
                placeholder="john@example.com"
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-2">{emailError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-red-400">
                Contact Number <span className="text-red-600">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                pattern="[0-9]{10}"
                className="w-full bg-black/50 border border-red-900/30 rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50 transition-all"
                placeholder="9876543210"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-red-400">
                College Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="collegeName"
                value={formData.collegeName}
                onChange={handleInputChange}
                required
                className="w-full bg-black/50 border border-red-900/30 rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50 transition-all"
                placeholder="ABC College of Engineering"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-red-400">
                Referral ID (Optional)
              </label>
              <input
                type="text"
                name="referralId"
                value={formData.referralId}
                onChange={handleInputChange}
                className="w-full bg-black/50 border border-red-900/30 rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50 transition-all"
                placeholder="REF123456"
              />
            </div>
          </div>

          {/* Payment and Submit Section */}
          <div className="mt-8 pt-6 border-t border-red-900/50 space-y-4">

            <div className="bg-red-900/20 border border-red-900/30 rounded-xl p-4">
              <h4 className="text-white font-semibold mb-2">Step 1: Make Payment</h4>
              <p className="text-gray-400 text-sm mb-4">
                Click the button below to pay the registration fee of ₹{workshopData.registration_fee}.
                After payment, note down the Transaction ID / UTR Number.
              </p>
              <button
                type="button"
                onClick={handlePayClick}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-all"
              >
                Pay ₹{workshopData.registration_fee}
              </button>
            </div>

            <div className="bg-red-900/20 border border-red-900/30 rounded-xl p-4">
              <h4 className="text-white font-semibold mb-2">Step 2: Enter Transaction Details</h4>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2 text-red-400">
                  Transaction ID / UTR Number <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full bg-black/50 border border-red-900/30 rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50 transition-all"
                  placeholder="Enter Transaction ID"
                />
              </div>

              <button
                type="submit"
                onClick={handleSubmit}
                disabled={submitting || !!emailError || !transactionId}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-red-600/50 hover:shadow-red-600/70 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    Processing...
                  </span>
                ) : (
                  'Complete Registration'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </PageSection>
  );
}
