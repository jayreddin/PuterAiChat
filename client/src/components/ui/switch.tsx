import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const switchVariants = cva(
  "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        default: "h-6 w-11",
        sm: "h-5 w-9",
        lg: "h-7 w-14",
      },
      variant: {
        default: "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        success: "data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-input",
        danger: "data-[state=checked]:bg-red-500 data-[state=unchecked]:bg-input",
        warning: "data-[state=checked]:bg-yellow-500 data-[state=unchecked]:bg-input",
      },
      loading: {
        true: "animate-pulse",
        false: "",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
      loading: false,
    },
  }
)

const thumbVariants = cva(
  "pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform",
  {
    variants: {
      size: {
        default: "h-5 w-5 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
        sm: "h-4 w-4 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
        lg: "h-6 w-6 data-[state=checked]:translate-x-7 data-[state=unchecked]:translate-x-0",
      },
      loading: {
        true: "after:absolute after:inset-0 after:animate-spin after:content-['']",
        false: "",
      },
    },
    defaultVariants: {
      size: "default",
      loading: false,
    },
  }
)

interface SwitchProps 
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>,
    VariantProps<typeof switchVariants> {
  loading?: boolean;
  label?: string;
  description?: string;
  error?: string;
}

const LoadingIcon = () => (
  <svg
    className="absolute h-3 w-3 animate-spin"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
)

const Switch = React.memo(React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ 
  className, 
  size, 
  variant,
  loading = false,
  label,
  description,
  error,
  disabled,
  ...props 
}, ref) => {
  const isDisabled = disabled || loading;
  const id = React.useId();

  return (
    <div className="flex flex-col space-y-1.5">
      <div className="flex items-center space-x-2">
        <SwitchPrimitives.Root
          id={id}
          ref={ref}
          disabled={isDisabled}
          className={cn(switchVariants({ size, variant, loading, className }))}
          {...props}
        >
          <SwitchPrimitives.Thumb
            className={cn(thumbVariants({ size, loading }))}
          >
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <LoadingIcon />
              </div>
            )}
          </SwitchPrimitives.Thumb>
        </SwitchPrimitives.Root>

        {label && (
          <label
            htmlFor={id}
            className={cn(
              "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              isDisabled && "cursor-not-allowed opacity-70"
            )}
          >
            {label}
          </label>
        )}
      </div>

      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}))

Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch, type SwitchProps }