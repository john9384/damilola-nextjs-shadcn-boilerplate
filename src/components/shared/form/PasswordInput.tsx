"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

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
      ...props
    },
    ref,
  ) => {
    const [show, setShow] = React.useState(false);

    return (
      <div className={cn("space-y-1.5", containerClassName)}>
        {label ? (
          <label className="block text-sm font-medium text-slate-200">
            {label}
            {required ? <span className="text-rose-300"> *</span> : null}
          </label>
        ) : null}
        <div className="relative">
          <input
            ref={ref}
            required={required}
            type={show ? "text" : "password"}
            className={cn(
              "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 pr-24 text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30",
              error && "border-rose-400/60 focus:border-rose-400 focus:ring-rose-400/30",
              className,
            )}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShow((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-3 py-1 text-xs font-medium text-slate-100/80 transition hover:bg-white/10"
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? "Hide" : "Show"}
          </button>
        </div>
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
PasswordInput.displayName = "PasswordInput";
