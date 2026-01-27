"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

export function DatePickerDOB({
  date,
  onDateChange,
  dateLabel = "Date of Birth",
  dateId = "date-of-birth",
  className = "",
  dateError = false,
  dateErrorMessage = "",
  minDate = null,
  maxDate = null,
  placeholder = "Select date",
  fullWidth = true,
  required = false,
}) {
  const [open, setOpen] = React.useState(false);
  const [internalDate, setInternalDate] = React.useState(
    date ? new Date(date) : undefined
  );

  // Update internal state when props change
  React.useEffect(() => {
    if (date) {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        setInternalDate(parsedDate);
      }
    } else {
      setInternalDate(undefined);
    }
  }, [date]);

  // Handle date selection
  const handleDateSelect = (selectedDate) => {
    if (selectedDate) {
      setInternalDate(selectedDate);
      setOpen(false);
      if (onDateChange) {
        // Format as YYYY-MM-DD for form compatibility
        onDateChange(format(selectedDate, "yyyy-MM-dd"));
      }
    }
  };

  // Calculate disabled dates
  const isDateDisabled = (date) => {
    if (minDate && date < new Date(minDate)) return true;
    if (maxDate && date > new Date(maxDate)) return true;
    return false;
  };

  return (
    <div className={cn("space-y-2", className)}>
      {dateLabel && (
        <Label
          htmlFor={dateId}
          className="text-sm font-medium text-gray-700"
        >
          {dateLabel} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={dateId}
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              "min-h-[44px] px-4 py-3",
              "bg-white border-2 rounded-lg",
              "hover:bg-gray-50 hover:border-[#a797cc]",
              "transition-all duration-200",
              "focus:ring-2 focus:ring-[#a797cc] focus:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              !internalDate && "text-gray-500",
              dateError && "border-red-500 focus:ring-red-500",
              !dateError && "border-gray-300"
            )}
          >
            <CalendarIcon className="mr-3 h-4 w-4 text-gray-500 flex-shrink-0" />
            <span className="flex-1 text-left">
              {internalDate ? (
                format(internalDate, "PPP")
              ) : (
                <span className="text-gray-400">{placeholder}</span>
              )}
            </span>
            <svg
              className={cn(
                "ml-2 h-4 w-4 text-gray-400 transition-transform duration-200 flex-shrink-0",
                open && "transform rotate-180"
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 bg-white shadow-lg border border-gray-200 rounded-lg"
          align="start"
          sideOffset={8}
        >
          <Calendar
            mode="single"
            selected={internalDate}
            onSelect={handleDateSelect}
            disabled={isDateDisabled}
            initialFocus
            className="p-3"
            classNames={{
              months: "flex flex-col space-y-4",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center mb-2",
              caption_label: "text-sm font-semibold text-gray-900",
              nav: "space-x-1 flex items-center",
              nav_button: cn(
                "h-8 w-8 bg-transparent p-0 opacity-70 hover:opacity-100",
                "inline-flex items-center justify-center rounded-md",
                "border border-gray-300 hover:bg-gray-100",
                "transition-colors duration-200"
              ),
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex mb-2",
              head_cell:
                "text-gray-600 rounded-md w-10 font-medium text-[0.875rem]",
              row: "flex w-full mt-1",
              cell: cn(
                "h-10 w-10 text-center text-sm p-0 relative",
                "focus-within:relative focus-within:z-20"
              ),
              day: cn(
                "h-10 w-10 p-0 font-normal rounded-md",
                "hover:bg-gray-100 transition-colors duration-150",
                "aria-selected:opacity-100"
              ),
              day_selected:
                "bg-[#a797cc] text-white hover:bg-[#8ba179] hover:text-white focus:bg-[#a797cc] focus:text-white",
              day_today: "bg-gray-100 text-gray-900 font-semibold",
              day_outside:
                "text-gray-400 opacity-50 aria-selected:bg-gray-100 aria-selected:text-gray-400",
              day_disabled:
                "text-gray-300 opacity-40 cursor-not-allowed hover:bg-transparent",
              day_range_middle:
                "aria-selected:bg-gray-100 aria-selected:text-gray-900",
              day_hidden: "invisible",
            }}
            components={{
              IconLeft: ({ ...props }) => (
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  {...props}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              ),
              IconRight: ({ ...props }) => (
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  {...props}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              ),
            }}
          />
        </PopoverContent>
      </Popover>
      {dateError && dateErrorMessage && (
        <p className="text-xs text-red-600 mt-1.5 font-medium">
          {dateErrorMessage}
        </p>
      )}
    </div>
  );
}
