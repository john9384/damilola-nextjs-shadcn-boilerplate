"use client";

import { Search, X } from "lucide-react";

export interface TableSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export function TableSearchBar({
  value,
  onChange,
  placeholder,
  onClear,
}: TableSearchBarProps) {
  const placeholderText = placeholder ?? "Search";
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange("");
    onClear?.();
  };

  return (
    <div className="relative w-[300px]">
      <input
        placeholder={placeholderText}
        value={value}
        onChange={handleChange}
        className="w-full h-12 pl-10 pr-10 rounded-lg border border-gray-300 bg-white py-2 outline-none transition-all duration-200 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none z-10" />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
          type="button"
          aria-label="Clear search"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
