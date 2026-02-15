"use client"

import * as React from "react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

// Field component - wrapper for form fields
const Field = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-2", className)}
      {...props}
    >
      {children}
    </div>
  )
})
Field.displayName = "Field"

// FieldGroup component - container for multiple fields
const FieldGroup = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-end gap-4", className)}
      {...props}
    >
      {children}
    </div>
  )
})
FieldGroup.displayName = "FieldGroup"

// FieldLabel component - label for form fields
const FieldLabel = React.forwardRef(({ className, htmlFor, children, ...props }, ref) => {
  return (
    <Label
      ref={ref}
      htmlFor={htmlFor}
      className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
      {...props}
    >
      {children}
    </Label>
  )
})
FieldLabel.displayName = "FieldLabel"

export { Field, FieldGroup, FieldLabel }
