// components/ui/date-picker.tsx

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  selected: Date | null; // Updated to accept Date or null
  onChange: (date: Date | null) => void; // Updated to handle null
  className?: string;
  placeholder?: string; // Added placeholder prop
  isClearable?: boolean; // Added isClearable prop
}

export const DatePicker: React.FC<DatePickerProps> = ({
  selected,
  onChange,
  className,
  placeholder,
  isClearable,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClear = () => {
    onChange(null);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !selected && "text-muted-foreground",
            className // Apply the passed className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? (
            format(selected, "PPP")
          ) : (
            <span>{placeholder || "Pick a date"}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected || undefined}
          onSelect={(date) => {
            onChange(date ?? null);
            setIsOpen(false);
          }}
          initialFocus
        />
        {isClearable && selected && (
          <Button variant="ghost" className="w-full mt-2" onClick={handleClear}>
            Clear
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
};
