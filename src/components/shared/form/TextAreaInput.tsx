import React from "react";
import { Textarea } from "@/components/ui/textarea";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Scalar } from "@/types/global";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  [key: string]: Scalar;
}

export const FloatingTextArea = React.forwardRef<HTMLTextAreaElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <Textarea
        placeholder=" "
        className={cn(
          "peer rounded-[10px] text-[#212121] placeholder:text-[#C8C8C8] focus-visible:ring-1 focus-visible:ring-ring min-h-[96px]",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

FloatingTextArea.displayName = "FloatingTextArea";

export const FloatingLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => {
  return (
    <Label
      className={cn(
        "peer-focus:secondary peer-focus:dark:secondary absolute start-2 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-background px-2 text-sm text-gray-500 duration-300 " +
          "peer-placeholder-shown:top-[10px] peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 " +
          "peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 dark:bg-background rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 cursor-text",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

FloatingLabel.displayName = "FloatingLabel";

type FloatingLabelInputProps = InputProps & { label?: string };

const TextAreaInput = React.forwardRef<
  React.ElementRef<typeof FloatingTextArea>,
  React.PropsWithoutRef<FloatingLabelInputProps>
>(({ label, error, ...props }, ref) => {
  return (
    <div className="relative w-full">
      <FloatingTextArea
        ref={ref}
        id={label}
        {...props}
        className={`${error ? "border-red-500 focus-visible:ring-red-500" : ""}`}
      />
      <FloatingLabel htmlFor={label}>{label}</FloatingLabel>
      {error && (
        <span className="text-[10px] text-red-500 absolute top-[100%] bottom-[1px] pl-1">
          {error}
        </span>
      )}
    </div>
  );
});

TextAreaInput.displayName = "TextAreaInput";

export { TextAreaInput };
