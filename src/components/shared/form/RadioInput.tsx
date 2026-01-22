import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Scalar } from "@/types/global";
import React from "react";
import { FieldError, UseFormRegister } from "react-hook-form";

interface RadioOption {
  value: string;
  label: string;
}

interface RadioInputProps {
  name: string;
  label?: string;
  description?: string;
  options: RadioOption[];
  orientation?: "horizontal" | "vertical";
  disabled?: boolean;
  required?: boolean;
  className?: string;
  error?: FieldError | string;
  register?: UseFormRegister<Scalar>;
  value?: string;
  onChange?: (value: string) => void;
}

export const RadioInput: React.FC<RadioInputProps> = ({
  name,
  label,
  description,
  options,
  orientation = "vertical",
  disabled = false,
  required = false,
  className = "",
  error,
  register,
  value,
  onChange,
}) => {
  const [internalValue, setInternalValue] = React.useState(value || "");
  const registerProps = register
    ? register(name, {
        required: required ? `${label || name} is required` : false,
      })
    : ({ onChange: undefined } as { onChange?: (event: Scalar) => void });
  const errorMessage = typeof error === "string" ? error : error?.message;

  const handleValueChange = (newValue: string) => {
    setInternalValue(newValue);
    if (onChange) onChange(newValue);
    if (registerProps.onChange) {
      registerProps.onChange({ target: { name, value: newValue } } as Scalar);
    }
  };

  React.useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <label className="text-sm font-medium leading-none text-[#212121] peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <RadioGroup
        value={internalValue}
        onValueChange={handleValueChange}
        className={
          orientation === "horizontal" ? "flex flex-row space-x-4" : "flex flex-col space-y-2"
        }
        disabled={disabled}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={`${name}-${option.value}`} />
            <label
              htmlFor={`${name}-${option.value}`}
              className="text-sm font-medium leading-none text-[#212121] peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {option.label}
            </label>
          </div>
        ))}
      </RadioGroup>
      {register && <input type="hidden" {...registerProps} value={internalValue} />}
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      {errorMessage && <p className="text-[10px] font-medium text-red-500">{errorMessage}</p>}
    </div>
  );
};
