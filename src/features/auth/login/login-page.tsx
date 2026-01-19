"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("auth");
  const { isAuthenticated } = useAuth();
  const { mutateAsync, isPending, formError } = useLogin();
  const loginSchema = useMemo(() => getLoginSchema(t), [t]);

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
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-card-foreground shadow-2xl">
        <div className="mb-8 space-y-2 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
            {t("login.welcomeBack")}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">{t("login.title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("login.subtitle")}
          </p>
        </div>

        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <TextInput
            label={t("login.emailLabel")}
            id="email"
            type="email"
            placeholder={t("login.emailPlaceholder")}
            autoComplete="email"
            error={form.formState.errors.email?.message}
            {...form.register("email")}
          />
          <PasswordInput
            label={t("login.passwordLabel")}
            id="password"
            placeholder={t("login.passwordPlaceholder")}
            autoComplete="current-password"
            error={form.formState.errors.password?.message}
            {...form.register("password")}
          />

          {formError ? (
            <p className="text-sm text-destructive" role="alert">
              {formError}
            </p>
          ) : null}

          <Button
            type="submit"
            className="mt-2 w-full bg-primary text-primary-foreground shadow-lg shadow-primary/20"
            disabled={isPending}
          >
            {isPending ? t("login.submitting") : t("login.submit")}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t("login.newHere")}{" "}
          <button
            type="button"
            className="text-primary underline-offset-4 hover:underline"
            onClick={() => router.push("/auth/signup")}
          >
            {t("login.createAccount")}
          </button>
        </p>
      </div>
    </div>
  );
}
