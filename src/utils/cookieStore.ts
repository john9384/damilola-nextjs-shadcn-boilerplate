import { env } from "./env";

type SameSite = "lax" | "strict" | "none";

type CookieOptions = {
  path?: string;
  secure?: boolean;
  sameSite?: SameSite;
  maxAge?: number; // seconds
};

const ENCRYPTION_KEY = env.encryptionKey;

const DEFAULT_OPTIONS: Required<CookieOptions> = {
  path: "/",
  secure: true,
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 30, // 30 days
};

const isBrowser = () => typeof window !== "undefined" && typeof document !== "undefined";

const isServer = () => typeof window === "undefined";

export class CookieStore {
  static setItem<T>(key: string, value: T, options: CookieOptions = {}): void {
    const opts = { ...DEFAULT_OPTIONS, ...options };

    try {
      const stringValue = JSON.stringify(value);
      const encryptedValue = this.encrypt(stringValue);

      if (isServer()) {
        // Dynamically import to avoid bundling in client builds
        const { cookies } = require("next/headers");
        const cookieStore = cookies();
        cookieStore.set(key, encryptedValue, {
          path: opts.path,
          secure: opts.secure,
          sameSite: opts.sameSite,
          maxAge: opts.maxAge,
        });
        return;
      }

      if (!isBrowser()) return;

      const parts = [
        `${key}=${encodeURIComponent(encryptedValue)}`,
        `path=${opts.path}`,
        `max-age=${opts.maxAge}`,
        `samesite=${opts.sameSite}`,
      ];
      if (opts.secure) parts.push("secure");
      document.cookie = parts.join("; ");
    } catch (error) {
      console.error("Error setting cookie item:", error);
    }
  }

  static getItem<T>(key: string): T | null {
    try {
      if (isServer()) {
        const { cookies } = require("next/headers");
        const cookieStore = cookies();
        const stored = cookieStore.get(key);
        if (!stored?.value) return null;
        const decryptedValue = this.decrypt(stored.value);
        return JSON.parse(decryptedValue) as T;
      }

      if (!isBrowser()) return null;

      const match = document.cookie
        .split(";")
        .map((c) => c.trim())
        .find((c) => c.startsWith(`${key}=`));

      if (!match) return null;

      const [, raw] = match.split("=");
      if (!raw) return null;

      const decryptedValue = this.decrypt(decodeURIComponent(raw));
      return JSON.parse(decryptedValue) as T;
    } catch (error) {
      console.error("Error getting cookie item:", error);
      return null;
    }
  }

  static removeItem(key: string, options: CookieOptions = {}): void {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    try {
      if (isServer()) {
        const { cookies } = require("next/headers");
        const cookieStore = cookies();
        cookieStore.delete(key);
        return;
      }

      if (!isBrowser()) return;

      const parts = [`${key}=`, `path=${opts.path}`, "max-age=0", `samesite=${opts.sameSite}`];
      if (opts.secure) parts.push("secure");
      document.cookie = parts.join("; ");
    } catch (error) {
      console.error("Error removing cookie item:", error);
    }
  }

  static clearItems(prefix?: string): void {
    try {
      if (isServer()) {
        const { cookies } = require("next/headers");
        const cookieStore = cookies();
        if (!prefix) {
          cookieStore.getAll().forEach((c: { name: string }) => cookieStore.delete(c.name));
        } else {
          cookieStore.getAll().forEach((c: { name: string }) => {
            if (c.name.startsWith(prefix)) cookieStore.delete(c.name);
          });
        }
        return;
      }

      if (!isBrowser()) return;

      const items = document.cookie.split(";").map((c) => c.trim().split("=")[0]);
      items.forEach((name) => {
        if (!prefix || name.startsWith(prefix)) {
          this.removeItem(name);
        }
      });
    } catch (error) {
      console.error("Error clearing cookie items:", error);
    }
  }

  private static encrypt(text: string): string {
    let result = "";
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
      result += String.fromCharCode(charCode);
    }
    return btoa(result);
  }

  private static decrypt(encryptedText: string): string {
    try {
      const text = atob(encryptedText);
      let result = "";
      for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
        result += String.fromCharCode(charCode);
      }
      return result;
    } catch (error) {
      console.error("Error decrypting text:", error);
      return "";
    }
  }
}
