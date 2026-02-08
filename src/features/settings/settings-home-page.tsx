"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsSubnav } from "@/features/settings/components/settings-subnav";

const settingsLinks = [
  {
    title: "Profile",
    description: "View your account details and role information.",
    href: "/settings/profile",
  },
  {
    title: "System",
    description: "Manage app name and paystack configuration keys.",
    href: "/settings/system",
  },
];

export function SettingsHomePage() {
  return (
    <div className="space-y-8 text-foreground">
      <header className="flex flex-col gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-primary">Settings</h1>
          <p className="text-sm text-muted-foreground">Choose a settings section to continue.</p>
        </div>
        <SettingsSubnav />
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {settingsLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="h-full border border-border transition-colors hover:border-primary/40">
              <CardHeader>
                <CardTitle>{link.title}</CardTitle>
                <CardDescription>{link.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-sm font-medium text-primary">Open {link.title}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
