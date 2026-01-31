# Alert Component Usage Guide

## Basic Alert

```jsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2Icon, InfoIcon } from "lucide-react"

export function AlertDemo() {
  return (
    <div className="grid w-full max-w-md items-start gap-4">
      <Alert>
        <CheckCircle2Icon className="h-4 w-4" />
        <AlertTitle>Payment successful</AlertTitle>
        <AlertDescription>
          Your payment of $29.99 has been processed. A receipt has been sent to
          your email address.
        </AlertDescription>
      </Alert>
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>New feature available</AlertTitle>
        <AlertDescription>
          We&apos;ve added dark mode support. You can enable it in your account
          settings.
        </AlertDescription>
      </Alert>
    </div>
  )
}
```

## Destructive Alert

```jsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircleIcon } from "lucide-react"

export function AlertDestructive() {
  return (
    <Alert variant="destructive" className="max-w-md">
      <AlertCircleIcon className="h-4 w-4" />
      <AlertTitle>Payment failed</AlertTitle>
      <AlertDescription>
        Your payment could not be processed. Please check your payment method
        and try again.
      </AlertDescription>
    </Alert>
  )
}
```

## Available Icons from Lucide

- `CheckCircle2Icon` - Success
- `InfoIcon` - Information
- `AlertCircleIcon` - Warning/Error
- `XCircleIcon` - Error
- `CheckIcon` - Success
- `AlertTriangleIcon` - Warning

## Props

### Alert
- `variant`: "default" | "destructive"
- `className`: Additional CSS classes

### AlertTitle
- `className`: Additional CSS classes

### AlertDescription
- `className`: Additional CSS classes

## Examples

See:
- `web/src/components/ui/alert-demo.jsx` - Basic examples
- `web/src/components/ui/alert-destructive.jsx` - Destructive variant
