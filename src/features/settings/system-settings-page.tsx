"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  settingsService,
  type SystemSettings,
  type UpdateSystemSettingsPayload,
} from "@/features/settings/api/settings-api";
import { SettingsSubnav } from "@/features/settings/components/settings-subnav";

type FormState = {
  appName: string;
  paystackPubKey: string;
  paystackPrivateKey: string;
  password: string;
};

const defaultForm: FormState = {
  appName: "",
  paystackPubKey: "",
  paystackPrivateKey: "",
  password: "",
};

export function SystemSettingsPage() {
  const [form, setForm] = useState<FormState>(defaultForm);

  const { data, isLoading, refetch } = useQuery<SystemSettings>({
    queryKey: ["settings", "system"],
    queryFn: () => settingsService.getSystemSettings(),
  });

  useEffect(() => {
    if (!data) return;
    setForm({
      appName: data.appName ?? "",
      paystackPubKey: data.paystackPubKey ?? "",
      paystackPrivateKey: data.paystackPrivateKey ?? "",
      password: "",
    });
  }, [data]);

  const mutation = useMutation({
    mutationFn: (payload: UpdateSystemSettingsPayload) =>
      settingsService.updateSystemSettings(payload),
    onSuccess: () => {
      toast.success("System settings updated successfully.");
      setForm((prev) => ({ ...prev, password: "" }));
      refetch();
    },
    onError: (error: { response?: { data?: { message?: string } }; message?: string }) => {
      const message =
        error?.response?.data?.message || error?.message || "Failed to update settings.";
      toast.error(message);
    },
  });

  const hasChanges = useMemo(() => {
    if (!data) return false;
    return (
      form.appName !== data.appName ||
      form.paystackPubKey !== data.paystackPubKey ||
      form.paystackPrivateKey !== data.paystackPrivateKey
    );
  }, [data, form.appName, form.paystackPubKey, form.paystackPrivateKey]);

  const isSubmitDisabled = mutation.isPending || !form.password.trim() || !hasChanges;

  const handleChange = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!data) return;

    const payload: UpdateSystemSettingsPayload = {
      password: form.password.trim(),
    };

    if (form.appName !== data.appName) payload.appName = form.appName.trim();
    if (form.paystackPubKey !== data.paystackPubKey)
      payload.paystackPubKey = form.paystackPubKey.trim();
    if (form.paystackPrivateKey !== data.paystackPrivateKey) {
      payload.paystackPrivateKey = form.paystackPrivateKey.trim();
    }

    mutation.mutate(payload);
  };

  return (
    <div className="space-y-8 text-foreground">
      <header className="flex flex-col gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-primary">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your profile and platform settings.
          </p>
        </div>
        <SettingsSubnav />
      </header>

      <Card className="border border-border">
        <CardHeader>
          <CardTitle>System</CardTitle>
          <CardDescription>Update app identity and paystack credentials.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-sm text-muted-foreground">Loading system settings...</div>
          ) : (
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="space-y-2">
                <Label htmlFor="app-name">App name</Label>
                <Input
                  id="app-name"
                  value={form.appName}
                  onChange={(event) => handleChange("appName", event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paystack-pub-key">Paystack public key</Label>
                <Input
                  id="paystack-pub-key"
                  value={form.paystackPubKey}
                  onChange={(event) => handleChange("paystackPubKey", event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paystack-private-key">Paystack private key</Label>
                <Input
                  id="paystack-private-key"
                  value={form.paystackPrivateKey}
                  onChange={(event) => handleChange("paystackPrivateKey", event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="settings-password">System password</Label>
                <Input
                  id="settings-password"
                  type="password"
                  value={form.password}
                  onChange={(event) => handleChange("password", event.target.value)}
                  placeholder="Enter system password to confirm changes"
                />
              </div>

              <div className="pt-2">
                <Button type="submit" disabled={isSubmitDisabled}>
                  {mutation.isPending ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
