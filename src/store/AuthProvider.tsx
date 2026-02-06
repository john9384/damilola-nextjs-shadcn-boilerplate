"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CookieStore } from "../utils/cookieStore";
import { LocalStore } from "../utils/localStore";
import type { IUser } from "@/types/user";

type AuthState = {
  isAuthenticated: boolean;
  user: IUser | null;
  token: string | null;
  isLoading: boolean;
  login: (user: IUser, token: string, refreshToken?: string) => Promise<void>;
  logout: () => void;
};

export const AUTH_TOKEN_KEY = "metropay-admin-auth";

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cookieStored = CookieStore.getItem<{ user: IUser; token: string; refreshToken?: string }>(
      AUTH_TOKEN_KEY,
    );
    const localStored = LocalStore.getItem<{ user: IUser; token: string; refreshToken?: string }>(
      AUTH_TOKEN_KEY,
    );
    const stored = cookieStored ?? localStored;

    if (stored?.user && stored?.token) {
      setUser(stored.user);
      setToken(stored.token);
    }
    setIsLoading(false);
  }, []);

  const login = async (newUser: IUser, newToken: string, refreshToken?: string) => {
    setIsLoading(true);
    setUser(newUser);
    setToken(newToken);
    LocalStore.setItem(AUTH_TOKEN_KEY, { user: newUser, token: newToken, refreshToken });
    CookieStore.setItem(AUTH_TOKEN_KEY, { user: newUser, token: newToken, refreshToken });
    setIsLoading(false);
  };

  const logout = () => {
    setIsLoading(true);
    setUser(null);
    setToken(null);
    LocalStore.removeItem(AUTH_TOKEN_KEY);
    CookieStore.removeItem(AUTH_TOKEN_KEY);
    setIsLoading(false);
  };
  const ensureAuthentication = (user: IUser | null) => {
    return Boolean(user && token && user.type === "ADMIN");
  };

  const value = useMemo(
    () => ({
      isAuthenticated: ensureAuthentication(user),
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
