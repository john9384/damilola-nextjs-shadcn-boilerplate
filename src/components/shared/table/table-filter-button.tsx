"use client";

import { Filter } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export interface TableFilterButtonProps {
  isActive?: boolean;
  onClick: () => void;
  activeFilterCount?: number;
  className?: string;
}

export function TableFilterButton({
  isActive = false,
  onClick,
  activeFilterCount = 0,
  className,
}: TableFilterButtonProps) {
  const t = useTranslations("table");
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
      title={t("filter")}
      type="button"
    >
      <Filter className="size-5" />
      {activeFilterCount > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center size-5 rounded-full bg-primary text-white text-xs font-semibold">
          {activeFilterCount}
        </span>
      )}
    </button>
  );
}
