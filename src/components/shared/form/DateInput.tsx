import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FloatingLabel } from "./TextInput";
import type { Scalar } from "@/types/global";

export interface DatePickerProps {
  value?: Date;
  onChange: (date?: Date) => void;
  label?: string;
  error?: string;
  [key: string]: Scalar;
}

const DateInput = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.PropsWithoutRef<DatePickerProps>
>(({ id, label, error, value, onChange, ...props }, ref) => {
  return (
    <div className="relative h-14">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal h-full border-gray-200",
              !value && "text-muted-foreground",
              error ? "border-red-500" : "",
            )}
            {...props}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "PPP") : <span>{label}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={value} onSelect={onChange} captionLayout="dropdown" />
        </PopoverContent>
      </Popover>
      {value && <FloatingLabel htmlFor={id ?? label}>{label}</FloatingLabel>}
      {error && (
        <span className="text-[10px] text-red-500 absolute top-[100%] bottom-[1px] pl-1">
          {error}
        </span>
      )}
    </div>
  );
});

DateInput.displayName = "DateInput";

export { DateInput };
