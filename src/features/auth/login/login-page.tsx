"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/AuthProvider";
import { useLogin, loginSchema } from "./use-login";
import { TextInput } from "@/components/shared/form/TextInput";
import { PasswordInput } from "@/components/shared/form/PasswordInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export function LoginPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { mutateAsync, isPending, formError } = useLogin();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    const result = await mutateAsync(values);
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

        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <TextInput
            label="Email"
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            error={form.formState.errors.email?.message}
            {...form.register("email")}
          />
          <PasswordInput
            label="Password"
            id="password"
            placeholder="••••••••"
            autoComplete="current-password"
            error={form.formState.errors.password?.message}
            {...form.register("password")}
          />

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
