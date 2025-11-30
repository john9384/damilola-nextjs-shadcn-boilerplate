"use client";

import { useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { z, ZodError } from "zod";
import { useAuth } from "@/store/AuthProvider";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type LoginInput = z.infer<typeof loginSchema>;

export function useLogin() {
  const { login } = useAuth();

  const mutation = useMutation({
    mutationFn: async (values: LoginInput) => {
      const parsed = loginSchema.safeParse(values);
      if (!parsed.success) {
        throw parsed.error;
      }

      // Simulate API call delay for demo purposes.
      await new Promise((resolve) => setTimeout(resolve, 300));

      const { email } = parsed.data;
      const user = {
        name: email.split("@")[0] || "User",
        email,
      };
      const token = "demo-token";

      await login(user, token);
      return { user, token };
    },
  });

  const fieldErrors = useMemo(() => {
    if (mutation.error instanceof ZodError) {
      return mutation.error.flatten().fieldErrors;
    }
    return undefined;
  }, [mutation.error]);

  const formError =
    mutation.error && !(mutation.error instanceof ZodError)
      ? "Something went wrong. Please try again."
      : null;

  return {
    ...mutation,
    fieldErrors,
    formError,
  };
}
