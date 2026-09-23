import { useState } from 'react';
import { ROLES, MOCK_USERS, authenticateUser, hasPermission } from '../data/mockAuth';
import { authService } from '../services/authService';
import { AuthContext } from './useAuth';

const STORAGE_KEY = 'estateflow_crm_user';

function getInitialUser() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // ignore parse error
  }
  return null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getInitialUser);

  const login = async (email, password) => {
    try {
      // 1. Try real API first
      const data = await authService.login(email, password);
      setUser(data.user);
      return data.user;
    } catch {
      // 2. Fallback to mockAuth
      const authenticatedUser = await authenticateUser(email, password);
      setUser(authenticatedUser);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(authenticatedUser));
      } catch {
        // ignore
      }
      return authenticatedUser;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // ignore
    } finally {
      setUser(null);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('estateflow_crm_token');
    }
  };

  const switchRole = async (targetRole) => {
    const targetEmail = targetRole === ROLES.ADMIN ? 'admin@estatecrm.com' : 'agent@estatecrm.com';
    const targetPassword = targetRole === ROLES.ADMIN ? 'admin123' : 'agent123';

    try {
      await login(targetEmail, targetPassword);
    } catch {
      const targetUser = MOCK_USERS.find((u) => u.role === targetRole);
      if (targetUser) {
        const { password: _p, ...safeUser } = targetUser;
        setUser(safeUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));
      }
    }
  };

  const can = (permission) => hasPermission(user, permission);

  const value = {
    user,
    role: user?.role || null,
    isAdmin: user?.role === ROLES.ADMIN,
    isAuthenticated: Boolean(user),
    login,
    logout,
    switchRole,
    can,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
