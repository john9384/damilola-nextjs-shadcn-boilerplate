"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/AuthProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextInput } from "@/components/shared/form/TextInput";
import { PasswordInput } from "@/components/shared/form/PasswordInput";

const getSignupSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(2, t("errors.nameMin")),
    email: z.string().email(t("errors.invalidEmail")),
    password: z.string().min(6, t("errors.passwordMin")),
  });

export function SignupPage() {
  const router = useRouter();
  const t = useTranslations("auth");
  const { login, isLoading, isAuthenticated } = useAuth();
  const signupSchema = useMemo(() => getSignupSchema(t), [t]);

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
            {t("signup.joinWorkspace")}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">{t("signup.title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("signup.subtitle")}
          </p>
        </div>

        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <TextInput
            label={t("signup.nameLabel")}
            id="name"
            type="text"
            placeholder={t("signup.namePlaceholder")}
            autoComplete="name"
            error={form.formState.errors.name?.message}
            {...form.register("name")}
          />
          <TextInput
            label={t("signup.emailLabel")}
            id="email"
            type="email"
            placeholder={t("signup.emailPlaceholder")}
            autoComplete="email"
            error={form.formState.errors.email?.message}
            {...form.register("email")}
          />
          <PasswordInput
            label={t("signup.passwordLabel")}
            id="password"
            placeholder={t("signup.passwordPlaceholder")}
            autoComplete="new-password"
            error={form.formState.errors.password?.message}
            {...form.register("password")}
          />

          <Button
            type="submit"
            className="mt-2 w-full bg-primary text-primary-foreground shadow-lg shadow-primary/20"
            disabled={isLoading}
          >
            {isLoading ? t("signup.submitting") : t("signup.submit")}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t("signup.alreadyHaveAccount")}{" "}
          <button
            type="button"
            className="text-primary underline-offset-4 hover:underline"
            onClick={() => router.push("/auth/login")}
          >
            {t("signup.signIn")}
          </button>
        </p>
      </div>
    </div>
  );
}
