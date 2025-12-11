"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type DropdownMenuContextType = {
  close: () => void;
};

export const DropdownMenuContext = React.createContext<DropdownMenuContextType | null>(null);

type DropdownMenuProps = {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
  contentClassName?: string;
};

export function DropdownMenu({
  trigger,
  children,
  align = "right",
  contentClassName,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const close = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  return (
    <DropdownMenuContext.Provider value={{ close }}>
      <div className="relative" ref={menuRef}>
        <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div
              className={cn(
                "absolute z-50 mt-2 w-64 rounded-lg bg-white shadow-lg border border-gray-200 py-1",
                align === "right" ? "right-0" : "left-0",
                contentClassName,
              )}
            >
              {children}
            </div>
          </>
        )}
      </div>
    </DropdownMenuContext.Provider>
  );
}

export function DropdownMenuHeader({ children }: { children: React.ReactNode }) {
  return <div className="px-4 py-3 border-b border-gray-200">{children}</div>;
}

export function DropdownMenuItem({
  children,
  onClick,
  className,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) {
  const context = React.useContext(DropdownMenuContext);

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
    context?.close();
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        "w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function DropdownMenuSeparator() {
  return <div className="h-px bg-gray-200 my-1" />;
}

