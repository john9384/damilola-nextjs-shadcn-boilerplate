"use client";

import { TableSearchBar } from "./table-search-bar";
import { TableSortButton } from "./table-sort-button";
import { TableFilterButton } from "./table-filter-button";
import { useTranslations } from "next-intl";

export interface TableHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSortClick: () => void;
  onFilterClick: () => void;
  isSortActive?: boolean;
  isFilterActive?: boolean;
  filterCount?: number;
  searchPlaceholder?: string;
}

export function TableHeader({
  searchValue,
  onSearchChange,
  onSortClick,
  onFilterClick,
  isSortActive = false,
  isFilterActive = false,
  filterCount = 0,
  searchPlaceholder,
}: TableHeaderProps) {
  const t = useTranslations("table");
  const placeholderText = searchPlaceholder ?? t("searchPlaceholder");
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
      <div className="flex-1 w-full flex items-center  justify-between gap-2">
        <TableSearchBar
          value={searchValue}
          onChange={onSearchChange}
          placeholder={placeholderText}
        />

        <div className="flex items-center gap-2">
          <TableSortButton isActive={isSortActive} onClick={onSortClick} />
          <TableFilterButton
            isActive={isFilterActive}
            onClick={onFilterClick}
            activeFilterCount={filterCount}
          />
        </div>
      </div>
    </div>
  );
}
