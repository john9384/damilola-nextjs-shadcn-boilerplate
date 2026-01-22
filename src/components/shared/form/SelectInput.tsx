import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Scalar } from "@/types/global";
import { Label } from "@/components/ui/label";

interface Option {
  label: string;
  value: string;
}

interface SelectInputProps {
  label?: string;
  error?: string | null | undefined;
  name?: string;
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  placholder?: string;
  [key: string]: Scalar;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  label,
  error,
  options,
  value,
  onChange,
  name,
  placeholder,
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const shouldFloat = isOpen || (!!value && value !== "");

  return (
    <div className="relative w-full">
      <Select
        value={value}
        onValueChange={(selectedValue) => {
          onChange?.(selectedValue);
        }}
        onOpenChange={setIsOpen}
        name={name}
        {...rest}
      >
        <SelectTrigger
          id={name}
          className={`peer h-14 w-full rounded-[10px] border border-input px-3 pr-8 text-sm font-normal text-[#212121] focus:outline-none focus:ring-1 focus:ring-ring data-[placeholder]:text-[#C8C8C8] 
          ${error ? "border-red-500 focus:ring-red-500" : ""}`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {label && (
        <Label
          htmlFor={name}
          className={`pointer-events-none absolute left-2 z-10 origin-[0] transform bg-background px-2 text-sm text-gray-400 transition-all duration-200 font-normal
            ${
              shouldFloat ? "top-2 -translate-y-4 scale-75" : "top-1/2 -translate-y-1/2 scale-100"
            }`}
        >
          {label}
        </Label>
      )}

      {error && (
        <span className="text-[10px] absolute top-[100%] left-0 pl-1 text-red-500">{error}</span>
      )}
    </div>
  );
};
