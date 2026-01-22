import { Checkbox } from "@/components/ui/checkbox";
import type { Scalar } from "@/types/global";
import React from "react";
import { FieldError, UseFormRegister } from "react-hook-form";

interface CheckInputProps {
  name: string;
  label?: string;
  description?: string;
  checkboxLabel?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  error?: FieldError | string;
  register?: UseFormRegister<Scalar>;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export const CheckInput: React.FC<CheckInputProps> = ({
  name,
  label,
  description,
  checkboxLabel,
  disabled = false,
  required = false,
  className = "",
  error,
  register,
  checked,
  onChange,
}) => {
  const [internalChecked, setInternalChecked] = React.useState(checked || false);
  const registerProps = register
    ? register(name, {
        required: required ? `${label || checkboxLabel || name} is required` : false,
      })
    : ({ onChange: undefined } as { onChange?: (event: Scalar) => void });
  const errorMessage = typeof error === "string" ? error : error?.message;

  const handleCheckedChange = (newChecked: boolean) => {
    setInternalChecked(newChecked);
    if (onChange) onChange(newChecked);
    if (registerProps.onChange) {
      registerProps.onChange({
        target: { name, value: newChecked, checked: newChecked },
      } as Scalar);
    }
  };

  React.useEffect(() => {
    if (checked !== undefined) {
      setInternalChecked(checked);
    }
  }, [checked]);

  return (
    <div className={`flex flex-row items-start space-x-3 space-y-0 ${className}`}>
      <Checkbox
        id={name}
        checked={internalChecked}
        onCheckedChange={handleCheckedChange}
        disabled={disabled}
      />
      {register && (
        <input type="hidden" {...registerProps} value={internalChecked ? "true" : "false"} />
      )}
      <div className="space-y-1 leading-none">
        {(label || checkboxLabel) && (
          <label
            htmlFor={name}
            className="text-sm font-medium leading-none text-[#212121] peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label || checkboxLabel} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
        {errorMessage && <p className="text-[10px] font-medium text-red-500">{errorMessage}</p>}
      </div>
    </div>
  );
};
