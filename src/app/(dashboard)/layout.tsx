import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <main className="mx-auto min-h-svh w-full max-w-3xl px-6 py-16">{children}</main>;
}
