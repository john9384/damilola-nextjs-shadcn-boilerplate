"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type UserDetailsPlaceholderProps = {
  children: ReactNode;
  className?: string;
};

export function UserDetailsPlaceholder({ children, className }: UserDetailsPlaceholderProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}
