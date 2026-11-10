"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { CookieStore } from "@/utils/cookieStore";
import { LocalStore } from "@/utils/localStore";
import { AUTH_CHANGE_EVENT, AUTH_TOKEN_KEY } from "@/lib/auth";
import type { IUser } from "@/types/user";

type Session = { user: IUser; token: string; refreshToken?: string };

type AuthState = {
  isAuthenticated: boolean;
  user: IUser | null;
  token: string | null;
  isLoading: boolean;
  login: (user: IUser, token: string, refreshToken?: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(AUTH_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(AUTH_CHANGE_EVENT, onChange);
  };
}

function getSnapshot() {
  const session =
    CookieStore.getItem<Session>(AUTH_TOKEN_KEY) ?? LocalStore.getItem<Session>(AUTH_TOKEN_KEY);
  return JSON.stringify(session);
}

function getServerSnapshot() {
  return undefined;
}

async function login(user: IUser, token: string, refreshToken?: string) {
  const session = { user, token, refreshToken };
  LocalStore.setItem(AUTH_TOKEN_KEY, session);
  CookieStore.setItem(AUTH_TOKEN_KEY, session);
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

function logout() {
  LocalStore.removeItem(AUTH_TOKEN_KEY);
  CookieStore.removeItem(AUTH_TOKEN_KEY);
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const value = useMemo<AuthState>(() => {
    const session: Session | null = snapshot ? JSON.parse(snapshot) : null;
    return {
      isAuthenticated: Boolean(session?.user && session?.token),
      user: session?.user ?? null,
      token: session?.token ?? null,
      isLoading: snapshot === undefined,
      login,
      logout,
    };
  }, [snapshot]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
