import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scalar } from "@/types/global";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateInputProps extends React.ComponentPropsWithRef<typeof Input> {
  label: string;
  error?: string;
  placeholder?: string;
  value?: Scalar;
  onChange?: (value: Scalar) => void;
  className?: string;
  selectTime?: boolean;

  [key: string]: Scalar;
}

export function DateInput(props: DateInputProps) {
  const { label, id, className, error, placeholder, value, onChange, selectTime = false } = props;
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

  // Initialize time from value if it exists and selectTime is true, otherwise use current time
  const getInitialTime = React.useCallback(() => {
    if (value && selectTime) {
      const date = new Date(value);
      return {
        hours: date.getHours().toString().padStart(2, "0"),
        minutes: date.getMinutes().toString().padStart(2, "0"),
      };
    }
    if (selectTime) {
      const now = new Date();
      return {
        hours: now.getHours().toString().padStart(2, "0"),
        minutes: now.getMinutes().toString().padStart(2, "0"),
      };
    }
    return {
      hours: "00",
      minutes: "00",
    };
  }, [value, selectTime]);

  const [selectedTime, setSelectedTime] = React.useState(getInitialTime);

  // Update time when value changes
  React.useEffect(() => {
    setSelectedTime(getInitialTime());
  }, [getInitialTime]);

  const handleDateChange = (date: Date | undefined) => {
    if (!date) {
      onChange?.(undefined);
      return;
    }

    if (selectTime) {
      // Combine selected date with selected time
      const newDate = new Date(date);
      newDate.setHours(parseInt(selectedTime.hours), parseInt(selectedTime.minutes), 0, 0);
      onChange?.(newDate);
    } else {
      // For date-only selection, set time to start of day
      const newDate = new Date(date);
      newDate.setHours(0, 0, 0, 0);
      onChange?.(newDate);
    }
  };

  const handleTimeChange = (type: "hours" | "minutes", timeValue: string) => {
    const newTime = { ...selectedTime, [type]: timeValue };
    setSelectedTime(newTime);

    if (value) {
      const currentDate = new Date(value);
      currentDate.setHours(parseInt(newTime.hours), parseInt(newTime.minutes), 0, 0);
      onChange?.(currentDate);
    }
  };

  const formatDisplayValue = (val: Date) => {
    if (selectTime) {
      return format(val, "PPP HH:mm");
    }
    return format(val, "PPP");
  };

  // Generate hours and minutes options
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));

  return (
    <div className={cn("flex flex-col gap-1 w-full", className)}>
      <Label htmlFor={inputId} className="ml-1">
        {label}
      </Label>
      <Popover>
        <PopoverTrigger asChild className="bg-transparent">
          <Button
            variant={"outline"}
            className={cn(
              "w-full h-14 justify-start text-left font-normal hover:bg-transparent hover:text-foreground",
              !value && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? formatDisplayValue(value) : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <div className="p-3">
            <Calendar mode="single" selected={value} onSelect={handleDateChange} initialFocus />

            {selectTime && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">Time</span>
                </div>
                <div className="flex gap-2">
                  <Select
                    value={selectedTime.hours}
                    onValueChange={(val) => handleTimeChange("hours", val)}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {hours.map((hour) => (
                        <SelectItem key={hour} value={hour}>
                          {hour}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-muted-foreground self-center">:</span>
                  <Select
                    value={selectedTime.minutes}
                    onValueChange={(val) => handleTimeChange("minutes", val)}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {minutes.map((minute) => (
                        <SelectItem key={minute} value={minute}>
                          {minute}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
      {error && <p className="text-[9px] text-destructive ml-1">{error}</p>}
    </div>
  );
}

DateInput.displayName = "DateInput";
