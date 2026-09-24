import { useState } from 'react';
import { ROLES, hasPermission } from '../data/mockAuth';
import { authService } from '../services/authService';
import { AuthContext } from './useAuth';

const STORAGE_KEY = 'estateflow_crm_user';

function getInitialUser() {
  try {
    const token = localStorage.getItem('estateflow_crm_token');
    const saved = localStorage.getItem(STORAGE_KEY);
    if (token && saved) {
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
    // Use real API login and preserve JWT token
    const data = await authService.login(email, password);
    setUser(data.user);
    return data.user;
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

    await login(targetEmail, targetPassword);
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
