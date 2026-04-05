import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { clearAuthToken, getAuthToken, getGoogleOAuthLoginUrl, setAuthToken } from '../api/client';
import type { AuthUser, Role } from '../api/types';

interface JwtPayload {
  uid: number;
  role: Role;
  sub: string;
  exp: number;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loginWithGoogle: () => void;
  completeOAuthLogin: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const parseJwtPayload = (token: string): JwtPayload => {
  const payloadSegment = token.split('.')[1];
  if (!payloadSegment) {
    throw new Error('Invalid JWT token');
  }
  const base64 = payloadSegment.replace(/-/g, '+').replace(/_/g, '/');
  const paddedBase64 = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  const decoded = atob(paddedBase64);
  const parsed = JSON.parse(decoded) as JwtPayload;
  if (!parsed.uid || !parsed.role || !parsed.sub || !parsed.exp) {
    throw new Error('Incomplete JWT payload');
  }
  return parsed;
};

const buildUserFromToken = (token: string): AuthUser => {
  const payload = parseJwtPayload(token);
  if (payload.exp * 1000 < Date.now()) {
    throw new Error('Token expired');
  }

  const nameFromEmail = payload.sub.split('@')[0] || payload.sub;
  return {
    userId: payload.uid,
    email: payload.sub,
    role: payload.role,
    name: nameFromEmail,
  };
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(getAuthToken());
  const [user, setUser] = useState<AuthUser | null>(null);

  const completeOAuthLogin = useCallback((nextToken: string) => {
    const nextUser = buildUserFromToken(nextToken);
    setAuthToken(nextToken);
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    clearAuthToken();
    setToken(null);
    setUser(null);
  }, []);

  const loginWithGoogle = useCallback(() => {
    window.location.href = getGoogleOAuthLoginUrl();
  }, []);

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }
    try {
      setUser(buildUserFromToken(token));
    } catch {
      logout();
    }
  }, [token, logout]);

  const value = useMemo(
    () => ({ user, token, loginWithGoogle, completeOAuthLogin, logout }),
    [user, token, loginWithGoogle, completeOAuthLogin, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
