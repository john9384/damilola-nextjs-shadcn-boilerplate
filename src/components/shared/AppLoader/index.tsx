"use client";

import * as React from "react";
import { RotateLoader } from "react-spinners";
import { cn } from "@/lib/utils";

export type AppLoaderType = "blank-page" | "overlay" | "component";

export interface AppLoaderProps {
  type?: AppLoaderType;
  color?: string;
  size?: number;
  loading?: boolean;
  className?: string;
}

export function AppLoader({
  type = "component",
  color = "#36D7B7",
  size = 15,
  loading = true,
  className,
}: AppLoaderProps) {
  const baseClasses = "flex items-center justify-center";

  const typeClasses = {
    "blank-page": "w-full h-full",
    overlay: "fixed inset-0 z-50 bg-black/90",
    component: "w-full h-full",
  };

  if (!loading) {
    return null;
  }

  return (
    <div
      className={cn(baseClasses, typeClasses[type], className)}
      data-slot="app-loader"
    >
      <RotateLoader color={color} size={size} loading={loading} />
    </div>
  );
}

