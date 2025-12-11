"use client";

import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TableSortButtonProps {
  isActive?: boolean;
  onClick: () => void;
  className?: string;
}

export function TableSortButton({ isActive = false, onClick, className }: TableSortButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex items-center justify-center size-10 rounded-lg border transition-all",
        isActive
          ? "border-primary bg-primary/10 text-primary"
          : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50",
        className,
      )}
      title="Sort"
      type="button"
    >
      <ArrowUpDown className="size-5" />
    </button>
  );
}

