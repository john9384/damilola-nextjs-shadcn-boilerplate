"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/AuthProvider";

export function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black px-6 py-12 text-slate-50">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 shadow-2xl backdrop-blur">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-300">Dashboard</p>
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Welcome back{user?.name ? `, ${user.name}` : ""}!
            </h1>
            <p className="text-sm text-slate-300">Here is your at-a-glance view.</p>
          </div>
          <Button onClick={logout}>Log out</Button>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur">
            <p className="text-sm text-slate-300">User</p>
            <p className="text-xl font-semibold text-white">{user?.name ?? "Unknown"}</p>
            <p className="text-sm text-slate-400">{user?.email ?? "No email"}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur">
            <p className="text-sm text-slate-300">Status</p>
            <p className="text-xl font-semibold text-emerald-300">Authenticated</p>
            <p className="text-sm text-slate-400">Session active with demo token.</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur">
            <p className="text-sm text-slate-300">Next steps</p>
            <p className="text-sm text-slate-200">
              Replace demo auth with your backend API and wire real data widgets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
