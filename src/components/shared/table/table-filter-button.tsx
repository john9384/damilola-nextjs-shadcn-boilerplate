"use client";

import * as React from "react";
import { Filter } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TableFilterButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  activeFilterCount?: number;
  className?: string;
}

export const TableFilterButton = React.forwardRef<
  HTMLButtonElement,
  TableFilterButtonProps
>(({ isActive = false, activeFilterCount = 0, className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "relative flex items-center justify-center size-10 rounded-lg border transition-all",
        isActive
          ? "border-primary bg-primary/10 text-primary"
          : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50",
        className,
      )}
      title="Filter"
      type="button"
      {...props}
    >
      <Filter className="size-5" />
      {activeFilterCount > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center size-5 rounded-full bg-primary text-white text-xs font-semibold">
          {activeFilterCount}
        </span>
      )}
    </button>
  );
});

TableFilterButton.displayName = "TableFilterButton";
