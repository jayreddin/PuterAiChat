import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel, SelectSeparator } from "@/components/ui/select";
import { reasoningModels, ReasoningModel } from "@/lib/models";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ModelSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  isDeepThinkActive?: boolean; // Add new prop
}

export function ModelSelect({ value, onValueChange, className, isDeepThinkActive = false }: ModelSelectProps) {
  const selectedModel = reasoningModels.find(model => model.id === value);

  // Group models by provider
  const groupedModels = reasoningModels.reduce((groups, model) => {
    const provider = model.provider;
    if (!groups[provider]) {
      groups[provider] = [];
    }
    groups[provider].push(model);
    return groups;
  }, {} as { [provider: string]: ReasoningModel[] });

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className={`w-[220px] ${isDeepThinkActive ? 'bg-yellow-200 dark:bg-yellow-700' : ''}`}> {/* Conditional styling */}
          <SelectValue>
            {selectedModel?.name || "Select a model"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(groupedModels).map(([provider, models]) => (
            <SelectGroup key={provider}>
              <SelectLabel>{provider}</SelectLabel>
              <SelectSeparator />
              {models.map((model) => (
                <SelectItem
                  key={model.id}
                  value={model.id}
                  disabled={!model.isAvailable}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    {model.logo && (
                      <img
                        src={model.logo} 
                        alt={`${model.provider} Logo`} 
                        width={20} 
                        height={20} 
                        className="rounded-full" 
                      />
                    )}
                    <span>{model.name}</span>
                    <TooltipProvider delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={(e) => e.preventDefault()}
                          >
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-[250px]">
                          <p>{model.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}