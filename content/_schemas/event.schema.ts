
export interface EventSchema {
  slug: string;
  title: string;
  category: 'technical' | 'cultural' | 'sports' | 'workshop';
  
  // Team configuration
  isGroup: boolean;
  minTeamSize: number;
  maxTeamSize: number;
  
  // Registration
  isPaid: boolean;
  fee: number;
  maxParticipants: number;
  
  // Details
  description: string;
  rules: string[];
  eligibility: string[];
  
  // Logistics
  venue: string;
  date: string;
  duration: string;
  
  // Contact
  coordinators: {
    name: string;
    phone: string;
    email: string;
  }[];
  
  // Meta
  isActive: boolean;
  registrationOpen: boolean;
}
