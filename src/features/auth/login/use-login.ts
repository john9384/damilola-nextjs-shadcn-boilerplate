"use client";

import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { z, ZodError } from "zod";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/store/AuthProvider";
import type { IUser } from "@/types/user";

export const getLoginSchema = () =>
  z.object({
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(6, "Password must be at least 6 characters."),
  });

type LoginInput = z.infer<ReturnType<typeof getLoginSchema>>;
interface LoginResponse {
  content: {
    user: IUser;
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

const getLoginErrorMessage = (error: unknown) => {
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
  const loginSchema = getLoginSchema();

  const mutation = useMutation({
    mutationFn: async (values: LoginInput) => {
      const parsed = loginSchema.parse(values);
      const response = await apiClient.post<LoginResponse>("/auth/login", {
        ...parsed,
        type: "ADMIN",
      });

      const { user, tokens } = response.content;

      if (user.type !== "ADMIN") {
        throw new Error("Invalid credentials.");
      }

      return { user, tokens };
    },
    onSuccess: ({ user, tokens }) => {
      login(user, tokens.accessToken, tokens.refreshToken);
      toast.success("Login successful.");
    },
    onError: (error) => {
      toast.error(getLoginErrorMessage(error));
    },
  });

  return mutation;
}
