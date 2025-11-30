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
    {
      label,
      description,
      error,
      className,
      containerClassName,
      required,
      rows = 4,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={cn("space-y-1.5", containerClassName)}>
        {label ? (
          <label className="block text-sm font-medium text-slate-200">
            {label}
            {required ? <span className="text-rose-300"> *</span> : null}
          </label>
        ) : null}
        <textarea
          ref={ref}
          required={required}
          rows={rows}
          className={cn(
            "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30",
            error && "border-rose-400/60 focus:border-rose-400 focus:ring-rose-400/30",
            className,
          )}
          {...props}
        />
        {error ? (
          <p className="text-sm text-rose-300" role="alert">
            {error}
          </p>
        ) : description ? (
          <p className="text-sm text-slate-400">{description}</p>
        ) : null}
      </div>
    );
  },
);
TextAreaInput.displayName = "TextAreaInput";
