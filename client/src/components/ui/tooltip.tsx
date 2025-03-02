"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"

// Custom types for better type safety and documentation
interface TooltipProps extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root> {
  delayDuration?: number;
  skipDelayDuration?: number;
}

interface TooltipContentProps extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
  hideArrow?: boolean;
  className?: string;
}

// Error Boundary Component
class TooltipErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.children;
    }

    return this.props.children;
  }
}

// Tooltip Provider with default configuration
const TooltipProvider = React.memo(({ 
  delayDuration = 200, 
  skipDelayDuration = 300, 
  ...props 
}: TooltipPrimitive.TooltipProviderProps) => (
  <TooltipPrimitive.Provider 
    delayDuration={delayDuration} 
    skipDelayDuration={skipDelayDuration}
    {...props} 
  />
));
TooltipProvider.displayName = "TooltipProvider";

// Base Tooltip component with error boundary
const Tooltip = React.memo(({ children, ...props }: TooltipProps) => (
  <TooltipErrorBoundary>
    <TooltipPrimitive.Root {...props}>
      {children}
    </TooltipPrimitive.Root>
  </TooltipErrorBoundary>
));
Tooltip.displayName = "Tooltip";

// Trigger component with accessibility enhancements
const TooltipTrigger = React.memo(React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TooltipPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex [&[data-state=open]]:bg-accent",
      className
    )}
    {...props}
  />
)));
TooltipTrigger.displayName = TooltipPrimitive.Trigger.displayName;

// Content component with enhanced animations and positioning
const TooltipContent = React.memo(React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ 
  className, 
  side = "top", 
  align = "center",
  sideOffset = 4, 
  alignOffset = 0,
  hideArrow = false,
  ...props 
}, ref) => {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    const timeout = requestAnimationFrame(() => setIsMounted(true));
    return () => {
      cancelAnimationFrame(timeout);
      setIsMounted(false);
    };
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <TooltipPrimitive.Content
      ref={ref}
      side={side}
      align={align}
      sideOffset={sideOffset}
      alignOffset={alignOffset}
      className={cn(
        "z-[100] overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md",
        "animate-in fade-in-0 zoom-in-95",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        "data-[side=bottom]:slide-in-from-top-2",
        "data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2",
        "data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    >
      {props.children}
      {!hideArrow && (
        <TooltipPrimitive.Arrow 
          className="fill-popover" 
          width={11} 
          height={5} 
        />
      )}
    </TooltipPrimitive.Content>
  );
}));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

// Helper component for common tooltip usage
interface SimpleTooltipProps extends Omit<TooltipProps, 'children'> {
  content: React.ReactNode;
  contentProps?: TooltipContentProps;
  children: React.ReactNode;
}

const SimpleTooltip = React.memo(({ 
  content, 
  contentProps, 
  children,
  ...props 
}: SimpleTooltipProps) => (
  <TooltipErrorBoundary>
    <Tooltip {...props}>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent {...contentProps}>
        {content}
      </TooltipContent>
    </Tooltip>
  </TooltipErrorBoundary>
));
SimpleTooltip.displayName = "SimpleTooltip";

export { 
  Tooltip, 
  TooltipTrigger, 
  TooltipContent, 
  TooltipProvider,
  SimpleTooltip,
  type TooltipProps,
  type TooltipContentProps,
  type SimpleTooltipProps
};
