'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  displayName: string;
  role: 'user' | 'admin';
  bio?: string;
  avatarUrl?: string;
  preferences?: { defaultView: 'grid' | 'table'; emailNotifications: boolean };
  createdAt?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<{ ok: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => Promise<{ ok: boolean; error?: string }>;
  changePassword: (current: string, next: string) => Promise<{ ok: boolean; error?: string }>;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  displayName?: string;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  const refresh = React.useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { cache: 'no-store' });
      const data = await res.json();
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { ok: false, error: data.error || 'Błąd logowania' };
      await refresh();
      router.refresh();
      return { ok: true };
    } catch (err: any) {
      return { ok: false, error: err?.message || 'Błąd sieci' };
    }
  };

  const register = async (regData: RegisterData) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regData),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = data.issues?.fieldErrors
          ? Object.values(data.issues.fieldErrors).flat().join(', ')
          : data.error || 'Błąd rejestracji';
        return { ok: false, error: msg };
      }
      await refresh();
      router.refresh();
      return { ok: true };
    } catch (err: any) {
      return { ok: false, error: err?.message || 'Błąd sieci' };
    }
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
    router.refresh();
  };

  const updateProfile = async (data: Partial<AuthUser>) => {
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const d = await res.json();
      if (!res.ok) return { ok: false, error: d.error || 'Błąd' };
      await refresh();
      return { ok: true };
    } catch (err: any) {
      return { ok: false, error: err?.message || 'Błąd sieci' };
    }
  };

  const changePassword = async (current: string, next: string) => {
    try {
      const res = await fetch('/api/auth/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const d = await res.json();
      if (!res.ok) return { ok: false, error: d.error || 'Błąd' };
      return { ok: true };
    } catch (err: any) {
      return { ok: false, error: err?.message || 'Błąd sieci' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh, updateProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
