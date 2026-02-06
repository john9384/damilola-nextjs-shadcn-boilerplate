"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/AuthProvider";
import { useLogin, getLoginSchema } from "./use-login";
import { TextInput } from "@/components/shared/form/TextInput";
import { PasswordInput } from "@/components/shared/form/PasswordInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export function LoginPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { mutateAsync, isPending } = useLogin();
  const loginSchema = useMemo(() => getLoginSchema(), []);

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
    try {
      const result = await mutateAsync(values);
      if (result) {
        router.push("/");
      }
    } catch {
      // Errors are surfaced via toast notifications.
    }
  };

  if (isAuthenticated) return null;

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-1 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Welcome back</p>
        <h1 className="text-3xl font-semibold tracking-tight">Log in dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Use your admin credentials to access the dashboard.
        </p>
      </div>

      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <TextInput
          label="Email address"
          id="email"
          autoComplete="email"
          error={form.formState.errors.email?.message}
          {...form.register("email")}
        />
        <PasswordInput
          label="Password"
          id="password"
          error={form.formState.errors.password?.message}
          {...form.register("password")}
        />

        <Button
          type="submit"
          className="mt-2 w-full bg-primary text-primary-foreground shadow-lg shadow-primary/20"
          disabled={isPending}
        >
          {isPending ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
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
  );
}
