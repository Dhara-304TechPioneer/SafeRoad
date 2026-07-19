// Temporary client-side authentication state for protected-route UI behavior.
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import type { AuthUser } from '../types/auth';

interface AuthContextValue {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  signIn: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  const value = useMemo<AuthContextValue>(() => ({
    currentUser,
    isAuthenticated: currentUser !== null,
    signIn: setCurrentUser,
    logout: () => setCurrentUser(null),
  }), [currentUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
