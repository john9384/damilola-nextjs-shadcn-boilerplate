"use client";

import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { z, ZodError } from "zod";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/store/AuthProvider";
import type { IUser } from "@/types/user";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export type LoginInput = z.infer<typeof loginSchema>;
interface LoginResponse {
  content: {
    user: IUser;
    tokens: {
      accessToken: string;
      refreshToken?: string;
    };
  };
}

export const getLoginErrorMessage = (error: unknown) => {
  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? "Please double-check your login details.";
  }

  if (error instanceof AxiosError) {
    const payload = error.response?.data;
    if (payload && typeof payload === "object") {
      const data = payload as { message?: string; error?: string };
      if (data.message) return data.message;
      if (data.error) return data.error;
    }

    if (error.response?.status === 401 || error.response?.status === 403) {
      return "Invalid credentials. Please try again.";
    }
  }

  if (error instanceof Error) {
    return error.message || "Something went wrong. Please try again.";
  }

  return "Something went wrong. Please try again.";
};

export function useLogin() {
  const { login } = useAuth();

  const mutation = useMutation({
    mutationFn: async (values: LoginInput) => {
      const parsed = loginSchema.parse(values);
      const response = await apiClient.post<LoginResponse>("/auth/login", parsed);

      const { user, tokens } = response.content;

      return { user, tokens };
    },
    onSuccess: async ({ user, tokens }) => {
      await login(user, tokens.accessToken, tokens.refreshToken);
    },
  });

  return mutation;
}
