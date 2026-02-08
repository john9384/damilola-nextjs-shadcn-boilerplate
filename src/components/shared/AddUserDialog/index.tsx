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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TextInput } from "../form/TextInput";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { ICreateUser } from "@/services/user-service";
import type { Scalar } from "@/types/global";
import { useCreateUser } from "@/hooks/use-users";

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
  const formSchema = useMemo(() => {
    const baseSchema = z.object({
      email: z.string().trim().min(1, "Email is required.").email("Enter a valid email address."),
      name: z.string().trim().optional(),
      phone: z.string().trim().optional(),
      adminRole: z.enum(["ADMIN", "STAFF"]).optional(),
      hasScheduledRemittance: z.boolean().optional(),
      remittanceStartDate: z.string().trim().optional(),
      scheduledRemittanceAmount: z.preprocess((value) => {
        if (value === "" || value === null || value === undefined) return undefined;
        const num = Number(value);
        return Number.isFinite(num) ? num : undefined;
      }, z.number().positive("Amount must be greater than 0.").optional()),
    });

    return baseSchema.superRefine((data, ctx) => {
      if (userType === "ADMIN" && !data.adminRole) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Admin role is required.",
          path: ["adminRole"],
        });
      }

      if (userType === "BASIC" && data.hasScheduledRemittance) {
        if (!data.remittanceStartDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Remittance start date is required.",
            path: ["remittanceStartDate"],
          });
        }
        if (!data.scheduledRemittanceAmount) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Scheduled amount is required.",
            path: ["scheduledRemittanceAmount"],
          });
        }
      }
    });
  }, [userType]);

  const { handleSubmit, formState, register, reset, watch } = useForm<AddUserFormValues>({
    mode: "onChange",
    shouldUnregister: true,
    defaultValues,
    resolver: zodResolver(formSchema),
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

  const createUserMutation = useCreateUser(userType, {
    onSuccess: () => {
      reset(defaultValues);
      setOpen(false);
      onCreated?.();
      toast.success(
        userType === "ADMIN"
          ? "Admin created."
          : userType === "AGENT"
            ? "Agent created."
            : "User created.",
      );
    },
    onError: (error) => {
      const message = (error as Scalar)?.message ?? "Error creating user";
      toast.error(message);
    },
  });

  const onSubmit = (payload: AddUserFormValues) => {
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
      type: userType,
      ...(userType === "ADMIN"
        ? { adminRole: sanitized.adminRole ?? "ADMIN" }
        : userType === "BASIC"
          ? { adminRole: "STAFF", ...remittancePayload }
          : {}),
    };

    createUserMutation.mutate(userPayload);
  };

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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <TextInput
              label="Email"
              id="user-email"
              type="email"
              autoComplete="email"
              error={formState.errors.email?.message}
              {...register("email")}
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
                {...register("adminRole")}
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
                      {...register("remittanceStartDate")}
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
          <DialogFooter className="mt-8">
            <Button type="submit" disabled={createUserMutation.isPending}>
              {createUserMutation.isPending ? "Creating..." : dialogCopy.submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
