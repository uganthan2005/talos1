# TALOS Registration System - Setup Guide

## Overview
This system allows users to:
1. Login with Google OAuth
2. View their profile and registrations in the dashboard
3. Register for events (solo or team)
4. Track payment status
5. Each event stores registrations in its own Firebase collection

## Firebase Setup

### 1. Create Events Collection

In your Firebase Console, create a collection called `events`. Each document should have the following structure:

```javascript
{
  slug: "cyber-security-hunt",           // Used in URL: /register/cyber-security-hunt
  title: "Cyber Security Hunt",
  category: "technical",                  // technical | cultural | sports | workshop
  
  // Team configuration
  isGroup: true,                         // Allow team registration
  minTeamSize: 2,                        // Minimum team members (including leader)
  maxTeamSize: 4,                        // Maximum team members
  
  // Registration
  isPaid: true,                          // Is this a paid event?
  fee: 500,                              // Registration fee in INR
  maxParticipants: 100,                  // Maximum registrations
  
  // Details
  description: "Capture the flag and secure the network...",
  rules: [
    "Participants must bring their own laptops",
    "Use of automated tools is strictly prohibited",
    "Decision of the judges is final"
  ],
  eligibility: [
    "Open to all college students",
    "Team members must be from same institution"
  ],
  
  // Logistics
  venue: "Main Auditorium",
  date: "2026-02-14",
  duration: "3 hours",
  
  // Contact
  coordinators: [
    {
      name: "John Doe",
      phone: "9876543210",
      email: "john@example.com"
    }
  ],
  
  // Meta
  isActive: true,
  registrationOpen: true
}
```

### 2. Event Registration Collections

For each event with slug `event-slug`, the system automatically creates a collection named `event-slug_registrations`.

Example: Event with slug "cyber-security-hunt" will store registrations in `cyber-security-hunt_registrations`.

### Registration Document Structure

```javascript
{
  // User Information
  userId: "firebase-user-uid",
  userEmail: "user@example.com",
  userName: "John Doe",
  department: "Computer Science",
  year: "2nd Year",
  phone: "9876543210",
  collegeName: "ABC College of Engineering",
  collegeAddress: "123 Main St, City, State - 123456",
  refId: "REF123",                       // Optional reference ID
  
  // Team Information (if team registration)
  isTeamRegistration: true,
  teamName: "The Avengers",
  teamMembers: [
    {
      name: "Tony Stark",
      email: "tony@example.com",
      phone: "9876543211"
    },
    {
      name: "Steve Rogers",
      email: "steve@example.com",
      phone: "9876543212"
    }
  ],
  
  // Event Details
  eventSlug: "cyber-security-hunt",
  eventName: "Cyber Security Hunt",
  
  // Payment
  paymentStatus: "pending",              // pending | completed | not_required
  paymentAmount: 500,
  paymentId: null,                       // Set when payment is completed
  
  // Metadata
  registrationDate: Timestamp,
  createdAt: Timestamp,
  status: "confirmed"
}
```

## How to Add Sample Events

### Option 1: Using Firebase Console

1. Go to Firebase Console
2. Select your project
3. Go to Firestore Database
4. Click "Start collection"
5. Collection ID: `events`
6. Add documents with the structure shown above

### Option 2: Using Firebase Admin SDK (Programmatically)

Create a script to add events:

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const sampleEvents = [
  {
    slug: 'cyber-security-hunt',
    title: 'Cyber Security Hunt',
    category: 'technical',
    isGroup: true,
    minTeamSize: 2,
    maxTeamSize: 4,
    isPaid: true,
    fee: 500,
    maxParticipants: 100,
    description: 'Test your hacking skills in this intense CTF competition',
    rules: [
      'Bring your own laptop',
      'No automated tools',
      'Judges decision is final'
    ],
    eligibility: ['Open to all college students'],
    venue: 'Computer Lab',
    date: '2026-02-14',
    duration: '3 hours',
    coordinators: [
      {
        name: 'Coordinator Name',
        phone: '9876543210',
        email: 'coordinator@example.com'
      }
    ],
    isActive: true,
    registrationOpen: true
  },
  // Add more events...
];

async function addEvents() {
  for (const event of sampleEvents) {
    await db.collection('events').doc(event.slug).set(event);
    console.log(`Added event: ${event.title}`);
  }
}

addEvents();
```

## User Flow

### 1. Login
- User clicks "Sign in with Google" on `/login`
- After successful authentication, redirected to `/dashboard`
- User profile (image, name) from Google is displayed

### 2. Dashboard
- Shows user profile with Google photo and name
- Lists all events the user has registered for
- Shows payment status for each registration
- Can browse more events or view event details

### 3. Event Registration
- User goes to `/events` and selects an event
- Clicks "Register Now" to go to `/register/[event-slug]`
- Fills registration form with:
  - Personal details (Name, Dept, Year, Email, Phone, College details, Ref ID)
  - Team details (if team event): Team name and up to 3 members
- Submits form
- Registration is stored in `{event-slug}_registrations` collection
- Redirected to dashboard

### 4. Payment Flow (if paid event)
- Registration is created with `paymentStatus: 'pending'`
- Dashboard shows "Payment Pending" badge
- User can click "Complete Payment" button
- After payment gateway integration, update `paymentStatus: 'completed'`

## Firebase Security Rules

Add these rules to secure your Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Events collection (read-only for users)
    match /events/{eventId} {
      allow read: if true;
      allow write: if false; // Only admins can modify events
    }
    
    // Registration collections
    match /{eventSlug}_registrations/{registrationId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && 
                     (request.auth.token.email == resource.data.userEmail ||
                      request.auth.token.admin == true);
      allow update: if request.auth != null &&
                       (request.auth.token.email == resource.data.userEmail ||
                        request.auth.token.admin == true);
      allow delete: if request.auth.token.admin == true;
    }
  }
}
```

## Environment Variables

Make sure your `.env.local` file has:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Features Implemented

✅ Google OAuth Login
✅ User Dashboard with profile (image + name from Google)
✅ Display registered events with payment status
✅ Dynamic registration page per event
✅ Form fields: Name, Dept, Year, Email, Phone, College Name, College Address, Ref ID
✅ Team registration with up to 3 members (name, email, phone each)
✅ Red theme UI throughout
✅ Event-specific Firebase collections (`{eventSlug}_registrations`)
✅ Payment status tracking (pending/completed/not_required)
✅ Authentication protection on all pages

## Next Steps

1. **Add Sample Events**: Create events in Firebase using the structure above
2. **Payment Integration**: Integrate Razorpay/Stripe for payment processing
3. **Email Notifications**: Send confirmation emails after registration
4. **Admin Dashboard**: Create admin panel to view all registrations
5. **Certificate Generation**: Auto-generate participation certificates
6. **QR Code**: Generate QR codes for event check-in

## Troubleshooting

### Users collection not found
- First user login will auto-create the users collection

### Events not showing
- Make sure events collection exists in Firebase
- Check that events have `isActive: true` and `registrationOpen: true`

### Registration fails
- Check Firebase rules
- Verify environment variables
- Check browser console for errors

## Support

For issues or questions, check:
1. Firebase Console for data structure
2. Browser console for errors
3. Network tab for failed requests
