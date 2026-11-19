import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { User } from '../types';
import { apiRequest } from '../lib/api';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (payload: {
    name: string;
    email: string;
    photoUrl: string;
    password: string;
  }) => Promise<void>;
  loginWithGoogle: (account: { name: string; email: string; photoUrl?: string }) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const data = await apiRequest<{ user: User | null }>('/api/auth/me');
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string): Promise<User> => {
    const data = await apiRequest<{ user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setUser(data.user);
    return data.user;
  };

  const register = async (payload: {
    name: string;
    email: string;
    photoUrl: string;
    password: string;
  }): Promise<void> => {
    await apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  };

  const loginWithGoogle = async (account: {
    name: string;
    email: string;
    photoUrl?: string;
  }): Promise<User> => {
    const data = await apiRequest<{ user: User }>('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify(account),
    });
    setUser(data.user);
    return data.user;
  };

  const logout = async (): Promise<void> => {
    await apiRequest('/api/auth/logout', { method: 'POST' });
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, loginWithGoogle, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
