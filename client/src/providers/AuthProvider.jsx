import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { storage } from '@/lib/storage';

const AuthContext = createContext(null);

// ── Test accounts (match database seeders) ──
const DEMO_ACCOUNTS = {
  'refugee@sheltra.test':  { id: 1, name: 'Ahmed Hassan',      email: 'refugee@sheltra.test',  role: 'refugee'  },
  'ngo@sheltra.test':      { id: 2, name: 'NGO Coordinator',   email: 'ngo@sheltra.test',      role: 'ngo'      },
  'employer@sheltra.test': { id: 3, name: 'Employer Manager',  email: 'employer@sheltra.test', role: 'employer' },
  'admin@sheltra.test':    { id: 4, name: 'Admin User',        email: 'admin@sheltra.test',    role: 'admin'    },
};
const DEMO_PASSWORD = 'password123';
const DEMO_TOKEN_PREFIX = 'demo_token_';

function isDemoToken(token) {
  return token?.startsWith(DEMO_TOKEN_PREFIX);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = storage.getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    // Handle demo tokens locally
    if (isDemoToken(token)) {
      const email = token.replace(DEMO_TOKEN_PREFIX, '');
      const demo = DEMO_ACCOUNTS[email];
      setUser(demo || null);
      if (!demo) storage.removeToken();
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.user || data);
    } catch {
      storage.removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (credentials) => {
    // Try real backend login first
    const { data } = await api.post('/auth/login', credentials);
    storage.setToken(data.token);
    await fetchUser();
    return data;
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    storage.setToken(data.token);
    await fetchUser();
    return data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // silent
    }
    storage.removeToken();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    role: user?.role || null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
