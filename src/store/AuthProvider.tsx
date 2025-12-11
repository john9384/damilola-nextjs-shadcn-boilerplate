"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CookieStore } from "../utils/cookieStore";
import { LocalStore } from "../utils/localStore";

type User = {
  name: string;
  email: string;
};

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (user: User, token: string) => Promise<void>;
  logout: () => void;
};

export const AUTH_STORE_KEY = "boilerplate-auth";

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cookieStored = CookieStore.getItem<{ user: User; token: string }>(AUTH_STORE_KEY);
    const localStored = LocalStore.getItem<{ user: User; token: string }>(AUTH_STORE_KEY);
    const stored = cookieStored ?? localStored;

    if (stored?.user && stored?.token) {
      setUser(stored.user);
      setToken(stored.token);
    }
    setIsLoading(false);
  }, []);

  const login = async (newUser: User, newToken: string) => {
    setIsLoading(true);
    setUser(newUser);
    setToken(newToken);
    LocalStore.setItem(AUTH_STORE_KEY, { user: newUser, token: newToken });
    CookieStore.setItem(AUTH_STORE_KEY, { user: newUser, token: newToken });
    setIsLoading(false);
  };

  const logout = () => {
    setIsLoading(true);
    setUser(null);
    setToken(null);
    LocalStore.removeItem(AUTH_STORE_KEY);
    CookieStore.removeItem(AUTH_STORE_KEY);
    setIsLoading(false);
  };

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(user && token),
      user,
      token,
      isLoading,
      login,
      logout,
    }),
    [user, token, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
