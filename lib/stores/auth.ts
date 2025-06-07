import { create } from 'zustand';
import { AuthState, User, UserProfile, LoginFormData, RegisterFormData } from '../types/auth';
import { supabase } from '../supabase/client';
import { ApiResponse } from '../types/common';

interface AuthActions {
  initialize: () => Promise<void>;
  login: (data: LoginFormData) => Promise<ApiResponse>;
  register: (data: RegisterFormData) => Promise<ApiResponse>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<ApiResponse>;
  updatePassword: (password: string) => Promise<ApiResponse>;
  refreshSession: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  loadProfile: () => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<ApiResponse>;
  verifyEmail: (token: string, type: string) => Promise<ApiResponse>;
  handleEmailVerificationCallback: (url: string) => Promise<ApiResponse>;
}

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,

  initialize: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        set({ isLoading: false, error: error.message });
        return;
      }

      if (session?.user) {
        set({ 
          user: session.user as User, 
          isAuthenticated: true,
          isLoading: false 
        });
        await get().loadProfile();
      } else {
        set({ 
          user: null, 
          profile: null, 
          isAuthenticated: false, 
          isLoading: false 
        });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to initialize auth' 
      });
    }
  },

  login: async (data: LoginFormData) => {
    try {
      set({ isLoading: true, error: null });

      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        set({ isLoading: false, error: error.message });
        return { success: false, error: error.message };
      }

      if (authData.user) {
        set({ 
          user: authData.user as User, 
          isAuthenticated: true, 
          isLoading: false 
        });
        await get().loadProfile();
        return { success: true, data: authData.user };
      }

      set({ isLoading: false });
      return { success: false, error: 'Login failed' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  register: async (data: RegisterFormData) => {
    try {
      set({ isLoading: true, error: null });

      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
          },
        },
      });

      if (error) {
        set({ isLoading: false, error: error.message });
        return { success: false, error: error.message };
      }

      if (authData.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: authData.user.id,
            first_name: data.firstName,
            last_name: data.lastName,
            display_name: data.firstName ? `${data.firstName} ${data.lastName || ''}`.trim() : null,
          });

        if (profileError) {
          console.warn('Profile creation error:', profileError);
        }

        set({ 
          user: authData.user as User, 
          isAuthenticated: true, 
          isLoading: false 
        });
        
        return { 
          success: true, 
          data: authData.user,
          message: 'Please check your email to verify your account'
        };
      }

      set({ isLoading: false });
      return { success: false, error: 'Registration failed' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true });
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
      }
      
      set({ 
        user: null, 
        profile: null, 
        isAuthenticated: false, 
        isLoading: false, 
        error: null 
      });
    } catch (error) {
      console.error('Logout error:', error);
      set({ 
        user: null, 
        profile: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
    }
  },

  resetPassword: async (email: string) => {
    try {
      set({ error: null });

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://your-app.com/reset-password',
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { 
        success: true, 
        message: 'Password reset email sent. Please check your inbox.' 
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send reset email';
      return { success: false, error: errorMessage };
    }
  },

  updatePassword: async (password: string) => {
    try {
      set({ isLoading: true, error: null });

      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        set({ isLoading: false, error: error.message });
        return { success: false, error: error.message };
      }

      set({ isLoading: false });
      return { success: true, message: 'Password updated successfully' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update password';
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  refreshSession: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Session refresh error:', error);
        return;
      }

      if (session?.user) {
        set({ user: session.user as User, isAuthenticated: true });
      }
    } catch (error) {
      console.error('Session refresh error:', error);
    }
  },

  loadProfile: async () => {
    try {
      const { user } = get();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Profile load error:', error);
        return;
      }

      if (data) {
        set({ profile: data as UserProfile });
      }
    } catch (error) {
      console.error('Profile load error:', error);
    }
  },

  clearError: () => set({ error: null }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),

  resendVerificationEmail: async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { 
        success: true, 
        message: 'Verification email sent successfully' 
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to resend verification email';
      return { success: false, error: errorMessage };
    }
  },

  verifyEmail: async (token: string, type: string) => {
    try {
      set({ isLoading: true, error: null });

      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: type as any,
      });

      if (error) {
        set({ isLoading: false, error: error.message });
        return { success: false, error: error.message };
      }

      if (data.user) {
        set({ 
          user: data.user as User, 
          isAuthenticated: true, 
          isLoading: false 
        });
        await get().loadProfile();
        return { success: true, message: 'Email verified successfully' };
      }

      set({ isLoading: false });
      return { success: false, error: 'Email verification failed' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Email verification failed';
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  handleEmailVerificationCallback: async (url: string) => {
    try {
      set({ isLoading: true, error: null });

      // Parse URL to extract token and type
      const urlParams = new URL(url);
      const token = urlParams.searchParams.get('token');
      const type = urlParams.searchParams.get('type');

      if (!token || !type) {
        set({ isLoading: false, error: 'Invalid verification link' });
        return { success: false, error: 'Invalid verification link' };
      }

      // Handle the email verification
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: type as any,
      });

      if (error) {
        set({ isLoading: false, error: error.message });
        return { success: false, error: error.message };
      }

      if (data.user) {
        set({ 
          user: data.user as User, 
          isAuthenticated: true, 
          isLoading: false 
        });
        await get().loadProfile();
        return { 
          success: true, 
          message: 'Email verified successfully! Welcome to JOLTCLICK.' 
        };
      }

      set({ isLoading: false });
      return { success: false, error: 'Email verification failed' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Email verification failed';
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },
}));

// Set up auth state listener
supabase.auth.onAuthStateChange((event, session) => {
  const { initialize } = useAuthStore.getState();
  
  if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
    initialize();
  }
});