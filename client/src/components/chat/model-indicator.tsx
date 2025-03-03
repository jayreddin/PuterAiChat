import { Brain } from "lucide-react";
import { ReasoningModel, getModelById } from "@/lib/models";
import { motion } from "framer-motion";

interface ModelIndicatorProps {
  modelId: string;
  className?: string;
}

export function ModelIndicator({ modelId, className = "" }: ModelIndicatorProps) {
  const model = getModelById(modelId);
  
  if (!model) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex items-center gap-1.5 text-sm text-muted-foreground ${className}`}
    >
      <Brain className="h-4 w-4" />
      <span>Using {model.name}</span>
      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
    </motion.div>
  );
}