"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/AuthProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextInput } from "@/components/shared/form/TextInput";
import { PasswordInput } from "@/components/shared/form/PasswordInput";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export function SignupPage() {
  const router = useRouter();
  const { login, isLoading, isAuthenticated } = useAuth();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    await login({ name: values.name, email: values.email }, "demo-token");
    router.push("/");
  };

  if (isAuthenticated) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-card-foreground shadow-2xl">
        <div className="mb-8 space-y-2 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Join the workspace
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Create your account</h1>
          <p className="text-sm text-muted-foreground">
            Set up your profile to access your dashboard.
          </p>
        </div>

        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <TextInput
            label="Name"
            id="name"
            type="text"
            placeholder="Ada Lovelace"
            autoComplete="name"
            error={form.formState.errors.name?.message}
            {...form.register("name")}
          />
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
            autoComplete="new-password"
            error={form.formState.errors.password?.message}
            {...form.register("password")}
          />

          <Button
            type="submit"
            className="mt-2 w-full bg-primary text-primary-foreground shadow-lg shadow-primary/20"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <button
            type="button"
            className="text-primary underline-offset-4 hover:underline"
            onClick={() => router.push("/auth/login")}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
