import { env } from "./env";

const ENCRYPTION_KEY = env.encryptionKey;

export class LocalStore {
  private static isBrowser(): boolean {
    return typeof window !== "undefined" && typeof localStorage !== "undefined";
  }

  static setItem(key: string, value: any): void {
    if (!this.isBrowser()) return;

    try {
      const stringValue = JSON.stringify(value);
      const encryptedValue = this.encrypt(stringValue);
      localStorage.setItem(key, encryptedValue);
    } catch (error) {
      console.error("Error setting localStorage item:", error);
    }
  }

  static getItem<T>(key: string): T | null {
    if (!this.isBrowser()) return null;

    try {
      const encryptedValue = localStorage.getItem(key);
      if (!encryptedValue) return null;

      const decryptedValue = this.decrypt(encryptedValue);
      return JSON.parse(decryptedValue) as T;
    } catch (error) {
      console.error("Error getting localStorage item:", error);
      return null;
    }
  }

  static removeItem(key: string): void {
    if (!this.isBrowser()) return;

    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing localStorage item:", error);
    }
  }

  static clearItems(prefix?: string): void {
    if (!this.isBrowser()) return;

    try {
      if (prefix) {
        // Remove only items that start with the prefix
        Object.keys(localStorage)
          .filter((key) => key.startsWith(prefix))
          .forEach((key) => localStorage.removeItem(key));
      } else {
        // Clear all localStorage
        localStorage.clear();
      }
    } catch (error) {
      console.error("Error clearing localStorage items:", error);
    }
  }

  private static encrypt(text: string): string {
    // Simple XOR encryption with the key
    let result = "";
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
      result += String.fromCharCode(charCode);
    }
    // Convert to base64 for safe storage
    return btoa(result);
  }

  private static decrypt(encryptedText: string): string {
    try {
      // Convert from base64
      const text = atob(encryptedText);
      // XOR decryption with the key
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
