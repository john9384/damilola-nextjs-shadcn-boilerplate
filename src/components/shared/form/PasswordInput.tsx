import * as React from "react";
import { FloatingInput, FloatingLabel, InputProps } from "@/components/shared/form/TextInput";
import { EyeOff, Eye } from "lucide-react";

type FloatingLabelInputProps = InputProps & { label?: string };

const PasswordInput = React.forwardRef<
  React.ElementRef<typeof FloatingInput>,
  React.PropsWithoutRef<FloatingLabelInputProps>
>(({ id, label, error, ...props }, ref) => {
  const [visible, setVisible] = React.useState(false);
  return (
    <div className="relative h-14">
      <FloatingInput ref={ref} id={id ?? label} {...props} type={visible ? "text" : "password"} />
      <FloatingLabel htmlFor={id ?? label}>{label}</FloatingLabel>
      <button
        type="button"
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 -mt-[2.5px] rounded-md flex items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
        onClick={() => setVisible(!visible)}
      >
        <span className="relative h-4 w-4">
          <Eye
            className={`absolute inset-0 transition-all duration-200 ${
              visible ? "opacity-0 scale-75 rotate-45" : "opacity-100 scale-100 rotate-0"
            }`}
          />
          <EyeOff
            className={`absolute inset-0 transition-all duration-200 ${
              visible ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-75 -rotate-45"
            }`}
          />
        </span>
      </button>
      {error && (
        <span className="text-[10px] text-red-500 absolute top-[100%] bottom-[1px] pl-1">
          {error}
        </span>
      )}
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
