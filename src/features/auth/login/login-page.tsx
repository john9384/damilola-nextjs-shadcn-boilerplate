"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/AuthProvider";
import { useLogin } from "./use-login";

export function LoginPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { mutateAsync, isPending, fieldErrors, formError } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await mutateAsync({ email, password });
    if (result) {
      router.push("/");
    }
  };

  if (isAuthenticated) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-black px-4 py-10 text-slate-50">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
        <div className="mb-8 space-y-2 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-300">
            Welcome back
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Sign in</h1>
          <p className="text-sm text-slate-300">
            Access the dashboard to manage your workspace.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm text-slate-200" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
            {fieldErrors?.email ? (
              <p className="text-sm text-amber-300" role="alert">
                {fieldErrors.email[0]}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-200" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
            {fieldErrors?.password ? (
              <p className="text-sm text-amber-300" role="alert">
                {fieldErrors.password[0]}
              </p>
            ) : null}
          </div>

          {formError ? (
            <p className="text-sm text-amber-300" role="alert">
              {formError}
            </p>
          ) : null}

          <Button
            type="submit"
            className="mt-2 w-full bg-primary text-primary-foreground shadow-lg shadow-primary/20"
            disabled={isPending}
          >
            {isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-300">
          New here?{" "}
          <button
            type="button"
            className="text-primary underline-offset-4 hover:underline"
            onClick={() => router.push("/auth/signup")}
          >
            Create an account
          </button>
        </p>
      </div>
    </div>
  );
}
