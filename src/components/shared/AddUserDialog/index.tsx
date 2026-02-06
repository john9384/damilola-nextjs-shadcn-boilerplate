"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TextInput } from "../form/TextInput";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  createAdmin,
  createAgent,
  createUser,
  type ICreateUser,
} from "@/features/admin/api/admin-api";
import type { Scalar } from "@/types/global";

interface Props {
  userType: "ADMIN" | "AGENT" | "BASIC";
  onCreated?: () => void;
  triggerLabel?: string;
}

type AddUserFormValues = {
  email: string;
  name?: string;
  phone?: string;
  adminRole?: "ADMIN" | "STAFF";
  hasScheduledRemittance?: boolean;
  remittanceStartDate?: string;
  scheduledRemittanceAmount?: number;
};

export function AddUserDialog({ userType, onCreated, triggerLabel }: Props) {
  const [open, setOpen] = useState(false);
  const defaultValues = useMemo<AddUserFormValues>(
    () => ({
      email: "",
      name: "",
      phone: "",
      adminRole: userType === "ADMIN" ? "ADMIN" : "STAFF",
      hasScheduledRemittance: false,
      remittanceStartDate: "",
      scheduledRemittanceAmount: undefined,
    }),
    [userType],
  );
  const { handleSubmit, formState, register, reset, watch } = useForm<AddUserFormValues>({
    mode: "onChange",
    shouldUnregister: true,
    defaultValues,
  });

  const hasScheduledRemittance = watch("hasScheduledRemittance");

  const dialogCopy = useMemo(() => {
    switch (userType) {
      case "ADMIN":
        return {
          title: "Create admin",
          description: "Add a new admin account with elevated access.",
          triggerLabel: "New admin",
          submitLabel: "Create admin",
        };
      case "AGENT":
        return {
          title: "Create agent",
          description: "Add a new agent profile to the Metropay system.",
          triggerLabel: "New agent",
          submitLabel: "Create agent",
        };
      default:
        return {
          title: "Create user",
          description: "Add a new basic user account.",
          triggerLabel: "New user",
          submitLabel: "Create user",
        };
    }
  }, [userType]);

  const { onSubmit, isSubmitting } = useCreateUser({
    userType,
    onSuccess: () => {
      reset(defaultValues);
      setOpen(false);
      onCreated?.();
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      reset(defaultValues);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>{triggerLabel ?? dialogCopy.triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogCopy.title}</DialogTitle>
          <DialogDescription>{dialogCopy.description}</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit, (err: Scalar) => console.log(err))}
          className="space-y-6"
        >
          <div className="space-y-4">
            <TextInput
              label="Email"
              id="user-email"
              type="email"
              autoComplete="email"
              error={formState.errors.email?.message}
              {...register("email", {
                required: "Email is required.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address.",
                },
              })}
            />
            <TextInput
              label="Name"
              id="name"
              autoComplete="name"
              error={formState.errors.name?.message}
              {...register("name")}
            />
            <TextInput
              label="Phone"
              id="user-phone"
              type="tel"
              autoComplete="tel"
              error={formState.errors.phone?.message}
              {...register("phone")}
            />
          </div>
          {userType === "ADMIN" && (
            <div className="space-y-2">
              <Label htmlFor="admin-role">Admin role</Label>
              <select
                id="admin-role"
                className="flex h-12 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                {...register("adminRole", { required: "Admin role is required." })}
              >
                <option value="ADMIN">Admin</option>
                <option value="STAFF">Staff</option>
              </select>
              {formState.errors.adminRole?.message ? (
                <span className="text-[10px] text-red-500">
                  {formState.errors.adminRole?.message}
                </span>
              ) : null}
            </div>
          )}
          {userType === "BASIC" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  id="has-scheduled-remittance"
                  type="checkbox"
                  className="size-4 accent-primary"
                  {...register("hasScheduledRemittance")}
                />
                <Label htmlFor="has-scheduled-remittance">Has scheduled remittance</Label>
              </div>
              {hasScheduledRemittance && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="remittance-start-date">Remittance start date</Label>
                    <Input
                      id="remittance-start-date"
                      type="date"
                      {...register("remittanceStartDate", {
                        required: "Remittance start date is required.",
                      })}
                    />
                    {formState.errors.remittanceStartDate?.message ? (
                      <span className="text-[10px] text-red-500">
                        {formState.errors.remittanceStartDate?.message}
                      </span>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scheduled-remittance-amount">Scheduled amount</Label>
                    <Input
                      id="scheduled-remittance-amount"
                      type="number"
                      min={0}
                      step="1"
                      {...register("scheduledRemittanceAmount", {
                        valueAsNumber: true,
                        min: {
                          value: 1,
                          message: "Amount must be greater than 0.",
                        },
                        required: "Scheduled amount is required.",
                      })}
                    />
                    {formState.errors.scheduledRemittanceAmount?.message ? (
                      <span className="text-[10px] text-red-500">
                        {formState.errors.scheduledRemittanceAmount?.message}
                      </span>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          )}
        </form>
        <DialogFooter className="mt-8">
          <Button type="submit" disabled={isSubmitting || !formState.isValid}>
            {isSubmitting ? "Creating..." : dialogCopy.submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function useCreateUser({
  userType,
  onSuccess,
}: {
  userType: Props["userType"];
  onSuccess?: () => void;
}) {
  const mutation = useMutation({
    mutationFn: (payload: AddUserFormValues) => {
      const sanitized = {
        email: payload.email.trim(),
        name: payload.name?.trim() || undefined,
        phone: payload.phone?.trim() || undefined,
        adminRole: payload.adminRole,
        hasScheduledRemittance: payload.hasScheduledRemittance ?? false,
        remittanceStartDate: payload.remittanceStartDate?.trim() || undefined,
        scheduledRemittanceAmount: Number.isFinite(payload.scheduledRemittanceAmount ?? NaN)
          ? payload.scheduledRemittanceAmount
          : undefined,
      };

      if (userType === "ADMIN") {
        return createAdmin({
          email: sanitized.email,
          name: sanitized.name,
          phone: sanitized.phone,
          adminRole: sanitized.adminRole ?? "ADMIN",
        });
      }
      if (userType === "AGENT") {
        return createAgent({
          email: sanitized.email,
          name: sanitized.name,
          phone: sanitized.phone,
        });
      }

      const remittancePayload = sanitized.hasScheduledRemittance
        ? {
            hasScheduledRemittance: true,
            remittanceStartDate: sanitized.remittanceStartDate,
            scheduledRemittanceAmount: sanitized.scheduledRemittanceAmount,
          }
        : { hasScheduledRemittance: false };

      const userPayload: ICreateUser = {
        email: sanitized.email,
        name: sanitized.name,
        phone: sanitized.phone,
        type: "BASIC",
        adminRole: "STAFF",
        ...remittancePayload,
      };
      return createUser(userPayload);
    },
    onSuccess: () => {
      toast.success(
        userType === "ADMIN"
          ? "Admin created."
          : userType === "AGENT"
            ? "Agent created."
            : "User created.",
      );
      onSuccess?.();
    },
    onError: (error: Scalar) => {
      toast.error(error?.message ?? "Error creating user");
    },
  });

  return {
    onSubmit: (data: AddUserFormValues) => mutation.mutate(data),
    isSubmitting: mutation.isPending,
    error: mutation.error,
  };
}
