"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export type SelectItem = {
  value: string;
  label: string;
  disabled?: boolean;
};

type SelectInputProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> & {
  label?: string;
  description?: string;
  error?: string;
  containerClassName?: string;
  items?: SelectItem[];
  placeholder?: string;
  renderOption?: (item: SelectItem) => string;
};

export const SelectInput = React.forwardRef<HTMLSelectElement, SelectInputProps>(
  (
    {
      label,
      description,
      error,
      className,
      containerClassName,
      required,
      value,
      onFocus,
      onBlur,
      onChange,
      items = [],
      placeholder,
      renderOption,
      name,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const hiddenSelectRef = React.useRef<HTMLSelectElement>(null);
    const stringValue = value ? String(value) : "";
    const [selectValue, setSelectValue] = React.useState(stringValue);
    const hasValue = Boolean(selectValue && selectValue.trim() !== "");

    // Forward ref to hidden select for form integration
    React.useImperativeHandle(ref, () => hiddenSelectRef.current as HTMLSelectElement);

    React.useEffect(() => {
      const newValue = value ? String(value) : "";
      setSelectValue(newValue);
      if (hiddenSelectRef.current) {
        hiddenSelectRef.current.value = newValue;
      }
    }, [value]);

    // Close dropdown when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setIsFocused(false);
          if (hiddenSelectRef.current) {
            const blurEvent = new FocusEvent("blur", {
              bubbles: true,
              cancelable: true,
            });
            hiddenSelectRef.current.dispatchEvent(blurEvent);
          }
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
      }
    }, [isOpen]);

    const selectedItem = items.find((item) => item.value === selectValue);
    const displayText = selectedItem
      ? renderOption
        ? renderOption(selectedItem)
        : selectedItem.label
      : placeholder || "";

    const handleButtonClick = () => {
      setIsOpen(!isOpen);
      if (!isFocused) {
        setIsFocused(true);
        if (hiddenSelectRef.current) {
          const focusEvent = new FocusEvent("focus", {
            bubbles: true,
            cancelable: true,
          });
          hiddenSelectRef.current.dispatchEvent(focusEvent);
        }
      }
    };

    const handleItemSelect = (item: SelectItem) => {
      if (item.disabled) return;

      setSelectValue(item.value);
      setIsOpen(false);
      setIsFocused(false);

      // Update hidden select and trigger onChange
      if (hiddenSelectRef.current) {
        hiddenSelectRef.current.value = item.value;
        // Create a synthetic change event for React
        const syntheticEvent = {
          target: hiddenSelectRef.current,
          currentTarget: hiddenSelectRef.current,
        } as React.ChangeEvent<HTMLSelectElement>;
        onChange?.(syntheticEvent);
      }
    };

    const isFloating = isFocused || hasValue;

    return (
      <div className={cn("relative", containerClassName)} ref={containerRef}>
        <div className="relative">
          {label && (
            <label
              className={cn(
                "absolute left-3 pointer-events-none transition-all duration-200 origin-left z-10",
                isFloating
                  ? "top-2 left-4 text-[9px] text-gray-600 scale-100"
                  : "top-1/2 -translate-y-1/2 text-base text-gray-400 scale-100",
              )}
            >
              {label}
              {required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
          )}
          <div className="relative">
            {/* Hidden select for form integration */}
            <select
              ref={hiddenSelectRef}
              name={name}
              value={selectValue}
              required={required}
              onChange={onChange}
              onFocus={onFocus}
              onBlur={onBlur}
              className="sr-only"
              tabIndex={-1}
              aria-hidden="true"
            >
              {items.map((item) => (
                <option key={item.value} value={item.value}>
                  {renderOption ? renderOption(item) : item.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              className={cn(
                "w-full rounded-lg border border-gray-300 bg-white px-3 outline-none transition-all duration-200 text-left",
                label ? "pt-5 pb-2.5 h-12" : "h-12",
                "text-gray-900",
                "focus:border-primary focus:ring-2 focus:ring-primary/20",
                error && "border-red-400 focus:border-red-500 focus:ring-red-400/20",
                !hasValue && placeholder && "text-gray-400",
                className,
              )}
              onClick={handleButtonClick}
              onFocus={() => {
                setIsFocused(true);
                hiddenSelectRef.current?.focus();
              }}
              aria-haspopup="listbox"
              aria-expanded={isOpen}
            >
              <span className="block truncate">{displayText}</span>
            </button>
            <ChevronDown
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none size-4 text-gray-400 transition-transform duration-200",
                isOpen && "rotate-180",
              )}
            />
            {isOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                <div
                  className={cn(
                    "absolute z-50 mt-1 w-full rounded-lg bg-white shadow-lg border border-gray-200 py-1 max-h-60 overflow-auto",
                  )}
                >
                  {items.map((item) => {
                    const optionText = renderOption ? renderOption(item) : item.label;
                    const isSelected = item.value === selectValue;
                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => handleItemSelect(item)}
                        disabled={item.disabled}
                        className={cn(
                          "w-full text-left px-3 py-2 text-sm transition-colors",
                          isSelected
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-gray-900 hover:bg-gray-100",
                          item.disabled && "opacity-50 cursor-not-allowed",
                        )}
                      >
                        {optionText}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
        {error ? (
          <p className="mt-1.5 text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : description ? (
          <p className="mt-1.5 text-sm text-gray-500">{description}</p>
        ) : null}
      </div>
    );
  },
);
SelectInput.displayName = "SelectInput";

