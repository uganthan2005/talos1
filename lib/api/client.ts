
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import type {
  Event,
  EventRegistration,
  EventRegistrationRequest,
  Workshop,
  WorkshopRegistration,
  WorkshopRegistrationRequest,
  CreateOrderResponse,
  PaymentVerificationRequest,
  User,
  UserUpdate,
} from "./types";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

// Validate API URL at module load
if (!API_BASE_URL && typeof window !== 'undefined') {
  console.error('[API] CRITICAL: NEXT_PUBLIC_API_URL is not configured! API requests will fail.');
}

class ApiClient {
  private async getAuthToken(): Promise<string | null> {
    if (!auth) {
      console.warn('[API] Auth not initialized');
      return null;
    }
    
    // If currentUser is available, get the token
    if (auth.currentUser) {
      console.log('[API] Getting token from currentUser:', auth.currentUser.email);
      try {
        const token = await auth.currentUser.getIdToken(true);
        console.log('[API] Token retrieved successfully, length:', token.length);
        return token;
      } catch (e) {
        console.error('[API] Failed to get token from currentUser:', e);
        return null;
      }
    }
    
    console.log('[API] No currentUser, waiting for auth state...');
    
    // Wait for auth state to be ready (max 5 seconds)
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        console.warn('[API] Auth state timeout - no user found after 5s');
        resolve(null);
      }, 5000);
      
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        clearTimeout(timeout);
        unsubscribe();
        if (user) {
          console.log('[API] Auth state resolved, user:', user.email);
          try {
            const token = await user.getIdToken(true);
            console.log('[API] Token retrieved from auth state, length:', token.length);
            resolve(token);
          } catch (e) {
            console.error('[API] Failed to get token from auth state:', e);
            resolve(null);
          }
        } else {
          console.warn('[API] Auth state resolved but no user');
          resolve(null);
        }
      });
    });
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount: number = 0
  ): Promise<T> {
    const MAX_RETRIES = 3;
    const RETRY_DELAYS = [2000, 4000, 8000]; // Exponential backoff: 2s, 4s, 8s
    
    const token = await this.getAuthToken();
    
    console.log(`[API] Request to ${endpoint}, token present: ${!!token}, token length: ${token?.length || 0}${retryCount > 0 ? `, retry #${retryCount}` : ''}`);

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    } else {
      console.warn(`[API] No token available for protected endpoint: ${endpoint}`);
    }

    // Validate API URL before making request
    if (!API_BASE_URL) {
      console.error('[API] NEXT_PUBLIC_API_URL is not configured');
      throw new Error("Server configuration error. Please contact support.");
    }

    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "An error occurred" }));
        let errorMessage = errorData.detail || `HTTP error! status: ${response.status}`;
        
        // Handle case where detail is an object or array (e.g. FastAPI validation errors)
        if (typeof errorMessage === 'object') {
          errorMessage = JSON.stringify(errorMessage);
        }
        
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      // Handle network errors (cold start, timeout, etc.) with automatic retry
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        if (retryCount < MAX_RETRIES) {
          const delay = RETRY_DELAYS[retryCount];
          console.log(`[API] Connection failed, retrying in ${delay/1000}s... (attempt ${retryCount + 1}/${MAX_RETRIES})`);
          
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.request<T>(endpoint, options, retryCount + 1);
        }
        
        // All retries exhausted
        console.error(`[API] All ${MAX_RETRIES} retry attempts failed for ${endpoint}`);
        throw new Error("Unable to connect to the server. Please check your internet connection or try again later.");
      }
      throw error;
    }
  }

  // ============== Events ==============

  async getEvents(status?: string): Promise<Event[]> {
    const params = status ? `?status=${status}` : "";
    try {
      return await this.request<Event[]>(`/api/events${params}`);
    } catch (error) {
      console.warn("Failed to fetch events, using empty list", error);
      return [];
    }
  }

  async getEvent(eventId: string): Promise<Event> {
    return this.request<Event>(`/api/events/${eventId}`);
  }

  async registerForEvent(
    eventId: string,
    registration: EventRegistrationRequest
  ): Promise<{ message: string; registration_id: string; team_name: string }> {
    return this.request(`/api/events/${eventId}/register`, {
      method: "POST",
      body: JSON.stringify(registration),
    });
  }

  async checkTeamName(
    eventId: string,
    teamName: string
  ): Promise<{ available: boolean }> {
    return this.request(`/api/events/${eventId}/check-team-name?team_name=${encodeURIComponent(teamName)}`);
  }

  async checkEventRegistration(eventId: string): Promise<{ registered: boolean }> {
    return this.request(`/api/events/${eventId}/check-registration`);
  }

  // ============== Workshops ==============

  async getWorkshops(status?: string): Promise<Workshop[]> {
    const params = status ? `?status=${status}` : "";
    try {
      return await this.request<Workshop[]>(`/api/workshops${params}`);
    } catch (error) {
      console.warn("Failed to fetch workshops, using empty list", error);
      return [];
    }
  }

  async getWorkshop(workshopId: string): Promise<Workshop> {
    return this.request<Workshop>(`/api/workshops/${workshopId}`);
  }

  async createWorkshopPaymentLink(
    workshopId: string,
    registration: WorkshopRegistrationRequest
  ): Promise<{ payment_link_id: string; short_url: string; amount: number; reference_id: string }> {
    return this.request(
      `/api/workshops/${workshopId}/create-payment-link`,
      {
        method: "POST",
        body: JSON.stringify(registration),
      }
    );
  }


  async checkWorkshopEmail(
    workshopId: string,
    email: string
  ): Promise<{ registered: boolean }> {
    return this.request(`/api/workshops/${workshopId}/check-email?email=${encodeURIComponent(email)}`);
  }

  async checkWorkshopRegistration(workshopId: string): Promise<{ registered: boolean }> {
    return this.request(`/api/workshops/${workshopId}/check-registration`);
  }

  async registerWorkshop(
    workshopId: string,
    registration: WorkshopRegistrationRequest
  ): Promise<{ message: string; registration_id: string }> {
    return this.request(`/api/workshops/${workshopId}/register`, {
      method: "POST",
      body: JSON.stringify(registration),
    });
  }

  // ============== User ==============

  async getUserProfile(): Promise<User> {
    return this.request<User>("/api/user/profile");
  }

  async updateUserProfile(update: UserUpdate): Promise<User> {
    return this.request<User>("/api/user/profile", {
      method: "PUT",
      body: JSON.stringify(update),
    });
  }

  async getUserEvents(): Promise<EventRegistration[]> {
    return this.request<EventRegistration[]>("/api/user/events");
  }

  async getUserWorkshops(): Promise<WorkshopRegistration[]> {
    return this.request<WorkshopRegistration[]>("/api/user/workshops");
  }
}

// Export singleton instance
export const api = new ApiClient();

// Export types for convenience
export * from "./types";

