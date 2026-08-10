import { deleteCookie, getCookie, getCookies, setCookie } from "cookies-next";

type SameSite = "lax" | "strict" | "none";

type CookieOptions = {
  path?: string;
  secure?: boolean;
  sameSite?: SameSite;
  maxAge?: number; // seconds
};

const DEFAULT_OPTIONS: Required<CookieOptions> = {
  path: "/",
  secure: true,
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 30, // 30 days
};

export class CookieStore {
  static setItem<T>(key: string, value: T, options: CookieOptions = {}): void {
    const opts = { ...DEFAULT_OPTIONS, ...options };

    try {
      const stringValue = JSON.stringify(value);
      setCookie(key, stringValue, opts);
    } catch (error) {
      console.error("Error setting cookie item:", error);
    }
  }

  static getItem<T>(key: string): T | null {
    try {
      const stored = getCookie(key);
      if (!stored) return null;
      const stringValue = typeof stored === "string" ? stored : stored.toString();
      return JSON.parse(stringValue) as T;
    } catch (error) {
      console.error("Error getting cookie item:", error);
      return null;
    }
  }

  static removeItem(key: string, options: CookieOptions = {}): void {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    try {
      deleteCookie(key, opts);
    } catch (error) {
      console.error("Error removing cookie item:", error);
    }
  }

  static clearItems(prefix?: string): void {
    try {
      const cookies = getCookies();
      Object.keys(cookies as any).forEach((name) => {
        if (!prefix || name.startsWith(prefix)) deleteCookie(name);
      });
    } catch (error) {
      console.error("Error clearing cookie items:", error);
    }
  }
}
