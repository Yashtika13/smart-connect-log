import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { tokenStore, type StoredUser } from "./api/client";
import { login as apiLogin, logout as apiLogout, type LoginRequest } from "./api/auth";

interface AuthContextValue {
  user: StoredUser | null;
  isAuthenticated: boolean;
  isReady: boolean;
  signIn: (req: LoginRequest) => Promise<StoredUser>;
  signOut: () => void;
  hasRole: (role: StoredUser["role"]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setUser(tokenStore.getUser());
    setIsReady(true);
  }, []);

  const signIn = useCallback(async (req: LoginRequest) => {
    const res = await apiLogin(req);
    const u: StoredUser = {
      userId: res.userId,
      username: res.username,
      email: res.email,
      fullName: res.fullName,
      role: res.role,
    };
    setUser(u);
    return u;
  }, []);

  const signOut = useCallback(() => {
    apiLogout();
    setUser(null);
  }, []);

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isReady,
    signIn,
    signOut,
    hasRole: (r) => user?.role === r,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
