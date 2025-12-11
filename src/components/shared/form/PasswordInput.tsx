"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  description?: string;
  error?: string;
  containerClassName?: string;
};

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
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
      ...props
    },
    ref,
  ) => {
    const [show, setShow] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = React.useState(value || "");
    const [domValue, setDomValue] = React.useState<string>("");

    // Compute hasValue from both value prop and DOM value (for cases where value is set via DOM)
    const currentValue = value ?? domValue ?? "";
    const hasValue = Boolean(currentValue && String(currentValue).trim() !== "");

    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    React.useEffect(() => {
      setInputValue(value || "");
    }, [value]);

    // Check input element value after render to catch cases where value is set via DOM
    React.useLayoutEffect(() => {
      if (inputRef.current) {
        const inputValue = inputRef.current.value || "";
        setDomValue(inputValue);
      }
    }, [value]);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      setDomValue(newValue);
      onChange?.(e);
    };

    const isFloating = isFocused || hasValue;

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
            ref={inputRef}
            required={required}
            type={show ? "text" : "password"}
            value={value}
            className={cn(
              "w-full rounded-lg border border-gray-300 bg-white px-3 pr-10 outline-none transition-all duration-200 h-12",
              label ? "pt-5 pb-2.5" : "",
              "text-gray-900 placeholder:text-transparent",
              "focus:border-primary focus:ring-2 focus:ring-primary/20",
              error && "border-red-400 focus:border-red-500 focus:ring-red-400/20",
              className,
            )}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShow((prev) => !prev)}
              className="text-gray-400 hover:text-gray-600 transition-colors z-20"
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
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
PasswordInput.displayName = "PasswordInput";
