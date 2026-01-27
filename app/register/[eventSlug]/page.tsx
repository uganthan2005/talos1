'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import PageSection from '@/components/_core/layout/PageSection';
import { api, type Event, type EventRegistrationRequest, type TeamMember } from '@/lib/api';
import eventsData from '@/events.json';

export default function EventRegistrationPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const eventSlug = params?.eventSlug as string;

  // Get event data from static JSON instead of API
  const getEventFromJson = (): Event | null => {
    const event = (eventsData as Event[]).find(e => e.event_id === eventSlug);
    if (!event) return null;
    
    // Create a copy to avoid mutating the original
    const eventCopy = { ...event };
    
    // Override for Plot Verse and Pixora to ensure they allow 1-2 participants
    const lowerTitle = eventCopy.title.toLowerCase();
    const lowerSlug = eventSlug.toLowerCase();

    const isFlexibleEvent = lowerTitle.includes('pixora') ||
      lowerTitle.includes('plot') ||
      lowerSlug.includes('pixora') ||
      lowerSlug.includes('plot');

    if (isFlexibleEvent) {
      eventCopy.min_team_size = 1;
      if (eventCopy.max_team_size < 2) eventCopy.max_team_size = 2;
    }
    
    return eventCopy;
  };

  const [eventData] = useState<Event | null>(getEventFromJson);
  const [submitting, setSubmitting] = useState(false);
  const [teamNameError, setTeamNameError] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  // Form state - Team Leader Info
  const [formData, setFormData] = useState({
    teamName: '',
    leaderName: '',
    leaderEmail: '',
    leaderPhone: '',
    leaderYear: '',
    collegeName: '',
    referralId: '',
  });

  const PAYMENT_FORM_LINK = eventSlug === 'lenstolife' 
    ? process.env.NEXT_PUBLIC_FORM_NON_TECH 
    : process.env.NEXT_PUBLIC_FORM_IPL_AUCTION;

  // Team Members - initialize based on event's min_team_size
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    if (!eventData) return [];
    const minAdditionalMembers = Math.max(0, (eventData.min_team_size || 2) - 1);
    return Array(minAdditionalMembers).fill(null).map(() => ({
      name: '',
      email: '',
      phone: ''
    }));
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Redirect if event not found
  useEffect(() => {
    if (!eventData && !authLoading) {
      alert('Event not found');
      router.push('/events');
    }
  }, [eventData, authLoading, router]);

  // Check if user is already registered (still needs API call)
  useEffect(() => {
    const checkRegistration = async () => {
      // Wait for auth to fully complete before making API calls
      if (authLoading || !user || !eventSlug) return;
      
      try {
        const regCheck = await api.checkEventRegistration(eventSlug);
        setAlreadyRegistered(regCheck.registered);
      } catch (error) {
        console.error('Error checking registration:', error);
      }
    };

    checkRegistration();
  }, [user, eventSlug, authLoading]);

  // Pre-fill user data
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        leaderName: user.displayName || '',
        leaderEmail: user.email || '',
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear team name error when user types
    if (name === 'teamName') {
      setTeamNameError(null);
    }
  };

  const handleTeamMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    const updatedMembers = [...teamMembers];
    updatedMembers[index][field] = value;
    setTeamMembers(updatedMembers);
  };

  const addTeamMember = () => {
    if (!eventData) return;

    // max_team_size includes leader
    const maxAdditionalMembers = (eventData.max_team_size || 4) - 1;

    if (teamMembers.length < maxAdditionalMembers) {
      setTeamMembers([...teamMembers, { name: '', email: '', phone: '' }]);
    }
  };

  const removeTeamMember = (index: number) => {
    if (!eventData) return;

    // min_team_size includes leader
    const minAdditionalMembers = Math.max(0, (eventData.min_team_size || 2) - 1);

    if (teamMembers.length > minAdditionalMembers) {
      setTeamMembers(teamMembers.filter((_, i) => i !== index));
    }
  };

  const checkTeamNameAvailability = async () => {
    if (!formData.teamName.trim()) return;

    try {
      const result = await api.checkTeamName(eventSlug, formData.teamName.trim());
      if (!result.available) {
        setTeamNameError('Team name already exists. Please choose a different name.');
        return false;
      }
      setTeamNameError(null);
      return true;
    } catch (error) {
      console.error('Error checking team name:', error);
      return true; // Allow submission, backend will validate
    }
  };

  const generateIndividualTeamName = () => {
    const phoneDigits = formData.leaderPhone.replace(/\D/g, '');
    const safeName = formData.leaderName.trim() || 'participant';
    return `${safeName}-${phoneDigits || 'phone'}`.replace(/\s+/g, '-').toLowerCase();
  };

  const handlePayClick = () => {
    window.open(PAYMENT_FORM_LINK, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('Please login to register');
      router.push('/login');
      return;
    }

    const isIndividualEvent = eventData?.min_team_size === 1 && eventData?.max_team_size === 1;

    // Validation
    if ((!formData.teamName && !isIndividualEvent) || !formData.leaderName || !formData.leaderYear ||
      !formData.leaderEmail || !formData.leaderPhone || !formData.collegeName) {
      alert('Please fill all required fields');
      return;
    }

    // Check if event requires payment and transaction ID
    if (eventData?.registration_fee && eventData.registration_fee > 0 && !transactionId.trim()) {
      alert('Please enter the Transaction ID after completing the payment');
      return;
    }

    // Validate phone number
    if (!/^\d{10}$/.test(formData.leaderPhone.replace(/\D/g, ''))) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    // Validate team members (minimum required)
    // min_team_size includes leader
    const minAdditionalMembers = Math.max(0, (eventData?.min_team_size || 2) - 1);
    const filledMembers = teamMembers.filter((m) => m.name && m.email && m.phone);

    if (filledMembers.length < minAdditionalMembers) {
      alert(`At least ${minAdditionalMembers} additional team member${minAdditionalMembers !== 1 ? 's' : ''} ${minAdditionalMembers === 1 ? 'is' : 'are'} required`);
      return;
    }

    // Validate member phone numbers
    for (const member of filledMembers) {
      if (!/^\d{10}$/.test(member.phone.replace(/\D/g, ''))) {
        alert(`Please enter a valid 10-digit phone number for team member ${member.name}`);
        return;
      }
    }

    // Check team name availability for team events only
    if (!isIndividualEvent) {
      const isTeamNameAvailable = await checkTeamNameAvailability();
      if (!isTeamNameAvailable) {
        return;
      }
    }

    try {
      setSubmitting(true);

      const leaderPhoneDigits = formData.leaderPhone.replace(/\D/g, '');
      const teamNameToSend = isIndividualEvent ? generateIndividualTeamName() : formData.teamName.trim();

      const membersToSend = filledMembers.map(m => ({
        name: m.name,
        email: m.email,
        phone: m.phone.replace(/\D/g, ''),
      }));

      // Workaround for Pixora/Plotverse: If participating solo, add leader to members list
      // to satisfy potential backend requirement of min_team_size = 2.
      const lowerTitle = eventData?.title.toLowerCase() || '';
      const lowerSlug = eventSlug.toLowerCase();

      const isFlexibleEvent = lowerTitle.includes('pixora') ||
        lowerTitle.includes('plot') ||
        lowerSlug.includes('pixora') ||
        lowerSlug.includes('plot');

      if (isFlexibleEvent && membersToSend.length === 0) {
        membersToSend.push({
          name: formData.leaderName,
          email: formData.leaderEmail,
          phone: leaderPhoneDigits,
        });
      }

      const registrationData: EventRegistrationRequest = {
        team_name: teamNameToSend,
        leader_name: formData.leaderName,
        leader_email: formData.leaderEmail,
        leader_phone: leaderPhoneDigits,
        leader_year: formData.leaderYear,
        college_name: formData.collegeName,
        referral_id: formData.referralId || undefined,
        transaction_id: transactionId.trim() || undefined,
        members: membersToSend,
      };

      await api.registerForEvent(eventSlug, registrationData);

      const successMessage = eventData?.registration_fee && eventData.registration_fee > 0
        ? 'Registration successful! Your registration is pending verification.'
        : 'Registration successful! Your team has been registered for this event.';
      
      alert(successMessage);
      router.push('/profile');
    } catch (error) {
      console.error('Error submitting registration:', error);
      const errorMessage = error instanceof Error ? error.message : 'Registration failed. Please try again.';
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <PageSection title="Register" className="min-h-screen flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </PageSection>
    );
  }
 
  
  if (!eventData) {
    return null;
  }

  if (alreadyRegistered) {
    return (
      <PageSection title={`Register - ${eventData.title}`} className="min-h-screen font-sans">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-yellow-950/30 to-black/50 backdrop-blur-sm border border-yellow-900/30 rounded-2xl p-8 shadow-2xl text-center">
            <div className="mb-6">
              <svg className="w-20 h-20 mx-auto text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Already Registered</h2>
            <p className="text-gray-300 mb-6 text-lg">
              You are already registered for {eventData.title}. You can only register once per event.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push('/profile')}
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all"
              >
                View My Registrations
              </button>
              <button
                onClick={() => router.push('/events')}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all"
              >
                Browse Events
              </button>
            </div>
          </div>
        </div>
      </PageSection>
    );
  }

  const minMembers = eventData.min_team_size;
  const maxMembers = eventData.max_team_size;
  const isIndividual = minMembers === 1 && maxMembers === 1;
  const minAdditionalMembers = Math.max(0, minMembers - 1);
  const maxAdditionalMembers = Math.max(0, maxMembers - 1);

  return (
    <PageSection title={`Register - ${eventData.title}`} className="min-h-screen font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Event Info */}
        <div className="bg-linear-to-br from-red-950/30 to-black/50 backdrop-blur-sm border border-red-900/30 rounded-2xl p-8 mb-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-4">{eventData.title}</h2>
          <p className="text-gray-300 mb-6 text-lg">{eventData.description}</p>

          <div className="flex flex-wrap gap-4 items-center">
            {(eventData.registration_fee ?? 0) > 0 ? (
              <div className="px-4 py-2 bg-red-600/20 border border-red-600/50 rounded-lg">
                <span className="text-red-400 font-semibold text-lg">
                  Registration Fee: ₹{eventData.registration_fee}
                </span>
              </div>
            ) : (
              <div className="px-4 py-2 bg-green-600/20 border border-green-600/50 rounded-lg">
                <span className="text-green-400 font-semibold text-lg">Free Registration</span>
              </div>
            )}
            <div className="px-4 py-2 bg-blue-600/20 border border-blue-600/50 rounded-lg">
              <span className="text-blue-400 font-semibold">
                {isIndividual ? (
                  "Individual Participation"
                ) : (
                  `Team Size: ${eventData.min_team_size} - ${eventData.max_team_size} members (including leader)`
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="bg-black/40 backdrop-blur-sm border border-red-900/30 rounded-2xl p-8 shadow-2xl">
          {!isIndividual && (
            <>
              <h3 className="text-2xl font-bold text-white mb-6 border-b border-red-900/50 pb-4">
                Team Information
              </h3>

              <div className="mb-8">
                <label className="block text-sm font-semibold mb-2 text-red-400">
                  Team Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleInputChange}
                  onBlur={checkTeamNameAvailability}
                  required={!isIndividual}
                  className={`w-full bg-black/50 border rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 transition-all ${teamNameError
                    ? 'border-red-600 focus:border-red-600 focus:ring-red-600/50'
                    : 'border-red-900/30 focus:border-red-600 focus:ring-red-600/50'
                    }`}
                  placeholder="Enter a unique team name"
                />
                {teamNameError && (
                  <p className="text-red-500 text-sm mt-2">{teamNameError}</p>
                )}
              </div>
            </>
          )}

          {/* Team Leader Section */}
          <h3 className="text-2xl font-bold text-white mb-6 border-b border-red-900/50 pb-4">
            {isIndividual ? "Participant Information" : "Team Leader Information"}
          </h3>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-semibold mb-2 text-red-400">
                {(eventData?.title.toLowerCase().includes('promptorix') || eventSlug.toLowerCase().includes('promptorix')) ? 'Participant Name' : 'Leader Name'} <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="leaderName"
                value={formData.leaderName}
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
                name="leaderYear"
                value={formData.leaderYear}
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
                name="leaderEmail"
                value={formData.leaderEmail}
                onChange={handleInputChange}
                required
                className="w-full bg-black/50 border border-red-900/30 rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50 transition-all"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-red-400">
                Contact Number <span className="text-red-600">*</span>
              </label>
              <input
                type="tel"
                name="leaderPhone"
                value={formData.leaderPhone}
                onChange={handleInputChange}
                required
                pattern="[0-9]{10}"
                className="w-full bg-black/50 border border-red-900/30 rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50 transition-all"
                placeholder="9876543210"
              />
            </div>

            <div className="md:col-span-2">
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
          </div>

          <div className="mb-8">
            <label className="block text-sm font-semibold mb-2 text-red-400">Referral ID (Optional)</label>
            <input
              type="text"
              name="referralId"
              value={formData.referralId}
              onChange={handleInputChange}
              className="w-full bg-black/50 border border-red-900/30 rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50 transition-all"
              placeholder="REF123456"
            />
          </div>

          {/* Team Members Section */}
          {!isIndividual && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex items-center justify-between mb-6 border-b border-red-900/50 pb-4">
                <h3 className="text-2xl font-bold text-white">
                  Team Members ({minMembers}-{maxMembers} members total)
                </h3>
              </div>

              <div className="space-y-6">
                {teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className="bg-red-950/20 border border-red-900/30 rounded-xl p-6 relative"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-semibold text-red-400">Member {index + 1}</h5>
                      {teamMembers.length > minAdditionalMembers && (
                        <button
                          type="button"
                          onClick={() => removeTeamMember(index)}
                          className="text-red-500 hover:text-red-400 transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-2 text-gray-400">
                          Name <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                          required
                          className="w-full bg-black/50 border border-red-900/30 rounded-lg p-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition-all text-sm"
                          placeholder="Member name"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-2 text-gray-400">
                          Email <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="email"
                          value={member.email}
                          onChange={(e) => handleTeamMemberChange(index, 'email', e.target.value)}
                          required
                          className="w-full bg-black/50 border border-red-900/30 rounded-lg p-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition-all text-sm"
                          placeholder="member@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-2 text-gray-400">
                          Phone <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="tel"
                          value={member.phone}
                          onChange={(e) => handleTeamMemberChange(index, 'phone', e.target.value)}
                          required
                          pattern="[0-9]{10}"
                          className="w-full bg-black/50 border border-red-900/30 rounded-lg p-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition-all text-sm"
                          placeholder="9876543210"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {teamMembers.length < maxAdditionalMembers && (
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={addTeamMember}
                    className="w-full py-3 border-2 border-dashed border-red-900/30 hover:border-red-600/50 bg-red-950/10 hover:bg-red-950/20 text-red-400 hover:text-red-300 rounded-xl transition-all flex items-center justify-center gap-2 font-semibold"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Another Member
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-8 pt-6 border-t border-red-900/50">
            {(eventData.registration_fee ?? 0) > 0 ? (
              <div className="space-y-4">
                <div className="bg-red-900/20 border border-red-900/30 rounded-xl p-4">
                  <h4 className="text-white font-semibold mb-2">Step 1: Make Payment</h4>
                  <p className="text-gray-400 text-sm mb-4">
                    Click the button below to pay the registration fee of ₹{eventData.registration_fee}.
                    After payment, note down the Transaction ID / UTR Number.
                  </p>
                  <button
                    type="button"
                    onClick={() => window.open(PAYMENT_FORM_LINK, '_blank')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-all"
                  >
                    Pay ₹{eventData.registration_fee}
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
                    disabled={submitting || !!teamNameError || !transactionId}
                    className="w-full bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-red-600/50 hover:shadow-red-600/70 disabled:opacity-50 disabled:cursor-not-allowed"
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
            ) : (
              <button
                type="submit"
                disabled={submitting || !!teamNameError}
                className="w-full bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-red-600/50 hover:shadow-red-600/70 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    Registering...
                  </span>
                ) : (
                  'Complete Registration'
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </PageSection>
  );
}
