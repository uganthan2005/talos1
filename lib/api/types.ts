// API Types matching backend models

export interface Event {
  event_id: string;
  title: string;
  description: string;
  main_description?: string;
  rules?: string;
  category: string;
  date: string;
  time: string;
  venue?: string;
  image_url: string;
  max_participants: number | null;
  min_team_size: number;
  max_team_size: number;
  is_team_event?: boolean;
  registration_fee?: number;
  status: "open" | "closed" | "cancelled";
  created_at: string;
  caption?: string;
  oneLiner?: string | null;
  hashtags?: string[];
  organiser?: {
    name: string;
    contact: string[];
  };
}

// Team Member for event registration (1-3 members)
export interface TeamMember {
  name: string;
  email: string;
  phone: string;
}

// Event Registration Request - Team based
export interface EventRegistrationRequest {
  team_name: string;
  leader_name: string;
  leader_email: string;
  leader_phone: string;
  leader_year: string;
  college_name: string;
  referral_id?: string;
  transaction_id?: string;
  members: TeamMember[];
}

// Event Registration stored in Firestore
export interface EventRegistration {
  registration_id: string;
  event_id: string;
  event_name: string;
  team_name: string;
  leader_name: string;
  leader_email: string;
  leader_phone: string;
  leader_year: string;
  college_name: string;
  referral_id?: string;
  members: TeamMember[];
  status: string;
  registered_at: string;
  // Extra fields from user endpoint
  event_date?: string;
  event_venue?: string;
}

export interface Workshop {
  workshop_id: string;
  title: string;
  description: string;
  main_description?: string;
  rules?: string | null;
  instructor: string;
  date: string;
  time: string;
  duration: string;
  venue?: string;
  image_url: string;
  max_participants: number | null;
  registration_fee: number;
  status: "open" | "closed" | "cancelled";
  created_at: string;
  organisers?: Array<{
    name: string;
    phone: string;
    role?: string;
  }>;
}

export interface PaymentVerificationRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  // Registration data to store after payment
  name: string;
  email: string;
  phone: string;
  year: string;
  college_name: string;
  referral_id?: string;
}

// Workshop Registration Request - Solo with payment
export interface WorkshopRegistrationRequest {
  name: string;
  email: string;
  phone: string;
  year: string;
  college_name: string;
  transaction_id: string; // Required transaction ID
  referral_id?: string;
}

// Workshop Registration stored in Firestore
export interface WorkshopRegistration {
  registration_id: string;
  workshop_id: string;
  workshop_name: string;
  name: string;
  email: string;
  phone: string;
  year: string;
  college_name: string;
  referral_id?: string;
  payment_id: string;
  order_id: string;
  amount: number;
  payment_status: string;
  status: string;
  registered_at: string;
  payment_completed_at?: string;
  // Extra fields from user endpoint
  workshop_date?: string;
  workshop_venue?: string;
  instructor?: string;
}

export interface CreateOrderResponse {
  order_id: string;
  amount: number;
  currency: string;
  key_id: string;
}

export interface User {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  college?: string;
  profile_photo?: string;
  created_at: string;
  last_login: string;
}

export interface UserUpdate {
  name?: string;
  phone?: string;
  college?: string;
}

export interface ApiError {
  detail: string;
}
