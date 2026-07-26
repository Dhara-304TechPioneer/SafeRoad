// Authentication state provider with backend integration and session restoration.
import { createContext, useContext, useMemo, useState, useEffect, type ReactNode } from 'react';

import type { AuthUser, UserRole } from '../types/auth';
import { getProfile } from '../services/authService';

interface AuthContextValue {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (user: AuthUser, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const mapRole = (backendRole: string): UserRole => {
  const roleLower = (backendRole || '').toLowerCase();
  if (roleLower === 'admin') return 'admin';
  if (roleLower === 'officer' || roleLower === 'municipal_officer') return 'municipal_officer';
  return 'citizen';
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const token = localStorage.getItem('access_token');
    const id = localStorage.getItem('user_id');
    const name = localStorage.getItem('user_name');
    const email = localStorage.getItem('user_email');
    const role = localStorage.getItem('user_role');

    if (token && id && name && email && role) {
      return {
        id,
        name,
        email,
        role: role as UserRole,
      };
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(() => {
    const token = localStorage.getItem('access_token');
    return !!token;
  });

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_role');
    setCurrentUser(null);
    setIsLoading(false);
  };

  const signIn = (user: AuthUser, token: string) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user_id', user.id);
    localStorage.setItem('user_name', user.name);
    localStorage.setItem('user_email', user.email);
    localStorage.setItem('user_role', user.role);
    setCurrentUser(user);
    setIsLoading(false);
  };

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await getProfile();
        const user = response.data.user;
        const mappedUser = {
          id: user.id,
          name: user.fullName,
          email: user.email,
          role: mapRole(user.role),
        };
        setCurrentUser(mappedUser);
        
        // Sync storage
        localStorage.setItem('user_id', user.id);
        localStorage.setItem('user_name', user.fullName);
        localStorage.setItem('user_email', user.email);
        localStorage.setItem('user_role', user.role);
      } catch (error) {
        console.error('Session restoration failed:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    currentUser,
    isAuthenticated: currentUser !== null,
    isLoading,
    signIn,
    logout,
  }), [currentUser, isLoading]);

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
