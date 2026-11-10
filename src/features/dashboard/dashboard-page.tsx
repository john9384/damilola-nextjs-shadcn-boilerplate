"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/AuthProvider";

export function DashboardPage() {
  const { isAuthenticated, isLoading, logout } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p role="status" aria-live="polite" className="text-muted-foreground">
        {isLoading ? "Loading..." : isAuthenticated ? "User logged in" : "User logged out"}
      </p>
      {!isLoading &&
        (isAuthenticated ? (
          <Button onClick={logout}>Log out</Button>
        ) : (
          <Button asChild>
            <Link href="/auth/login">Log in</Link>
          </Button>
        ))}
    </div>
  );
}
