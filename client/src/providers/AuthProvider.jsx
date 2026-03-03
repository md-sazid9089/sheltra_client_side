import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { storage } from '@/lib/storage';

const AuthContext = createContext(null);

// ── Demo accounts (work without a backend) ──
const DEMO_ACCOUNTS = {
  'refugee@sheltra.dev':  { id: 1, name: 'Amara Mensah',   email: 'refugee@sheltra.dev',  role: 'refugee'  },
  'ngo@sheltra.dev':      { id: 2, name: 'Sarah Kim',      email: 'ngo@sheltra.dev',      role: 'ngo'      },
  'employer@sheltra.dev': { id: 3, name: 'TechBridge HR',   email: 'employer@sheltra.dev', role: 'employer' },
  'admin@sheltra.dev':    { id: 4, name: 'Admin User',     email: 'admin@sheltra.dev',    role: 'admin'    },
};
const DEMO_PASSWORD = 'demo1234';
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
    // Demo login (no backend needed)
    const demo = DEMO_ACCOUNTS[credentials.email];
    if (demo && credentials.password === DEMO_PASSWORD) {
      const token = DEMO_TOKEN_PREFIX + demo.email;
      storage.setToken(token);
      setUser(demo);
      return { token, user: demo, role: demo.role };
    }
    // Real backend login
    const { data } = await api.post('/auth/login', credentials);
    storage.setToken(data.token);
    await fetchUser();
    return data;
  };

  const register = async (payload) => {
    // Demo registration shortcut
    const demo = DEMO_ACCOUNTS[payload.email];
    if (demo && payload.password === DEMO_PASSWORD) {
      const token = DEMO_TOKEN_PREFIX + demo.email;
      storage.setToken(token);
      setUser(demo);
      return { token, user: demo, role: demo.role };
    }
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
