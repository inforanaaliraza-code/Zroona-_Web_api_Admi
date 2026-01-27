"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { ChevronDownIcon } from "lucide-react"

export function DatePickerTime({ 
  date, 
  onDateChange, 
  time, 
  onTimeChange, 
  dateLabel = "Date",
  timeLabel = "Time",
  dateId = "date-picker-optional",
  timeId = "time-picker-optional",
  className = "",
  dateError = false,
  timeError = false,
  dateErrorMessage = "",
  timeErrorMessage = "",
  minDate = null,
  maxDate = null,
  defaultTime = "10:30:00",
  showDate = true,
  showTime = true,
  fullWidth = false
}) {
  const [open, setOpen] = React.useState(false)
  const [internalDate, setInternalDate] = React.useState(date ? new Date(date) : undefined)
  const [internalTime, setInternalTime] = React.useState(time || defaultTime)

  // Update internal state when props change
  React.useEffect(() => {
    if (date) {
      setInternalDate(new Date(date))
    }
  }, [date])

  React.useEffect(() => {
    if (time) {
      setInternalTime(time)
    }
  }, [time])

  // Notify parent when date changes
  const handleDateSelect = (selectedDate) => {
    setInternalDate(selectedDate)
    setOpen(false)
    if (onDateChange) {
      // Format as YYYY-MM-DD for form compatibility
      if (selectedDate) {
        onDateChange(format(selectedDate, "yyyy-MM-dd"))
      } else {
        onDateChange("")
      }
    }
  }

  // Notify parent when time changes
  const handleTimeChange = (e) => {
    const newTime = e.target.value
    setInternalTime(newTime)
    if (onTimeChange) {
      onTimeChange(newTime)
    }
  }

  // If only date or only time is needed, adjust layout
  if (!showTime && showDate) {
    // Date only
    return (
      <div className={className}>
        <Field>
          <FieldLabel htmlFor={dateId}>{dateLabel}</FieldLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id={dateId}
                className={`${fullWidth ? "w-full" : "w-32"} justify-between font-normal min-h-[44px] bg-white border-2 border-gray-300 hover:border-[#a797cc] hover:bg-gray-50 transition-colors ${dateError ? "border-red-500" : ""}`}
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {internalDate ? format(internalDate, "PPP") : "Select date"}
                </span>
                <ChevronDownIcon className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0 bg-white" align="start">
              <Calendar
                mode="single"
                selected={internalDate}
                captionLayout="dropdown"
                defaultMonth={internalDate}
                onSelect={handleDateSelect}
                disabled={(date) => {
                  if (minDate && date < new Date(minDate)) return true
                  if (maxDate && date > new Date(maxDate)) return true
                  return false
                }}
              />
            </PopoverContent>
          </Popover>
          {dateError && dateErrorMessage && (
            <p className="mt-1 text-sm text-red-600">{dateErrorMessage}</p>
          )}
        </Field>
      </div>
    )
  }

  if (!showDate && showTime) {
    // Time only
    return (
      <div className={className}>
        <Field className={fullWidth ? "w-full" : "w-32"}>
          <FieldLabel htmlFor={timeId}>{timeLabel}</FieldLabel>
          <Input
            type="time"
            id={timeId}
            step="1"
            value={internalTime}
            onChange={handleTimeChange}
            className={`bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none ${timeError ? "border-red-500" : ""}`}
          />
          {timeError && timeErrorMessage && (
            <p className="mt-1 text-sm text-red-600">{timeErrorMessage}</p>
          )}
        </Field>
      </div>
    )
  }

  // Both date and time
  return (
    <FieldGroup className={`mx-auto ${fullWidth ? "max-w-full" : "max-w-xs"} flex-row ${className}`}>
      {showDate && (
        <Field>
          <FieldLabel htmlFor={dateId}>{dateLabel}</FieldLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id={dateId}
                className={`w-32 justify-between font-normal ${dateError ? "border-red-500" : ""}`}
              >
                {internalDate ? format(internalDate, "PPP") : "Select date"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0 bg-white" align="start">
              <Calendar
                mode="single"
                selected={internalDate}
                captionLayout="dropdown"
                defaultMonth={internalDate}
                onSelect={handleDateSelect}
                disabled={(date) => {
                  if (minDate && date < new Date(minDate)) return true
                  if (maxDate && date > new Date(maxDate)) return true
                  return false
                }}
              />
            </PopoverContent>
          </Popover>
          {dateError && dateErrorMessage && (
            <p className="mt-1 text-sm text-red-600">{dateErrorMessage}</p>
          )}
        </Field>
      )}
      {showTime && (
        <Field className="w-32">
          <FieldLabel htmlFor={timeId}>{timeLabel}</FieldLabel>
          <Input
            type="time"
            id={timeId}
            step="1"
            value={internalTime}
            onChange={handleTimeChange}
            className={`bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none ${timeError ? "border-red-500" : ""}`}
          />
          {timeError && timeErrorMessage && (
            <p className="mt-1 text-sm text-red-600">{timeErrorMessage}</p>
          )}
        </Field>
      )}
    </FieldGroup>
  )
}
