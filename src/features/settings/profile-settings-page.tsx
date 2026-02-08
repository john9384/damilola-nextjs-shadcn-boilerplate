"use client";

import { SettingsSubnav } from "@/features/settings/components/settings-subnav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/store/AuthProvider";

export function ProfileSettingsPage() {
  const { user } = useAuth();

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
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your account information.</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Name</dt>
              <dd className="mt-1 text-sm font-medium">{user?.name || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Email</dt>
              <dd className="mt-1 text-sm font-medium">{user?.email || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Role</dt>
              <dd className="mt-1 text-sm font-medium">{user?.adminRole || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Created At</dt>
              <dd className="mt-1 text-sm font-medium">
                {user?.createdAt ? new Date(user.createdAt).toLocaleString() : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Type</dt>
              <dd className="mt-1 text-sm font-medium">{user?.type || "—"}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
