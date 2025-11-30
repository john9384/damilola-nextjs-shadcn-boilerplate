import React from "react";
import { AuthProvider } from "./AuthProvider";

export function GlobalProvider({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
