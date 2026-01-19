"use client";

import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { z, ZodError } from "zod";
import { useAuth } from "@/store/AuthProvider";

export const getLoginSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().email(t("errors.invalidEmail")),
    password: z.string().min(6, t("errors.passwordMin")),
  });

type LoginInput = z.infer<ReturnType<typeof getLoginSchema>>;

export function useLogin() {
  const { login } = useAuth();
  const t = useTranslations("auth");
  const loginSchema = getLoginSchema(t);

  const mutation = useMutation({
    mutationFn: async (values: LoginInput) => {
      const parsed = loginSchema.parse(values);

      // Simulate API call delay for demo purposes.
      await new Promise((resolve) => setTimeout(resolve, 300));

      const { email } = parsed;
      const user = {
        name: email.split("@")[0] || t("userFallback"),
        email,
      };
      const token = "demo-token";

      await login(user, token);
      return { user, token };
    },
  });

  const formError =
    mutation.error && !(mutation.error instanceof ZodError)
      ? t("errors.generic")
      : null;

  return {
    ...mutation,
    formError,
  };
}
