import { Brain } from "lucide-react";
import { ReasoningModel, getModelById } from "@/lib/models";

interface ModelIndicatorProps {
  modelId: string;
  className?: string;
}

export function ModelIndicator({ modelId, className = "" }: ModelIndicatorProps) {
  const model = getModelById(modelId);
  
  if (!model) return null;

  return (
    <div className={`flex items-center gap-1.5 text-sm text-muted-foreground ${className}`}>
      <Brain className="h-4 w-4" />
      <span>Using {model.name}</span>
      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
    </div>
  );
}