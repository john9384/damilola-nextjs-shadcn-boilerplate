"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { Scalar } from "@/types/global";

type DateInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
  description?: string;
  error?: string;
  containerClassName?: string;
};

export const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
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
      name,
      id,
      disabled,
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    const hiddenInputRef = React.useRef<HTMLInputElement>(null);
    const stringValue = value ? String(value) : "";
    const hasValue = Boolean(stringValue && stringValue.trim() !== "");
    const selectedDate = stringValue ? new Date(stringValue) : undefined;
    const displayValue = selectedDate ? format(selectedDate, "MMM d, yyyy") : "";

    React.useImperativeHandle(ref, () => hiddenInputRef.current as HTMLInputElement);

    const isFloating = isFocused || hasValue;

    const handleSelect = (date?: Date) => {
      if (!date) return;
      const nextValue = format(date, "yyyy-MM-dd");
      if (hiddenInputRef.current) {
        hiddenInputRef.current.value = nextValue;
      }
      const syntheticEvent = {
        target: { value: nextValue },
        currentTarget: { value: nextValue },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange?.(syntheticEvent);
      setIsOpen(false);
      setIsFocused(false);
    };

    return (
      <div className={cn("relative", containerClassName)}>
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
          <input
            ref={hiddenInputRef}
            name={name}
            id={id}
            required={required}
            value={stringValue}
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={onChange}
            className="sr-only"
            readOnly
          />
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                disabled={disabled}
                className={cn(
                  "w-full rounded-lg border border-gray-300 bg-white px-3 outline-none transition-all duration-200 h-12 text-left",
                  label ? "pt-5 pb-2.5" : "",
                  "text-gray-900 placeholder:text-transparent",
                  "focus:border-primary focus:ring-2 focus:ring-primary/20",
                  error && "border-red-400 focus:border-red-500 focus:ring-red-400/20",
                  disabled && "opacity-60 cursor-not-allowed",
                  className,
                )}
                onFocus={(event: Scalar) => {
                  setIsFocused(true);
                  onFocus?.(event);
                }}
                onBlur={(event: Scalar) => {
                  setIsFocused(false);
                  onBlur?.(event);
                }}
              >
                <span className={cn(!displayValue && "text-gray-400")}>
                  {displayValue || (label ? "" : "Select date")}
                </span>
                <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleSelect as Scalar}
                initialFocus
                {...props}
              />
            </PopoverContent>
          </Popover>
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
DateInput.displayName = "DateInput";
