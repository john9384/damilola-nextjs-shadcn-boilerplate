"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type TextAreaInputProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  description?: string;
  error?: string;
  containerClassName?: string;
};

export const TextAreaInput = React.forwardRef<HTMLTextAreaElement, TextAreaInputProps>(
  (
    { label, description, error, className, containerClassName, required, rows = 4, ...props },
    ref,
  ) => {
    return (
      <div className={cn("space-y-1.5", containerClassName)}>
        {label ? (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {required ? <span className="text-red-500 ml-0.5">*</span> : null}
          </label>
        ) : null}
        <textarea
          ref={ref}
          required={required}
          rows={rows}
          className={cn(
            "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20",
            "min-h-14",
            error && "border-red-400 focus:border-red-500 focus:ring-red-400/20",
            className,
          )}
          {...props}
        />
        {error ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : description ? (
          <p className="text-sm text-gray-500">{description}</p>
        ) : null}
      </div>
    );
  },
);
TextAreaInput.displayName = "TextAreaInput";
