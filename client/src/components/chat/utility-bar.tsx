import { Button } from "@/components/ui/button";
import { ImageUp, Code, Link } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePuter } from "../../contexts/puter-context";

interface UtilityBarProps {
  onImageClick?: () => void;
  onCodeClick?: () => void;
  onWebAddressClick?: () => void;
  className?: string;
}

export function UtilityBar({
  onImageClick,
  onCodeClick,
  onWebAddressClick,
  className
}: UtilityBarProps) {
  const { isInitialized: isPuterInitialized } = usePuter();

  return (
    <div className={cn("flex items-center gap-1", className)}>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={onCodeClick}
        className="hover:bg-accent"
      >
        <Code className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onWebAddressClick}
        className="hover:bg-accent"
      >
        <Link className="h-5 w-5" />
      </Button>
    </div>
  );
}
