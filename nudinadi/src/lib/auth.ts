// ── Auth System (Supabase) ──────────────────────────────────
// Real auth with Supabase - same useAuth() interface as before

'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import React from 'react';
import { getSupabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';
import type { Profile } from '@/lib/database.types';

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  bio?: string | null;
  location?: string;
  level: number;
  xp: number;
  isAdmin: boolean;
  createdAt?: string;
  totalSales?: number;
  totalPurchases?: number;
}

export type RegisterResult = 'success' | 'needs_confirmation' | 'error';

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  lastError: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, username: string) => Promise<RegisterResult>;
  loginWithOAuth: (provider: 'google' | 'facebook') => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

// Convert Supabase user + profile to our AuthUser format
function toAuthUser(user: User, profile?: Profile | null): AuthUser {
  return {
    id: user.id,
    email: user.email || '',
    username: profile?.username || user.user_metadata?.username || user.email?.split('@')[0] || '',
    fullName: profile?.full_name || user.user_metadata?.full_name || '',
    avatarUrl: profile?.avatar_url || user.user_metadata?.avatar_url || '',
    bio: profile?.bio ?? null,
    location: profile?.location || undefined,
    level: profile?.level || 1,
    xp: profile?.xp || 0,
    isAdmin: profile?.is_admin || false,
    createdAt: profile?.created_at || user.created_at,
    totalSales: profile?.total_sales || 0,
    totalPurchases: profile?.total_purchases || 0,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastError, setLastError] = useState<string | null>(null);

  const supabase = getSupabase();

  // Fetch profile data for a user
  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    return data as Profile | null;
  }, [supabase]);

  // Set user from Supabase session — resilient: always resolves even on profile fetch error
  const setUserFromSession = useCallback(async (session: Session | null) => {
    if (!session?.user) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    // Signal loading while session is being processed — prevents false "not authenticated" redirects
    setIsLoading(true);
    try {
      // Timeout after 8s — prevents hanging if DB is slow or RLS blocks the query
      const profile = await Promise.race([
        fetchProfile(session.user.id),
        new Promise<null>(resolve => setTimeout(() => resolve(null), 8000)),
      ]);
      setUser(toAuthUser(session.user, profile));
    } catch {
      // Profile fetch failed — still set user with basic session data
      setUser(toAuthUser(session.user, null));
    } finally {
      setIsLoading(false);
    }
  }, [fetchProfile]);

  // Initialize: check current session + listen for subsequent auth changes
  useEffect(() => {
    // Primary init: explicit session check (reliable across localStorage and cookie storage)
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      await setUserFromSession(session);
    });

    // Listen for auth state changes (SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED, USER_UPDATED)
    // Skip INITIAL_SESSION — handled by getSession() above to avoid race condition
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'INITIAL_SESSION') return;
        await setUserFromSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase, setUserFromSession]);

  // ─── Login with Email/Password ────────────────────────

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setLastError(null);
    // Timeout after 15s — prevents hanging if Supabase auth API is unreachable
    const { data, error } = await Promise.race([
      supabase.auth.signInWithPassword({ email, password }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Veza je istekla. Provjerite internet vezu i pokušajte ponovo.')), 15000)
      ),
    ]);

    if (error) {
      setLastError(error.message);
      return false;
    }

    if (data.session) {
      await setUserFromSession(data.session);
      return true;
    }

    return false;
  }, [supabase, setUserFromSession]);

  // ─── Register ─────────────────────────────────────────

  const register = useCallback(async (email: string, password: string, username: string): Promise<RegisterResult> => {
  setLastError(null);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        full_name: '',
      },
    },
  });

  if (error) {
    setLastError(error.message);
    return 'error';
  }

  // ✅ Fall 1: Session direkt bekommen (E-Mail-Bestätigung deaktiviert)
  if (data.session) {
    await setUserFromSession(data.session);
    return 'success';
  }

  // ✅ Fall 2: User existiert aber keine Session → manuell einloggen
  // Das passiert bei Supabase manchmal auch wenn Bestätigung deaktiviert ist
  if (data.user) {
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!loginError && loginData.session) {
      await setUserFromSession(loginData.session);
      return 'success';
    }

    // Login hat nicht funktioniert → E-Mail Bestätigung nötig
    if (loginError?.message?.includes('Email not confirmed')) {
      return 'needs_confirmation';
    }

    setLastError(loginError?.message || 'Prijava nije uspjela');
    return 'error';
  }

  return 'needs_confirmation';
}, [supabase, setUserFromSession]);

  // ─── OAuth Login (Google, Facebook) ───────────────────

  const loginWithOAuth = useCallback(async (provider: 'google' | 'facebook') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.error('OAuth error:', error.message);
    }
  }, [supabase]);

  // ─── Logout ───────────────────────────────────────────

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, [supabase]);

  // ─── Password Reset ──────────────────────────────────

  const resetPassword = useCallback(async (email: string): Promise<boolean> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      console.error('Reset password error:', error.message);
      return false;
    }

    return true;
  }, [supabase]);

  // ─── Refresh Profile (re-fetch from DB) ────────────

  const refreshProfile = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;
    try {
      const profile = await Promise.race([
        fetchProfile(session.user.id),
        new Promise<null>(resolve => setTimeout(() => resolve(null), 6000)),
      ]);
      if (profile) {
        setUser(toAuthUser(session.user, profile));
      }
    } catch {
      // silent — keep existing user data
    }
  }, [supabase, fetchProfile]);

  return React.createElement(AuthContext.Provider, {
    value: {
      user,
      isLoading,
      isAuthenticated: !!user,
      lastError,
      login,
      register,
      loginWithOAuth,
      logout,
      resetPassword,
      refreshProfile,
    }
  }, children);
}

export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
