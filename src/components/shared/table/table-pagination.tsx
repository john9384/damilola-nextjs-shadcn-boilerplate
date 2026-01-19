"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import type { TablePaginationProps } from "@/types/table.types";

export function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  startIndex,
  endIndex,
}: TablePaginationProps) {
  const t = useTranslations("table");
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="border-t border-gray-200 w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
      <div className="text-sm text-gray-600">
        {t("showing", { start: startIndex, end: endIndex, total: totalItems })}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={currentPage <= 1}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="size-4" />
        </Button>

        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-700">
            {t("pageOf", { current: currentPage, total: totalPages })}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={currentPage >= totalPages}
          className="flex items-center gap-1"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
